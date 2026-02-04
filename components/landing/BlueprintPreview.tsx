export function BlueprintPreview() {
  return (
    <section className="px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide text-center mb-8">
          What you'll get
        </h2>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 sm:p-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-zinc-500 font-mono text-sm shrink-0 w-6">A</span>
              <div>
                <h3 className="text-zinc-200 font-medium">Why This Worked</h3>
                <p className="text-zinc-500 text-sm mt-1">
                  Mechanisms, psychological triggers, and format analysis
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-zinc-500 font-mono text-sm shrink-0 w-6">B</span>
              <div>
                <h3 className="text-zinc-200 font-medium">Hook Variations</h3>
                <p className="text-zinc-500 text-sm mt-1">
                  6–10 adaptable hooks based on the original structure
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-zinc-500 font-mono text-sm shrink-0 w-6">C</span>
              <div>
                <h3 className="text-zinc-200 font-medium">Body Blueprint</h3>
                <p className="text-zinc-500 text-sm mt-1">
                  Beat-by-beat structure with timing and purpose
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-zinc-500 font-mono text-sm shrink-0 w-6">D</span>
              <div>
                <h3 className="text-zinc-200 font-medium">Make It Better</h3>
                <p className="text-zinc-500 text-sm mt-1">
                  Specific suggestions to improve on the original
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}