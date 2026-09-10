"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Bell, Clock, ChevronLeft, ChevronRight, Tv, Calendar } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ─── Inline types & data ────────────────────────────────────────────────────

type StreamStatus = "live" | "upcoming" | "replay";

interface MatchEvent {
  id: string;
  sport: string;
  sportIcon: string;
  league: string;
  leagueColor: string;
  homeTeam: string;
  homeFlag: string;
  awayTeam: string;
  awayFlag: string;
  homeScore?: number;
  awayScore?: number;
  status: StreamStatus;
  startTime: string; // "HH:MM"
  dateKey: string;   // "YYYY-MM-DD"
  channel: string;
}

interface SportFilter {
  key: string;
  label: string;
  icon: string;
}

const SPORT_FILTERS: SportFilter[] = [
  { key: "all",        label: "All Sports",  icon: "🏆" },
  { key: "football",   label: "Football",    icon: "⚽" },
  { key: "basketball", label: "Basketball",  icon: "🏀" },
  { key: "tennis",     label: "Tennis",      icon: "🎾" },
  { key: "cricket",    label: "Cricket",     icon: "🏏" },
  { key: "mma",        label: "MMA",         icon: "🥊" },
  { key: "f1",         label: "Formula 1",   icon: "🏎️" },
  { key: "baseball",   label: "Baseball",    icon: "⚾" },
  { key: "rugby",      label: "Rugby",       icon: "🏉" },
];

// Generate date keys relative to today (static offsets to avoid hydration mismatch)
const BASE_DATE = "2025-07-14"; // static anchor

