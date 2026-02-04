import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-100 tracking-tight max-w-4xl leading-tight">
        Reverse-engineer viral videos.
        <br />
        <span className="text-zinc-400">Build better ones.</span>
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed">
        Paste any short-form video. Get a structured breakdown of why it
        worked—and a blueprint to adapt it for your own content.
      </p>

      <div className="mt-10">
        <Link href="/analyze">
          <Button variant="primary" className="text-base px-8 py-3">
            Analyze a Video →
          </Button>
        </Link>
      </div>

      <p className="mt-6 text-sm text-zinc-600">
        No account required. Free during early access.
      </p>
    </section>
  );
}