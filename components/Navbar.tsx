"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { navLinks, BRAND } from "@/lib/data";
import { Menu, X, User, Search } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (href.startsWith("#")) {
      if (pathname === "/") {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  function getHref(href: string) {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--bg-base)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center accent-glow group-hover:scale-105 transition-transform duration-200">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <polygon points="3,2 13,8 3,14" fill="white" />
                </svg>
              </div>
              <span
                className="font-['var(--font-barlow)',_sans-serif] font-800 text-xl tracking-tight text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800 }}
              >
                {BRAND.name}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={getHref(link.href)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive(link.href)
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  {link.key === "live" && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-green)] live-dot" />
                      <span className="relative z-10">{navT[link.key] ?? link.label}</span>
                    </span>
                  )}
                  {link.key !== "live" && (
                    <span className="relative z-10">{navT[link.key] ?? link.label}</span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                aria-label="Search"
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-all duration-200"
              >
                <Search size={18} />
              </button>
              <Link
                href="/sign-in-sign-up"
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
              >
                {navT["signIn"] ?? "Sign In"}
              </Link>
              <Link
                href="/sign-in-sign-up"
                className="px-4 py-2 text-sm font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg transition-all duration-200 accent-glow hover:scale-105"
              >
                {navT["startWatching"] ?? "Start Watching"}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-all duration-200"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 z-40 bg-[var(--bg-base)]/95 backdrop-blur-xl border-b border-[var(--border-subtle)] lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <Link
                    href={getHref(link.href)}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? "bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]"
                    }`}
                  >
                    {link.key === "live" && (
                      <span className="w-2 h-2 rounded-full bg-[var(--live-green)] live-dot flex-shrink-0" />
                    )}
                    {navT[link.key] ?? link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
                <Link
                  href="/sign-in-sign-up"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--glass-border)] transition-all duration-200"
                >
                  <User size={16} />
                  {navT["signIn"] ?? "Sign In"}
                </Link>
                <Link
                  href="/sign-in-sign-up"
                  className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-all duration-200"
                >
                  {navT["startWatching"] ?? "Start Watching"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}