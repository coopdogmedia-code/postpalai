import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-zinc-100">
          PostPal
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/analyze"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Analyze
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Pricing
          </Link>
        </nav>
      </div>
    </header>
  );
}