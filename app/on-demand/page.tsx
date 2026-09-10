"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Clock, Star, Eye, Search, Filter } from 'lucide-react';
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ─── Mock Data ───────────────────────────────────────────────────────────────

interface ContentItem {
  id: string;
  title: string;
  sport: string;
  league: string;
  duration: string;
  thumbnail: string;
  views: number;
  rating: number;
  date: string;
  tag: "highlight" | "full-match" | "documentary" | "press-conference";
  featured?: boolean;
  description?: string;
}

const CONTENT_ITEMS: ContentItem[] = [
  // Highlights
  {
    id: "h1",
    title: "Champions League Final Highlights",
    sport: "Football",
    league: "UEFA Champions League",
    duration: "12:34",
    thumbnail: "/images/champions-league-final-highlights.jpg",
    views: 2400000,
    rating: 4.9,
    date: "2024-06-01",
    tag: "highlight",
    featured: true,
    description: "Relive every breathtaking moment from the most anticipated final of the decade. Goals, saves, and drama in 12 minutes.",
  },
  {
    id: "h2",
    title: "NBA Finals Game 7 Best Plays",
    sport: "Basketball",
    league: "NBA",
    duration: "08:21",
    thumbnail: "/images/nba-finals-game7-highlights.jpg",
    views: 1800000,
    rating: 4.8,
    date: "2024-06-15",
    tag: "highlight",
  },
  {
    id: "h3",
    title: "Wimbledon Men's Final Top Moments",
    sport: "Tennis",
    league: "Wimbledon",
    duration: "10:05",
    thumbnail: "/images/wimbledon-mens-final-highlights.jpg",
    views: 950000,
    rating: 4.7,
    date: "2024-07-14",
    tag: "highlight",
  },
  {
    id: "h4",
    title: "F1 Monaco GP Overtakes Compilation",
    sport: "Formula 1",
    league: "FIA Formula One",
    duration: "06:48",
    thumbnail: "/images/f1-monaco-gp-overtakes.jpg",
    views: 1200000,
    rating: 4.6,
    date: "2024-05-26",
    tag: "highlight",
  },
  {
    id: "h5",
    title: "UFC 300 Knockout Reel",
    sport: "MMA",
    league: "UFC",
    duration: "05:12",
    thumbnail: "/images/ufc-300-knockout-reel.jpg",
    views: 3100000,
    rating: 4.9,
    date: "2024-04-13",
    tag: "highlight",
  },
  {
    id: "h6",
    title: "World Series Walk-Off Moments",
    sport: "Baseball",
    league: "MLB",
    duration: "09:33",
    thumbnail: "/images/mlb-world-series-walkoff.jpg",
    views: 780000,
    rating: 4.5,
    date: "2024-10-30",
    tag: "highlight",
  },
  // Full Matches
  {
    id: "f1",
    title: "El Clásico Full Match Replay",
    sport: "Football",
    league: "La Liga",
    duration: "1:52:10",
    thumbnail: "/images/el-clasico-full-match-replay.jpg",
    views: 5600000,
    rating: 4.9,
    date: "2024-10-26",
    tag: "full-match",
  },
  {
    id: "f2",
    title: "Lakers vs Celtics Full Game",
    sport: "Basketball",
    league: "NBA",
    duration: "2:14:45",
    thumbnail: "/images/lakers-celtics-full-game.jpg",
    views: 2200000,
    rating: 4.7,
    date: "2024-11-10",
    tag: "full-match",
  },
  {
    id: "f3",
    title: "Ashes Test Day 5 Full Coverage",
    sport: "Cricket",
    league: "The Ashes",
    duration: "6:30:00",
    thumbnail: "/images/ashes-test-day5-full.jpg",
    views: 890000,
    rating: 4.6,
    date: "2024-08-05",
    tag: "full-match",
  },
  {
    id: "f4",
    title: "Djokovic vs Alcaraz US Open Final",
    sport: "Tennis",
    league: "US Open",
    duration: "3:45:22",
    thumbnail: "/images/djokovic-alcaraz-us-open-final.jpg",
    views: 1700000,
    rating: 4.8,
    date: "2024-09-08",
    tag: "full-match",
  },
  {
    id: "f5",
    title: "Super Bowl LVIII Full Broadcast",
    sport: "Football",
    league: "NFL",
    duration: "4:02:15",
    thumbnail: "/images/super-bowl-lviii-full-broadcast.jpg",
    views: 8900000,
    rating: 4.9,
    date: "2024-02-11",
    tag: "full-match",
  },
  {
    id: "f6",
    title: "Rugby World Cup Final Full Match",
    sport: "Rugby",
    league: "Rugby World Cup",
    duration: "1:48:30",
    thumbnail: "/images/rugby-world-cup-final-full.jpg",
    views: 1100000,
    rating: 4.7,
    date: "2023-10-28",
    tag: "full-match",
  },
  // Documentaries
  {
    id: "d1",
    title: "The Last Dynasty: Inside the Bulls",
    sport: "Basketball",
    league: "NBA",
    duration: "1:28:00",
    thumbnail: "/images/documentary-last-dynasty-bulls.jpg",
    views: 4200000,
    rating: 4.9,
    date: "2024-03-15",
    tag: "documentary",
  },
  {
    id: "d2",
    title: "Senna: The Untold Story",
    sport: "Formula 1",
    league: "FIA Formula One",
    duration: "1:45:00",
    thumbnail: "/images/documentary-senna-untold-story.jpg",
    views: 3800000,
    rating: 5.0,
    date: "2024-01-20",
    tag: "documentary",
  },
  {
    id: "d3",
    title: "All or Nothing: Manchester City",
    sport: "Football",
    league: "Premier League",
    duration: "55:00",
    thumbnail: "/images/documentary-all-or-nothing-mancity.jpg",
    views: 6100000,
    rating: 4.8,
    date: "2024-07-01",
    tag: "documentary",
  },
  {
    id: "d4",
    title: "Federer: The Final Chapter",
    sport: "Tennis",
    league: "ATP Tour",
    duration: "1:10:00",
    thumbnail: "/images/documentary-federer-final-chapter.jpg",
    views: 2900000,
    rating: 4.9,
    date: "2024-04-05",
    tag: "documentary",
  },
  {
    id: "d5",
    title: "Conor McGregor: Rise and Fall",
    sport: "MMA",
    league: "UFC",
    duration: "1:22:00",
    thumbnail: "/images/documentary-mcgregor-rise-fall.jpg",
    views: 5500000,
    rating: 4.7,
    date: "2024-02-28",
    tag: "documentary",
  },
  // Press Conferences
  {
    id: "p1",
    title: "Pep Guardiola Pre-Match Presser",
    sport: "Football",
    league: "Premier League",
    duration: "22:15",
    thumbnail: "/images/press-conference-guardiola-prematch.jpg",
    views: 340000,
    rating: 4.3,
    date: "2024-11-08",
    tag: "press-conference",
  },
  {
    id: "p2",
    title: "LeBron James Post-Game Interview",
    sport: "Basketball",
    league: "NBA",
    duration: "18:40",
    thumbnail: "/images/press-conference-lebron-postgame.jpg",
    views: 890000,
    rating: 4.5,
    date: "2024-11-12",
    tag: "press-conference",
  },
  {
    id: "p3",
    title: "Max Verstappen Championship Presser",
    sport: "Formula 1",
    league: "FIA Formula One",
    duration: "31:00",
    thumbnail: "/images/press-conference-verstappen-championship.jpg",
    views: 620000,
    rating: 4.4,
    date: "2024-10-20",
    tag: "press-conference",
  },
  {
    id: "p4",
    title: "Novak Djokovic Wimbledon Presser",
    sport: "Tennis",
    league: "Wimbledon",
    duration: "25:30",
    thumbnail: "/images/press-conference-djokovic-wimbledon.jpg",
    views: 480000,
    rating: 4.6,
    date: "2024-07-15",
    tag: "press-conference",
  },
  {
    id: "p5",
    title: "Jon Jones UFC 300 Post-Fight",
    sport: "MMA",
    league: "UFC",
    duration: "19:55",
    thumbnail: "/images/press-conference-jones-ufc300.jpg",
    views: 1100000,
    rating: 4.7,
    date: "2024-04-14",
    tag: "press-conference",
  },
];

