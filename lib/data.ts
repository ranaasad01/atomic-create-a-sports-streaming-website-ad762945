export const BRAND = {
  name: "ArenaStream",
  tagline: "Every Match. Every Moment. Live.",
  url: "https://arenastream.tv",
} as const;

export interface NavLink {
  label: string;
  href: string;
  key: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", key: "home" },
  { label: "Live", href: "/live", key: "live" },
  { label: "Schedule", href: "/schedule", key: "schedule" },
  { label: "On Demand", href: "/on-demand", key: "onDemand" },
  { label: "Sports", href: "/sports-category", key: "sports" },
  { label: "Pricing", href: "/pricing", key: "pricing" },
];

export interface Sport {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const sports: Sport[] = [
  { id: "football", name: "Football", icon: "⚽", color: "#22c55e" },
  { id: "basketball", name: "Basketball", icon: "🏀", color: "#f97316" },
  { id: "tennis", name: "Tennis", icon: "🎾", color: "#eab308" },
  { id: "mma", name: "MMA", icon: "🥊", color: "#E63946" },
  { id: "f1", name: "Formula 1", icon: "🏎️", color: "#ef4444" },
  { id: "basketball-nba", name: "NBA", icon: "🏀", color: "#3b82f6" },
  { id: "rugby", name: "Rugby", icon: "🏉", color: "#8b5cf6" },
  { id: "cricket", name: "Cricket", icon: "🏏", color: "#06b6d4" },
];

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  annualPrice: number;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    annualPrice: 0,
    features: [
      "5 live streams per month",
      "720p HD quality",
      "Limited on-demand library",
      "1 device at a time",
      "Ad-supported",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 14.99,
    annualPrice: 9.99,
    features: [
      "Unlimited live streams",
      "1080p Full HD quality",
      "Full on-demand library",
      "3 devices simultaneously",
      "Ad-free experience",
      "DVR & replay",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "elite",
    name: "Elite",
    price: 24.99,
    annualPrice: 19.99,
    features: [
      "Everything in Pro",
      "4K Ultra HD quality",
      "6 devices simultaneously",
      "Offline downloads",
      "Early access to PPV events",
      "Priority support",
    ],
    highlighted: false,
    badge: "Best Value",
  },
];