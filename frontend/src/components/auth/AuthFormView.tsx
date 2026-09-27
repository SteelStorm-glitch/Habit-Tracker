import React, { useState, useMemo } from 'react'
import { User, Mail, Lock, Check, Loader2 } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'

interface AuthFormViewProps {
  onSuccess?: () => void
  isModal?: boolean
}

export const AuthFormView: React.FC<AuthFormViewProps> = ({ onSuccess, isModal = false }) => {
  const {
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle
  } = useHabitStore()

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Password strength calculation (0 to 4 bars)
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
      setErrorMsg('Пожалуйста, заполните email и пароль.')
      return
    }

    if (activeTab === 'signup') {
      if (!agreedToTerms) {
        setErrorMsg('Необходимо согласиться с условиями использования.')
        return
      }
      if (password.length < 6) {
        setErrorMsg('Пароль должен содержать минимум 6 символов.')
        return
      }
    }

    setIsLoading(true)

    try {
      if (activeTab === 'signup') {
        const res = await registerWithEmail(email.trim(), password, name.trim() || undefined)
        if (res.success) {
          setSuccessMsg('Аккаунт успешно создан! Стрик и облачная база подключены.')
          setTimeout(() => {
            if (onSuccess) onSuccess()
          }, 800)
        } else {
          setErrorMsg(res.error || 'Не удалось зарегистрироваться.')
        }
      } else {
        const res = await loginWithEmail(email.trim(), password)
        if (res.success) {
          setSuccessMsg('С возвращением! Данные загружены из облака.')
          setTimeout(() => {
            if (onSuccess) onSuccess()
          }, 800)
        } else {
          setErrorMsg(res.error || 'Не удалось войти в аккаунт.')
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Произошла непредвиденная ошибка.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setErrorMsg(null)
    setIsLoading(true)
    try {
      const res = await loginWithGoogle()
      if (res.success) {
        setSuccessMsg('Вход через Google успешно выполнен!')
        setTimeout(() => {
          if (onSuccess) onSuccess()
        }, 800)
      } else {
        setErrorMsg(res.error || 'Ошибка входа через Google.')
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Не удалось авторизоваться через Google.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`relative w-full rounded-[36px] bg-[#0c0919]/95 backdrop-blur-3xl border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.85)] p-6 sm:p-8 md:p-12 overflow-hidden ${isModal ? '' : 'my-4'}`}>
      {/* Subtle Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />

      {/* Grid: Left Hero (Desktop) + Right Glass Form (Desktop & Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ─────────────────────────────────────────────────────────────
            LEFT HERO COLUMN (Identical to uploaded Desktop mockup)
        ────────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full py-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-3.5 mb-2 lg:mb-16">
            <div className="size-11 rounded-2xl bg-gradient-to-br from-[#8a42f5] to-[#5820c7] flex items-center justify-center shadow-lg shadow-purple-600/30 border border-purple-400/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="flameGradInline" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffb347" />
                    <stop offset="100%" stopColor="#ff5f6d" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2C9.5 6 7 8.5 7 13a5 5 0 0 0 10 0c0-2-1-4-2-5-.5 2-2 3-3 3 0-3 1.5-6 0-9z"
                  fill="url(#flameGradInline)"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              HabitSpace
            </span>
          </div>

          {/* Bold Typography (Desktop Only - per uploaded mobile mockup) */}
          <div className="hidden lg:block space-y-5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Привычки строятся<br />день за днём .
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md">
              Отмечайте выполнение одним кликом, следите за стриком и прокачивайте уровень вместе с тысячами пользователей.
            </p>
          </div>

          {/* Decorative Badges */}
          <div className="hidden lg:flex items-center gap-3 mt-12 pt-4 border-t border-white/5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300">
              ⚡ Облачный стрик
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300">
              🔥 База Firebase
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT GLASS FORM CARD (Matches both Desktop & Mobile designs)
        ────────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 w-full">
          <div className="rounded-[28px] sm:rounded-[32px] bg-[#161226]/85 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-2xl relative">
            {/* Segmented Toggle: Вход / Регистрация */}
            <div className="p-1 rounded-2xl bg-[#1c1830] flex items-center gap-1 mb-6 border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin')
                  setErrorMsg(null)
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-[#a855f7] text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup')
                  setErrorMsg(null)
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-[#a855f7] text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Регистрация
              </button>
            </div>

            {/* Form Title & Subtitle */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {activeTab === 'signup' ? 'Создать аккаунт' : 'Вход в аккаунт'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {activeTab === 'signup'
                  ? 'Начните стрик уже сегодня — это бесплатно'
                  : 'С возвращением! Продолжите свой стрик'}
              </p>
            </div>

            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm animate-in fade-in">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm animate-in fade-in">
                {successMsg}
              </div>
            )}

            {/* Form Elements */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Only on Registration) */}
              {activeTab === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Имя</label>
                  <div className="h-12 rounded-2xl bg-[#1c1731] border border-white/10 px-3.5 flex items-center gap-3 focus-within:border-purple-500/80 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
                    <User className="size-4 text-purple-400/80 shrink-0" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Артём"
                      className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Email</label>
                <div className="h-12 rounded-2xl bg-[#1c1731] border border-white/10 px-3.5 flex items-center gap-3 focus-within:border-purple-500/80 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
                  <Mail className="size-4 text-purple-400/80 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="artyom@mail.ru"
                    className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-400">Пароль</label>
                  {activeTab === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert('Для сброса пароля воспользуйтесь входом через Google или обратитесь в службу поддержки.')}
                      className="text-[11px] text-purple-400 hover:underline"
                    >
                      Забыли пароль?
                    </button>
                  )}
                </div>
                <div className="h-12 rounded-2xl bg-[#1c1731] border border-white/10 px-3.5 flex items-center gap-3 focus-within:border-purple-500/80 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
                  <Lock className="size-4 text-amber-400 shrink-0" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Минимум 8 символов"
                    className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                {/* Password Strength Indicator Bar (on Registration) */}
                {activeTab === 'signup' && (
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4].map(idx => (
                      <div
                        key={idx}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          idx <= passwordStrength
                            ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Terms Checkbox (on Registration) */}
              {activeTab === 'signup' && (
                <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                  <div
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={`size-4 rounded-md border flex items-center justify-center transition-all ${
                      agreedToTerms
                        ? 'bg-[#a855f7] border-[#a855f7] text-white shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                        : 'border-white/20 bg-[#1c1731]'
                    }`}
                  >
                    {agreedToTerms && <Check className="size-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-zinc-300">
                    Согласен с{' '}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        alert('Пользовательское соглашение: сервис HabitSpace обеспечивает защиту и конфиденциальность ваших персональных данных.')
                      }}
                      className="font-semibold text-purple-400 hover:underline inline"
                    >
                      условиями
                    </button>
                  </span>
                </label>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 rounded-2xl bg-[#a855f7] hover:bg-[#b56ef8] active:scale-[0.98] text-white font-semibold text-sm shadow-[0_6px_25px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Синхронизация с Firebase...</span>
                  </>
                ) : (
                  <span>{activeTab === 'signup' ? 'Создать аккаунт' : 'Войти'}</span>
                )}
              </button>
            </form>

            {/* Divider: "или" */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#161226] px-3 text-zinc-500 font-medium">или</span>
              </div>
            </div>

            {/* Social Auth Buttons (Apple & Google) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Apple Button */}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('Вход через Apple ID поддерживается на iOS устройствах.')
                }}
                className="h-12 rounded-2xl bg-[#221c38] hover:bg-[#2c2448] border border-white/5 flex items-center justify-center gap-2 text-white text-sm font-medium transition-all cursor-pointer active:scale-95"
              >
                <span className="text-base">🍎</span>
                <span>Apple</span>
              </button>

              {/* Google Button (Wired to Firebase Google Auth) */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="h-12 rounded-2xl bg-[#221c38] hover:bg-[#2c2448] border border-white/5 flex items-center justify-center gap-2 text-white text-sm font-medium transition-all cursor-pointer active:scale-95 disabled:opacity-60"
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
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
                <span>Google</span>
              </button>
            </div>

            {/* Footer Switch Link */}
            <div className="mt-6 text-center text-xs text-zinc-400">
              {activeTab === 'signup' ? (
                <>
                  Уже есть аккаунт?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin')
                      setErrorMsg(null)
                    }}
                    className="font-bold text-white hover:text-purple-400 hover:underline transition-colors"
                  >
                    Войти
                  </button>
                </>
              ) : (
                <>
                  Нет аккаунта?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup')
                      setErrorMsg(null)
                    }}
                    className="font-bold text-white hover:text-purple-400 hover:underline transition-colors"
                  >
                    Зарегистрироваться
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
