"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Eye, Radio, TrendingUp, ChevronRight, Search } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const SPORT_FILTERS = [
  "All",
  "Football",
  "Basketball",
  "Tennis",
  "Cricket",
  "MMA",
  "Formula 1",
  "Baseball",
  "Rugby",
] as const;

type SportFilter = (typeof SPORT_FILTERS)[number];

interface LiveMatch {
  id: string;
  sport: SportFilter;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: string;
  viewers: number;
  thumbnail: string;
  isFeatured?: boolean;
}

const LIVE_MATCHES: LiveMatch[] = [
  {
    id: "1",
    sport: "Football",
    league: "UEFA Champions League",
    homeTeam: "Real Madrid",
    awayTeam: "Manchester City",
    homeScore: 2,
    awayScore: 1,
    minute: "67'",
    viewers: 1420000,
    thumbnail: "https://editorial.uefa.com/resources/02a8-21626bf229de-2b18e186f14f-1000/ucl_16_9_promo_20260819124536.png",
    isFeatured: true,
  },
  {
    id: "2",
    sport: "Basketball",
    league: "NBA Playoffs",
    homeTeam: "Boston Celtics",
    awayTeam: "Miami Heat",
    homeScore: 88,
    awayScore: 91,
    minute: "Q3 4:22",
    viewers: 980000,
    thumbnail: "/images/nba-celtics-heat-playoffs.jpg",
    isFeatured: true,
  },
  {
    id: "3",
    sport: "Tennis",
    league: "Wimbledon",
    homeTeam: "C. Alcaraz",
    awayTeam: "N. Djokovic",
    homeScore: 2,
    awayScore: 1,
    minute: "Set 4",
    viewers: 760000,
    thumbnail: "/images/wimbledon-alcaraz-djokovic.jpg",
    isFeatured: true,
  },
  {
    id: "4",
    sport: "Formula 1",
    league: "F1 World Championship",
    homeTeam: "M. Verstappen",
    awayTeam: "L. Hamilton",
    homeScore: 1,
    awayScore: 3,
    minute: "Lap 42/58",
    viewers: 640000,
    thumbnail: "/images/formula1-verstappen-hamilton-race.jpg",
  },
  {
    id: "5",
    sport: "Cricket",
    league: "ICC World Cup",
    homeTeam: "India",
    awayTeam: "Australia",
    homeScore: 287,
    awayScore: 241,
    minute: "42nd Over",
    viewers: 520000,
    thumbnail: "/images/cricket-india-australia-world-cup.jpg",
  },
  {
    id: "6",
    sport: "MMA",
    league: "UFC 298",
    homeTeam: "A. Volkanovski",
    awayTeam: "I. Topuria",
    homeScore: 0,
    awayScore: 1,
    minute: "Round 2",
    viewers: 490000,
    thumbnail: "/images/ufc-volkanovski-topuria-fight.jpg",
  },
  {
    id: "7",
    sport: "Football",
    league: "Premier League",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    homeScore: 1,
    awayScore: 1,
    minute: "78'",
    viewers: 870000,
    thumbnail: "/images/premier-league-arsenal-liverpool.jpg",
  },
  {
    id: "8",
    sport: "Basketball",
    league: "EuroLeague",
    homeTeam: "FC Barcelona",
    awayTeam: "Olympiacos",
    homeScore: 72,
    awayScore: 68,
    minute: "Q4 2:10",
    viewers: 210000,
    thumbnail: "/images/euroleague-barcelona-olympiacos.jpg",
  },
  {
    id: "9",
    sport: "Baseball",
    league: "MLB",
    homeTeam: "NY Yankees",
    awayTeam: "LA Dodgers",
    homeScore: 4,
    awayScore: 3,
    minute: "7th Inning",
    viewers: 310000,
    thumbnail: "/images/mlb-yankees-dodgers-game.jpg",
  },
  {
    id: "10",
    sport: "Rugby",
    league: "Six Nations",
    homeTeam: "England",
    awayTeam: "France",
    homeScore: 17,
    awayScore: 21,
    minute: "55'",
    viewers: 280000,
    thumbnail: "/images/six-nations-england-france-rugby.jpg",
  },
  {
    id: "11",
    sport: "Football",
    league: "La Liga",
    homeTeam: "Barcelona",
    awayTeam: "Atletico Madrid",
    homeScore: 3,
    awayScore: 2,
    minute: "82'",
    viewers: 590000,
    thumbnail: "/images/la-liga-barcelona-atletico-madrid.jpg",
  },
  {
    id: "12",
    sport: "Tennis",
    league: "US Open",
    homeTeam: "I. Swiatek",
    awayTeam: "A. Sabalenka",
    homeScore: 1,
    awayScore: 1,
    minute: "Set 3",
    viewers: 340000,
    thumbnail: "/images/us-open-swiatek-sabalenka-tennis.jpg",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatViewers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

function sportColor(sport: string): string {
  const map: Record<string, string> = {
    Football: "#22c55e",
    Basketball: "#f97316",
    Tennis: "#eab308",
    Cricket: "#06b6d4",
    MMA: "#e63946",
    "Formula 1": "#a855f7",
    Baseball: "#f59e0b",
    Rugby: "#84cc16",
  };
  return map[sport] ?? "#6b7280";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white",
        className,
      )}
    >
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-white"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      Live
    </span>
  );
}

