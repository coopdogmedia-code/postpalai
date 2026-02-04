export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} PostPal
        </p>
        <p className="text-sm text-zinc-600">
          Built for creators who study the craft.
        </p>
      </div>
    </footer>
  );
}