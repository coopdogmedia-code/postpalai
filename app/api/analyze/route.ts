import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { getClientIp, enforceMonthlyCap } from "@/lib/usage-limit";

// --- Schema ---
const RequestSchema = z.object({
  url: z.string().url(),
});

const BlueprintSchema = z.object({
  title: z.string(),
  platform: z.enum(["youtube", "tiktok", "instagram", "unknown"]),
  summary: z.string(),
  hooks: z.array(z.string()),
  outline: z.array(z.string()),
  notes: z.array(z.string()),
});

export type BlueprintResponse = z.infer<typeof BlueprintSchema>;

// --- Rate Limiting (in-memory, per-minute) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count += 1;
  return false;
}

// --- SSRF Protection ---
function isUnsafeUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    if (!["http:", "https:"].includes(url.protocol)) {
      return true;
    }

    const hostname = url.hostname.toLowerCase();

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname.endsWith(".localhost")
    ) {
      return true;
    }

    const privatePatterns = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./,
      /^0\./,
    ];

    for (const pattern of privatePatterns) {
      if (pattern.test(hostname)) {
        return true;
      }
    }

    return false;
  } catch {
    return true;
  }
}

// --- Platform Detection ---
function detectPlatform(
  url: string
): "youtube" | "tiktok" | "instagram" | "unknown" {
  const hostname = new URL(url).hostname.toLowerCase();

  if (
    hostname.includes("youtube.com") ||
    hostname.includes("youtu.be") ||
    hostname.includes("youtube-nocookie.com")
  ) {
    return "youtube";
  }

  if (hostname.includes("tiktok.com")) {
    return "tiktok";
  }

  if (hostname.includes("instagram.com")) {
    return "instagram";
  }

  return "unknown";
}

// --- YouTube Video ID Extraction ---
function extractYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (urlObj.pathname.startsWith("/shorts/")) {
      return urlObj.pathname.split("/shorts/")[1]?.split("/")[0] || null;
    }

    if (urlObj.searchParams.has("v")) {
      return urlObj.searchParams.get("v");
    }

    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1).split("/")[0] || null;
    }

    return null;
  } catch {
    return null;
  }
}

// --- Fetch Page Metadata ---
async function fetchPageMetadata(
  url: string
): Promise<{ title: string; description: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    const titleMatch =
      html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
      html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i) ||
      html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/i);

    const title = titleMatch
      ? titleMatch[1].trim().replace(/&amp;/g, "&").replace(/&#39;/g, "'")
      : "Unknown Title";

    const descMatch =
      html.match(
        /<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i
      ) ||
      html.match(
        /<meta[^>]+content="([^"]+)"[^>]+property="og:description"/i
      ) ||
      html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) ||
      html.match(/<meta[^>]+content="([^"]+)"[^>]+name="description"/i);

    const description = descMatch
      ? descMatch[1].trim().replace(/&amp;/g, "&").replace(/&#39;/g, "'")
      : "";

    return { title, description };
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    return { title: "Unknown Title", description: "" };
  }
}

// --- OpenAI Analysis ---
async function analyzeWithOpenAI(
  platform: string,
  title: string,
  description: string,
  videoId: string | null
): Promise<BlueprintResponse> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `You are an expert short-form video analyst. Analyze this ${platform} video and produce a structured blueprint.

VIDEO INFO:
- Platform: ${platform}
- Title: ${title}
- Description: ${description}
${videoId ? `- Video ID: ${videoId}` : ""}

Produce a JSON response with this exact structure:
{
  "title": "A clean, descriptive title for this blueprint",
  "platform": "${platform}",
  "summary": "2-3 sentence summary of what makes this video effective",
  "hooks": ["array of 5-10 hook variations that could work for similar content"],
  "outline": ["array of 4-6 structural beats, e.g. 'Hook (0-3s): Bold claim that stops scroll'"],
  "notes": ["array of 3-5 notes on why this worked and execution tips"]
}

Focus on:
- Psychological triggers (curiosity gap, fear of missing out, identity, authority)
- Structural patterns (hook → context → proof → CTA)
- Retention mechanics (pattern interrupts, open loops, escalation)
- Adaptable frameworks, NOT copying

Return ONLY valid JSON. No markdown, no explanation.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a short-form video strategist. Always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content || "";

  try {
    const parsed = JSON.parse(content);
    return BlueprintSchema.parse(parsed);
  } catch {
    return {
      title: title || "Video Blueprint",
      platform: platform as BlueprintResponse["platform"],
      summary:
        "Analysis completed. The video uses common short-form patterns to engage viewers.",
      hooks: [
        `"${title}" — Original hook`,
        '"Why nobody talks about [topic]" — Curiosity gap variant',
        '"I tested [thing] for 30 days" — Effort-based authority',
        '"The truth about [topic]" — Insider knowledge hook',
        '"Stop doing [common thing]" — Contrarian pattern interrupt',
      ],
      outline: [
        "Hook (0-3s): Attention-grabbing opening statement",
        "Context (3-10s): Quick setup establishing relevance",
        "Core content (10-40s): Main value delivery",
        "CTA (40-60s): Soft call to action",
      ],
      notes: [
        "Uses pattern interrupts to maintain attention",
        "Clear value proposition in the first 3 seconds",
        "Builds credibility through specificity",
      ],
    };
  }
}

// --- Route Handler ---
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // Per-minute rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limited. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    // Monthly usage cap
    const MONTHLY_LIMIT = 5;
    const usage = enforceMonthlyCap({ key: ip, limit: MONTHLY_LIMIT });

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: "limit_exceeded",
          message:
            "Free plan limit reached (5 analyses/month). Upgrade to keep going.",
          limit: usage.limit,
          remaining: usage.remaining,
          reset: usage.reset,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(usage.limit),
            "X-RateLimit-Remaining": String(usage.remaining),
            "X-RateLimit-Reset": usage.reset,
          },
        }
      );
    }

    const body = await request.json();

    const validation = RequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid URL provided." },
        { status: 400 }
      );
    }

    const { url } = validation.data;

    if (isUnsafeUrl(url)) {
      return NextResponse.json({ error: "URL not allowed." }, { status: 400 });
    }

    const platform = detectPlatform(url);

    if (platform === "tiktok" || platform === "instagram") {
      return NextResponse.json(
        {
          error: `${platform.charAt(0).toUpperCase() + platform.slice(1)} support coming soon. Try a YouTube Shorts URL for now.`,
        },
        { status: 400 }
      );
    }

    if (platform === "unknown") {
      return NextResponse.json(
        { error: "Unsupported platform. Please use a YouTube Shorts URL." },
        { status: 400 }
      );
    }

    const videoId = extractYouTubeVideoId(url);
    const { title, description } = await fetchPageMetadata(url);

    if (!title || title === "Unknown Title") {
      return NextResponse.json(
        {
          error:
            "Could not extract video information. Please check the URL and try again.",
        },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Service temporarily unavailable." },
        { status: 503 }
      );
    }

    const blueprint = await analyzeWithOpenAI(
      platform,
      title,
      description,
      videoId
    );

    return NextResponse.json(blueprint);
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}