function ViewerCount({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-white/70">
      <Eye className="h-3 w-3" />
      {formatViewers(count)}
    </span>
  );
}

function SportTag({ sport }: { sport: string }) {
  const color = sportColor(sport);
  return (
    <span
      className="rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {sport}
    </span>
  );
}

function ScoreDisplay({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  minute,
  compact = false,
}: {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center justify-between", compact ? "gap-2" : "gap-3")}>
      <span
        className={cn(
          "font-semibold text-white truncate",
          compact ? "text-xs max-w-[70px]" : "text-sm max-w-[90px]",
        )}
      >
        {homeTeam}
      </span>
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className={cn(
            "font-black tabular-nums text-white",
            compact ? "text-base" : "text-xl",
          )}
        >
          {homeScore}
        </span>
        <span className="text-white/40 font-light text-xs">–</span>
        <span
          className={cn(
            "font-black tabular-nums text-white",
            compact ? "text-base" : "text-xl",
          )}
        >
          {awayScore}
        </span>
      </div>
      <span
        className={cn(
          "font-semibold text-white truncate text-right",
          compact ? "text-xs max-w-[70px]" : "text-sm max-w-[90px]",
        )}
      >
        {awayTeam}
      </span>
    </div>
  );
}

// ─── Featured Card (large) ────────────────────────────────────────────────────

