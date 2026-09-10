"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Play, Clock, Users, Star, Filter, ChevronRight, Flame, Trophy } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SPORT_CATEGORIES = [
  { key: "all", label: "All Sports", icon: "🏆", color: "#e63946" },
  { key: "football", label: "Football", icon: "⚽", color: "#22c55e" },
  { key: "basketball", label: "Basketball", icon: "🏀", color: "#f97316" },
  { key: "tennis", label: "Tennis", icon: "🎾", color: "#eab308" },
  { key: "cricket", label: "Cricket", icon: "🏏", color: "#06b6d4" },
  { key: "mma", label: "MMA", icon: "🥊", color: "#e63946" },
  { key: "f1", label: "Formula 1", icon: "🏎️", color: "#a855f7" },
  { key: "baseball", label: "Baseball", icon: "⚾", color: "#f59e0b" },
  { key: "rugby", label: "Rugby", icon: "🏉", color: "#84cc16" },
];

interface ContentItem {
  id: string;
  sport: string;
  title: string;
  league: string;
  thumbnail: string;
  status: "live" | "upcoming" | "replay";
  viewers?: number;
  duration?: string;
  startTime?: string;
  teams?: string;
  rating: number;
}

const CONTENT_ITEMS: ContentItem[] = [
  {
    id: "1",
    sport: "football",
    title: "Champions League Final",
    league: "UEFA Champions League",
    thumbnail: "/images/champions-league-final-football.jpg",
    status: "live",
    viewers: 142000,
    teams: "Real Madrid vs Manchester City",
    rating: 4.9,
  },
  {
    id: "2",
    sport: "basketball",
    title: "NBA Finals Game 5",
    league: "NBA",
    thumbnail: "/images/nba-finals-basketball-game.jpg",
    status: "live",
    viewers: 98000,
    teams: "Lakers vs Celtics",
    rating: 4.8,
  },
  {
    id: "3",
    sport: "tennis",
    title: "Wimbledon Men's Final",
    league: "Grand Slam",
    thumbnail: "/images/wimbledon-tennis-final.jpg",
    status: "upcoming",
    startTime: "Today, 14:00 BST",
    teams: "Djokovic vs Alcaraz",
    rating: 4.7,
  },
  {
    id: "4",
    sport: "f1",
    title: "Monaco Grand Prix",
    league: "Formula 1 World Championship",
    thumbnail: "/images/monaco-formula1-grand-prix.jpg",
    status: "upcoming",
    startTime: "Sun, 13:00 CET",
    teams: "Verstappen vs Hamilton",
    rating: 4.9,
  },
  {
    id: "5",
    sport: "mma",
    title: "UFC 300 Main Event",
    league: "UFC",
    thumbnail: "/images/ufc-300-mma-main-event.jpg",
    status: "replay",
    duration: "2h 14m",
    teams: "Pereira vs Hill",
    rating: 4.8,
  },
  {
    id: "6",
    sport: "cricket",
    title: "Ashes Test Series",
    league: "International Cricket",
    thumbnail: "/images/ashes-cricket-test-series.jpg",
    status: "live",
    viewers: 67000,
    teams: "England vs Australia",
    rating: 4.6,
  },
  {
    id: "7",
    sport: "football",
    title: "Premier League Derby",
    league: "English Premier League",
    thumbnail: "/images/premier-league-derby-football.jpg",
    status: "replay",
    duration: "1h 52m",
    teams: "Arsenal vs Tottenham",
    rating: 4.7,
  },
  {
    id: "8",
    sport: "baseball",
    title: "World Series Game 7",
    league: "MLB",
    thumbnail: "/images/world-series-baseball-game7.jpg",
    status: "replay",
    duration: "3h 08m",
    teams: "Yankees vs Dodgers",
    rating: 4.9,
  },
  {
    id: "9",
    sport: "rugby",
    title: "Six Nations Championship",
    league: "Six Nations",
    thumbnail: "/images/six-nations-rugby-championship.jpg",
    status: "upcoming",
    startTime: "Sat, 15:30 GMT",
    teams: "England vs France",
    rating: 4.5,
  },
  {
    id: "10",
    sport: "basketball",
    title: "EuroLeague Playoffs",
    league: "EuroLeague Basketball",
    thumbnail: "/images/euroleague-basketball-playoffs.jpg",
    status: "upcoming",
    startTime: "Fri, 20:00 CET",
    teams: "Real Madrid vs Olympiacos",
    rating: 4.4,
  },
  {
    id: "11",
    sport: "tennis",
    title: "US Open Quarterfinal",
    league: "Grand Slam",
    thumbnail: "/images/us-open-tennis-quarterfinal.jpg",
    status: "replay",
    duration: "2h 41m",
    teams: "Sinner vs Medvedev",
    rating: 4.6,
  },
  {
    id: "12",
    sport: "f1",
    title: "British Grand Prix Highlights",
    league: "Formula 1 World Championship",
    thumbnail: "/images/british-grand-prix-formula1.jpg",
    status: "replay",
    duration: "1h 28m",
    teams: "Full Race Replay",
    rating: 4.7,
  },
];