function addDays(base: string, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const MATCHES: MatchEvent[] = [
  // Day 0
  {
    id: "m1", sport: "football", sportIcon: "⚽",
    league: "Premier League", leagueColor: "#3b0764",
    homeTeam: "Manchester City", homeFlag: "🔵",
    awayTeam: "Arsenal", awayFlag: "🔴",
    status: "upcoming", startTime: "15:00", dateKey: addDays(BASE_DATE, 0),
    channel: "Arena HD 1",
  },
  {
    id: "m2", sport: "basketball", sportIcon: "🏀",
    league: "NBA", leagueColor: "#c2410c",
    homeTeam: "LA Lakers", homeFlag: "🟣",
    awayTeam: "Boston Celtics", awayFlag: "🟢",
    status: "upcoming", startTime: "20:30", dateKey: addDays(BASE_DATE, 0),
    channel: "Arena HD 2",
  },
  {
    id: "m3", sport: "tennis", sportIcon: "🎾",
    league: "Wimbledon", leagueColor: "#15803d",
    homeTeam: "C. Alcaraz", homeFlag: "🇪🇸",
    awayTeam: "N. Djokovic", awayFlag: "🇷🇸",
    status: "upcoming", startTime: "13:00", dateKey: addDays(BASE_DATE, 0),
    channel: "Arena Tennis",
  },
  {
    id: "m4", sport: "f1", sportIcon: "🏎️",
    league: "Formula 1", leagueColor: "#a855f7",
    homeTeam: "Qualifying Session", homeFlag: "🏁",
    awayTeam: "British Grand Prix", awayFlag: "🇬🇧",
    status: "upcoming", startTime: "14:00", dateKey: addDays(BASE_DATE, 0),
    channel: "Arena Motorsport",
  },
  // Day 1
  {
    id: "m5", sport: "football", sportIcon: "⚽",
    league: "La Liga", leagueColor: "#dc2626",
    homeTeam: "Real Madrid", homeFlag: "⚪",
    awayTeam: "FC Barcelona", awayFlag: "🔵",
    status: "upcoming", startTime: "20:00", dateKey: addDays(BASE_DATE, 1),
    channel: "Arena HD 1",
  },
  {
    id: "m6", sport: "cricket", sportIcon: "🏏",
    league: "ICC Test Series", leagueColor: "#0891b2",
    homeTeam: "England", homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    awayTeam: "Australia", awayFlag: "🇦🇺",
    status: "upcoming", startTime: "10:30", dateKey: addDays(BASE_DATE, 1),
    channel: "Arena Cricket",
  },
  {
    id: "m7", sport: "mma", sportIcon: "🥊",
    league: "UFC 305", leagueColor: "#dc2626",
    homeTeam: "I. Machachev", homeFlag: "🇷🇺",
    awayTeam: "A. Volkanovski", awayFlag: "🇦🇺",
    status: "upcoming", startTime: "22:00", dateKey: addDays(BASE_DATE, 1),
    channel: "Arena Fight",
  },
  {
    id: "m8", sport: "baseball", sportIcon: "⚾",
    league: "MLB", leagueColor: "#b45309",
    homeTeam: "NY Yankees", homeFlag: "⚾",
    awayTeam: "LA Dodgers", awayFlag: "🔵",
    status: "upcoming", startTime: "18:05", dateKey: addDays(BASE_DATE, 1),
    channel: "Arena HD 3",
  },
  // Day 2
  {
    id: "m9", sport: "rugby", sportIcon: "🏉",
    league: "Six Nations", leagueColor: "#65a30d",
    homeTeam: "Ireland", homeFlag: "🇮🇪",
    awayTeam: "France", awayFlag: "🇫🇷",
    status: "upcoming", startTime: "16:45", dateKey: addDays(BASE_DATE, 2),
    channel: "Arena Rugby",
  },
  {
    id: "m10", sport: "basketball", sportIcon: "🏀",
    league: "EuroLeague", leagueColor: "#1d4ed8",
    homeTeam: "Real Madrid", homeFlag: "⚪",
    awayTeam: "CSKA Moscow", awayFlag: "🔴",
    status: "upcoming", startTime: "19:00", dateKey: addDays(BASE_DATE, 2),
    channel: "Arena HD 2",
  },
  {
    id: "m11", sport: "football", sportIcon: "⚽",
    league: "Champions League", leagueColor: "#1e3a8a",
    homeTeam: "Bayern Munich", homeFlag: "🔴",
    awayTeam: "PSG", awayFlag: "🔵",
    status: "upcoming", startTime: "21:00", dateKey: addDays(BASE_DATE, 2),
    channel: "Arena HD 1",
  },
  {
    id: "m12", sport: "tennis", sportIcon: "🎾",
    league: "Wimbledon", leagueColor: "#15803d",
    homeTeam: "I. Swiatek", homeFlag: "🇵🇱",
    awayTeam: "E. Rybakina", awayFlag: "🇰🇿",
    status: "upcoming", startTime: "12:00", dateKey: addDays(BASE_DATE, 2),
    channel: "Arena Tennis",
  },
  // Day 3
  {
    id: "m13", sport: "f1", sportIcon: "🏎️",
    league: "Formula 1", leagueColor: "#a855f7",
    homeTeam: "Race Day", homeFlag: "🏁",
    awayTeam: "British Grand Prix", awayFlag: "🇬🇧",
    status: "upcoming", startTime: "14:00", dateKey: addDays(BASE_DATE, 3),
    channel: "Arena Motorsport",
  },
  {
    id: "m14", sport: "cricket", sportIcon: "🏏",
    league: "ICC Test Series", leagueColor: "#0891b2",
    homeTeam: "India", homeFlag: "🇮🇳",
    awayTeam: "South Africa", awayFlag: "🇿🇦",
    status: "upcoming", startTime: "09:00", dateKey: addDays(BASE_DATE, 3),
    channel: "Arena Cricket",
  },
  {
    id: "m15", sport: "football", sportIcon: "⚽",
    league: "Serie A", leagueColor: "#1d4ed8",
    homeTeam: "Inter Milan", homeFlag: "⚫",
    awayTeam: "AC Milan", awayFlag: "🔴",
    status: "upcoming", startTime: "20:45", dateKey: addDays(BASE_DATE, 3),
    channel: "Arena HD 1",
  },
  // Day 4
  {
    id: "m16", sport: "basketball", sportIcon: "🏀",
    league: "NBA", leagueColor: "#c2410c",
    homeTeam: "Golden State Warriors", homeFlag: "🟡",
    awayTeam: "Miami Heat", awayFlag: "🔴",
    status: "upcoming", startTime: "21:00", dateKey: addDays(BASE_DATE, 4),
    channel: "Arena HD 2",
  },
  {
    id: "m17", sport: "mma", sportIcon: "🥊",
    league: "Bellator 300", leagueColor: "#dc2626",
    homeTeam: "P. Pitbull", homeFlag: "🇧🇷",
    awayTeam: "A. McKee", awayFlag: "🇺🇸",
    status: "upcoming", startTime: "20:00", dateKey: addDays(BASE_DATE, 4),
    channel: "Arena Fight",
  },
  // Day 5
  {
    id: "m18", sport: "rugby", sportIcon: "🏉",
    league: "Premiership Rugby", leagueColor: "#65a30d",
    homeTeam: "Saracens", homeFlag: "⚫",
    awayTeam: "Exeter Chiefs", awayFlag: "🔴",
    status: "upcoming", startTime: "15:00", dateKey: addDays(BASE_DATE, 5),
    channel: "Arena Rugby",
  },
  {
    id: "m19", sport: "football", sportIcon: "⚽",
    league: "Bundesliga", leagueColor: "#dc2626",
    homeTeam: "Borussia Dortmund", homeFlag: "🟡",
    awayTeam: "RB Leipzig", awayFlag: "🔴",
    status: "upcoming", startTime: "17:30", dateKey: addDays(BASE_DATE, 5),
    channel: "Arena HD 1",
  },
  {
    id: "m20", sport: "baseball", sportIcon: "⚾",
    league: "MLB", leagueColor: "#b45309",
    homeTeam: "Chicago Cubs", homeFlag: "🔵",
    awayTeam: "Houston Astros", awayFlag: "🟠",
    status: "upcoming", startTime: "19:15", dateKey: addDays(BASE_DATE, 5),
    channel: "Arena HD 3",
  },
  // Day 6
  {
    id: "m21", sport: "tennis", sportIcon: "🎾",
    league: "Wimbledon Final", leagueColor: "#15803d",
    homeTeam: "C. Alcaraz", homeFlag: "🇪🇸",
    awayTeam: "J. Sinner", awayFlag: "🇮🇹",
    status: "upcoming", startTime: "14:00", dateKey: addDays(BASE_DATE, 6),
    channel: "Arena Tennis",
  },
  {
    id: "m22", sport: "football", sportIcon: "⚽",
    league: "Premier League", leagueColor: "#3b0764",
    homeTeam: "Liverpool", homeFlag: "🔴",
    awayTeam: "Chelsea", awayFlag: "🔵",
    status: "upcoming", startTime: "16:30", dateKey: addDays(BASE_DATE, 6),
    channel: "Arena HD 1",
  },
];

// ─── Week strip helpers ──────────────────────────────────────────────────────

function buildWeekDays(anchorDate: string, weekOffset: number) {
  return Array.from({ length: 7 }, (_, i) => {
    const dateKey = addDays(anchorDate, weekOffset * 7 + i);
    const d = new Date(dateKey);
    return {
      dateKey,
      dayShort: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: d.getDate(),
      monthShort: d.toLocaleDateString("en-US", { month: "short" }),
    };
  });
}

function formatDateHeading(dateKey: string): string {
  const d = new Date(dateKey);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StreamStatus }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-400 border border-red-500/30">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
        LIVE
      </span>
    );
  }
  if (status === "replay") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/30">
        Replay
      </span>
    );
  }
  return null;
}