function FeaturedCard({ match }: { match: LiveMatch }) {
  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_2px_4px_rgba(0,0,0,0.3),0_16px_48px_-12px_rgba(0,0,0,0.6)] group cursor-pointer"
    >
      <Link href={`/watch-video-player?id=${match.id}`} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={match.thumbnail}
            alt={`${match.homeTeam} vs ${match.awayTeam}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Top row */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <LiveBadge />
            <ViewerCount count={match.viewers} />
          </div>

          {/* Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="mb-2 flex items-center gap-2">
              <SportTag sport={match.sport} />
              <span className="text-xs text-white/60">{match.league}</span>
            </div>
            <ScoreDisplay
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              homeScore={match.homeScore}
              awayScore={match.awayScore}
              minute={match.minute}
            />
            <div className="mt-1.5 flex items-center gap-1">
              <Radio className="h-3 w-3 text-red-400" />
              <span className="text-xs text-red-400 font-medium">{match.minute}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Standard Card ────────────────────────────────────────────────────────────

function MatchCard({ match }: { match: LiveMatch }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl border border-white/8 bg-white/4 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.4)] group cursor-pointer"
    >
      <Link href={`/watch-video-player?id=${match.id}`} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={match.thumbnail}
            alt={`${match.homeTeam} vs ${match.awayTeam}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            <LiveBadge />
            <ViewerCount count={match.viewers} />
          </div>

          {/* Minute */}
          <div className="absolute bottom-2 right-2">
            <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
              {match.minute}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-3">
          <div className="mb-2 flex items-center gap-2">
            <SportTag sport={match.sport} />
            <span className="truncate text-xs text-white/50">{match.league}</span>
          </div>
          <ScoreDisplay
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            homeScore={match.homeScore}
            awayScore={match.awayScore}
            minute={match.minute}
            compact
          />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Most Watched Row ─────────────────────────────────────────────────────────

function MostWatchedRow({ match, rank }: { match: LiveMatch; rank: number }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group"
    >
      <Link
        href={`/watch-video-player?id=${match.id}`}
        className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/3 p-3 transition-colors duration-200 hover:bg-white/8"
      >
        {/* Rank */}
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black",
            rank === 1
              ? "bg-[var(--accent)] text-black"
              : rank === 2
                ? "bg-white/20 text-white"
                : rank === 3
                  ? "bg-amber-700/60 text-amber-200"
                  : "bg-white/8 text-white/50",
          )}
        >
          {rank}
        </span>

        {/* Thumbnail */}
        <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg">
          <img
            src={match.thumbnail}
            alt={`${match.homeTeam} vs ${match.awayTeam}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <SportTag sport={match.sport} />
            <LiveBadge className="scale-90 origin-left" />
          </div>
          <p className="truncate text-xs font-semibold text-white">
            {match.homeTeam} {match.homeScore} – {match.awayScore} {match.awayTeam}
          </p>
          <p className="text-xs text-white/50">{match.league}</p>
        </div>

        {/* Viewers */}
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-[var(--accent)]">{formatViewers(match.viewers)}</p>
          <p className="text-xs text-white/40">watching</p>
        </div>

        <ChevronRight className="h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-white/60" />
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LivePage() {
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = useState<SportFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = LIVE_MATCHES;
    if (activeFilter !== "All") {
      result = result.filter((m) => m.sport === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(q) ||
          m.awayTeam.toLowerCase().includes(q) ||
          m.league.toLowerCase().includes(q) ||
          m.sport.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeFilter, searchQuery]);

  const mostWatched = useMemo(
    () => [...LIVE_MATCHES].sort((a, b) => b.viewers - a.viewers).slice(0, 5),
    [],
  );

  const featured = useMemo(
    () => LIVE_MATCHES.filter((m) => m.isFeatured),
    [],
  );

  const totalViewers = useMemo(
    () => LIVE_MATCHES.reduce((sum, m) => sum + m.viewers, 0),
    [],
  );

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] pb-24">
      {/* ── Hero Header ── */}
      <Reveal>
        <section className="relative overflow-hidden border-b border-white/8 bg-gradient-to-br from-red-950/30 via-[hsl(var(--background))] to-[hsl(var(--background))] px-4 pb-10 pt-12 md:px-8">
          {/* Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />

          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1">
                  <motion.span
                    className="h-2 w-2 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                  <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
                    {t("live.headerBadge")}
                  </span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                  {t("live.heading")}
                </h1>
                <p className="mt-2 text-sm text-white/50 md:text-base">
                  {t("live.subheading")}
                </p>
              </div>

              {/* Stats strip */}
              <div className="flex items-center gap-6 rounded-2xl border border-white/8 bg-white/4 px-5 py-3 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-xl font-black text-white">{LIVE_MATCHES.length}</p>
                  <p className="text-xs text-white/50">{t("live.statStreams")}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-xl font-black text-[var(--accent)]">
                    {formatViewers(totalViewers)}
                  </p>
                  <p className="text-xs text-white/50">{t("live.statViewers")}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-xl font-black text-white">8</p>
                  <p className="text-xs text-white/50">{t("live.statSports")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Sticky Filter Bar ── */}
      <div className="sticky top-0 z-30 border-b border-white/8 bg-[hsl(var(--background))]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center gap-3 py-3">
            {/* Search */}
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("live.searchPlaceholder")}
                className="h-8 w-36 rounded-full border border-white/10 bg-white/6 pl-8 pr-3 text-xs text-white placeholder-white/30 outline-none transition-all focus:w-48 focus:border-[var(--accent)]/50 focus:bg-white/10 md:w-44 md:focus:w-56"
              />
            </div>

            {/* Divider */}
            <div className="h-6 w-px shrink-0 bg-white/10" />

            {/* Sport filters */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
              {SPORT_FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
                    activeFilter === filter
                      ? "bg-[var(--accent)] text-black shadow-[0_0_12px_var(--accent)/40]"
                      : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* ── Most Watched Section ── */}
        <Reveal>
          <section className="mt-10">
            <div className="mb-5 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--accent)]" />
              <h2 className="text-lg font-bold text-white">{t("live.mostWatchedTitle")}</h2>
              <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-xs font-semibold text-[var(--accent)]">
                {t("live.mostWatchedBadge")}
              </span>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 gap-2 lg:grid-cols-2"
            >
              {mostWatched.map((match, i) => (
                <motion.div key={match.id} variants={fadeInUp}>
                  <MostWatchedRow match={match} rank={i + 1} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        </Reveal>

        {/* ── Featured Streams ── */}
        {activeFilter === "All" && !searchQuery && (
          <Reveal>
            <section className="mt-12">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{t("live.featuredTitle")}</h2>
                <span className="text-xs text-white/40">{t("live.featuredSub")}</span>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {featured.map((match) => (
                  <motion.div key={match.id} variants={scaleIn}>
                    <FeaturedCard match={match} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </Reveal>
        )}

        {/* ── All Live Streams ── */}
        <Reveal>
          <section className="mt-12">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {activeFilter === "All"
                  ? t("live.allStreamsTitle")
                  : `${t("live.allStreamsTitleFiltered")} ${activeFilter}`}
              </h2>
              <AnimatePresence mode="wait">
                <motion.span
                  key={filtered.length}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="rounded-full border border-white/10 bg-white/6 px-3 py-0.5 text-xs text-white/50"
                >
                  {filtered.length} {t("live.streamCount")}
                </motion.span>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/3 py-20 text-center"
                >
                  <Radio className="mb-3 h-10 w-10 text-white/20" />
                  <p className="text-base font-semibold text-white/40">{t("live.emptyTitle")}</p>
                  <p className="mt-1 text-sm text-white/25">{t("live.emptyBody")}</p>
                  <button
                    onClick={() => {
                      setActiveFilter("All");
                      setSearchQuery("");
                    }}
                    className="mt-5 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                  >
                    {t("live.emptyReset")}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${activeFilter}-${searchQuery}`}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {filtered.map((match) => (
                    <motion.div key={match.id} variants={fadeInUp}>
                      <MatchCard match={match} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </Reveal>

        {/* ── CTA Banner ── */}
        <Reveal>
          <section className="mt-16">
            <div className="relative overflow-hidden rounded-2xl border border-[var(--accent)]/20 bg-gradient-to-r from-[var(--accent)]/10 via-[var(--accent)]/5 to-transparent p-8 md:p-10">
              <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[var(--accent)]/5 to-transparent" />
              <div className="relative max-w-xl">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                  {t("live.ctaEyebrow")}
                </p>
                <h2 className="text-2xl font-black text-white md:text-3xl">
                  {t("live.ctaHeading")}
                </h2>
                <p className="mt-2 text-sm text-white/60 md:text-base">
                  {t("live.ctaBody")}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/pricing"
                    className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-bold text-black transition-all duration-200 hover:opacity-90 hover:shadow-[0_0_20px_var(--accent)/40]"
                  >
                    {t("live.ctaPrimary")}
                  </Link>
                  <Link
                    href="/schedule"
                    className="rounded-full border border-white/15 bg-white/6 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/12"
                  >
                    {t("live.ctaSecondary")}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}