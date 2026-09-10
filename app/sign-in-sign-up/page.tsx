"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { BRAND } from "@/lib/data";
import { fadeInUp, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PERKS = [
  "Live streams for 50+ sports leagues",
  "4K Ultra HD on Elite plan",
  "Watch on any device, anywhere",
  "Cancel anytime, no hidden fees",
];

type AuthMode = "signin" | "signup";

export default function SignInSignUpPage() {
  const t = useTranslations();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (mode === "signup" && !form.name.trim()) next.name = t("auth.errors.nameRequired");
    if (!form.email.trim()) next.email = t("auth.errors.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = t("auth.errors.emailInvalid");
    if (!form.password) next.password = t("auth.errors.passwordRequired");
    else if (form.password.length < 8) next.password = t("auth.errors.passwordShort");
    if (mode === "signup") {
      if (!form.confirm) next.confirm = t("auth.errors.confirmRequired");
      else if (form.confirm !== form.password) next.confirm = t("auth.errors.confirmMismatch");
      if (!agreed) next.agreed = t("auth.errors.agreeRequired");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  }

  function handleField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] px-4">
        <Reveal>
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="text-center max-w-md mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-[var(--accent)]/15 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-[var(--accent)]" />
            </div>
            <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-3">
              {mode === "signup" ? t("auth.success.signupTitle") : t("auth.success.signinTitle")}
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] mb-8">
              {mode === "signup" ? t("auth.success.signupBody") : t("auth.success.signinBody")}
            </p>
            <Link
              href="/live"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-black font-semibold hover:opacity-90 transition-opacity"
            >
              {t("auth.success.cta")} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </Reveal>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--background))]">
        {/* Decorative glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[var(--accent)]/5 blur-3xl pointer-events-none" />

        <Reveal>
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-16">
              <span className="text-2xl font-black tracking-tight text-[hsl(var(--foreground))]">
                {BRAND.name}
              </span>
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            </Link>

            <h1 className="text-4xl xl:text-5xl font-black text-[hsl(var(--foreground))] leading-tight tracking-tight text-balance mb-6">
              {t("auth.panel.headline")}
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-lg leading-relaxed mb-10 text-pretty">
              {t("auth.panel.subheadline")}
            </p>

            <ul className="space-y-4">
              {(Array.isArray(t.raw("auth.panel.perks")) ? t.raw("auth.panel.perks") : PERKS) as string[]}
              {PERKS.map((perk, i) => (
                <motion.li
                  key={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-3 text-[hsl(var(--foreground))]"
                >
                  <span className="w-6 h-6 rounded-full bg-[var(--accent)]/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" />
                  </span>
                  <span className="text-sm font-medium">{perk}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="relative z-10 border border-[hsl(var(--border))] rounded-2xl p-5 bg-[hsl(var(--card))]/60 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/images/sports-fan-avatar.jpg"
                alt="Testimonial"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--accent)]/30"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Jordan+M&background=random";
                }}
              />
              <div>
                <p className="text-sm font-semibold text-[hsl(var(--foreground))]">Jordan M.</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{t("auth.testimonial.role")}</p>
              </div>
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed italic">
              {t("auth.testimonial.quote")}
            </p>
          </div>
        </Reveal>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Reveal>
            {/* Mode toggle */}
            <div className="flex rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 mb-8">
              {(["signin", "signup"] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setErrors({}); setForm({ name: "", email: "", password: "", confirm: "" }); }}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                    mode === m
                      ? "bg-[var(--accent)] text-black shadow-sm"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  {m === "signin" ? t("auth.tabs.signin") : t("auth.tabs.signup")}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mb-8">
              <h1 className="text-2xl font-black text-[hsl(var(--foreground))] tracking-tight mb-1">
                {mode === "signin" ? t("auth.signin.heading") : t("auth.signup.heading")}
              </h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {mode === "signin" ? t("auth.signin.subheading") : t("auth.signup.subheading")}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name field (signup only) */}
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1.5">
                    {t("auth.fields.name")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleField("name", e.target.value)}
                      placeholder={t("auth.placeholders.name")}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 rounded-xl border bg-[hsl(var(--card))] text-[hsl(var(--foreground))] text-sm placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--accent)]/40",
                        errors.name ? "border-red-500" : "border-[hsl(var(--border))] focus:border-[var(--accent)]"
                      )}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1.5">
                  {t("auth.fields.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleField("email", e.target.value)}
                    placeholder={t("auth.placeholders.email")}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-xl border bg-[hsl(var(--card))] text-[hsl(var(--foreground))] text-sm placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--accent)]/40",
                      errors.email ? "border-red-500" : "border-[hsl(var(--border))] focus:border-[var(--accent)]"
                    )}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1.5">
                  {t("auth.fields.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleField("password", e.target.value)}
                    placeholder={t("auth.placeholders.password")}
                    className={cn(
                      "w-full pl-10 pr-11 py-3 rounded-xl border bg-[hsl(var(--card))] text-[hsl(var(--foreground))] text-sm placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--accent)]/40",
                      errors.password ? "border-red-500" : "border-[hsl(var(--border))] focus:border-[var(--accent)]"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm password (signup only) */}
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1.5">
                    {t("auth.fields.confirm")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirm}
                      onChange={(e) => handleField("confirm", e.target.value)}
                      placeholder={t("auth.placeholders.confirm")}
                      className={cn(
                        "w-full pl-10 pr-11 py-3 rounded-xl border bg-[hsl(var(--card))] text-[hsl(var(--foreground))] text-sm placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--accent)]/40",
                        errors.confirm ? "border-red-500" : "border-[hsl(var(--border))] focus:border-[var(--accent)]"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
                </div>
              )}

              {/* Forgot password (signin only) */}
              {mode === "signin" && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-[var(--accent)] hover:underline font-medium">
                    {t("auth.signin.forgot")}
                  </button>
                </div>
              )}

              {/* Terms (signup only) */}
              {mode === "signup" && (
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => { setAgreed((v) => !v); setErrors((prev) => ({ ...prev, agreed: "" })); }}
                      className={cn(
                        "mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200",
                        agreed
                          ? "bg-[var(--accent)] border-[var(--accent)]"
                          : "border-[hsl(var(--border))] bg-transparent"
                      )}
                    >
                      {agreed && <Check className="w-3 h-3 text-black" />}
                    </button>
                    <span className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                      {t("auth.signup.termsPrefix")}{" "}
                      <span className="text-[var(--accent)] hover:underline cursor-pointer font-medium">
                        {t("auth.signup.termsLink")}
                      </span>{" "}
                      {t("auth.signup.termsAnd")}{" "}
                      <span className="text-[var(--accent)] hover:underline cursor-pointer font-medium">
                        {t("auth.signup.privacyLink")}
                      </span>
                    </span>
                  </label>
                  {errors.agreed && <p className="mt-1 text-xs text-red-500">{errors.agreed}</p>}
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-black font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-2"
              >
                {mode === "signin" ? t("auth.signin.submit") : t("auth.signup.submit")}
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-[hsl(var(--border))]" />
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{t("auth.divider")}</span>
                <div className="flex-1 h-px bg-[hsl(var(--border))]" />
              </div>

              {/* Demo continue */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSubmitted(true)}
                className="w-full py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] font-semibold text-sm hover:border-[var(--accent)]/40 transition-all duration-200"
              >
                {t("auth.demoButton")}
              </motion.button>
            </form>
          </Reveal>

          {/* Switch mode */}
          <Reveal delay={0.15}>
            <p className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
              {mode === "signin" ? t("auth.signin.switchPrompt") : t("auth.signup.switchPrompt")}{" "}
              <button
                onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErrors({}); }}
                className="text-[var(--accent)] font-semibold hover:underline"
              >
                {mode === "signin" ? t("auth.signin.switchLink") : t("auth.signup.switchLink")}
              </button>
            </p>
          </Reveal>

          {/* Trust badges */}
          <Reveal delay={0.2}>
            <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
              {(Array.isArray(t.raw("auth.trust")) ? t.raw("auth.trust") : []) as { icon: string; label: string }[]}
              {[
                { icon: "🔒", label: t("auth.trustBadges.secure") },
                { icon: "🚫", label: t("auth.trustBadges.noSpam") },
                { icon: "↩️", label: t("auth.trustBadges.cancel") },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}