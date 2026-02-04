import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col p-6 rounded-xl border ${
        highlighted
          ? "border-zinc-500 bg-zinc-900/80"
          : "border-zinc-800 bg-zinc-900/40"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium bg-white text-zinc-900 rounded-full">
          Most Popular
        </span>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-100">{name}</h3>
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold text-zinc-100">{price}</span>
        <span className="text-zinc-500 text-sm ml-2">/{period}</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <span className="text-zinc-500 mt-0.5">✓</span>
            <span className="text-zinc-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={href}>
        <Button
          variant={highlighted ? "primary" : "secondary"}
          className="w-full justify-center"
        >
          {cta}
        </Button>
      </Link>
    </div>
  );
}