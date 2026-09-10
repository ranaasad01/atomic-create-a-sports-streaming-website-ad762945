"use client";

import { motion, type Variants } from "framer-motion";
import { Play, Tv, Download, Shield, Star, Users, ChevronRight, Zap, Globe, Award } from 'lucide-react';
import Link from "next/link";
import { BRAND, pricingPlans } from "@/lib/data";
type MatchEvent = any;
const MatchEvent: any = [];
import { fadeInUp, staggerContainer, scaleIn, slideInLeft, slideInRight } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

const LIVE_MATCHES: MatchEvent[] = [
  {
    id: "m1",
    sport: "football",
    league: "UEFA Champions League",
    homeTeam: "Real Madrid",
    awayTeam: "Manchester City",
    homeScore: 2,
    awayScore: 1,
    status: "live",
    startTime: "2024-03-15T20:00:00Z",
    thumbnail: "https://editorial.uefa.com/resources/02a8-21626bf229de-2b18e186f14f-1000/ucl_16_9_promo_20260819124536.png",
    viewers: 142000,
  },
  {
    id: "m2",
    sport: "basketball",
    league: "NBA",
    homeTeam: "LA Lakers",
    awayTeam: "Boston Celtics",
    homeScore: 87,
    awayScore: 91,
    status: "live",
    startTime: "2024-03-15T19:30:00Z",
    thumbnail: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/cac1487b42044a02a311a15e1be83f53.webp",
    viewers: 98000,
  },
  {
    id: "m3",
    sport: "tennis",
    league: "Wimbledon",
    homeTeam: "Djokovic",
    awayTeam: "Alcaraz",
    status: "upcoming",
    startTime: "2024-03-15T21:00:00Z",
    thumbnail: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/89dd1986d39e47a889ce2234dab700a4.jpg",
  },
  {
    id: "m4",
    sport: "f1",
    league: "Formula 1 Grand Prix",
    homeTeam: "Verstappen",
    awayTeam: "Hamilton",
    status: "replay",
    startTime: "2024-03-14T14:00:00Z",
    thumbnail: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/689d5178a600407ca9f412635cfc97c4.png",
    viewers: 54000,
  },
];

const SPORT_CATEGORIES = [
  { key: "football",   label: "Football",   icon: "⚽" },
  { key: "basketball", label: "Basketball", icon: "🏀" },
  { key: "tennis",     label: "Tennis",     icon: "🎾" },
  { key: "cricket",    label: "Cricket",    icon: "🏏" },
  { key: "mma",        label: "MMA",        icon: "🥊" },
  { key: "f1",         label: "Formula 1",  icon: "🏎️" },
  { key: "baseball",   label: "Baseball",   icon: "⚾" },
  { key: "rugby",      label: "Rugby",      icon: "🏉" },
];

const STATS = [
  { value: "50+", label: "Sports leagues covered" },
  { value: "4K",  label: "Ultra HD streaming" },
  { value: "3M+", label: "Active subscribers" },
  { value: "99%", label: "Uptime guaranteed" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Zero-lag live streams",
    description: "Sub-3-second latency on every broadcast. Watch the goal the same moment the crowd erupts.",
  },
  {
    icon: Globe,
    title: "50+ leagues worldwide",
    description: "Champions League, NBA, Wimbledon, Formula 1, IPL, UFC — all in one subscription.",
  },
  {
    icon: Download,
    title: "Download and watch offline",
    description: "Save replays and highlights to your device. Catch up on the train, the plane, or anywhere.",
  },
  {
    icon: Tv,
    title: "Every screen, every device",
    description: "Smart TV, phone, tablet, laptop. Switch mid-match without missing a second.",
  },
  {
    icon: Shield,
    title: "No blackouts, no restrictions",
    description: "Full access regardless of your location. No regional locks on any match in our library.",
  },
  {
    icon: Award,
    title: "Exclusive behind-the-scenes",
    description: "Locker room access, pre-match warmups, and post-match press conferences on Elite.",
  },
];

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Marcus T.",
    role: "Football fan, London",
    quote: "I cancelled three separate subscriptions after switching to ArenaStream. Every league I follow is here, in one place.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20T.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Priya S.",
    role: "Cricket and tennis viewer",
    quote: "The picture quality during the IPL final was flawless. Not a single buffer, even on my 4K TV.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20S.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Jake R.",
    role: "NBA season ticket holder",
    quote: "I use ArenaStream for away games I can't attend. The multi-angle replays are something else entirely.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jake%20R.",
    rating: 5,
  },
];

