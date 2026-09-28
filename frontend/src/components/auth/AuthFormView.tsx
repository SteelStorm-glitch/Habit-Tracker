import React, { useState, useMemo } from 'react'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  X,
  Check,
  Loader2,
  Sparkles,
  Flame,
  ShieldCheck,
  Cloud
} from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'
import { useTranslation } from '@/locales'
import { SmoothInput } from '@/components/ui/skiper-ui/skiper106'

interface AuthFormViewProps {
  onSuccess?: () => void
  onClose?: () => void
  isModal?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL ICONS (Official SVGs styled for Black & Purple aesthetic)
// ─────────────────────────────────────────────────────────────────────────────
const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'size-4' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
)

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'size-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const AppleIcon: React.FC<{ className?: string }> = ({ className = 'size-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 0.92-2.84-.9.04-2 .6-2.65 1.34-.56.63-1.05 1.68-.92 2.7 1.01.08 2.03-.45 2.65-1.2" />
  </svg>
)

export const AuthFormView: React.FC<AuthFormViewProps> = ({
  onSuccess,
  onClose,
  isModal = false,
}) => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useHabitStore()
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Password strength calculation (1 to 4 bars)
  const passwordStrength = useMemo(() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 8) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score++
    return Math.min(4, Math.max(1, score))
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!email.trim() || !password.trim()) {
      setErrorMsg(t.auth.errorFillFields)
      return
    }

    if (activeTab === 'signup') {
      if (!agreedToTerms) {
        setErrorMsg(t.auth.errorTermsRequired)
        return
      }
      if (password.length < 6) {
        setErrorMsg(t.auth.errorPasswordLength)
        return
      }
    }

    setIsLoading(true)

    try {
      if (activeTab === 'signup') {
        const res = await registerWithEmail(email.trim(), password, name.trim() || undefined)
        if (res.success) {
          setSuccessMsg(t.auth.successRegister)
          setTimeout(() => {
            if (onSuccess) onSuccess()
          }, 700)
        } else {
          setErrorMsg(res.error || t.auth.errorRegisterFailed)
        }
      } else {
        const res = await loginWithEmail(email.trim(), password)
        if (res.success) {
          setSuccessMsg(t.auth.successLogin)
          setTimeout(() => {
            if (onSuccess) onSuccess()
          }, 700)
        } else {
          setErrorMsg(res.error || t.auth.errorLoginFailed)
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : t.auth.errorGeneric)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)
    setIsLoading(true)
    try {
      const res = await loginWithGoogle()
      if (res.success) {
        setSuccessMsg(t.auth.successGoogle)
        setTimeout(() => {
          if (onSuccess) onSuccess()
        }, 700)
      } else {
        setErrorMsg(res.error || t.auth.errorGoogleAuth)
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : t.auth.errorGoogleAuth)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl sm:rounded-[32px] border border-purple-500/20 bg-[#07050d] text-white shadow-[0_25px_80px_rgba(0,0,0,0.9)] transition-all ${
        isModal ? '' : 'my-4'
      }`}
    >
      {/* Subtle Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-purple-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-indigo-600/20 blur-[120px]" />

      <div className="flex flex-col lg:flex-row min-h-[580px] lg:min-h-[640px]">
        {/* ─────────────────────────────────────────────────────────────────────
            LEFT PANEL: HERO & BRAND (Watermelon auth-08 Style in Black & Violet)
        ────────────────────────────────────────────────────────────────────── */}
        <div className="relative flex w-full flex-col justify-between overflow-hidden p-5 sm:p-8 lg:p-10 lg:w-1/2 bg-[#0b0816] border-b lg:border-b-0 lg:border-r border-white/10">
          {/* Layered Abstract Visual Gradient & Pattern */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1a0f33] via-[#0d091a] to-[#06040c]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(168, 85, 247, 0.35) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Glowing Atmospheric Circles in Hero */}
          <div className="pointer-events-none absolute top-12 left-10 size-64 rounded-full bg-purple-500/25 blur-[90px]" />
          <div className="pointer-events-none absolute bottom-8 right-8 size-72 rounded-full bg-indigo-500/20 blur-[100px]" />

          {/* Decorative Minimalist Graphic Element */}
          <div className="pointer-events-none absolute right-[-40px] top-1/2 -translate-y-1/2 opacity-15 hidden lg:block">
            <svg width="340" height="340" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="url(#ringGrad)" strokeWidth="1.5" strokeDasharray="6 6" />
              <circle cx="100" cy="100" r="55" stroke="url(#ringGrad)" strokeWidth="1" />
              <circle cx="100" cy="100" r="30" fill="url(#ringGrad)" fillOpacity="0.2" />
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Top Header Row: Logo & Back Button */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="size-9 sm:size-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#9333ea] to-[#6366f1] flex items-center justify-center shadow-lg shadow-purple-600/30 border border-purple-400/25">
                <svg className="size-4 sm:size-5" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="heroFlameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 2C9.5 6 7 8.5 7 13a5 5 0 0 0 10 0c0-2-1-4-2-5-.5 2-2 3-3 3 0-3 1.5-6 0-9z"
                    fill="url(#heroFlameGrad)"
                  />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
                HabitSpace
              </span>
            </div>

            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer backdrop-blur-md"
              >
                <ArrowLeft className="size-3.5" />
                <span>{t.auth.back}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                <Sparkles className="size-3 text-purple-400" />
                <span>{t.auth.cloudOs}</span>
              </div>
            )}
          </div>

          {/* Bottom Content: Bold Editorial Typography */}
          <div className="relative z-10 pt-4 sm:pt-10 lg:pt-16 pb-2 sm:pb-6">
            <h1 className="mb-2 sm:mb-4 text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight text-white">
              {t.auth.heroTitle}{' '}
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent block sm:inline">
                {t.auth.heroGradient}
              </span>
            </h1>
            <p className="max-w-md text-xs sm:text-sm lg:text-base text-zinc-300/90 leading-relaxed">
              {t.auth.heroSubtitle}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-3 sm:pt-6">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-[10px] sm:text-xs font-medium text-purple-300">
                <Flame className="size-3 text-purple-400" /> {t.auth.pillsStreaks}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-[10px] sm:text-xs font-medium text-indigo-300">
                <Cloud className="size-3 text-indigo-400" /> {t.auth.pillsSync}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs font-medium text-zinc-300">
                <ShieldCheck className="size-3 text-emerald-400" /> {t.auth.pillsPrivate}
              </span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────
            RIGHT PANEL: AUTH FORM (Watermelon auth-08 Form in Black & Violet)
        ────────────────────────────────────────────────────────────────────── */}
        <div className="relative flex w-full flex-col justify-center p-5 sm:p-8 lg:p-12 lg:w-1/2 bg-[#080611]">
          {/* Close Button on Right Panel */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 size-9 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer z-20 border border-white/10"
              title={t.common.close}
            >
              <X className="size-4" />
            </button>
          )}

          <div className="w-full max-w-md mx-auto">
            {/* Mode Switcher Segmented Control */}
            <div className="p-1 rounded-2xl bg-[#141022] border border-white/10 flex items-center mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin')
                  setErrorMsg(null)
                  setSuccessMsg(null)
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t.auth.loginTab}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup')
                  setErrorMsg(null)
                  setSuccessMsg(null)
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t.auth.registerTab}
              </button>
            </div>

            {/* Social Auth Section */}
            <div className="mb-6">
              <p className="mb-3 text-xs sm:text-sm font-medium text-zinc-400">
                {activeTab === 'signup' ? t.auth.socialRegisterPrompt : t.auth.socialLoginPrompt}
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#130f21] border border-white/10 py-3 text-xs sm:text-sm font-medium text-white transition-all hover:bg-[#1e1732] hover:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50 active:scale-[0.98] cursor-pointer disabled:opacity-60"
                  title={t.auth.continueWithGoogle}
                >
                  <GoogleIcon className="size-4" />
                  <span>{t.auth.google}</span>
                </button>

                {/* Github Button */}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(t.auth.githubUpcoming)
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#130f21] border border-white/10 py-3 text-xs sm:text-sm font-medium text-white transition-all hover:bg-[#1e1732] hover:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50 active:scale-[0.98] cursor-pointer"
                  title="GitHub"
                >
                  <GithubIcon className="size-4" />
                  <span>{t.auth.github}</span>
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(t.auth.appleUpcoming)
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#130f21] border border-white/10 py-3 text-xs sm:text-sm font-medium text-white transition-all hover:bg-[#1e1732] hover:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50 active:scale-[0.98] cursor-pointer"
                  title="Apple"
                >
                  <AppleIcon className="size-4" />
                  <span>{t.auth.apple}</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-6 flex items-center">
              <div className="grow border-t border-white/10"></div>
              <span className="px-3.5 text-xs text-zinc-500 font-medium">{t.auth.orDivider}</span>
              <div className="grow border-t border-white/10"></div>
            </div>

            {/* Feedback Notifications */}
            {errorMsg && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                <span className="text-base leading-none">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Username Field (Sign Up Only) */}
              {activeTab === 'signup' && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="auth-username" className="text-xs sm:text-sm font-medium text-zinc-300">
                    {t.auth.usernameLabel}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500 z-10">
                      <User className="size-4" />
                    </div>
                    <SmoothInput
                      id="auth-username"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={t.auth.usernamePlaceholder}
                      className="w-full rounded-xl border border-white/10 bg-[#120e20] py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-purple-500 focus:bg-[#18122c] focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-email" className="text-xs sm:text-sm font-medium text-zinc-300">
                  {t.auth.emailLabel}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500 z-10">
                    <Mail className="size-4" />
                  </div>
                  <SmoothInput
                    id="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t.auth.emailPlaceholder}
                    className="w-full rounded-xl border border-white/10 bg-[#120e20] py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-purple-500 focus:bg-[#18122c] focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="auth-password" className="text-xs sm:text-sm font-medium text-zinc-300">
                    {t.auth.passwordLabel}
                  </label>
                  {activeTab === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert(t.auth.forgotPasswordAlert)}
                      className="text-xs text-purple-400 hover:text-purple-300 hover:underline"
                    >
                      {t.auth.forgotPassword}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500 z-10">
                    <Lock className="size-4" />
                  </div>
                  <SmoothInput
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={t.auth.passwordPlaceholder}
                    className="w-full rounded-xl border border-white/10 bg-[#120e20] py-3 pl-10 pr-11 text-sm text-white placeholder:text-zinc-500 focus:border-purple-500 focus:bg-[#18122c] focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer z-10"
                    aria-label={t.auth.togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {/* Password strength & validation for registration */}
                {activeTab === 'signup' ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4].map(idx => (
                        <div
                          key={idx}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            idx <= passwordStrength
                              ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)]'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      {t.auth.passwordHint}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Agreement checkbox (Sign Up only) */}
              {activeTab === 'signup' && (
                <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                  <div
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={`size-4 rounded-md border flex items-center justify-center transition-all ${
                      agreedToTerms
                        ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                        : 'border-white/20 bg-[#141022]'
                    }`}
                  >
                    {agreedToTerms && <Check className="size-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-zinc-300">
                    {t.auth.termsAgree}{' '}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        alert(t.auth.termsAlert)
                      }}
                      className="font-medium text-purple-400 hover:underline"
                    >
                      {t.auth.termsLink}
                    </button>
                  </span>
                </label>
              )}

              {/* Primary Submit Button: Black & Violet Accent */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(147,51,234,0.4)] transition-all hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_35px_rgba(147,51,234,0.6)] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>{t.auth.syncingWithCloud}</span>
                  </>
                ) : (
                  <span>{activeTab === 'signup' ? t.auth.submitRegister : t.auth.submitLogin}</span>
                )}
              </button>
            </form>

            {/* Footer Terms */}
            <div className="mt-5 text-[11px] sm:text-xs leading-relaxed text-zinc-400 text-center sm:text-left">
              {t.auth.footerTerms}
            </div>

            {/* Bottom Login / Register Switcher Link */}
            <div className="mt-6 text-center text-xs sm:text-sm text-zinc-400">
              {activeTab === 'signup' ? (
                <>
                  {t.auth.alreadyHaveAccount}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin')
                      setErrorMsg(null)
                      setSuccessMsg(null)
                    }}
                    className="font-semibold text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                  >
                    {t.auth.switchToLogin}
                  </button>
                </>
              ) : (
                <>
                  {t.auth.dontHaveAccount}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup')
                      setErrorMsg(null)
                      setSuccessMsg(null)
                    }}
                    className="font-semibold text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                  >
                    {t.auth.switchToRegister}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
