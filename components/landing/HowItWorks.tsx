export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Paste a link",
      description:
        "YouTube Shorts, TikTok, or Instagram Reels. Or upload a video file directly.",
    },
    {
      number: "02",
      title: "We extract the structure",
      description:
        "Hooks, beats, retention mechanics, and psychological triggers—mapped out.",
    },
    {
      number: "03",
      title: "You leave with a blueprint",
      description:
        "A reusable framework to adapt, not copy. Make it yours.",
    },
  ];

  return (
    <section className="px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-100 text-center mb-12">
          How it works
        </h2>

        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center sm:text-left">
              <span className="text-3xl font-bold text-zinc-700">
                {step.number}
              </span>
              <h3 className="text-lg font-medium text-zinc-200 mt-3">
                {step.title}
              </h3>
              <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}