const STATUS_FILTERS = ["All", "Live", "Upcoming", "Replay"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

function formatViewers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

function StatusBadge({ status }: { status: ContentItem["status"] }) {
  if (status === "live") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        Live
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-[var(--accent)]/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
        <Clock className="h-3 w-3" />
        Soon
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white/70">
      <Play className="h-3 w-3" />
      Replay
    </span>
  );
}

function ContentCard({ item, index }: { item: ContentItem; index: number }) {
  const cat = SPORT_CATEGORIES.find((c) => c.key === item.sport);
  return (
    <Reveal delay={index * 0.06}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <Link href={`/watch-video-player?id=${item.id}`} className="block">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <StatusBadge status={item.status} />
              {cat && (
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{ background: `${cat.color}22`, color: cat.color, border: `1px solid ${cat.color}44` }}
                >
                  {cat.icon} {cat.label}
                </span>
              )}
            </div>
            {item.status === "live" && item.viewers && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-white/80">
                <Users className="h-3 w-3" />
                {formatViewers(item.viewers)} watching
              </div>
            )}
            {item.status === "replay" && item.duration && (
              <div className="absolute bottom-3 right-3 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white/80">
                {item.duration}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] shadow-lg">
                <Play className="h-5 w-5 fill-black text-black" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">{item.league}</p>
            <h3 className="font-semibold leading-snug text-white">{item.title}</h3>
            {item.teams && <p className="text-sm text-white/60">{item.teams}</p>}
            {item.status === "upcoming" && item.startTime && (
              <p className="flex items-center gap-1 text-xs text-white/50">
                <Clock className="h-3 w-3" />
                {item.startTime}
              </p>
            )}
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-white/60">{item.rating.toFixed(1)}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </Reveal>
  );
}

