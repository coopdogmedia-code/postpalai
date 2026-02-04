import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingCard } from "@/components/pricing/PricingCard";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For creators exploring the tool.",
    features: [
      "5 video analyses per month",
      "Basic blueprint export",
      "Hook variations",
      "Structure breakdown",
    ],
    cta: "Get Started",
    href: "/analyze",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For creators serious about craft.",
    features: [
      "Unlimited video analyses",
      "Full blueprint export",
      "Advanced hook variations",
      "Make it better suggestions",
      "Example executions",
      "Priority processing",
    ],
    cta: "Start Free Trial",
    href: "/analyze",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "per month",
    description: "For agencies and content teams.",
    features: [
      "Everything in Pro",
      "5 team members",
      "Shared blueprint library",
      "Team analytics",
      "Slack integration (soon)",
    ],
    cta: "Contact Us",
    href: "/analyze",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              Start free. Upgrade when you're ready to go deeper.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.name} {...tier} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-zinc-500 text-sm">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}