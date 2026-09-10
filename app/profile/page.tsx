"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { User, Star, Heart, Clock, Eye, Settings, Bell, Download, Calendar, Activity, Check, Edit, Mail, Lock } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const USER_PROFILE = {
  name: "Marcus Rivera",
  email: "marcus.rivera@email.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Rivera",
  plan: "Pro",
  memberSince: "March 2022",
  location: "New York, USA",
  favoriteTeam: "FC Barcelona",
  bio: "Lifelong football fan. Never miss a Champions League match. Also follow F1 and NBA closely.",
};

const WATCH_STATS = [
  { label: "Hours Watched", value: "342", icon: Clock, accent: true },
  { label: "Matches Viewed", value: "218", icon: Eye, accent: false },
  { label: "Favorites Saved", value: "47", icon: Heart, accent: false },
  { label: "Downloads", value: "31", icon: Download, accent: false },
];

const RECENT_WATCHES = [
  {
    id: "rw1",
    title: "Champions League Final",
    teams: "Real Madrid vs Man City",
    sport: "Football",
    date: "Jun 1, 2025",
    duration: "2h 15m",
    thumbnail: "/images/football-champions-league-final.jpg",
    status: "replay" as const,
  },
  {
    id: "rw2",
    title: "NBA Playoffs Game 7",
    teams: "Celtics vs Heat",
    sport: "Basketball",
    date: "May 28, 2025",
    duration: "2h 42m",
    thumbnail: "/images/basketball-nba-playoffs-game7.jpg",
    status: "replay" as const,
  },
  {
    id: "rw3",
    title: "Monaco Grand Prix",
    teams: "Formula 1 Race",
    sport: "Formula 1",
    date: "May 25, 2025",
    duration: "1h 58m",
    thumbnail: "/images/formula1-monaco-grand-prix.jpg",
    status: "replay" as const,
  },
  {
    id: "rw4",
    title: "Wimbledon Semifinal",
    teams: "Djokovic vs Alcaraz",
    sport: "Tennis",
    date: "May 20, 2025",
    duration: "3h 10m",
    thumbnail: "/images/tennis-wimbledon-semifinal.jpg",
    status: "replay" as const,
  },
];

const FAVORITE_SPORTS = [
  { key: "football", label: "Football", icon: "⚽", active: true },
  { key: "f1", label: "Formula 1", icon: "🏎️", active: true },
  { key: "basketball", label: "Basketball", icon: "🏀", active: true },
  { key: "tennis", label: "Tennis", icon: "🎾", active: false },
  { key: "mma", label: "MMA", icon: "🥊", active: false },
  { key: "cricket", label: "Cricket", icon: "🏏", active: false },
];

const NOTIFICATIONS = [
  {
    id: "n1",
    type: "live",
    message: "FC Barcelona vs Atletico Madrid is starting in 30 minutes",
    time: "28 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "reminder",
    message: "Your saved replay: Monaco GP is available to download",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n3",
    type: "promo",
    message: "Upgrade to Elite and get 4K streams for all F1 races",
    time: "1 day ago",
    read: true,
  },
  {
    id: "n4",
    type: "live",
    message: "NBA Finals Game 3 is live now — Celtics lead 2-0",
    time: "3 days ago",
    read: true,
  },
];

const UPCOMING_BOOKMARKS = [
  {
    id: "ub1",
    title: "Premier League Matchday 38",
    teams: "Arsenal vs Chelsea",
    date: "Jun 15, 2025",
    time: "15:00 GMT",
    sport: "Football",
  },
  {
    id: "ub2",
    title: "Canadian Grand Prix",
    teams: "Formula 1 Race",
    date: "Jun 16, 2025",
    time: "19:00 GMT",
    sport: "Formula 1",
  },
  {
    id: "ub3",
    title: "Wimbledon Day 1",
    teams: "Multiple Matches",
    date: "Jun 23, 2025",
    time: "11:00 GMT",
    sport: "Tennis",
  },
];

