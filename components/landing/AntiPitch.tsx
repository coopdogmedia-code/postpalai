export function AntiPitch() {
  return (
    <section className="px-4 py-16 bg-zinc-900/30">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-8">
          This is not a content generator.
        </h2>

        <div className="grid sm:grid-cols-3 gap-6 text-left">
          <div className="flex items-start gap-3">
            <span className="text-zinc-600 text-lg">✕</span>
            <div>
              <p className="text-zinc-300 font-medium">No "make me viral" buttons</p>
              <p className="text-zinc-500 text-sm mt-1">
                We analyze, we don't promise magic.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-zinc-600 text-lg">✕</span>
            <div>
              <p className="text-zinc-300 font-medium">No scheduling or posting</p>
              <p className="text-zinc-500 text-sm mt-1">
                Use your existing tools for that.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-zinc-600 text-lg">✕</span>
            <div>
              <p className="text-zinc-300 font-medium">No editing tools</p>
              <p className="text-zinc-500 text-sm mt-1">
                We help you think, not produce.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-10 text-zinc-400">
          Just clear analysis and actionable structure.
        </p>
      </div>
    </section>
  );
}