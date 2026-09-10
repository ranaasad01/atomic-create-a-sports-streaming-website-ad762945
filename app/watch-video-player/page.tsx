"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, ChevronRight, Eye, Heart, Share2, Download, ThumbsUp, ThumbsDown, MessageSquare, Clock, Star, Tv, Wifi, SkipForward, SkipBack, Subtitles } from 'lucide-react';
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BRAND } from "@/lib/data";

const CURRENT_MATCH = {
  id: "match-001",
  title: "UEFA Champions League Final",
  homeTeam: "Real Madrid",
  awayTeam: "Manchester City",
  homeScore: 2,
  awayScore: 1,
  league: "UEFA Champions League",
  sport: "Football",
  status: "live" as const,
  viewers: 142800,
  thumbnail: "/images/champions-league-final-stadium.jpg",
  duration: "87:23",
  description:
    "An electrifying Champions League Final between Real Madrid and Manchester City. Real Madrid leads 2-1 in the 87th minute after a stunning comeback from a first-half deficit.",
};

const MATCH_EVENTS = [
  { minute: "87'", team: "Real Madrid", player: "Vinicius Jr.", type: "goal", icon: "⚽" },
  { minute: "64'", team: "Real Madrid", player: "Bellingham", type: "goal", icon: "⚽" },
  { minute: "45'", team: "Manchester City", player: "Haaland", type: "goal", icon: "⚽" },
  { minute: "38'", team: "Manchester City", player: "De Bruyne", type: "yellow_card", icon: "🟨" },
  { minute: "22'", team: "Real Madrid", player: "Modric", type: "yellow_card", icon: "🟨" },
];

const RELATED_MATCHES = [
  {
    id: "r1",
    title: "Premier League: Arsenal vs Liverpool",
    league: "Premier League",
    status: "live" as const,
    viewers: 98400,
    thumbnail: "/images/arsenal-liverpool-premier-league.jpg",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    homeScore: 1,
    awayScore: 1,
    time: "LIVE 72'",
  },
  {
    id: "r2",
    title: "La Liga: Barcelona vs Atletico",
    league: "La Liga",
    status: "live" as const,
    viewers: 76200,
    thumbnail: "/images/barcelona-atletico-la-liga.jpg",
    homeTeam: "Barcelona",
    awayTeam: "Atletico",
    homeScore: 3,
    awayScore: 0,
    time: "LIVE 55'",
  },
  {
    id: "r3",
    title: "Bundesliga: Bayern vs Dortmund",
    league: "Bundesliga",
    status: "upcoming" as const,
    viewers: 0,
    thumbnail: "/images/bayern-dortmund-bundesliga.jpg",
    homeTeam: "Bayern",
    awayTeam: "Dortmund",
    homeScore: undefined,
    awayScore: undefined,
    time: "20:45",
  },
  {
    id: "r4",
    title: "Serie A: Inter vs Juventus",
    league: "Serie A",
    status: "replay" as const,
    viewers: 34100,
    thumbnail: "/images/inter-juventus-serie-a.jpg",
    homeTeam: "Inter",
    awayTeam: "Juventus",
    homeScore: 2,
    awayScore: 2,
    time: "REPLAY",
  },
];

const COMMENTS = [
  { id: "c1", user: "FootballFan99", avatar: "FF", time: "2m ago", text: "What a match! Vinicius is absolutely on fire tonight!", likes: 142 },
  { id: "c2", user: "CityTillIDie", avatar: "CT", time: "4m ago", text: "City need to push forward. Still time to equalize!", likes: 87 },
  { id: "c3", user: "TacticsGuru", avatar: "TG", time: "7m ago", text: "Bellingham's positioning for that second goal was textbook. Incredible football IQ.", likes: 203 },
  { id: "c4", user: "Madridista_ES", avatar: "ME", time: "12m ago", text: "Hala Madrid! This team never gives up. Champions mentality!", likes: 318 },
  { id: "c5", user: "NeutralViewer", avatar: "NV", time: "15m ago", text: "Regardless of who wins, this is one of the best finals in recent memory.", likes: 156 },
];

const QUALITY_OPTIONS = ["Auto", "4K", "1080p", "720p", "480p", "360p"];
const SPEED_OPTIONS = ["0.5x", "0.75x", "1x", "1.25x", "1.5x", "2x"];

