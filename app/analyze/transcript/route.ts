import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { getClientIp, enforceMonthlyCap } from "@/lib/usage-limit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RequestSchema = z.object({
  transcript: z.string().min(20),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // Monthly usage cap
    const MONTHLY_LIMIT = 5;
    const usage = enforceMonthlyCap({ key: ip, limit: MONTHLY_LIMIT });

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: "limit_exceeded",
          message: "Free plan limit reached (5 analyses/month). Upgrade to keep going.",
          limit: usage.limit,
          remaining: usage.remaining,
          reset: usage.reset,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = RequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Transcript too short. Please provide at least 20 characters." },
        { status: 400 }
      );
    }

    const { transcript } = validation.data;

    const blueprint = await analyzeTranscript(transcript);

    return NextResponse.json(blueprint);
  } catch (error) {
    console.error("Transcript analysis error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

async function analyzeTranscript(transcript: string) {
  const prompt = `You are an expert short-form video analyst. Analyze this video transcript and produce a structured blueprint.

TRANSCRIPT:
${transcript}

Produce a JSON response with this exact structure:
{
  "title": "A clean, descriptive title for this blueprint",
  "platform": "unknown",
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
        content: "You are a short-form video strategist. Always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content || "";

  try {
    return JSON.parse(content);
  } catch {
    return {
      title: "Video Blueprint",
      platform: "unknown",
      summary: "Analysis completed based on transcript.",
      hooks: [
        '"Why nobody talks about [topic]" — Curiosity gap',
        '"I tested [thing] for 30 days" — Effort-based authority',
        '"The truth about [topic]" — Insider knowledge hook',
      ],
      outline: [
        "Hook (0-3s): Attention-grabbing opening",
        "Context (3-10s): Quick setup",
        "Core content (10-40s): Main value delivery",
        "CTA (40-60s): Soft call to action",
      ],
      notes: ["Transcript-based analysis"],
    };
  }
}