const pulseRing: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function StatusBadge({ status }: { status: MatchEvent["status"] }) {
  if (status === "live") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        LIVE
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="rounded-full bg-[var(--accent)]/20 px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
        UPCOMING
      </span>
    );
  }
  return (
    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/60">
      REPLAY
    </span>
  );
}

function MatchCard({ match }: { match: MatchEvent }) {
  return (
    <Link href={`/watch-video-player`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={match.thumbnail}
            alt={`${match.homeTeam} vs ${match.awayTeam}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3">
            <StatusBadge status={match.status} />
          </div>
          {match.viewers && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white/80">
              <Users className="h-3 w-3" />
              {(match.viewers / 1000).toFixed(0)}K watching
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] shadow-lg">
              <Play className="h-5 w-5 text-black fill-black" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-[var(--accent)] mb-1">{match.league}</p>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{match.homeTeam}</p>
              <p className="text-sm text-white/50">vs</p>
              <p className="text-sm font-semibold text-white">{match.awayTeam}</p>
            </div>
            {match.homeScore !== undefined && match.awayScore !== undefined && (
              <div className="text-right">
                <p className="text-2xl font-bold text-white tabular-nums">
                  {match.homeScore} <span className="text-white/30">–</span> {match.awayScore}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center bg-[var(--background)]">
        {/* Background mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[var(--accent)]/8 blur-[120px]" />
          <div className="absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full bg-purple-600/6 blur-[100px]" />
          <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <Reveal>
            <motion.div variants={slideInLeft} initial="hidden" animate="visible">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-sm font-medium text-[var(--accent)] mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                142,000 fans watching live right now
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05] text-balance">
                Every game.<br />
                <span className="text-[var(--accent)]">Every moment.</span><br />
                Live.
              </h1>
              <p className="mt-6 text-lg text-white/60 leading-relaxed max-w-md text-pretty">
                Stream 50+ sports leagues in 4K with zero blackouts. Champions League, NBA, Wimbledon, Formula 1 and more — all in one subscription.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  Start watching free
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/live"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <Play className="h-4 w-4 fill-white" />
                  Browse live now
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6">
                {STATS.slice(0, 2).map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </Reveal>

          {/* Right — featured match card */}
          <Reveal delay={0.15}>
            <motion.div variants={slideInRight} initial="hidden" animate="visible" className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_8px_64px_rgba(0,0,0,0.6)]">
                <img
                  src="https://editorial.uefa.com/resources/02a8-21626bf229de-2b18e186f14f-1000/ucl_16_9_promo_20260819124536.png"
                  alt="Champions League live match"
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs font-semibold text-[var(--accent)] mb-2">UEFA Champions League</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-lg">Real Madrid</p>
                      <p className="text-white/50 text-sm">vs Manchester City</p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-black text-white tabular-nums">2 – 1</p>
                      <p className="text-white/50 text-xs mt-1">67&apos;</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-white/40" />
                    <span className="text-xs text-white/40">142K watching</span>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <motion.div
                variants={pulseRing}
                initial="hidden"
                animate="visible"
                className="absolute -bottom-4 -right-4 rounded-2xl border border-[var(--accent)]/30 bg-[var(--background)]/90 backdrop-blur-md px-4 py-3 shadow-xl"
              >
                <p className="text-xs text-white/50">Streaming in</p>
                <p className="text-sm font-bold text-[var(--accent)]">4K Ultra HD</p>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── LIVE NOW ── */}
      <section id="live" className="bg-[var(--background)] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-red-500">Live now</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  Matches happening right now
                </h2>
              </div>
              <Link
                href="/live"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
              >
                See all live <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {LIVE_MATCHES.map((match, i) => (
              <motion.div key={match.id} variants={scaleIn} custom={i}>
                <MatchCard match={match} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SPORTS CATEGORIES ── */}
      <section id="sports" className="bg-white/[0.02] border-y border-white/5 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Every sport you follow
              </h2>
              <p className="mt-3 text-white/50 max-w-xl mx-auto">
                From the Premier League to the UFC Octagon. Browse by sport and jump straight to the action.
              </p>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
          >
            {SPORT_CATEGORIES.map((cat, i) => (
              <motion.div key={cat.key} variants={fadeInUp} custom={i}>
                <Link href={`/category`}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/5 p-4 text-center cursor-pointer hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 transition-colors duration-300"
                  >
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="text-xs font-medium text-white/70">{cat.label}</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES — split layout ── */}
      <section id="features" className="bg-[var(--background)] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: image */}
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_4px_48px_rgba(0,0,0,0.5)]">
                <img
                  src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/93ce5d1d6a704430ba39e12183bfb103.png"
                  alt="ArenaStream on multiple devices"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
                        <Zap className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Ultra-low latency</p>
                        <p className="text-xs text-white/50">Under 3 seconds behind broadcast</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: feature list */}
            <div>
              <Reveal>
                <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight text-balance">
                  Built for fans who refuse to miss a moment
                </h2>
                <p className="mt-4 text-white/50 leading-relaxed">
                  ArenaStream is engineered from the ground up for sports. Not a general streaming service with a sports tab — a dedicated platform where every feature exists to serve the match.
                </p>
              </Reveal>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="mt-10 space-y-6"
              >
                {FEATURES.map((feat, i) => (
                  <motion.div key={feat.title} variants={fadeInUp} custom={i} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                      <feat.icon className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{feat.title}</p>
                      <p className="text-sm text-white/50 mt-0.5 leading-relaxed">{feat.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="border-y border-white/5 bg-[var(--accent)]/5 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STATS.map((stat, i) => (
              <motion.div key={stat.label} variants={scaleIn} custom={i} className="text-center">
                <p className="text-4xl lg:text-5xl font-black text-[var(--accent)]">{stat.value}</p>
                <p className="mt-2 text-sm text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="about" className="bg-[var(--background)] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Fans who switched, stayed
              </h2>
              <p className="mt-3 text-white/50 max-w-lg mx-auto">
                Over 3 million subscribers chose ArenaStream as their home for live sport. Here is what a few of them said.
              </p>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/8">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ── */}
      <section id="pricing" className="bg-white/[0.02] border-t border-white/5 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Pick the plan that fits your season
              </h2>
              <p className="mt-3 text-white/50 max-w-lg mx-auto">
                Start free, upgrade when you want more. No contracts, cancel any time.
              </p>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.key}
                variants={scaleIn}
                custom={i}
                className={`relative rounded-2xl border p-7 flex flex-col gap-5 ${
                  plan.highlighted
                    ? "border-[var(--accent)] bg-[var(--accent)]/8 shadow-[0_0_40px_var(--accent)]/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[var(--accent)] px-3 py-0.5 text-xs font-bold text-black">
                      Most popular
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-white/60">{plan.name}</p>
                  <div className="mt-1 flex items-end gap-1">
                    <span className="text-4xl font-black text-white">
                      {plan.monthlyPrice === 0 ? "Free" : `$${plan.monthlyPrice}`}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-white/40 text-sm mb-1">/month</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className={`mt-2 block rounded-full py-2.5 text-center text-sm font-bold transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-[var(--accent)] text-black hover:brightness-110"
                      : "border border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.monthlyPrice === 0 ? "Get started free" : `Choose ${plan.name}`}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <Reveal delay={0.2}>
            <p className="text-center text-xs text-white/30 mt-8">
              Annual plans save up to 30%. All plans include a 7-day free trial.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="relative bg-[var(--background)] py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[var(--accent)]/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[var(--accent)]/10 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight text-balance">
              The match starts in minutes. Are you in?
            </h2>
            <p className="mt-5 text-white/50 text-lg leading-relaxed">
              Join 3 million fans streaming live sport in HD. No setup, no contracts. Watch your first match free today.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-4 text-base font-bold text-black transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_32px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Start watching free
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="/schedule"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              >
                View today&apos;s schedule
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}