interface ReminderButtonProps {
  matchId: string;
  reminded: Set<string>;
  onToggle: (id: string) => void;
}

function ReminderButton({ matchId, reminded, onToggle }: ReminderButtonProps) {
  const active = reminded.has(matchId);
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(matchId)}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all duration-200",
        active
          ? "bg-[var(--accent)]/20 border-[var(--accent)]/60 text-[var(--accent)]"
          : "bg-white/5 border-white/10 text-white/60 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
      )}
    >
      <Bell className={cn("h-3 w-3", active && "fill-current")} />
      {active ? "Reminded" : "Remind Me"}
    </motion.button>
  );
}

interface MatchRowProps {
  match: MatchEvent;
  reminded: Set<string>;
  onToggle: (id: string) => void;
  index: number;
}

function MatchRow({ match, reminded, onToggle, index }: MatchRowProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        "group relative flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-white/8 bg-white/4 px-5 py-4",
        "hover:bg-white/7 hover:border-white/15 transition-all duration-300",
        "shadow-[0_1px_2px_rgba(0,0,0,0.2),0_4px_16px_-4px_rgba(0,0,0,0.3)]"
      )}
    >
      {/* Time */}
      <div className="flex items-center gap-2 sm:w-20 shrink-0">
        <Clock className="h-3.5 w-3.5 text-white/30 shrink-0" />
        <span className="text-sm font-mono font-semibold text-white/80">{match.startTime}</span>
      </div>

      {/* Sport + League */}
      <div className="flex items-center gap-2 sm:w-44 shrink-0">
        <span className="text-lg leading-none">{match.sportIcon}</span>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white/90 border border-white/10"
          style={{ backgroundColor: match.leagueColor + "33", borderColor: match.leagueColor + "55" }}
        >
          {match.league}
        </span>
        <StatusBadge status={match.status} />
      </div>

      {/* Teams */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none">{match.homeFlag}</span>
          <span className="text-sm font-semibold text-white truncate">{match.homeTeam}</span>
        </div>
        <span className="text-xs font-bold text-white/30 shrink-0">vs</span>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none">{match.awayFlag}</span>
          <span className="text-sm font-semibold text-white truncate">{match.awayTeam}</span>
        </div>
      </div>

      {/* Channel */}
      <div className="hidden lg:flex items-center gap-1.5 shrink-0">
        <Tv className="h-3.5 w-3.5 text-white/30" />
        <span className="text-xs text-white/40">{match.channel}</span>
      </div>

      {/* Reminder */}
      <div className="shrink-0">
        <ReminderButton matchId={match.id} reminded={reminded} onToggle={onToggle} />
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(BASE_DATE);
  const [activeSport, setActiveSport] = useState<string>("all");
  const [reminded, setReminded] = useState<Set<string>>(new Set());

  const weekDays = useMemo(() => buildWeekDays(BASE_DATE, weekOffset), [weekOffset]);

  // When week changes, auto-select first day of that week
  const handleWeekChange = (dir: 1 | -1) => {
    const newOffset = weekOffset + dir;
    if (newOffset < 0) return;
    setWeekOffset(newOffset);
    setSelectedDate(addDays(BASE_DATE, newOffset * 7));
  };

  const toggleReminder = (id: string) => {
    setReminded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter matches by selected date and sport
  const filteredMatches = useMemo(() => {
    return MATCHES.filter(m => {
      const dateMatch = m.dateKey === selectedDate;
      const sportMatch = activeSport === "all" || m.sport === activeSport;
      return dateMatch && sportMatch;
    });
  }, [selectedDate, activeSport]);

  // Group by date for the "all week" view — we show only selected date here
  const hasMatches = filteredMatches.length > 0;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ── Hero Header ── */}
      <Reveal>
        <section className="relative overflow-hidden border-b border-white/8 bg-gradient-to-b from-white/4 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(var(--accent-rgb),0.12),transparent)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[var(--accent)] text-sm font-semibold tracking-widest uppercase">
                <Calendar className="h-4 w-4" />
                Match Schedule
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Upcoming Fixtures
              </h1>
              <p className="mt-1 max-w-xl text-base text-white/50 leading-relaxed">
                Browse every match across all sports and leagues. Set reminders so you never miss kick-off.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* ── Week Strip ── */}
        <Reveal>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3">
              {/* Prev week */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleWeekChange(-1)}
                disabled={weekOffset === 0}
                className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:border-[var(--accent)]/40 hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>

              {/* Days */}
              <div className="flex flex-1 gap-1.5 overflow-x-auto scrollbar-none">
                {weekDays.map((day) => {
                  const isSelected = day.dateKey === selectedDate;
                  const hasEvents = MATCHES.some(m => m.dateKey === day.dateKey && (activeSport === "all" || m.sport === activeSport));
                  return (
                    <motion.button
                      key={day.dateKey}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedDate(day.dateKey)}
                      className={cn(
                        "relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-2.5 min-w-[56px] border transition-all duration-200",
                        isSelected
                          ? "bg-[var(--accent)] border-[var(--accent)] text-black"
                          : "bg-white/4 border-white/8 text-white/60 hover:border-white/20 hover:text-white"
                      )}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{day.dayShort}</span>
                      <span className="text-lg font-bold leading-none">{day.dayNum}</span>
                      <span className="text-[9px] opacity-70">{day.monthShort}</span>
                      {hasEvents && !isSelected && (
                        <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[var(--accent)]" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Next week */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleWeekChange(1)}
                className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </Reveal>

        {/* ── Sport Filter Tabs ── */}
        <Reveal>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {SPORT_FILTERS.map((sf) => (
              <motion.button
                key={sf.key}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveSport(sf.key)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-200",
                  activeSport === sf.key
                    ? "bg-[var(--accent)] border-[var(--accent)] text-black"
                    : "bg-white/4 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                )}
              >
                <span className="text-base leading-none">{sf.icon}</span>
                {sf.label}
              </motion.button>
            ))}
          </div>
        </Reveal>

        {/* ── Match List ── */}
        <Reveal>
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {formatDateHeading(selectedDate)}
              </h2>
              <span className="text-sm text-white/40">
                {filteredMatches.length} {filteredMatches.length === 1 ? "match" : "matches"}
              </span>
            </div>

            {hasMatches ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {filteredMatches.map((match, i) => (
                  <MatchRow
                    key={match.id}
                    match={match}
                    reminded={reminded}
                    onToggle={toggleReminder}
                    index={i}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/8 bg-white/3 py-20 text-center"
              >
                <span className="text-5xl">📅</span>
                <div>
                  <p className="text-lg font-semibold text-white/70">No matches scheduled</p>
                  <p className="mt-1 text-sm text-white/35">
                    Try a different date or sport filter to find upcoming fixtures.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </Reveal>

        {/* ── Reminder CTA Banner ── */}
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/6 px-8 py-8">
            <div className="absolute right-0 top-0 h-full w-64 bg-[radial-gradient(ellipse_at_right,rgba(var(--accent-rgb),0.15),transparent)]" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30">
                <Bell className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">Never miss a kick-off</h3>
                <p className="mt-1 text-sm text-white/50 leading-relaxed">
                  Set reminders on any match and we will notify you 15 minutes before it starts. Available on all devices.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="shrink-0 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
              >
                Enable Notifications
              </motion.button>
            </div>
          </div>
        </Reveal>

      </div>
    </main>
  );
}