export default function SportsCategoryPage() {
  const [activeSport, setActiveSport] = useState("all");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return CONTENT_ITEMS.filter((item) => {
      const matchSport = activeSport === "all" || item.sport === activeSport;
      const matchStatus =
        activeStatus === "All" ||
        (activeStatus === "Live" && item.status === "live") ||
        (activeStatus === "Upcoming" && item.status === "upcoming") ||
        (activeStatus === "Replay" && item.status === "replay");
      const matchSearch =
        search.trim() === "" ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.league.toLowerCase().includes(search.toLowerCase()) ||
        (item.teams ?? "").toLowerCase().includes(search.toLowerCase());
      return matchSport && matchStatus && matchSearch;
    });
  }, [activeSport, activeStatus, search]);

  const liveCount = CONTENT_ITEMS.filter((i) => i.status === "live").length;

  return (
    <main className="min-h-screen bg-[var(--background)] pb-24 pt-8">
      {/* Hero Header */}
      <Reveal>
        <section className="relative overflow-hidden border-b border-white/8 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-purple-900/10 px-4 pb-12 pt-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(230,57,70,0.12),transparent)]" />
          <div className="relative mx-auto max-w-6xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                <Flame className="h-3.5 w-3.5" />
                {liveCount} Events Live Now
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                <Trophy className="h-3.5 w-3.5" />
                {CONTENT_ITEMS.length} Total Events
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Browse by Sport
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/60 md:text-lg">
              Explore live matches, upcoming fixtures, and on-demand replays across every major sport and league.
            </p>
          </div>
        </section>
      </Reveal>

      <div className="mx-auto max-w-6xl px-4">
        {/* Sport Category Pills */}
        <Reveal>
          <section className="mt-10">
            <div className="flex flex-wrap gap-2">
              {SPORT_CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.key}
                  onClick={() => setActiveSport(cat.key)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200",
                    activeSport === cat.key
                      ? "border-[var(--accent)] bg-[var(--accent)] text-black shadow-[0_0_16px_rgba(230,57,70,0.4)]"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Filters + Search Row */}
        <Reveal>
          <section className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-white/40" />
              <div className="flex gap-1.5">
                {STATUS_FILTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveStatus(s)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                      activeStatus === s
                        ? "border-white/20 bg-white/15 text-white"
                        : "border-white/8 bg-transparent text-white/50 hover:border-white/15 hover:text-white/80"
                    )}
                  >
                    {s}
                    {s === "Live" && (
                      <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                        {liveCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, teams, leagues..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-[var(--accent)]/50 focus:bg-white/8 sm:w-72"
              />
            </div>
          </section>
        </Reveal>

        {/* Results Count */}
        <Reveal>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-white/40">
              {filtered.length === 0
                ? "No events found"
                : `${filtered.length} event${filtered.length !== 1 ? "s" : ""} found`}
            </p>
            {(activeSport !== "all" || activeStatus !== "All" || search.trim() !== "") && (
              <button
                onClick={() => {
                  setActiveSport("all");
                  setActiveStatus("All");
                  setSearch("");
                }}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </Reveal>

        {/* Content Grid */}
        {filtered.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((item, i) => (
              <ContentCard key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        ) : (
          <Reveal>
            <div className="mt-16 flex flex-col items-center gap-4 text-center">
              <span className="text-5xl">🔍</span>
              <h3 className="text-xl font-semibold text-white">No events match your filters</h3>
              <p className="text-sm text-white/50">Try adjusting your sport, status filter, or search query.</p>
              <button
                onClick={() => {
                  setActiveSport("all");
                  setActiveStatus("All");
                  setSearch("");
                }}
                className="mt-2 rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Reset Filters
              </button>
            </div>
          </Reveal>
        )}

        {/* Sport Spotlight Section */}
        <Reveal>
          <section className="mt-20 overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/5 to-white/2">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
                <span className="w-fit rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  Featured League
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                  UEFA Champions League
                </h2>
                <p className="text-base leading-relaxed text-white/60">
                  Watch every match from Europe's premier club competition. From group stage drama to the final showdown, ArenaStream has you covered with live streams, multi-angle replays, and expert analysis.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-white/50">
                  <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4 text-yellow-400" /> 32 Clubs</span>
                  <span className="flex items-center gap-1.5"><Play className="h-4 w-4 text-[var(--accent)]" /> 125+ Matches</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-blue-400" /> 500M+ Fans</span>
                </div>
                <Link
                  href="/live"
                  className="group flex w-fit items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-bold text-black transition-all duration-200 hover:opacity-90"
                >
                  Watch Now
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="relative min-h-[240px] overflow-hidden md:min-h-0">
                <img
                  src="/images/champions-league-stadium-night.jpg"
                  alt="Champions League stadium at night"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent md:from-transparent md:via-transparent md:to-transparent" />
              </div>
            </div>
          </section>
        </Reveal>

        {/* Browse All Sports Grid */}
        <Reveal>
          <section className="mt-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">All Sports</h2>
                <p className="mt-1 text-sm text-white/50">Jump straight into your favorite sport</p>
              </div>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8"
            >
              {SPORT_CATEGORIES.filter((c) => c.key !== "all").map((cat, i) => {
                const count = CONTENT_ITEMS.filter((item) => item.sport === cat.key).length;
                return (
                  <motion.button
                    key={cat.key}
                    variants={fadeInUp}
                    onClick={() => {
                      setActiveSport(cat.key);
                      setActiveStatus("All");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/5 p-4 text-center transition-all duration-200 hover:border-white/15 hover:bg-white/10"
                    style={{ boxShadow: activeSport === cat.key ? `0 0 20px ${cat.color}33` : undefined, borderColor: activeSport === cat.key ? `${cat.color}66` : undefined }}
                  >
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="text-xs font-semibold text-white">{cat.label}</span>
                    <span className="text-[10px] text-white/40">{count} event{count !== 1 ? "s" : ""}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </section>
        </Reveal>

        {/* CTA Banner */}
        <Reveal>
          <section className="mt-20 rounded-3xl bg-gradient-to-r from-[var(--accent)]/20 via-[var(--accent)]/10 to-purple-900/20 p-8 text-center md:p-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Never Miss a Moment
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/60 md:text-base">
              Upgrade to Pro or Elite and get unlimited access to every live match, replay, and exclusive content across all sports.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/pricing"
                className="rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
              >
                View Plans
              </Link>
              <Link
                href="/schedule"
                className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                See Schedule
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}