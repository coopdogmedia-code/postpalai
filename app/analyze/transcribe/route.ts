import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getClientIp, enforceMonthlyCap } from "@/lib/usage-limit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|webm)$/i)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload MP4, MOV, or WebM." },
        { status: 400 }
      );
    }

    // Validate file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 100MB." },
        { status: 400 }
      );
    }

    // Convert to buffer for Whisper
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create a File object that OpenAI expects
    const audioFile = new File([buffer], file.name, { type: file.type });

    // Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    const transcript = transcription.text;

    if (!transcript || transcript.length < 10) {
      return NextResponse.json(
        { error: "Could not transcribe video. Please try a different file or paste the transcript." },
        { status: 400 }
      );
    }

    // Analyze with GPT
    const blueprint = await analyzeTranscript(transcript, file.name);

    return NextResponse.json(blueprint);
  } catch (error) {
    console.error("Transcribe error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

async function analyzeTranscript(transcript: string, filename: string) {
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
      title: filename.replace(/\.[^/.]+$/, "") || "Video Blueprint",
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
      notes: [
        "Transcript-based analysis",
        "Consider adding visual hooks",
      ],
    };
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};