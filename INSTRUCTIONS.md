# PostPal V2 — Structural Analysis Update

## What Changed

This update replaces the old multi-input system (file upload, transcript paste, URL) with a focused YouTube-only tool with two analysis modes.

### New Features
- **Two modes**: "Analyze a Viral Short" and "Analyze Your Own Short"
- **Real YouTube transcript extraction** via `youtube-transcript` package
- **Timestamped structural analysis** — every insight references specific moments
- **No more file upload** — YouTube link only for MVP
- **No more generic output** — prompts demand specific, grounded observations

### Removed
- `VideoUpload.tsx` — delete this file
- `AnalyzeInput.tsx` — delete this file  
- `TranscriptInput.tsx` — delete this file
- `BlueprintResults.tsx` — delete this file (replaced by ViralResults + OwnResults)
- `app/api/analyze/transcribe/` folder — delete entirely
- `app/api/analyze/transcript/` folder — delete entirely

---

## Step-by-Step Instructions

### 1. Install the new package
```bash
npm install youtube-transcript
```

### 2. Delete old files
```bash
del components\analyze\VideoUpload.tsx
del components\analyze\AnalyzeInput.tsx
del components\analyze\TranscriptInput.tsx
del components\analyze\BlueprintResults.tsx
```

Delete the old API folders (if they exist):
```bash
rmdir /s /q app\api\analyze\transcribe
rmdir /s /q app\api\analyze\transcript
```

### 3. Replace/create these files

Copy each file from this download into your project at the matching path:

| File | Action |
|------|--------|
| `app/api/analyze/route.ts` | **REPLACE** existing file |
| `app/analyze/page.tsx` | **REPLACE** existing file |
| `components/analyze/ModeSelector.tsx` | **NEW** file |
| `components/analyze/UrlInput.tsx` | **REPLACE** existing file |
| `components/analyze/LoadingState.tsx` | **REPLACE** existing file |
| `components/analyze/ViralResults.tsx` | **NEW** file |
| `components/analyze/OwnResults.tsx` | **NEW** file |

### 4. Revert next.config.ts

The upload size limit is no longer needed. Replace your `next.config.ts` with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

### 5. Push to deploy
```bash
git add .
git commit -m "V2: Two-mode structural analysis with YouTube transcripts"
git push
```

---

## File Summary

### `app/api/analyze/route.ts` (core engine)
- Accepts `{ url, mode }` where mode is "viral" or "own"
- Extracts YouTube video ID from URL
- Fetches real transcript via `youtube-transcript` package
- Builds timestamped transcript with `[0:00]` format
- Sends mode-specific prompt to GPT-4o-mini
- Returns structured JSON blueprint
- Rate limiting: 10/10min + 5/month cap

### `app/analyze/page.tsx` (page)
- Mode toggle → URL input → Loading → Results
- Routes to ViralResults or OwnResults based on mode

### `components/analyze/ModeSelector.tsx`
- Toggle between "Analyze a Viral Short" and "Analyze Your Own Short"
- Shows description text based on selected mode

### `components/analyze/UrlInput.tsx`
- Simple URL input + Analyze button
- Validates URL format
- YouTube Shorts only messaging

### `components/analyze/LoadingState.tsx`
- Mode-aware loading text
- Shows pipeline: "Fetching transcript → Mapping beats → Building analysis"

### `components/analyze/ViralResults.tsx`
- Hook Breakdown (quote, type, timing, why it works)
- Structural Beats (timestamped beat-by-beat)
- Retention Mechanics (open loops, interrupts, what was avoided)
- Reusable Framework (structural skeleton stripped of topic)
- Confidence Notes (what can't be determined from transcript)
- Copy per section + full text export

### `components/analyze/OwnResults.tsx`
- Hook Diagnosis (quote, timing vs expected, verdict, fix)
- Structure Diagnosis (beats with red highlighting for issues)
- Payoff Check (clear? matches hook? with green/red indicators)
- Fix Priority (ranked 1-5 with fix/why/example for each)
- Confidence Notes
- Copy per section + full text export
