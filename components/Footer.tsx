"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { navLinks, BRAND } from "@/lib/data";
import { MessageCircle as Twitter, Code2 as Github, Briefcase as Linkedin, Mail } from 'lucide-react';
import { Reveal } from "@/components/Reveal";

const footerSections = [
  {
    titleKey: "footer.watchTitle",
    links: [
      { label: "Live Sports", href: "/live", key: "live" },
      { label: "On Demand", href: "/on-demand", key: "onDemand" },
      { label: "Schedule", href: "/schedule", key: "schedule" },
      { label: "Sports Categories", href: "/sports-category", key: "sports" },
    ],
  },
  {
    titleKey: "footer.accountTitle",
    links: [
      { label: "Sign In", href: "/sign-in-sign-up", key: "signIn" },
      { label: "Create Account", href: "/sign-in-sign-up", key: "createAccount" },
      { label: "Pricing", href: "/pricing", key: "pricing" },
      { label: "My Profile", href: "/profile", key: "profile" },
    ],
  },
  {
    titleKey: "footer.companyTitle",
    links: [
      { label: "About Us", href: "/about", key: "about" },
      { label: "Careers", href: "/careers", key: "careers" },
      { label: "Press", href: "/press", key: "press" },
      { label: "Contact", href: "/contact", key: "contact" },
    ],
  },
];

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@arenastream.tv", label: "Email" },
];

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;
  const footerT = t.raw("footer") as Record<string, string>;

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

  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] mt-auto">
      {/* CTA Banner */}
      <Reveal>
        <div className="border-b border-[var(--border-subtle)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="text-2xl font-bold text-[var(--text-primary)] tracking-tight"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              >
                {footerT["ctaTitle"] ?? "Ready to watch every match?"}
              </h3>
              <p className="text-[var(--text-secondary)] mt-1 text-sm">
                {footerT["ctaSubtitle"] ?? "Start your free trial today. No credit card required."}
              </p>
            </div>
            <Link
              href="/sign-in-sign-up"
              className="flex-shrink-0 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-xl transition-all duration-200 accent-glow hover:scale-105 text-sm"
            >
              {footerT["ctaButton"] ?? "Get Started Free"}
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Main Footer Grid */}
      <Reveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 group w-fit">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <polygon points="3,2 13,8 3,14" fill="white" />
                  </svg>
                </div>
                <span
                  className="font-bold text-xl tracking-tight text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800 }}
                >
                  {BRAND.name}
                </span>
              </Link>
              <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
                {footerT["brandDesc"] ?? "The ultimate sports streaming platform. Watch live matches, replays, and highlights from every major league and tournament worldwide."}
              </p>
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-colors duration-200"
                  >
                    <social.icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {footerSections.map((section) => (
              <div key={section.titleKey}>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">
                  {footerT[section.titleKey.replace("footer.", "")] ?? section.titleKey}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={getHref(link.href)}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 flex items-center gap-1.5 group"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-[var(--accent)] transition-all duration-200 rounded-full" />
                        {navT[link.key] ?? link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            {footerT["copyright"] ?? `© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}