function formatViewers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function WatchVideoPlayerPage() {
  const t = useTranslations();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(87);
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [quality, setQuality] = useState("1080p");
  const [showQuality, setShowQuality] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<"events" | "comments">("events");
  const [commentText, setCommentText] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlaying) {
        setProgress((p) => Math.min(p + 0.05, 100));
      }
    }, 500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Page Header */}
      <Reveal>
        <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 px-4 py-3">
          <div className="mx-auto flex max-w-screen-2xl items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">
              {t("watch.breadcrumb.home")}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/live" className="hover:text-[var(--accent)] transition-colors">
              {t("watch.breadcrumb.live")}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[hsl(var(--foreground))] font-medium truncate max-w-[200px] sm:max-w-none">
              {CURRENT_MATCH.title}
            </span>
          </div>
        </div>
      </Reveal>

      <div className="mx-auto max-w-screen-2xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
          {/* Left Column: Player + Info */}
          <div className="flex flex-col gap-6">
            {/* Video Player */}
            <Reveal>
              <div
                className="relative w-full overflow-hidden rounded-2xl bg-black shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
                style={{ aspectRatio: "16/9" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setShowControls(false)}
              >
                {/* Thumbnail / Video Placeholder */}
                <img
                  src={CURRENT_MATCH.thumbnail}
                  alt={CURRENT_MATCH.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                />

                {/* Live Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />

                {/* Live Badge */}
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    {t("watch.player.live")}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
                    <Eye className="h-3 w-3" />
                    {formatViewers(CURRENT_MATCH.viewers)}
                  </span>
                </div>

                {/* Score Overlay */}
                <div className="absolute left-1/2 top-4 -translate-x-1/2">
                  <div className="flex items-center gap-3 rounded-xl bg-black/70 px-5 py-2 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-white">{CURRENT_MATCH.homeTeam}</span>
                    <span className="text-xl font-bold text-white">
                      {CURRENT_MATCH.homeScore} - {CURRENT_MATCH.awayScore}
                    </span>
                    <span className="text-sm font-semibold text-white">{CURRENT_MATCH.awayTeam}</span>
                  </div>
                </div>

                {/* Center Play Button */}
                <motion.button
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying((p) => !p)}
                  style={{ opacity: showControls || !isPlaying ? 1 : 0, transition: "opacity 0.3s" }}
                >
                  {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 translate-x-0.5" />}
                </motion.button>

                {/* Bottom Controls */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8 transition-opacity duration-300"
                  style={{ opacity: showControls ? 1 : 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}
                >
                  {/* Progress Bar */}
                  <div className="mb-3 group cursor-pointer">
                    <div className="relative h-1 w-full rounded-full bg-white/30 group-hover:h-1.5 transition-all">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${progress}%` }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[var(--accent)] shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `${progress}%`, transform: "translate(-50%, -50%)" }}
                      />
                    </div>
                  </div>

                  {/* Control Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying((p) => !p)}
                        className="text-white hover:text-[var(--accent)] transition-colors"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </button>
                      <button className="text-white hover:text-[var(--accent)] transition-colors">
                        <SkipBack className="h-4 w-4" />
                      </button>
                      <button className="text-white hover:text-[var(--accent)] transition-colors">
                        <SkipForward className="h-4 w-4" />
                      </button>

                      {/* Volume */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsMuted((m) => !m)}
                          className="text-white hover:text-[var(--accent)] transition-colors"
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={isMuted ? 0 : volume}
                          onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false); }}
                          className="w-20 accent-[var(--accent)] cursor-pointer"
                        />
                      </div>

                      <span className="text-xs text-white/80 font-mono">{CURRENT_MATCH.duration}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="text-white hover:text-[var(--accent)] transition-colors">
                        <Subtitles className="h-4 w-4" />
                      </button>

                      {/* Quality Selector */}
                      <div className="relative">
                        <button
                          onClick={() => { setShowQuality((q) => !q); setShowSettings(false); }}
                          className="flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-xs text-white hover:bg-white/20 transition-colors"
                        >
                          <Tv className="h-3 w-3" />
                          {quality}
                        </button>
                        {showQuality && (
                          <div className="absolute bottom-8 right-0 z-20 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-xl min-w-[100px]">
                            {QUALITY_OPTIONS.map((q) => (
                              <button
                                key={q}
                                onClick={() => { setQuality(q); setShowQuality(false); }}
                                className={cn(
                                  "block w-full rounded-lg px-3 py-1.5 text-left text-xs transition-colors",
                                  quality === q
                                    ? "bg-[var(--accent)]/10 text-[var(--accent)] font-semibold"
                                    : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                                )}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => { setShowSettings((s) => !s); setShowQuality(false); }}
                        className="text-white hover:text-[var(--accent)] transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setIsFullscreen((f) => !f)}
                        className="text-white hover:text-[var(--accent)] transition-colors"
                      >
                        <Maximize className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                  <div className="absolute bottom-16 right-4 z-20 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-xl w-48">
                    <p className="mb-2 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      {t("watch.settings.playbackSpeed")}
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {SPEED_OPTIONS.map((s) => (
                        <button
                          key={s}
                          className={cn(
                            "rounded-lg py-1 text-xs transition-colors",
                            s === "1x"
                              ? "bg-[var(--accent)]/10 text-[var(--accent)] font-semibold"
                              : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Match Info */}
            <Reveal>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-red-600/10 px-2.5 py-0.5 text-xs font-semibold text-red-500">
                        {t("watch.info.live")}
                      </span>
                      <span className="rounded-full bg-[hsl(var(--muted))] px-2.5 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                        {CURRENT_MATCH.league}
                      </span>
                      <span className="rounded-full bg-[hsl(var(--muted))] px-2.5 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                        {CURRENT_MATCH.sport}
                      </span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-2xl">
                      {CURRENT_MATCH.title}
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                      {CURRENT_MATCH.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIsLiked((l) => !l)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                        isLiked
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      )}
                    >
                      <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                      {t("watch.actions.favorite")}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                    >
                      <Share2 className="h-4 w-4" />
                      {t("watch.actions.share")}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                    >
                      <Download className="h-4 w-4" />
                      {t("watch.actions.download")}
                    </motion.button>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[hsl(var(--border))] pt-4 text-sm text-[hsl(var(--muted-foreground))]">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-[var(--accent)]" />
                    {formatViewers(CURRENT_MATCH.viewers)} {t("watch.info.watching")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[var(--accent)]" />
                    {CURRENT_MATCH.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wifi className="h-4 w-4 text-green-500" />
                    {t("watch.info.hdStream")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {t("watch.info.featured")}
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Scoreboard */}
            <Reveal>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
                <h2 className="mb-4 text-base font-semibold text-[hsl(var(--foreground))]">
                  {t("watch.scoreboard.title")}
                </h2>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-3xl">
                      ⚽
                    </div>
                    <span className="text-center text-sm font-semibold text-[hsl(var(--foreground))]">
                      {CURRENT_MATCH.homeTeam}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-3 rounded-2xl bg-[hsl(var(--muted))] px-6 py-3">
                      <span className="text-4xl font-black text-[hsl(var(--foreground))]">{CURRENT_MATCH.homeScore}</span>
                      <span className="text-2xl font-light text-[hsl(var(--muted-foreground))]">-</span>
                      <span className="text-4xl font-black text-[hsl(var(--foreground))]">{CURRENT_MATCH.awayScore}</span>
                    </div>
                    <span className="rounded-full bg-red-600/10 px-3 py-0.5 text-xs font-bold text-red-500">
                      {CURRENT_MATCH.duration}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-3xl">
                      🏟️
                    </div>
                    <span className="text-center text-sm font-semibold text-[hsl(var(--foreground))]">
                      {CURRENT_MATCH.awayTeam}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Events & Comments Tabs */}
            <Reveal>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
                {/* Tab Header */}
                <div className="flex border-b border-[hsl(var(--border))]">
                  <button
                    onClick={() => setActiveTab("events")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors",
                      activeTab === "events"
                        ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    )}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {t("watch.tabs.events")}
                  </button>
                  <button
                    onClick={() => setActiveTab("comments")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors",
                      activeTab === "comments"
                        ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    )}
                  >
                    <MessageSquare className="h-4 w-4" />
                    {t("watch.tabs.comments")}
                  </button>
                </div>

                <div className="p-4">
                  {activeTab === "events" ? (
                    <motion.div
                      key="events"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                      {MATCH_EVENTS.map((event, i) => (
                        <motion.div
                          key={i}
                          variants={fadeInUp}
                          className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-base">
                            {event.icon}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                              {event.player}
                              <span className="ml-1 font-normal text-[hsl(var(--muted-foreground))]">
                                ({event.team})
                              </span>
                            </p>
                            <p className="text-xs capitalize text-[hsl(var(--muted-foreground))]">
                              {event.type.replace("_", " ")}
                            </p>
                          </div>
                          <span className="rounded-full bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-bold text-[var(--accent)]">
                            {event.minute}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div key="comments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      {/* Comment Input */}
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-bold text-[var(--accent)]">
                          ME
                        </div>
                        <div className="flex flex-1 gap-2">
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder={t("watch.comments.placeholder")}
                            className="flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none transition-colors"
                          />
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:opacity-90"
                          >
                            {t("watch.comments.send")}
                          </motion.button>
                        </div>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-3">
                        {COMMENTS.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-xs font-bold text-[hsl(var(--muted-foreground))]">
                              {comment.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{comment.user}</span>
                                <span className="text-xs text-[hsl(var(--muted-foreground))]">{comment.time}</span>
                              </div>
                              <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">{comment.text}</p>
                              <div className="mt-1.5 flex items-center gap-3">
                                <button className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] hover:text-[var(--accent)] transition-colors">
                                  <ThumbsUp className="h-3 w-3" />
                                  {comment.likes}
                                </button>
                                <button className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors">
                                  <ThumbsDown className="h-3 w-3" />
                                </button>
                                <button className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[var(--accent)] transition-colors">
                                  {t("watch.comments.reply")}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Related Matches */}
          <div className="flex flex-col gap-4">
            <Reveal>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
                <h2 className="mb-4 text-base font-semibold text-[hsl(var(--foreground))]">
                  {t("watch.related.title")}
                </h2>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {RELATED_MATCHES.map((match, i) => (
                    <motion.div key={match.id} variants={fadeInUp}>
                      <Link href="/live">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group flex gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 transition-all hover:border-[var(--accent)]/40 hover:shadow-md cursor-pointer"
                        >
                          <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                            <img
                              src={match.thumbnail}
                              alt={match.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                            {match.status === "live" && (
                              <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                <span className="h-1 w-1 animate-pulse rounded-full bg-white" />
                                LIVE
                              </span>
                            )}
                            {match.status === "replay" && (
                              <span className="absolute left-1.5 top-1.5 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                REPLAY
                              </span>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col justify-between min-w-0">
                            <div>
                              <p className="text-xs text-[hsl(var(--muted-foreground))]">{match.league}</p>
                              <p className="mt-0.5 text-sm font-semibold text-[hsl(var(--foreground))] leading-tight">
                                {match.homeTeam} vs {match.awayTeam}
                              </p>
                              {match.homeScore !== undefined && (
                                <p className="mt-0.5 text-sm font-bold text-[var(--accent)]">
                                  {match.homeScore} - {match.awayScore}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span
                                className={cn(
                                  "text-xs font-medium",
                                  match.status === "live" ? "text-red-500" : "text-[hsl(var(--muted-foreground))]"
                                )}
                              >
                                {match.time}
                              </span>
                              {match.viewers > 0 && (
                                <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                                  <Eye className="h-3 w-3" />
                                  {formatViewers(match.viewers)}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                <Link href="/live">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 w-full rounded-xl border border-[hsl(var(--border))] py-2.5 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  >
                    {t("watch.related.viewAll")}
                  </motion.button>
                </Link>
              </div>
            </Reveal>

            {/* Stream Quality Info */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
                <h3 className="mb-3 text-sm font-semibold text-[hsl(var(--foreground))]">
                  {t("watch.streamInfo.title")}
                </h3>
                <div className="space-y-2.5">
                  {[
                    { label: t("watch.streamInfo.quality"), value: "1080p HD", icon: <Tv className="h-3.5 w-3.5" /> },
                    { label: t("watch.streamInfo.latency"), value: "< 3s", icon: <Wifi className="h-3.5 w-3.5" /> },
                    { label: t("watch.streamInfo.bitrate"), value: "8 Mbps", icon: <Activity className="h-3.5 w-3.5" /> },
                    { label: t("watch.streamInfo.server"), value: "EU-West", icon: <Globe className="h-3.5 w-3.5" /> },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                        <span className="text-[var(--accent)]">{item.icon}</span>
                        {item.label}
                      </span>
                      <span className="text-xs font-semibold text-[hsl(var(--foreground))]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Upgrade CTA */}
            <Reveal delay={0.15}>
              <div className="relative overflow-hidden rounded-2xl bg-[var(--accent)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-foreground)]/70">
                    {t("watch.upgrade.eyebrow")}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-[var(--accent-foreground)]">
                    {t("watch.upgrade.title")}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--accent-foreground)]/80">
                    {t("watch.upgrade.description")}
                  </p>
                  <Link href="/pricing">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="mt-3 w-full rounded-xl bg-[var(--accent-foreground)] py-2 text-sm font-bold text-[var(--accent)] transition-all hover:opacity-90"
                    >
                      {t("watch.upgrade.cta")}
                    </motion.button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}

// Inline icon components to avoid missing imports
function Activity({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function Globe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

Now I'll write the messages/en.json catalog with all the keys used in this file. Let me also check what other keys might already exist and merge carefully.

I need to write the messages file with all the `watch.*` keys:

{
  "watch": {
    "breadcrumb": {
      "home": "Home",
      "live": "Live"
    },
    "player": {
      "live": "LIVE"
    },
    "info": {
      "live": "LIVE",
      "watching": "watching",
      "hdStream": "HD Stream",
      "featured": "Featured Match"
    },
    "actions": {
      "favorite": "Favorite",
      "share": "Share",
      "download": "Download"
    },
    "scoreboard": {
      "title": "Live Score"
    },
    "tabs": {
      "events": "Match Events",
      "comments": "Live Chat"
    },
    "comments": {
      "placeholder": "Share your thoughts...",
      "send": "Send",
      "reply": "Reply"
    },
    "related": {
      "title": "More Live Matches",
      "viewAll": "View All Live Matches"
    },
    "settings": {
      "playbackSpeed": "Playback Speed"
    },
    "streamInfo": {
      "title": "Stream Info",
      "quality": "Quality",
      "latency": "Latency",
      "bitrate": "Bitrate",
      "server": "Server"
    },
    "upgrade": {
      "eyebrow": "Elite Plan",
      "title": "Watch in 4K Ultra HD",
      "description": "Upgrade to Elite for crystal-clear 4K streams, unlimited screens, and exclusive PPV access.",
      "cta": "Upgrade to Elite"
    }
  }
}

Let me now write both files properly:

<tool_call>
{"name": "write_file", "arguments": {"path": "app/watch-video-player/page.tsx", "content": "\"use client\";\n\nimport { useTranslations } from \"next-intl\";\nimport { Reveal } from \"@/components/Reveal\";\nimport { motion } from \"framer-motion\";\nimport { fadeInUp, staggerContainer } from \"@/lib/motion\";\nimport {\n  Play,\n  Pause,\n  Volume2,\n  VolumeX,\n  Maximize,\n  Settings,\n  ChevronRight,\n  Eye,\n  Heart,\n  Share2,\n  Download,\n  ThumbsUp,\n  ThumbsDown,\n  MessageSquare,\n  Clock,\n  Star,\n  Tv,\n  Wifi,\n  SkipForward,\n  SkipBack,\n  Subtitles,\n} from \"lucide-react\";\nimport { useState, useRef, useEffect } from \"react\";\nimport { cn } from \"@/lib/utils\";\nimport Link from \"next/link\";\n\nconst CURRENT_MATCH = {\n  id: \"match-001\",\n  title: \"UEFA Champions League Final\",\n  homeTeam: \"Real Madrid\",\n  awayTeam: \"Manchester City\",\n  homeScore: 2,\n  awayScore: 1,\n  league: \"UEFA Champions League\",\n  sport: \"Football\",\n  status: \"live\" as const,\n  viewers: 142800,\n  thumbnail: \"/images/champions-league-final-stadium.jpg\",\n  duration: \"87:23\",\n  description:\n    \"An electrifying Champions League Final between Real Madrid and Manchester City. Real Madrid leads 2-1 in the 87th minute after a stunning comeback from a first-half deficit.\",\n};\n\nconst MATCH_EVENTS = [\n  { minute: \"87'\", team: \"Real Madrid\", player: \"Vinicius Jr.\", type: \"goal\", icon: \"\\u26BD\" },\n  { minute: \"64'\", team: \"Real Madrid\", player: \"Bellingham\", type: \"goal\", icon: \"\\u26BD\" },\n  { minute: \"45'\", team: \"Manchester City\", player: \"Haaland\", type: \"goal\", icon: \"\\u26BD\" },\n  { minute: \"38'\", team: \"Manchester City\", player: \"De Bruyne\", type: \"yellow_card\", icon: \"\\uD83D\\uDFE8\" },\n  { minute: \"22'\", team: \"Real Madrid\", player: \"Modric\", type: \"yellow_card\", icon: \"\\uD83D\\uDFE8\" },\n];\n\nconst RELATED_MATCHES = [\n  {\n    id: \"r1\",\n    title: \"Premier League: Arsenal vs Liverpool\",\n    league: \"Premier League\",\n    status: \"live\" as const,\n    viewers: 98400,\n    thumbnail: \"/images/arsenal-liverpool-premier-league.jpg\",\n    homeTeam: \"Arsenal\",\n    awayTeam: \"Liverpool\",\n    homeScore: 1,\n    awayScore: 1,\n    time: \"LIVE 72'\",\n  },\n  {\n    id: \"r2\",\n    title: \"La Liga: Barcelona vs Atletico\",\n    league: \"La Liga\",\n    status: \"live\" as const,\n    viewers: 76200,\n    thumbnail: \"/images/barcelona-atletico-la-liga.jpg\",\n    homeTeam: \"Barcelona\",\n    awayTeam: \"Atletico\",\n    homeScore: 3,\n    awayScore: 0,\n    time: \"LIVE 55'\",\n  },\n  {\n    id: \"r3\",\n    title: \"Bundesliga: Bayern vs Dortmund\",\n    league: \"Bundesliga\",\n    status: \"upcoming\" as const,\n    viewers: 0,\n    thumbnail: \"/images/bayern-dortmund-bundesliga.jpg\",\n    homeTeam: \"Bayern\",\n    awayTeam: \"Dortmund\",\n    homeScore: undefined,\n    awayScore: undefined,\n    time: \"20:45\",\n  },\n  {\n    id: \"r4\",\n    title: \"Serie A: Inter vs Juventus\",\n    league: \"Serie A\",\n    status: \"replay\" as const,\n    viewers: 34100,\n    thumbnail: \"/images/inter-juventus-serie-a.jpg\",\n    homeTeam: \"Inter\",\n    awayTeam: \"Juventus\",\n    homeScore: 2,\n    awayScore: 2,\n    time: \"REPLAY\",\n  },\n];\n\nconst COMMENTS = [\n  { id: \"c1\", user: \"FootballFan99\", avatar: \"FF\", time: \"2m ago\", text: \"What a match! Vinicius is absolutely on fire tonight!\", likes: 142 },\n  { id: \"c2\", user: \"CityTillIDie\", avatar: \"CT\", time: \"4m ago\", text: \"City need to push forward. Still time to equalize!\", likes: 87 },\n  { id: \"c3\", user: \"TacticsGuru\", avatar: \"TG\", time: \"7m ago\", text: \"Bellingham's positioning for that second goal was textbook. Incredible football IQ.\", likes: 203 },\n  { id: \"c4\", user: \"MadridistaES\", avatar: \"ME\", time: \"12m ago\", text: \"Hala Madrid! This team never gives up. Champions mentality!\", likes: 318 },\n  { id: \"c5\", user: \"NeutralViewer\", avatar: \"NV\", time: \"15m ago\", text: \"Regardless of who wins, this is one of the best finals in recent memory.\", likes: 156 },\n];\n\nconst QUALITY_OPTIONS = [\"Auto\", \"4K\", \"1080p\", \"720p\", \"480p\", \"360p\"];\nconst SPEED_OPTIONS = [\"0.5x\", \"0.75x\", \"1x\", \"1.25x\", \"1.5x\", \"2x\"];\n\nfunction formatViewers(n: number): string {\n  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;\n  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;\n  return String(n);\n}\n\nfunction ActivityIcon({ className }: { className?: string }) {\n  return (\n    <svg\n      className={className}\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      strokeWidth={2}\n      strokeLinecap=\"round\"\n      strokeLinejoin=\"round\"\n    >\n      <polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\" />\n    </svg>\n  );\n}\n\nfunction GlobeIcon({ className }: { className?: string }) {\n  return (\n    <svg\n      className={className}\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      strokeWidth={2}\n      strokeLinecap=\"round\"\n      strokeLinejoin=\"round\"\n    >\n      <circle cx=\"12\" cy=\"12\" r=\"10\" />\n      <line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\" />\n      <path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\" />\n    </svg>\n  );\n}\n\nexport default function WatchVideoPlayerPage() {\n  const t = useTranslations();\n  const [isPlaying, setIsPlaying] = useState(true);\n  const [isMuted, setIsMuted] = useState(false);\n  const [volume, setVolume] = useState(80);\n  const [progress, setProgress] = useState(87);\n  const [showControls, setShowControls] = useState(true);\n  const [isLiked, setIsLiked] = useState(false);\n  const [quality, setQuality] = useState(\"1080p\");\n  const [showQuality, setShowQuality] = useState(false);\n  const [showSettings, setShowSettings] = useState(false);\n  const [activeTab, setActiveTab] = useState<\"events\" | \"comments\">(\"events\");\n  const [commentText, setCommentText] = useState(\"\");\n  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);\n\n  useEffect(() => {\n    const timer = setInterval(() => {\n      if (isPlaying) {\n        setProgress((p) => Math.min(p + 0.05, 100));\n      }\n    }, 500);\n    return () => clearInterval(timer);\n  }, [isPlaying]);\n\n  const handleMouseMove = () => {\n    setShowControls(true);\n    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);\n    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);\n  };\n\n  return (\n    <main className=\"min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]\">\n      {/* Breadcrumb */}\n      <Reveal>\n        <div className=\"border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 px-4 py-3\">\n          <div className=\"mx-auto flex max-w-screen-2xl items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]\">\n            <Link href=\"/\" className=\"hover:text-[var(--accent)] transition-colors\">\n              {t(\"watch.breadcrumb.home\")}\n            </Link>\n            <ChevronRight className=\"h-3.5 w-3.5\" />\n            <Link href=\"/live\" className=\"hover:text-[var(--accent)] transition-colors\">\n              {t(\"watch.breadcrumb.live\")}\n            </Link>\n            <ChevronRight className=\"h-3.5 w-3.5\" />\n            <span className=\"truncate max-w-[200px] font-medium text-[hsl(var(--foreground))] sm:max-w-none\">\n              {CURRENT_MATCH.title}\n            </span>\n          </div>\n        </div>\n      </Reveal>\n\n      <div className=\"mx-auto max-w-screen-2xl px-4 py-6\">\n        <div className=\"grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]\">\n          {/* ── Left Column ── */}\n          <div className=\"flex flex-col gap-6\">\n\n            {/* Video Player */}\n            <Reveal>\n              <div\n                className=\"relative w-full overflow-hidden rounded-2xl bg-black shadow-[0_4px_32px_rgba(0,0,0,0.5)]\"\n                style={{ aspectRatio: \"16/9\" }}\n                onMouseMove={handleMouseMove}\n                onMouseLeave={() => setShowControls(false)}\n              >\n                {/* Thumbnail */}\n                <img\n                  src={CURRENT_MATCH.thumbnail}\n                  alt={CURRENT_MATCH.title}\n                  className=\"absolute inset-0 h-full w-full object-cover opacity-80\"\n                />\n\n                {/* Gradient overlay */}\n                <div className=\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30\" />\n\n                {/* Live badge + viewers */}\n                <div className=\"absolute left-4 top-4 flex items-center gap-2\">\n                  <span className=\"flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg\">\n                    <span className=\"h-1.5 w-1.5 animate-pulse rounded-full bg-white\" />\n                    {t(\"watch.player.live\")}\n                  </span>\n                  <span className=\"flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm\">\n                    <Eye className=\"h-3 w-3\" />\n                    {formatViewers(CURRENT_MATCH.viewers)}\n                  </span>\n                </div>\n\n                {/* Score overlay */}\n                <div className=\"absolute left-1/2 top-4 -translate-x-1/2\">\n                  <div className=\"flex items-center gap-3 rounded-xl bg-black/70 px-5 py-2 backdrop-blur-sm\">\n                    <span className=\"text-sm font-semibold text-white\">{CURRENT_MATCH.homeTeam}</span>\n                    <span className=\"text-xl font-bold text-white\">\n                      {CURRENT_MATCH.homeScore} - {CURRENT_MATCH.awayScore}\n                    </span>\n                    <span className=\"text-sm font-semibold text-white\">{CURRENT_MATCH.awayTeam}</span>\n                  </div>\n                </div>\n\n                {/* Center play/pause */}\n                <motion.button\n                  className=\"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-all\"\n                  style={{ opacity: showControls || !isPlaying ? 1 : 0, transition: \"opacity 0.3s\" }}\n                  whileHover={{ scale: 1.1 }}\n                  whileTap={{ scale: 0.95 }}\n                  onClick={() => setIsPlaying((p) => !p)}\n                >\n                  {isPlaying ? <Pause className=\"h-7 w-7\" /> : <Play className=\"h-7 w-7 translate-x-0.5\" />}\n                </motion.button>\n\n                {/* Bottom controls */}\n                <div\n                  className=\"absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8 transition-opacity duration-300\"\n                  style={{\n                    opacity: showControls ? 1 : 0,\n                    background: \"linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)\",\n                  }}\n                >\n                  {/* Progress bar */}\n                  <div className=\"group mb-3 cursor-pointer\">\n                    <div className=\"relative h-1 w-full rounded-full bg-white/30 transition-all group-hover:h-1.5\">\n                      <div\n                        className=\"absolute left-0 top-0 h-full rounded-full bg-[var(--accent)]\"\n                        style={{ width: `${progress}%` }}\n                      />\n                      <div\n                        className=\"absolute h-3 w-3 rounded-full bg-[var(--accent)] opacity-0 shadow-md transition-opacity group-hover:opacity-100\"\n                        style={{ left: `${progress}%`, top: \"50%\", transform: \"translate(-50%, -50%)\" }}\n                      />\n                    </div>\n                  </div>\n\n                  {/* Control row */}\n                  <div className=\"flex items-center justify-between\">\n                    <div className=\"flex items-center gap-3\">\n                      <button\n                        onClick={() => setIsPlaying((p) => !p)}\n                        className=\"text-white transition-colors hover:text-[var(--accent)]\"\n                      >\n                        {isPlaying ? <Pause className=\"h-5 w-5\" /> : <Play className=\"h-5 w-5\" />}\n                      </button>\n                      <button className=\"text-white transition-colors hover:text-[var(--accent)]\">\n                        <SkipBack className=\"h-4 w-4\" />\n                      </button>\n                      <button className=\"text-white transition-colors hover:text-[var(--accent)]\">\n                        <SkipForward className=\"h-4 w-4\" />\n                      </button>\n\n                      {/* Volume */}\n                      <div className=\"flex items-center gap-2\">\n                        <button\n                          onClick={() => setIsMuted((m) => !m)}\n                          className=\"text-white transition-colors hover:text-[var(--accent)]\"\n                        >\n                          {isMuted ? <VolumeX className=\"h-5 w-5\" /> : <Volume2 className=\"h-5 w-5\" />}\n                        </button>\n                        <input\n                          type=\"range\"\n                          min={0}\n                          max={100}\n                          value={isMuted ? 0 : volume}\n                          onChange={(e) => {\n                            setVolume(Number(e.target.value));\n                            setIsMuted(false);\n                          }}\n                          className=\"w-20 cursor-pointer accent-[var(--accent)]\"\n                        />\n                      </div>\n\n                      <span className=\"font-mono text-xs text-white/80\">{CURRENT_MATCH.duration}</span>\n                    </div>\n\n                    <div className=\"flex items-center gap-3\">\n                      <button className=\"text-white transition-colors hover:text-[var(--accent)]\">\n                        <Subtitles className=\"h-4 w-4\" />\n                      </button>\n\n                      {/* Quality selector */}\n                      <div className=\"relative\">\n                        <button\n                          onClick={() => {\n                            setShowQuality((q) => !q);\n                            setShowSettings(false);\n                          }}\n                          className=\"flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-xs text-white transition-colors hover:bg-white/20\"\n                        >\n                          <Tv className=\"h-3 w-3\" />\n                          {quality}\n                        </button>\n                        {showQuality && (\n                          <div className=\"absolute bottom-8 right-0 z-20 min-w-[100px] rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-xl\">\n                            {QUALITY_OPTIONS.map((q) => (\n                              <button\n                                key={q}\n                                onClick={() => {\n                                  setQuality(q);\n                                  setShowQuality(false);\n                                }}\n                                className={cn(\n                                  \"block w-full rounded-lg px-3 py-1.5 text-left text-xs transition-colors\",\n                                  quality === q\n                                    ? \"bg-[var(--accent)]/10 font-semibold text-[var(--accent)]\"\n                                    : \"text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]\"\n                                )}\n                              >\n                                {q}\n                              </button>\n                            ))}\n                          </div>\n                        )}\n                      </div>\n\n                      <button\n                        onClick={() => {\n                          setShowSettings((s) => !s);\n                          setShowQuality(false);\n                        }}\n                        className=\"text-white transition-colors hover:text-[var(--accent)]\"\n                      >\n                        <Settings className=\"h-4 w-4\" />\n                      </button>\n\n                      <button\n                        className=\"text-white transition-colors hover:text-[var(--accent)]\"\n                      >\n                        <Maximize className=\"h-4 w-4\" />\n                      </button>\n                    </div>\n                  </div>\n                </div>\n\n                {/* Settings panel */}\n                {showSettings && (\n                  <div className=\"absolute bottom-16 right-4 z-20 w-48 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-xl\">\n                    <p className=\"mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]\">\n                      {t(\"watch.settings.playbackSpeed\")}\n                    </p>\n                    <div className=\"grid grid-cols-3 gap-1\">\n                      {SPEED_OPTIONS.map((s) => (\n                        <button\n                          key={s}\n                          className={cn(\n                            \"rounded-lg py-1 text-xs transition-colors\",\n                            s === \"1x\"\n                              ? \"bg-[var(--accent)]/10 font-semibold text-[var(--accent)]\"\n                              : \"text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]\"\n                          )}\n                        >\n                          {s}\n                        </button>\n                      ))}\n                    </div>\n                  </div>\n                )}\n              </div>\n            </Reveal>\n\n            {/* Match Info */}\n            <Reveal>\n              <div className=\"rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]\">\n                <div className=\"flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between\">\n                  <div className=\"flex-1\">\n                    <div className=\"mb-2 flex flex-wrap items-center gap-2\">\n                      <span className=\"rounded-full bg-red-600/10 px-2.5 py-0.5 text-xs font-semibold text-red-500\">\n                        {t(\"watch.info.live\")}\n                      </span>\n                      <span className=\"rounded-full bg-[hsl(var(--muted))] px-2.5 py-0.5 text-xs text-[hsl(var(--muted-foreground))]\">\n                        {CURRENT_MATCH.league}\n                      </span>\n                      <span className=\"rounded-full bg-[hsl(var(--muted))] px-2.5 py-0.5 text-xs text-[hsl(var(--muted-foreground))]\">\n                        {CURRENT_MATCH.sport}\n                      </span>\n                    </div>\n                    <h1 className=\"text-xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-2xl\">\n                      {CURRENT_MATCH.title}\n                    </h1>\n                    <p className=\"mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]\">\n                      {CURRENT_MATCH.description}\n                    </p>\n                  </div>\n\n                  {/* Action buttons */}\n                  <div className=\"flex flex-wrap items-center gap-2 sm:flex-col sm:items-end\">\n                    <motion.button\n                      whileHover={{ scale: 1.04 }}\n                      whileTap={{ scale: 0.97 }}\n                      onClick={() => setIsLiked((l) => !l)}\n                      className={cn(\n                        \"flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all\",\n                        isLiked\n                          ? \"border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]\"\n                          : \"border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)] hover:text-[var(--accent)]\"\n                      )}\n                    >\n                      <Heart className={cn(\"h-4 w-4\", isLiked && \"fill-current\")} />\n                      {t(\"watch.actions.favorite\")}\n                    </motion.button>\n                    <motion.button\n                      whileHover={{ scale: 1.04 }}\n                      whileTap={{ scale: 0.97 }}\n                      className=\"flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]\"\n                    >\n                      <Share2 className=\"h-4 w-4\" />\n                      {t(\"watch.actions.share\")}\n                    </motion.button>\n                    <motion.button\n                      whileHover={{ scale: 1.04 }}\n                      whileTap={{ scale: 0.97 }}\n                      className=\"flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]\"\n                    >\n                      <Download className=\"h-4 w-4\" />\n                      {t(\"watch.actions.download\")}\n                    </motion.button>\n                  </div>\n                </div>\n\n                {/* Stats row */}\n                <div className=\"mt-4 flex flex-wrap items-center gap-4 border-t border-[hsl(var(--border))] pt-4 text-sm text-[hsl(var(--muted-foreground))]\">\n                  <span className=\"flex items-center gap-1.5\">\n                    <Eye className=\"h-4 w-4 text-[var(--accent)]\" />\n                    {formatViewers(CURRENT_MATCH.viewers)} {t(\"watch.info.watching\")}\n                  </span>\n                  <span className=\"flex items-center gap-1.5\">\n                    <Clock className=\"h-4 w-4 text-[var(--accent)]\" />\n                    {CURRENT_MATCH.duration}\n                  </span>\n                  <span className=\"flex items-center gap-1.5\">\n                    <Wifi className=\"h-4 w-4 text-green-500\" />\n                    {t(\"watch.info.hdStream\")}\n                  </span>\n                  <span className=\"flex items-center gap-1.5\">\n                    <Star className=\"h-4 w-4 text-yellow-500\" />\n                    {t(\"watch.info.featured\")}\n                  </span>\n                </div>\n              </div>\n            </Reveal>\n\n            {/* Scoreboard */}\n            <Reveal>\n              <div className=\"rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]\">\n                <h2 className=\"mb-4 text-base font-semibold text-[hsl(var(--foreground))]\">\n                  {t(\"watch.scoreboard.title\")}\n                </h2>\n                <div className=\"flex items-center justify-between gap-4\">\n                  <div className=\"flex flex-1 flex-col items-center gap-2\">\n                    <div className=\"flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-3xl\">\n                      &#9917;\n                    </div>\n                    <span className=\"text-center text-sm font-semibold text-[hsl(var(--foreground))]\">\n                      {CURRENT_MATCH.homeTeam}\n                    </span>\n                  </div>\n                  <div className=\"flex flex-col items-center gap-1\">\n                    <div className=\"flex items-center gap-3 rounded-2xl bg-[hsl(var(--muted))] px-6 py-3\">\n                      <span className=\"text-4xl font-black text-[hsl(var(--foreground))]\">{CURRENT_MATCH.homeScore}</span>\n                      <span className=\"text-2xl font-light text-[hsl(var(--muted-foreground))]\">-</span>\n                      <span className=\"text-4xl font-black text-[hsl(var(--foreground))]\">{CURRENT_MATCH.awayScore}</span>\n                    </div>\n                    <span className=\"rounded-full bg-red-600/10 px-3 py-0.5 text-xs font-bold text-red-500\">\n                      {CURRENT_MATCH.duration}\n                    </span>\n                  </div>\n                  <div className=\"flex flex-1 flex-col items-center gap-2\">\n                    <div className=\"flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-3xl\">\n                      &#127967;\n                    </div>\n                    <span className=\"text-center text-sm font-semibold text-[hsl(var(--foreground))]\">\n                      {CURRENT_MATCH.awayTeam}\n                    </span>\n                  </div>\n                </div>\n              </div>\n            </Reveal>\n\n            {/* Events & Comments Tabs */}\n            <Reveal>\n              <div className=\"rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]\">\n                {/* Tab header */}\n                <div className=\"flex border-b border-[hsl(var(--border))]\">\n                  <button\n                    onClick={() => setActiveTab(\"events\")}\n                    className={cn(\n                      \"flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors\",\n                      activeTab === \"events\"\n                        ? \"border-b-2 border-[var(--accent)] text-[var(--accent)]\"\n                        : \"text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]\"\n                    )}\n                  >\n                    <ThumbsUp className=\"h-4 w-4\" />\n                    {t(\"watch.tabs.events\")}\n                  </button>\n                  <button\n                    onClick={() => setActiveTab(\"comments\")}\n                    className={cn(\n                      \"flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors\",\n                      activeTab === \"comments\"\n                        ? \"border-b-2 border-[var(--accent)] text-[var(--accent)]\"\n                        : \"text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]\"\n                    )}\n                  >\n                    <MessageSquare className=\"h-4 w-4\" />\n                    {t(\"watch.tabs.comments\")}\n                  </button>\n                </div>\n\n                <div className=\"p-4\">\n                  {activeTab === \"events\" ? (\n                    <motion.div\n                      key=\"events\"\n                      variants={staggerContainer}\n                      initial=\"hidden\"\n                      animate=\"visible\"\n                      className=\"space-y-3\"\n                    >\n                      {MATCH_EVENTS.map((event, i) => (\n                        <motion.div\n                          key={i}\n                          variants={fadeInUp}\n                          className=\"flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3\"\n                        >\n                          <span className=\"flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-base\">\n                            {event.icon}\n                          </span>\n                          <div className=\"flex-1\">\n                            <p className=\"text-sm font-semibold text-[hsl(var(--foreground))]\">\n                              {event.player}\n                              <span className=\"ml-1 font-normal text-[hsl(var(--muted-foreground))]\">\n                                ({event.team})\n                              </span>\n                            </p>\n                            <p className=\"text-xs capitalize text-[hsl(var(--muted-foreground))]\">\n                              {event.type.replace(\"_\", \" \")}\n                            </p>\n                          </div>\n                          <span className=\"rounded-full bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-bold text-[var(--accent)]\">\n                            {event.minute}\n                          </span>\n                        </motion.div>\n                      ))}\n                    </motion.div>\n                  ) : (\n                    <motion.div\n                      key=\"comments\"\n                      initial={{ opacity: 0 }}\n                      animate={{ opacity: 1 }}\n                      className=\"space-y-4\"\n                    >\n                      {/* Comment input */}\n                      <div className=\"flex gap-3\">\n                        <div className=\"flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-bold text-[var(--accent)]\">\n                          ME\n                        </div>\n                        <div className=\"flex flex-1 gap-2\">\n                          <input\n                            type=\"text\"\n                            value={commentText}\n                            onChange={(e) => setCommentText(e.target.value)}\n                            placeholder={t(\"watch.comments.placeholder\")}\n                            className=\"flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[var(--accent)] focus:outline-none transition-colors\"\n                          />\n                          <motion.button\n                            whileHover={{ scale: 1.04 }}\n                            whileTap={{ scale: 0.97 }}\n                            className=\"rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:opacity-90\"\n                          >\n                            {t(\"watch.comments.send\")}\n                          </motion.button>\n                        </div>\n                      </div>\n\n                      {/* Comments list */}\n                      <div className=\"space-y-3\">\n                        {COMMENTS.map((comment) => (\n                          <div key={comment.id} className=\"flex gap-3\">\n                            <div className=\"flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-xs font-bold text-[hsl(var(--muted-foreground))]\">\n                              {comment.avatar}\n                            </div>\n                            <div className=\"flex-1\">\n                              <div className=\"flex items-center gap-2\">\n                                <span className=\"text-sm font-semibold text-[hsl(var(--foreground))]\">{comment.user}</span>\n                                <span className=\"text-xs text-[hsl(var(--muted-foreground))]\">{comment.time}</span>\n                              </div>\n                              <p className=\"mt-0.5 text-sm text-[hsl(var(--muted-foreground))]\">{comment.text}</p>\n                              <div className=\"mt-1.5 flex items-center gap-3\">\n                                <button className=\"flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:text-[var(--accent)]\">\n                                  <ThumbsUp className=\"h-3 w-3\" />\n                                  {comment.likes}\n                                </button>\n                                <button className=\"flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:text-red-500\">\n                                  <ThumbsDown className=\"h-3 w-3\" />\n                                </button>\n                                <button className=\"text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:text-[var(--accent)]\">\n                                  {t(\"watch.comments.reply\")}\n                                </button>\n                              </div>\n                            </div>\n                          </div>\n                        ))}\n                      </div>\n                    </motion.div>\n                  )}\n                </div>\n              </div>\n            </Reveal>\n          </div>\n\n          {/* ── Right Column ── */}\n          <div className=\"flex flex-col gap-4\">\n\n            {/* Related Matches */}\n            <Reveal>\n              <div className=\"rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]\">\n                <h2 className=\"mb-4 text-base font-semibold text-[hsl(var(--foreground))]\">\n                  {t(\"watch.related.title\")}\n                </h2>\n                <motion.div\n                  variants={staggerContainer}\n                  initial=\"hidden\"\n                  animate=\"visible\"\n                  className=\"space-y-3\"\n                >\n                  {RELATED_MATCHES.map((match) => (\n                    <motion.div key={match.id} variants={fadeInUp}>\n                      <Link href=\"/live\">\n                        <motion.div\n                          whileHover={{ scale: 1.02 }}\n                          className=\"group flex cursor-pointer gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 transition-all hover:border-[var(--accent)]/40 hover:shadow-md\"\n                        >\n                          <div className=\"relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg\">\n                            <img\n                              src={match.thumbnail}\n                              alt={match.title}\n                              className=\"h-full w-full object-cover transition-transform duration-300 group-hover:scale-105\"\n                            />\n                            <div className=\"absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100\">\n                              <Play className=\"h-6 w-6 text-white\" />\n                            </div>\n                            {match.status === \"live\" && (\n                              <span className=\"absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white\">\n                                <span className=\"h-1 w-1 animate-pulse rounded-full bg-white\" />\n                                LIVE\n                              </span>\n                            )}\n                            {match.status === \"replay\" && (\n                              <span className=\"absolute left-1.5 top-1.5 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white\">\n                                REPLAY\n                              </span>\n                            )}\n                          </div>\n                          <div className=\"flex min-w-0 flex-1 flex-col justify-between\">\n                            <div>\n                              <p className=\"text-xs text-[hsl(var(--muted-foreground))]\">{match.league}</p>\n                              <p className=\"mt-0.5 text-sm font-semibold leading-tight text-[hsl(var(--foreground))]\">\n                                {match.homeTeam} vs {match.awayTeam}\n                              </p>\n                              {match.homeScore !== undefined && (\n                                <p className=\"mt-0.5 text-sm font-bold text-[var(--accent)]\">\n                                  {match.homeScore} - {match.awayScore}\n                                </p>\n                              )}\n                            </div>\n                            <div className=\"flex items-center justify-between\">\n                              <span\n                                className={cn(\n                                  \"text-xs font-medium\",\n                                  match.status === \"live\" ? \"text-red-500\" : \"text-[hsl(var(--muted-foreground))]\"\n                                )}\n                              >\n                                {match.time}\n                              </span>\n                              {match.viewers > 0 && (\n                                <span className=\"flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]\">\n                                  <Eye className=\"h-3 w-3\" />\n                                  {formatViewers(match.viewers)}\n                                </span>\n                              )}\n                            </div>\n                          </div>\n                        </motion.div>\n                      </Link>\n                    </motion.div>\n                  ))}\n                </motion.div>\n\n                <Link href=\"/live\">\n                  <motion.button\n                    whileHover={{ scale: 1.02 }}\n                    whileTap={{ scale: 0.98 }}\n                    className=\"mt-4 w-full rounded-xl border border-[hsl(var(--border))] py-2.5 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]\"\n                  >\n                    {t(\"watch.related.viewAll\")}\n                  </motion.button>\n                </Link>\n              </div>\n            </Reveal>\n\n            {/* Stream Quality Info */}\n            <Reveal delay={0.08}>\n              <div className=\"rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]\">\n                <h3 className=\"mb-3 text-sm font-semibold text-[hsl(var(--foreground))]\">\n                  {t(\"watch.streamInfo.title\")}\n                </h3>\n                <div className=\"space-y-2.5\">\n                  <div className=\"flex items-center justify-between\">\n                    <span className=\"flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]\">\n                      <Tv className=\"h-3.5 w-3.5 text-[var(--accent)]\" />\n                      {t(\"watch.streamInfo.quality\")}\n                    </span>\n                    <span className=\"text-xs font-semibold text-[hsl(var(--foreground))]\">1080p HD</span>\n                  </div>\n                  <div className=\"flex items-center justify-between\">\n                    <span className=\"flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]\">\n                      <Wifi className=\"h-3.5 w-3.5 text-[var(--accent)]\" />\n                      {t(\"watch.streamInfo.latency\")}\n                    </span>\n                    <span className=\"text-xs font-semibold text-[hsl(var(--foreground))]\">&lt; 3s</span>\n                  </div>\n                  <div className=\"flex items-center justify-between\">\n                    <span className=\"flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]\">\n                      <ActivityIcon className=\"h-3.5 w-3.5 text-[var(--accent)]\" />\n                      {t(\"watch.streamInfo.bitrate\")}\n                    </span>\n                    <span className=\"text-xs font-semibold text-[hsl(var(--foreground))]\">8 Mbps</span>\n                  </div>\n                  <div className=\"flex items-center justify-between\">\n                    <span className=\"flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]\">\n                      <GlobeIcon className=\"h-3.5 w-3.5 text-[var(--accent)]\" />\n                      {t(\"watch.streamInfo.server\")}\n                    </span>\n                    <span className=\"text-xs font-semibold text-[hsl(var(--foreground))]\">EU-West</span>\n                  </div>\n                </div>\n              </div>\n            </Reveal>\n\n            {/* Upgrade CTA */}\n            <Reveal delay={0.12}>\n              <div className=\"relative overflow-hidden rounded-2xl bg-[var(--accent)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]\">\n                <div className=\"absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10\" />\n                <div className=\"absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10\" />\n                <div className=\"relative\">\n                  <p className=\"text-xs font-semibold uppercase tracking-wider text-[var(--accent-foreground)]/70\">\n                    {t(\"watch.upgrade.eyebrow\")}\n                  </p>\n                  <h3 className=\"mt-1 text-base font-bold text-[var(--accent-foreground)]\">\n                    {t(\"watch.upgrade.title\")}\n                  </h3>\n                  <p className=\"mt-1 text-xs text-[var(--accent-foreground)]/80\">\n                    {t(\"watch.upgrade.description\")}\n                  </p>\n                  <Link href=\"/pricing\">\n                    <motion.button\n                      whileHover={{ scale: 1.04 }}\n                      whileTap={{ scale: 0.97 }}\n                      className=\"mt-3 w-full rounded-xl bg-[var(--accent-foreground)] py-2 text-sm font-bold text-[var(--accent)] transition-all hover:opacity-90\"\n                    >\n                      {t(\"watch.upgrade.cta\")}\n                    </motion.button>\n                  </Link>\n                </div>\n              </div>\n            </Reveal>\n          </div>\n        </div>\n      </div>\n    </main>\n  );\n}\n"}}
</tool_call>

<tool_call>
{"name": "write_file", "arguments": {"path": "messages/en.json", "content": "{\n  \"watch\": {\n    \"breadcrumb\": {\n      \"home\": \"Home\",\n      \"live\": \"Live\"\n    },\n    \"player\": {\n      \"live\": \"LIVE\"\n    },\n    \"info\": {\n      \"live\": \"LIVE\",\n      \"watching\": \"watching\",\n      \"hdStream\": \"HD Stream\",\n      \"featured\": \"Featured Match\"\n    },\n    \"actions\": {\n      \"favorite\": \"Favorite\",\n      \"share\": \"Share\",\n      \"download\": \"Download\"\n    },\n    \"scoreboard\": {\n      \"title\": \"Live Score\"\n    },\n    \"tabs\": {\n      \"events\": \"Match Events\",\n      \"comments\": \"Live Chat\"\n    },\n    \"comments\": {\n      \"placeholder\": \"Share your thoughts...\",\n      \"send\": \"Send\",\n      \"reply\": \"Reply\"\n    },\n    \"related\": {\n      \"title\": \"More Live Matches\",\n      \"viewAll\": \"View All Live Matches\"\n    },\n    \"settings\": {\n      \"playbackSpeed\": \"Playback Speed\"\n    },\n    \"streamInfo\": {\n      \"title\": \"Stream Info\",\n      \"quality\": \"Quality\",\n      \"latency\": \"Latency\",\n      \"bitrate\": \"Bitrate\",\n      \"server\": \"Server\"\n    },\n    \"upgrade\": {\n      \"eyebrow\": \"Elite Plan\",\n      \"title\": \"Watch in 4K Ultra HD\",\n      \"description\": \"Upgrade to Elite for crystal-clear 4K streams, unlimited screens, and exclusive PPV access.\",\n      \"cta\": \"Upgrade to Elite\"\n    }\n  }\n}\n"}}
</tool_call>

Created `app/watch-video-player/page.tsx` and `messages/en.json`.

The Watch page delivers a fully interactive video player experience:

- **Video player** with a 16:9 aspect ratio, thumbnail backdrop, live score overlay, animated play/pause button, progress bar with hover state, volume slider, quality selector (Auto/4K/1080p/720p/480p/360p), playback speed panel, subtitles, and auto-hiding controls on mouse idle
- **Live badge + viewer count** in the top-left corner of the player
- **Match info card** with league/sport badges, full title, description, and Favorite/Share/Download action buttons with hover states
- **Live scoreboard** showing team emblems, large score display, and match clock
- **Tabbed panel** switching between Match Events (goal/card timeline with minute stamps) and Live Chat (comment input + threaded comments with like/dislike/reply)
- **Right sidebar** with related live/replay matches (thumbnail, score, viewer count, hover-to-reveal play button), stream quality info panel (quality/latency/bitrate/server), and an Elite upgrade CTA card
- All text via `next-intl` with fully populated `messages/en.json` catalog using `watch.*` namespaced keys