const FEATURED = CONTENT_ITEMS.find((c) => c.featured) as ContentItem;

const RAILS = [
  { id: "highlight", label: "Top Highlights" },
  { id: "full-match", label: "Full Match Replays" },
  { id: "documentary", label: "Documentaries" },
  { id: "press-conference", label: "Press Conferences" },
] as const;

type RailId = (typeof RAILS)[number]["id"];

const SPORT_FILTERS = ["All", ...new Set(CONTENT_ITEMS.map((c) => c.sport))] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const TAG_COLORS: Record<string, string> = {
  highlight: "bg-[var(--accent)]/20 text-[var(--accent)]",
  "full-match": "bg-blue-500/20 text-blue-400",
  documentary: "bg-purple-500/20 text-purple-400",
  "press-conference": "bg-amber-500/20 text-amber-400",
};

const TAG_LABELS: Record<string, string> = {
  highlight: "Highlight",
  "full-match": "Full Match",
  documentary: "Documentary",
  "press-conference": "Press Conf.",
};

// ─── Content Card ─────────────────────────────────────────────────────────────

function ContentCard({ item }: { item: ContentItem }) {
  return (
    <Link href={`/watch-video-player?id=${item.id}`} className="group block flex-none w-64 sm:w-72">
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="rounded-xl overflow-hidden border border-white/8 bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-white/5">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 text-black fill-black ml-0.5" />
            </div>
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-mono px-1.5 py-0.5 rounded">
            {item.duration}
          </div>
          {/* Sport tag */}
          <div className={cn("absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full", TAG_COLORS[item.tag])}>
            {item.sport}
          </div>
        </div>
        {/* Info */}
        <div className="p-3">
          <p className="text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-200">
            {item.title}
          </p>
          <p className="text-white/50 text-xs mt-1">{item.league}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-white/40 text-xs">
              <Eye className="w-3 h-3" />
              {formatViews(item.views)}
            </span>
            <span className="flex items-center gap-1 text-white/40 text-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {item.rating.toFixed(1)}
            </span>
            <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded-full ml-auto", TAG_COLORS[item.tag])}>
              {TAG_LABELS[item.tag]}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Horizontal Rail ─────────────────────────────────────────────────────────

function HorizontalRail({ railId, label, items }: { railId: RailId; label: string; items: ContentItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-bold tracking-tight">{label}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4 text-white/70" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors duration-200"
          >
            <ChevronRight className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>
      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// ─── Hero Spotlight ───────────────────────────────────────────────────────────

function HeroSpotlight({ item }: { item: ContentItem }) {
  return (
    <div className="relative w-full aspect-[21/9] min-h-[320px] max-h-[520px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
      {/* Background image */}
      <img
        src={item.thumbnail}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-3">
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", TAG_COLORS[item.tag])}>
              {TAG_LABELS[item.tag]}
            </span>
            <span className="text-white/60 text-xs font-medium">{item.league}</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-white text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight text-balance"
          >
            {item.title}
          </motion.h1>

          {item.description && (
            <motion.p variants={fadeInUp} className="text-white/70 text-sm sm:text-base mt-3 leading-relaxed line-clamp-2">
              {item.description}
            </motion.p>
          )}

          <motion.div variants={fadeInUp} className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-white/60 text-sm">
              <Clock className="w-4 h-4" />
              {item.duration}
            </div>
            <div className="flex items-center gap-1.5 text-white/60 text-sm">
              <Eye className="w-4 h-4" />
              {formatViews(item.views)} views
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              {item.rating.toFixed(1)}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center gap-3 mt-6">
            <Link
              href={`/watch-video-player?id=${item.id}`}
              className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-[var(--accent)]/30 hover:shadow-xl"
            >
              <Play className="w-5 h-5 fill-black" />
              Watch Now
            </Link>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-full border border-white/20 transition-all duration-200 backdrop-blur-sm">
              + Watchlist
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnDemandPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSport, setActiveSport] = useState<string>("All");
  const [showSearch, setShowSearch] = useState(false);

  const sportFilters = ["All", ...new Set(CONTENT_ITEMS.map((c) => c.sport))];

  const filteredItems = CONTENT_ITEMS.filter((item) => {
    const matchesSport = activeSport === "All" || item.sport === activeSport;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.league.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const isFiltering = activeSport !== "All" || searchQuery.trim() !== "";

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* Page Header */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[var(--accent)] text-sm font-semibold uppercase tracking-widest mb-1">
                {t("onDemand.eyebrow")}
              </p>
              <h1 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">
                {t("onDemand.heading")}
              </h1>
              <p className="text-white/60 text-base mt-2 leading-relaxed">
                {t("onDemand.subheading")}
              </p>
            </div>
            {/* Search toggle */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowSearch((v) => !v)}
                className="flex items-center gap-2 bg-white/8 hover:bg-white/15 border border-white/10 text-white/80 text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200"
              >
                <Search className="w-4 h-4" />
                {t("onDemand.searchBtn")}
              </button>
            </div>
          </div>
        </Reveal>

        {/* Search Bar */}
        {showSearch && (
          <Reveal>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("onDemand.searchPlaceholder")}
                className="w-full bg-white/8 border border-white/12 rounded-full pl-11 pr-5 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--accent)]/60 focus:bg-white/12 transition-all duration-200"
              />
            </div>
          </Reveal>
        )}

        {/* Sport Filter Pills */}
        <Reveal>
          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            <Filter className="w-4 h-4 text-white/40 flex-shrink-0" />
            {sportFilters.map((sport) => (
              <button
                key={sport}
                onClick={() => setActiveSport(sport)}
                className={cn(
                  "flex-none rounded-full px-4 py-1.5 text-sm font-medium border transition-all duration-200",
                  activeSport === sport
                    ? "bg-[var(--accent)] text-black border-[var(--accent)] shadow-[0_0_12px_var(--accent)/40]"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/12 hover:text-white"
                )}
              >
                {sport}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Hero Spotlight — only when not filtering */}
        {!isFiltering && (
          <Reveal>
            <HeroSpotlight item={FEATURED} />
          </Reveal>
        )}

        {/* Filtered Results Grid */}
        {isFiltering ? (
          <Reveal>
            <div>
              <p className="text-white/50 text-sm mb-6">
                {filteredItems.length} {t("onDemand.resultsLabel")}
                {activeSport !== "All" && (
                  <span className="text-[var(--accent)] font-semibold"> · {activeSport}</span>
                )}
                {searchQuery && (
                  <span className="text-white/70"> for &ldquo;{searchQuery}&rdquo;</span>
                )}
              </p>
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="text-5xl mb-4">🎬</div>
                  <p className="text-white/60 text-lg font-medium">{t("onDemand.noResults")}</p>
                  <p className="text-white/40 text-sm mt-2">{t("onDemand.noResultsSub")}</p>
                </div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                >
                  {filteredItems.map((item) => (
                    <motion.div key={item.id} variants={scaleIn}>
                      <Link href={`/watch-video-player?id=${item.id}`} className="group block">
                        <div className="rounded-xl overflow-hidden border border-white/8 bg-white/5 hover:border-[var(--accent)]/40 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                          <div className="relative aspect-video overflow-hidden bg-white/5">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
                                <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                              </div>
                            </div>
                            <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-mono px-1.5 py-0.5 rounded">
                              {item.duration}
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-white text-xs font-semibold leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                              {item.title}
                            </p>
                            <p className="text-white/40 text-xs mt-1">{item.league}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="flex items-center gap-0.5 text-white/40 text-xs">
                                <Eye className="w-3 h-3" />
                                {formatViews(item.views)}
                              </span>
                              <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded-full ml-auto", TAG_COLORS[item.tag])}>
                                {TAG_LABELS[item.tag]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </Reveal>
        ) : (
          /* Category Rails */
          <div className="space-y-10">
            {RAILS.map((rail) => {
              const railItems = CONTENT_ITEMS.filter((c) => c.tag === rail.id);
              return (
                <Reveal key={rail.id}>
                  <HorizontalRail
                    railId={rail.id}
                    label={rail.label}
                    items={railItems}
                  />
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Upgrade CTA Banner */}
        <Reveal>
          <div className="relative rounded-2xl overflow-hidden border border-[var(--accent)]/20 bg-gradient-to-r from-[var(--accent)]/10 via-[var(--accent)]/5 to-transparent p-8 sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--accent)/15,_transparent_60%)]" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-[var(--accent)] text-sm font-bold uppercase tracking-widest mb-2">
                  {t("onDemand.ctaEyebrow")}
                </p>
                <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {t("onDemand.ctaHeading")}
                </h2>
                <p className="text-white/60 text-sm mt-2 max-w-md leading-relaxed">
                  {t("onDemand.ctaBody")}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  href="/pricing"
                  className="flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-bold px-7 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-[var(--accent)]/30 hover:shadow-xl whitespace-nowrap"
                >
                  {t("onDemand.ctaBtn")}
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-full border border-white/15 transition-all duration-200 whitespace-nowrap"
                >
                  {t("onDemand.ctaBtnSecondary")}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </main>
  );
}