const PLAN_FEATURES = [
  "All live sports streams",
  "Full on-demand library",
  "1080p HD quality",
  "Ad-free experience",
  "Multi-device support (3 screens)",
  "Downloadable replays",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "live" | "upcoming" | "replay" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        status === "live" && "bg-red-500/20 text-red-400",
        status === "upcoming" && "bg-[var(--accent)]/20 text-[var(--accent)]",
        status === "replay" && "bg-white/10 text-white/60"
      )}
    >
      {status === "live" && (
        <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
      )}
      {status}
    </span>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg",
        active
          ? "text-[var(--accent)] bg-[var(--accent)]/10"
          : "text-white/50 hover:text-white/80"
      )}
    >
      {children}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"activity" | "bookmarks" | "notifications">("activity");
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState(USER_PROFILE.bio);

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* ── Hero / Profile Header ── */}
      <Reveal>
        <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-[hsl(var(--background))] via-[var(--accent)]/5 to-[hsl(var(--background))] px-4 pb-10 pt-16 sm:px-6 lg:px-8">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-6xl">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              {/* Avatar */}
              <motion.div
                className="relative shrink-0"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.25 }}
              >
                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-[var(--accent)]/40 shadow-[0_0_24px_rgba(0,0,0,0.4)]">
                  <img
                    src={USER_PROFILE.avatar}
                    alt={USER_PROFILE.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23222'/%3E%3Ccircle cx='48' cy='38' r='18' fill='%23444'/%3E%3Cellipse cx='48' cy='80' rx='28' ry='18' fill='%23444'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] shadow">
                  <Check className="h-3 w-3 text-black" />
                </span>
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {t("profile.name")}
                  </h1>
                  <span className="rounded-full bg-[var(--accent)]/20 px-3 py-0.5 text-xs font-semibold text-[var(--accent)] border border-[var(--accent)]/30">
                    {USER_PROFILE.plan} Member
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/50">
                  {USER_PROFILE.email}
                </p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {t("profile.memberSince")}: {USER_PROFILE.memberSince}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400" />
                    {USER_PROFILE.favoriteTeam}
                  </span>
                  <span>{USER_PROFILE.location}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
                >
                  <Settings className="h-4 w-4" />
                  {t("profile.settings")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
                >
                  <Edit className="h-4 w-4" />
                  {t("profile.editProfile")}
                </motion.button>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6 max-w-2xl">
              {editingBio ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 placeholder-white/30 focus:border-[var(--accent)]/50 focus:outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingBio(false)}
                      className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-black"
                    >
                      {t("profile.save")}
                    </button>
                    <button
                      onClick={() => { setBioText(USER_PROFILE.bio); setEditingBio(false); }}
                      className="rounded-lg border border-white/10 px-4 py-1.5 text-xs font-medium text-white/60"
                    >
                      {t("profile.cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group flex items-start gap-2">
                  <p className="text-sm leading-relaxed text-white/60">{bioText}</p>
                  <button
                    onClick={() => setEditingBio(true)}
                    className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-3.5 w-3.5 text-white/40 hover:text-[var(--accent)]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Stats Row ── */}
      <Reveal>
        <section className="border-b border-white/5 bg-[hsl(var(--card))]/40 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {WATCH_STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    variants={scaleIn}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className={cn(
                      "rounded-2xl border p-5 text-center shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.2)]",
                      stat.accent
                        ? "border-[var(--accent)]/30 bg-[var(--accent)]/10"
                        : "border-white/5 bg-[hsl(var(--card))]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mx-auto mb-2 h-5 w-5",
                        stat.accent ? "text-[var(--accent)]" : "text-white/40"
                      )}
                    />
                    <div
                      className={cn(
                        "text-3xl font-bold tracking-tight",
                        stat.accent ? "text-[var(--accent)]" : "text-white"
                      )}
                    >
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-white/50">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── Main Content Grid ── */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ── Left Column ── */}
          <div className="space-y-6 lg:col-span-2">

            {/* Tabs */}
            <Reveal>
              <div className="flex gap-1 rounded-xl border border-white/5 bg-[hsl(var(--card))]/60 p-1 w-fit">
                <TabButton active={activeTab === "activity"} onClick={() => setActiveTab("activity")}>
                  {t("profile.tabs.activity")}
                </TabButton>
                <TabButton active={activeTab === "bookmarks"} onClick={() => setActiveTab("bookmarks")}>
                  {t("profile.tabs.bookmarks")}
                </TabButton>
                <TabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")}>
                  {t("profile.tabs.notifications")}
                  <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    2
                  </span>
                </TabButton>
              </div>
            </Reveal>

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <Reveal>
                <div className="rounded-2xl border border-white/5 bg-[hsl(var(--card))] overflow-hidden">
                  <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <Activity className="h-4 w-4 text-[var(--accent)]" />
                      {t("profile.recentlyWatched")}
                    </h2>
                    <span className="text-xs text-white/40">{t("profile.last30Days")}</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {RECENT_WATCHES.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.35 }}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors group"
                      >
                        <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                          <p className="text-xs text-white/50 truncate">{item.teams}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <StatusBadge status={item.status} />
                            <span className="text-xs text-white/30">{item.sport}</span>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-xs text-white/50">{item.date}</p>
                          <p className="text-xs text-white/30 flex items-center gap-1 justify-end mt-0.5">
                            <Clock className="h-3 w-3" />
                            {item.duration}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Bookmarks Tab */}
            {activeTab === "bookmarks" && (
              <Reveal>
                <div className="rounded-2xl border border-white/5 bg-[hsl(var(--card))] overflow-hidden">
                  <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[var(--accent)]" />
                      {t("profile.upcomingBookmarks")}
                    </h2>
                    <span className="text-xs text-white/40">{UPCOMING_BOOKMARKS.length} {t("profile.saved")}</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {UPCOMING_BOOKMARKS.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.35 }}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-xl">
                          {item.sport === "Football" ? "⚽" : item.sport === "Formula 1" ? "🏎️" : "🎾"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                          <p className="text-xs text-white/50">{item.teams}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-xs font-medium text-[var(--accent)]">{item.date}</p>
                          <p className="text-xs text-white/40">{item.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Reveal>
                <div className="rounded-2xl border border-white/5 bg-[hsl(var(--card))] overflow-hidden">
                  <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <Bell className="h-4 w-4 text-[var(--accent)]" />
                      {t("profile.notifications")}
                    </h2>
                    <button className="text-xs text-[var(--accent)] hover:underline">
                      {t("profile.markAllRead")}
                    </button>
                  </div>
                  <div className="divide-y divide-white/5">
                    {NOTIFICATIONS.map((notif, i) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.35 }}
                        className={cn(
                          "flex items-start gap-4 px-6 py-4 transition-colors",
                          !notif.read && "bg-[var(--accent)]/3"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                            !notif.read ? "bg-[var(--accent)]" : "bg-white/10"
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm leading-relaxed", !notif.read ? "text-white" : "text-white/50")}>
                            {notif.message}
                          </p>
                          <p className="mt-1 text-xs text-white/30">{notif.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6">

            {/* Subscription Card */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent)]/10 to-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">{t("profile.subscription")}</h3>
                  <span className="rounded-full bg-[var(--accent)] px-3 py-0.5 text-xs font-bold text-black">
                    {USER_PROFILE.plan}
                  </span>
                </div>
                <ul className="space-y-2 mb-5">
                  {PLAN_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-white/70">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/40">{t("profile.nextBilling")}</p>
                    <p className="text-sm font-semibold text-white">Jul 1, 2025</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-black transition-opacity hover:opacity-90"
                  >
                    {t("profile.upgrade")}
                  </motion.button>
                </div>
              </div>
            </Reveal>

            {/* Favorite Sports */}
            <Reveal delay={0.15}>
              <div className="rounded-2xl border border-white/5 bg-[hsl(var(--card))] p-6">
                <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
                  <Heart className="h-4 w-4 text-[var(--accent)]" />
                  {t("profile.favoriteSports")}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {FAVORITE_SPORTS.map((sport) => (
                    <motion.button
                      key={sport.key}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl border py-3 text-center transition-colors",
                        sport.active
                          ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-white"
                          : "border-white/5 bg-white/3 text-white/40 hover:border-white/10 hover:text-white/60"
                      )}
                    >
                      <span className="text-xl">{sport.icon}</span>
                      <span className="text-[10px] font-medium leading-tight">{sport.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Account Settings Quick Links */}
            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-white/5 bg-[hsl(var(--card))] p-6">
                <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
                  <Settings className="h-4 w-4 text-[var(--accent)]" />
                  {t("profile.accountSettings")}
                </h3>
                <div className="space-y-1">
                  {[
                    { icon: User, label: t("profile.settings.personalInfo") },
                    { icon: Mail, label: t("profile.settings.emailPrefs") },
                    { icon: Bell, label: t("profile.settings.notifications") },
                    { icon: Lock, label: t("profile.settings.security") },
                    { icon: Download, label: t("profile.settings.downloads") },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.label}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.15 }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-white/30" />
                        {item.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}