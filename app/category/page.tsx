"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Eye, Clock, ChevronRight, Trophy, Users, Star, Filter, TrendingUp, Calendar } from 'lucide-react';
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
type sportCategories = any;
const sportCategories: any = [];
type SportCategory = any;
const SportCategory: any = [];

// ─── Inline sport data ────────────────────────────────────────────────────────

interface League {
  id: string;
  name: string;
  country: string;
  logo: string;
}

interface Team {
  id: string;
  name: string;
  badge: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
}

interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: string;
  league: string;
  viewers: number;
  thumbnail: string;
}

interface RecentResult {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  league: string;
  status: "FT" | "AET" | "PEN";
}

interface SportData {
  leagues: League[];
  teams: Team[];
  liveMatches: LiveMatch[];
  recentResults: RecentResult[];
  heroImage: string;
  description: string;
  totalEvents: number;
  activeLeagues: number;
}

const SPORT_DATA: Record<string, SportData> = {
  football: {
    heroImage: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/ab27245aa29047ca8065cea1f8781775.jpg",
    description:
      "The world's most popular sport, live from the biggest stadiums. Premier League, Champions League, La Liga and more.",
    totalEvents: 248,
    activeLeagues: 32,
    leagues: [
      { id: "pl", name: "Premier League", country: "England", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
      { id: "ucl", name: "Champions League", country: "Europe", logo: "🇪🇺" },
      { id: "laliga", name: "La Liga", country: "Spain", logo: "🇪🇸" },
      { id: "bundesliga", name: "Bundesliga", country: "Germany", logo: "🇩🇪" },
      { id: "seriea", name: "Serie A", country: "Italy", logo: "🇮🇹" },
      { id: "ligue1", name: "Ligue 1", country: "France", logo: "🇫🇷" },
    ],
    teams: [
      { id: "mci", name: "Manchester City", badge: "🔵", wins: 22, losses: 3, draws: 5, points: 71 },
      { id: "ars", name: "Arsenal", badge: "🔴", wins: 21, losses: 4, draws: 5, points: 68 },
      { id: "liv", name: "Liverpool", badge: "🔴", wins: 20, losses: 4, draws: 6, points: 66 },
      { id: "che", name: "Chelsea", badge: "🔵", wins: 16, losses: 8, draws: 6, points: 54 },
      { id: "tot", name: "Tottenham", badge: "⚪", wins: 14, losses: 9, draws: 7, points: 49 },
      { id: "mun", name: "Manchester Utd", badge: "🔴", wins: 13, losses: 10, draws: 7, points: 46 },
    ],
    liveMatches: [
      {
        id: "lm1",
        homeTeam: "Arsenal",
        awayTeam: "Chelsea",
        homeScore: 2,
        awayScore: 1,
        minute: "67'",
        league: "Premier League",
        viewers: 142000,
        thumbnail: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/f00ac2ac55f146a0a3409d74dc87c2c3.jpg",
      },
      {
        id: "lm2",
        homeTeam: "Real Madrid",
        awayTeam: "Bayern Munich",
        homeScore: 1,
        awayScore: 1,
        minute: "45+2'",
        league: "Champions League",
        viewers: 389000,
        thumbnail: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/1043df0cd8cb4f1b9a4bb7942dc6dea3.jpg",
      },
      {
        id: "lm3",
        homeTeam: "Barcelona",
        awayTeam: "Atletico Madrid",
        homeScore: 0,
        awayScore: 0,
        minute: "23'",
        league: "La Liga",
        viewers: 97000,
        thumbnail: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/868a9873182d413e8d46063b7ab0c4b3.png",
      },
    ],
    recentResults: [
      { id: "r1", date: "Dec 14", homeTeam: "Liverpool", awayTeam: "Man City", homeScore: 2, awayScore: 2, league: "Premier League", status: "FT" },
      { id: "r2", date: "Dec 13", homeTeam: "PSG", awayTeam: "Dortmund", homeScore: 3, awayScore: 1, league: "Champions League", status: "FT" },
      { id: "r3", date: "Dec 12", homeTeam: "Juventus", awayTeam: "Inter Milan", homeScore: 1, awayScore: 2, league: "Serie A", status: "FT" },
      { id: "r4", date: "Dec 11", homeTeam: "Bayern Munich", awayTeam: "Leverkusen", homeScore: 4, awayScore: 0, league: "Bundesliga", status: "FT" },
      { id: "r5", date: "Dec 10", homeTeam: "Tottenham", awayTeam: "Arsenal", homeScore: 1, awayScore: 3, league: "Premier League", status: "FT" },
    ],
  },
  basketball: {
    heroImage: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/e20a57cde38a492f88628acab4a57f5d.jpg",
    description:
      "High-flying action from the NBA, EuroLeague, and international competitions. Every dunk, every buzzer-beater, live.",
    totalEvents: 184,
    activeLeagues: 18,
    leagues: [
      { id: "nba", name: "NBA", country: "USA", logo: "🇺🇸" },
      { id: "euroleague", name: "EuroLeague", country: "Europe", logo: "🇪🇺" },
      { id: "ncaa", name: "NCAA", country: "USA", logo: "🎓" },
      { id: "fiba", name: "FIBA World Cup", country: "International", logo: "🌍" },
    ],
    teams: [
      { id: "bos", name: "Boston Celtics", badge: "🍀", wins: 28, losses: 8, draws: 0, points: 56 },
      { id: "okc", name: "OKC Thunder", badge: "⚡", wins: 27, losses: 9, draws: 0, points: 54 },
      { id: "den", name: "Denver Nuggets", badge: "🏔️", wins: 24, losses: 12, draws: 0, points: 48 },
      { id: "lal", name: "LA Lakers", badge: "💜", wins: 20, losses: 16, draws: 0, points: 40 },
    ],
    liveMatches: [
      {
        id: "lm1",
        homeTeam: "Boston Celtics",
        awayTeam: "Miami Heat",
        homeScore: 87,
        awayScore: 79,
        minute: "Q3 4:22",
        league: "NBA",
        viewers: 210000,
        thumbnail: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/bb4b5d31f1a54e4bbc6daebf545ad0be.jpg",
      },
      {
        id: "lm2",
        homeTeam: "LA Lakers",
        awayTeam: "Golden State",
        homeScore: 102,
        awayScore: 98,
        minute: "Q4 1:45",
        league: "NBA",
        viewers: 445000,
        thumbnail: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/dc1a526cf27e4dc79a734bddc18efc9c.jpg",
      },
    ],
    recentResults: [
      { id: "r1", date: "Dec 14", homeTeam: "OKC Thunder", awayTeam: "Dallas Mavs", homeScore: 118, awayScore: 104, league: "NBA", status: "FT" },
      { id: "r2", date: "Dec 13", homeTeam: "Denver Nuggets", awayTeam: "Phoenix Suns", homeScore: 121, awayScore: 115, league: "NBA", status: "FT" },
      { id: "r3", date: "Dec 12", homeTeam: "Real Madrid", awayTeam: "Fenerbahce", homeScore: 89, awayScore: 82, league: "EuroLeague", status: "FT" },
    ],
  },
  tennis: {
    heroImage: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/f72e7ba59a404513b20c68dde2ed7f9b.jpeg",
    description:
      "Grand Slams, ATP Masters, WTA events and Davis Cup. Watch every ace, every rally, every championship point.",
    totalEvents: 96,
    activeLeagues: 12,
    leagues: [
      { id: "wimbledon", name: "Wimbledon", country: "England", logo: "🇬🇧" },
      { id: "usopen", name: "US Open", country: "USA", logo: "🇺🇸" },
      { id: "roland", name: "Roland Garros", country: "France", logo: "🇫🇷" },
      { id: "ao", name: "Australian Open", country: "Australia", logo: "🇦🇺" },
    ],
    teams: [
      { id: "djok", name: "N. Djokovic", badge: "🇷🇸", wins: 68, losses: 7, draws: 0, points: 11245 },
      { id: "alca", name: "C. Alcaraz", badge: "🇪🇸", wins: 62, losses: 12, draws: 0, points: 9255 },
      { id: "sinner", name: "J. Sinner", badge: "🇮🇹", wins: 60, losses: 10, draws: 0, points: 8710 },
      { id: "medv", name: "D. Medvedev", badge: "🇷🇺", wins: 55, losses: 18, draws: 0, points: 7200 },
    ],
    liveMatches: [
      {
        id: "lm1",
        homeTeam: "Alcaraz",
        awayTeam: "Sinner",
        homeScore: 6,
        awayScore: 4,
        minute: "Set 2",
        league: "ATP Finals",
        viewers: 178000,
        thumbnail: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/bfdf8a4966954a298e943753bcb81eb1.JPG",
      },
    ],
    recentResults: [
      { id: "r1", date: "Dec 14", homeTeam: "Djokovic", awayTeam: "Medvedev", homeScore: 6, awayScore: 3, league: "ATP Finals", status: "FT" },
      { id: "r2", date: "Dec 13", homeTeam: "Swiatek", awayTeam: "Sabalenka", homeScore: 7, awayScore: 5, league: "WTA Finals", status: "FT" },
    ],
  },
  mma: {
    heroImage: "https://picsum.photos/seed/c9470eb6e0ab/800/600",
    description:
      "UFC, Bellator, ONE Championship and more. Every fight card, every title bout, every knockout moment.",
    totalEvents: 64,
    activeLeagues: 8,
    leagues: [
      { id: "ufc", name: "UFC", country: "International", logo: "🥊" },
      { id: "bellator", name: "Bellator MMA", country: "USA", logo: "🇺🇸" },
      { id: "one", name: "ONE Championship", country: "Asia", logo: "🌏" },
      { id: "pfl", name: "PFL", country: "USA", logo: "🏆" },
    ],
    teams: [
      { id: "jones", name: "Jon Jones", badge: "🦅", wins: 27, losses: 1, draws: 0, points: 0 },
      { id: "islam", name: "Islam Makhachev", badge: "🦁", wins: 26, losses: 1, draws: 0, points: 0 },
      { id: "pereira", name: "Alex Pereira", badge: "🐉", wins: 10, losses: 2, draws: 0, points: 0 },
      { id: "omalley", name: "Sean O'Malley", badge: "🍭", wins: 17, losses: 1, draws: 0, points: 0 },
    ],
    liveMatches: [
      {
        id: "lm1",
        homeTeam: "Pereira",
        awayTeam: "Prochazka",
        homeScore: 0,
        awayScore: 0,
        minute: "R2 3:12",
        league: "UFC 310",
        viewers: 312000,
        thumbnail: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/dff64c57eb0f414d805078f558769b26.jpg",
      },
    ],
    recentResults: [
      { id: "r1", date: "Dec 14", homeTeam: "Makhachev", awayTeam: "Tsarukyan", homeScore: 0, awayScore: 0, league: "UFC 311", status: "FT" },
      { id: "r2", date: "Dec 7", homeTeam: "O'Malley", awayTeam: "Dvalishvili", homeScore: 0, awayScore: 0, league: "UFC 306", status: "FT" },
    ],
  },
  f1: {
    heroImage: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/d91c45d63f1f45d1b4285b463a40ed6f.png",
    description:
      "Every Grand Prix, qualifying session, and practice run. Follow the fastest drivers on the planet in glorious 4K.",
    totalEvents: 48,
    activeLeagues: 4,
    leagues: [
      { id: "f1wc", name: "F1 World Championship", country: "International", logo: "🏁" },
      { id: "f2", name: "Formula 2", country: "International", logo: "🏎️" },
      { id: "f3", name: "Formula 3", country: "International", logo: "🚗" },
      { id: "fe", name: "Formula E", country: "International", logo: "⚡" },
    ],
    teams: [
      { id: "ver", name: "Max Verstappen", badge: "🔵", wins: 19, losses: 4, draws: 0, points: 575 },
      { id: "nor", name: "Lando Norris", badge: "🟠", wins: 4, losses: 19, draws: 0, points: 356 },
      { id: "lec", name: "Charles Leclerc", badge: "🔴", wins: 3, losses: 20, draws: 0, points: 307 },
      { id: "ham", name: "Lewis Hamilton", badge: "⚫", wins: 2, losses: 21, draws: 0, points: 290 },
    ],
    liveMatches: [
      {
        id: "lm1",
        homeTeam: "Verstappen",
        awayTeam: "Norris",
        homeScore: 1,
        awayScore: 2,
        minute: "Lap 42/58",
        league: "Abu Dhabi GP",
        viewers: 520000,
        thumbnail: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/79541bae0d7d47758783596b81ca56ad.webp",
      },
    ],
    recentResults: [
      { id: "r1", date: "Dec 8", homeTeam: "Verstappen", awayTeam: "Norris", homeScore: 1, awayScore: 2, league: "Las Vegas GP", status: "FT" },
      { id: "r2", date: "Nov 24", homeTeam: "Leclerc", awayTeam: "Sainz", homeScore: 1, awayScore: 2, league: "Qatar GP", status: "FT" },
    ],
  },
  cricket: {
    heroImage: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/4d96c0573d1b440ab1160d87d7595dff.png",
    description:
      "Test cricket, ODIs, T20 internationals and the IPL. Every delivery, every century, every wicket live.",
    totalEvents: 112,
    activeLeagues: 14,
    leagues: [
      { id: "ipl", name: "IPL", country: "India", logo: "🇮🇳" },
      { id: "ashes", name: "The Ashes", country: "England/Australia", logo: "🏺" },
      { id: "wc", name: "ICC World Cup", country: "International", logo: "🌍" },
      { id: "bbl", name: "Big Bash League", country: "Australia", logo: "🇦🇺" },
    ],
    teams: [
      { id: "ind", name: "India", badge: "🇮🇳", wins: 18, losses: 4, draws: 2, points: 56 },
      { id: "aus", name: "Australia", badge: "🇦🇺", wins: 16, losses: 5, draws: 3, points: 51 },
      { id: "eng", name: "England", badge: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", wins: 14, losses: 7, draws: 3, points: 45 },
      { id: "pak", name: "Pakistan", badge: "🇵🇰", wins: 12, losses: 9, draws: 3, points: 39 },
    ],
    liveMatches: [
      {
        id: "lm1",
        homeTeam: "India",
        awayTeam: "Australia",
        homeScore: 287,
        awayScore: 0,
        minute: "Day 2, Over 88",
        league: "Border-Gavaskar Trophy",
        viewers: 680000,
        thumbnail: "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/26c4e82cc0ac409da9d66b25045e4864.jpg",
      },
    ],
    recentResults: [
      { id: "r1", date: "Dec 14", homeTeam: "India", awayTeam: "Australia", homeScore: 295, awayScore: 104, league: "Border-Gavaskar Trophy", status: "FT" },
      { id: "r2", date: "Dec 10", homeTeam: "England", awayTeam: "New Zealand", homeScore: 325, awayScore: 280, league: "Test Series", status: "FT" },
    ],
  },
  baseball: {
    heroImage: "/images/baseball-mlb-stadium-night.jpg",
    description:
      "MLB regular season, playoffs, and the World Series. Every pitch, every home run, every stolen base.",
    totalEvents: 88,
    activeLeagues: 6,
    leagues: [
      { id: "mlb", name: "MLB", country: "USA", logo: "🇺🇸" },
      { id: "npb", name: "NPB", country: "Japan", logo: "🇯🇵" },
      { id: "kbo", name: "KBO", country: "South Korea", logo: "🇰🇷" },
    ],
    teams: [
      { id: "lad", name: "LA Dodgers", badge: "🔵", wins: 98, losses: 64, draws: 0, points: 98 },
      { id: "nyy", name: "NY Yankees", badge: "⚫", wins: 94, losses: 68, draws: 0, points: 94 },
      { id: "atl", name: "Atlanta Braves", badge: "🪓", wins: 89, losses: 73, draws: 0, points: 89 },
    ],
    liveMatches: [
      {
        id: "lm1",
        homeTeam: "LA Dodgers",
        awayTeam: "NY Yankees",
        homeScore: 4,
        awayScore: 3,
        minute: "7th Inning",
        league: "MLB",
        viewers: 195000,
        thumbnail: "/images/baseball-dodgers-yankees-mlb.jpg",
      },
    ],
    recentResults: [
      { id: "r1", date: "Dec 14", homeTeam: "Dodgers", awayTeam: "Padres", homeScore: 7, awayScore: 2, league: "MLB", status: "FT" },
      { id: "r2", date: "Dec 13", homeTeam: "Yankees", awayTeam: "Red Sox", homeScore: 5, awayScore: 4, league: "MLB", status: "AET" },
    ],
  },
  rugby: {
    heroImage: "/images/rugby-world-cup-stadium.jpg",
    description:
      "Rugby Union, Rugby League, Six Nations, and the Rugby World Cup. Every scrum, every try, every conversion.",
    totalEvents: 76,
    activeLeagues: 10,
    leagues: [
      { id: "sixnations", name: "Six Nations", country: "Europe", logo: "🇪🇺" },
      { id: "rwc", name: "Rugby World Cup", country: "International", logo: "🌍" },
      { id: "premiership", name: "Premiership Rugby", country: "England", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
      { id: "urc", name: "United Rugby Championship", country: "Europe", logo: "🏆" },
    ],
    teams: [
      { id: "nzl", name: "New Zealand", badge: "🇳🇿", wins: 14, losses: 2, draws: 1, points: 43 },
      { id: "rsa", name: "South Africa", badge: "🇿🇦", wins: 13, losses: 3, draws: 1, points: 40 },
      { id: "ire", name: "Ireland", badge: "🇮🇪", wins: 12, losses: 4, draws: 1, points: 37 },
      { id: "fra", name: "France", badge: "🇫🇷", wins: 11, losses: 5, draws: 1, points: 34 },
    ],
    liveMatches: [
      {
        id: "lm1",
        homeTeam: "Ireland",
        awayTeam: "France",
        homeScore: 17,
        awayScore: 14,
        minute: "62'",
        league: "Six Nations",
        viewers: 134000,
        thumbnail: "/images/rugby-ireland-france-sixnations.jpg",
      },
    ],
    recentResults: [
      { id: "r1", date: "Dec 14", homeTeam: "New Zealand", awayTeam: "South Africa", homeScore: 31, awayScore: 18, league: "Rugby Championship", status: "FT" },
      { id: "r2", date: "Dec 7", homeTeam: "England", awayTeam: "Australia", homeScore: 29, awayScore: 20, league: "Autumn Nations", status: "FT" },
    ],
  },
};

const DEFAULT_SPORT = "football";

function formatViewers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LiveMatchCard({ match }: { match: LiveMatch }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className="relative flex-shrink-0 w-64 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer group"
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={match.thumbnail}
          alt={`${match.homeTeam} vs ${match.awayTeam}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          LIVE
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white/80 text-xs px-2 py-0.5 rounded-full">
          <Eye className="w-3 h-3" />
          {formatViewers(match.viewers ?? 0)}
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-3 text-white">
          <span className="font-semibold text-sm truncate max-w-[70px] text-right">{match.homeTeam}</span>
          <span className="font-bold text-lg bg-black/50 px-2 py-0.5 rounded">
            {match.homeScore} – {match.awayScore}
          </span>
          <span className="font-semibold text-sm truncate max-w-[70px]">{match.awayTeam}</span>
        </div>
      </div>
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-xs text-white/50 truncate">{match.league}</span>
        <span className="text-xs font-mono text-[var(--accent)]">{match.minute}</span>
      </div>
      <Link href={`/watch-video-player?id=${match.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
        <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg">
          <Play className="w-5 h-5 text-black fill-black ml-0.5" />
        </div>
      </Link>
    </motion.div>
  );
}

function TeamRow({ team, rank, isPoints }: { team: Team; rank: number; isPoints: boolean }) {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
    >
      <span className="w-5 text-center text-sm font-bold text-white/30">{rank}</span>
      <span className="text-xl">{team.badge}</span>
      <span className="flex-1 text-sm font-medium text-white/90 truncate">{team.name}</span>
      <div className="flex items-center gap-4 text-xs text-white/50">
        <span className="w-6 text-center">{team.wins}W</span>
        <span className="w-6 text-center">{team.losses}L</span>
        {team.draws > 0 && <span className="w-6 text-center">{team.draws}D</span>}
        <span className="w-10 text-right font-bold text-[var(--accent)]">
          {isPoints ? `${team.points}pts` : `${team.wins}W`}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function CategoryPageInner() {
  const searchParams = useSearchParams();
  const sportParam = searchParams.get("sport") ?? DEFAULT_SPORT;

  const [activeSport, setActiveSport] = useState<string>(sportParam);
  const [activeLeague, setActiveLeague] = useState<string>("all");

  const sport = useMemo<SportCategory | undefined>(
    () => sportCategories.find((s) => s.key === activeSport),
    [activeSport]
  );

  const data = useMemo<SportData>(
    () => SPORT_DATA[activeSport] ?? SPORT_DATA[DEFAULT_SPORT],
    [activeSport]
  );

  useEffect(() => {
    setActiveLeague("all");
  }, [activeSport]);

  const filteredResults = useMemo(() => {
    if (activeLeague === "all") return data.recentResults;
    return data.recentResults.filter((r) => {
      const league = data.leagues.find((l) => l.id === activeLeague);
      return league ? r.league === league.name : true;
    });
  }, [activeLeague, data]);

  const isPoints = activeSport !== "basketball" && activeSport !== "baseball";

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">

      {/* ── Sport Selector Strip ── */}
      <Reveal>
        <section className="border-b border-white/8 bg-black/30 backdrop-blur-sm sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
              {sportCategories.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveSport(s.key)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeSport === s.key
                      ? "bg-[var(--accent)] text-black"
                      : "text-white/60 hover:text-white hover:bg-white/8"
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Hero Banner ── */}
      <Reveal>
        <section className="relative h-[420px] md:h-[520px] overflow-hidden">
          <img
            src={data.heroImage}
            alt={sport?.label ?? activeSport}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
            <motion.div
              key={activeSport}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">{sport?.icon ?? "🏆"}</span>
                <div>
                  <p className="text-white/50 text-sm font-medium uppercase tracking-widest mb-1">
                    Sports Hub
                  </p>
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                    {sport?.label ?? activeSport}
                  </h1>
                </div>
              </div>
              <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed mb-6">
                {data.description}
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Calendar className="w-4 h-4 text-[var(--accent)]" />
                  <span><strong className="text-white">{data.totalEvents}</strong> events this season</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Trophy className="w-4 h-4 text-[var(--accent)]" />
                  <span><strong className="text-white">{data.activeLeagues}</strong> active leagues</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
                  <span><strong className="text-white">{data.liveMatches.length}</strong> live now</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── Live Now Rail ── */}
      {data.liveMatches.length > 0 && (
        <Reveal>
          <section className="bg-black/40 border-b border-white/8 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <h2 className="text-white font-bold text-lg">Live Now</h2>
                  <span className="bg-red-600/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                    {data.liveMatches.length} streams
                  </span>
                </div>
                <Link
                  href="/live"
                  className="flex items-center gap-1 text-[var(--accent)] text-sm font-medium hover:underline"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
              >
                {data.liveMatches.map((match) => (
                  <motion.div key={match.id} variants={scaleIn}>
                    <LiveMatchCard match={match} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </Reveal>
      )}

      {/* ── Main Content: Sidebar + Teams + Results ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar: League Selector */}
          <Reveal className="lg:col-span-1">
            <aside className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm p-5 sticky top-32">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Competitions</h3>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveLeague("all")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeLeague === "all"
                      ? "bg-[var(--accent)] text-black"
                      : "text-white/60 hover:text-white hover:bg-white/8"
                  }`}
                >
                  All Competitions
                </button>
                {data.leagues.map((league) => (
                  <button
                    key={league.id}
                    onClick={() => setActiveLeague(league.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 ${
                      activeLeague === league.id
                        ? "bg-[var(--accent)] text-black font-medium"
                        : "text-white/60 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    <span className="text-base">{league.logo}</span>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{league.name}</div>
                      <div className={`text-xs truncate ${activeLeague === league.id ? "text-black/60" : "text-white/30"}`}>
                        {league.country}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick stats */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
                <h4 className="text-white/40 text-xs uppercase tracking-wider font-medium">Quick Stats</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Total Events</span>
                  <span className="text-white font-bold">{data.totalEvents}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Leagues</span>
                  <span className="text-white font-bold">{data.activeLeagues}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Live Now</span>
                  <span className="text-red-400 font-bold">{data.liveMatches.length}</span>
                </div>
              </div>
            </aside>
          </Reveal>

          {/* Main: Teams + Results */}
          <div className="lg:col-span-3 space-y-8">

            {/* Featured Teams / Standings */}
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[var(--accent)]" />
                    <h2 className="text-white font-bold">
                      {activeSport === "tennis" || activeSport === "mma" || activeSport === "f1"
                        ? "Top Athletes"
                        : "Standings"}
                    </h2>
                  </div>
                  <span className="text-white/30 text-xs">{data.leagues[0]?.name}</span>
                </div>

                {/* Header row */}
                <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5">
                  <span className="w-5 text-center text-xs text-white/20">#</span>
                  <span className="w-8" />
                  <span className="flex-1 text-xs text-white/30 uppercase tracking-wider">
                    {activeSport === "tennis" || activeSport === "mma" || activeSport === "f1" ? "Athlete" : "Team"}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-white/30 uppercase tracking-wider">
                    <span className="w-6 text-center">W</span>
                    <span className="w-6 text-center">L</span>
                    {data.teams[0]?.draws > 0 && <span className="w-6 text-center">D</span>}
                    <span className="w-10 text-right">
                      {isPoints ? "Pts" : "W"}
                    </span>
                  </div>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="divide-y divide-white/5"
                >
                  {data.teams.map((team, i) => (
                    <motion.div key={team.id} variants={fadeInUp}>
                      <TeamRow team={team} rank={i + 1} isPoints={isPoints} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </Reveal>

            {/* Recent Results Table */}
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--accent)]" />
                    <h2 className="text-white font-bold">Recent Results</h2>
                  </div>
                  <Link
                    href="/schedule"
                    className="flex items-center gap-1 text-[var(--accent)] text-xs font-medium hover:underline"
                  >
                    Full schedule <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {filteredResults.length === 0 ? (
                  <div className="px-5 py-10 text-center text-white/30 text-sm">
                    No results for this competition yet.
                  </div>
                ) : (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="divide-y divide-white/5"
                  >
                    {filteredResults.map((result) => (
                      <motion.div
                        key={result.id}
                        variants={fadeInUp}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-white/4 transition-colors group"
                      >
                        <span className="text-white/30 text-xs w-12 flex-shrink-0">{result.date}</span>
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-sm font-medium text-white/80 truncate max-w-[100px] md:max-w-[140px]">
                              {result.homeTeam}
                            </span>
                            <div className="flex items-center gap-1.5 bg-white/8 px-3 py-1 rounded-lg font-mono text-sm font-bold text-white flex-shrink-0">
                              <span>{result.homeScore}</span>
                              <span className="text-white/30">–</span>
                              <span>{result.awayScore}</span>
                            </div>
                            <span className="text-sm font-medium text-white/80 truncate max-w-[100px] md:max-w-[140px]">
                              {result.awayTeam}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="hidden sm:block text-xs text-white/30 truncate max-w-[120px]">
                            {result.league}
                          </span>
                          <span className="text-xs font-bold text-white/40 bg-white/8 px-2 py-0.5 rounded">
                            {result.status}
                          </span>
                          <Link
                            href={`/on-demand?match=${result.id}`}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[var(--accent)] text-xs font-medium"
                          >
                            <Play className="w-3 h-3 fill-current" /> Replay
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </Reveal>

            {/* CTA Banner */}
            <Reveal>
              <div className="relative rounded-2xl overflow-hidden border border-[var(--accent)]/20 bg-gradient-to-r from-[var(--accent)]/10 via-[var(--accent)]/5 to-transparent p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-[var(--accent)]" />
                      <span className="text-[var(--accent)] text-sm font-semibold uppercase tracking-wider">
                        Pro Access
                      </span>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-1">
                      Never miss a {sport?.label ?? "game"} moment
                    </h3>
                    <p className="text-white/50 text-sm">
                      Unlock all {data.totalEvents} events, 1080p HD, and ad-free viewing from $12/mo.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Link
                      href="/pricing"
                      className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-black font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      Get Pro
                    </Link>
                    <Link
                      href="/live"
                      className="px-5 py-2.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/8 transition-colors"
                    >
                      Watch Free
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>
    </main>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={null}>
      <CategoryPageInner />
    </Suspense>
  );
}
