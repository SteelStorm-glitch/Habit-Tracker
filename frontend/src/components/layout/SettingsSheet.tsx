import React, { useRef, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { 
  Cloud, 
  Download, 
  Upload, 
  Trash2, 
  Share2, 
  Terminal, 
  HelpCircle, 
  Lock, 
  Unlock, 
  Flame, 
  Zap, 
  Bot,
  LogOut,
  User as UserIcon
} from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'
import { useTranslation } from '@/locales'

export const SettingsSheet: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    prefs,
    updatePrefs,
    clearAllData,
    exportBackup,
    importBackup,
    currentUser,
    setIsAuthModalOpen,
    logoutUser,
    isDevModeUnlocked,
    setIsDevPasscodeModalOpen,
    lockDevMode,
    setActiveTab,
    setIsTourOpen,
    setTourStep,
    gamification,
    setIsAiDrawerOpen,
    syncCloudData,
    lastSyncTime
  } = useHabitStore()

  const [isSyncing, setIsSyncing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        const ok = importBackup(content)
        if (ok) {
          alert('Бэкап успешно загружен!')
        } else {
          alert('Ошибка при чтении файла бэкапа')
        }
      }
    }
    reader.readAsText(file)
  }

  const handleClear = () => {
    if (confirm('Вы уверены, что хотите удалить ВСЕ данные без возможности восстановления?')) {
      clearAllData()
      alert('Хранилище очищено.')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Habit Tracker',
          text: 'Мой личный трекер привычек, задач и финансов в стиле Glassmorphism.',
          url: window.location.href
        })
      } catch {}
    } else {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(window.location.href)
          alert('Ссылка скопирована в буфер обмена!')
        } else {
          prompt('Скопируйте ссылку на трекер:', window.location.href)
        }
      } catch {
        prompt('Скопируйте ссылку на трекер:', window.location.href)
      }
    }
  }

  const handleOpenProfile = () => {
    setIsSettingsOpen(false)
    setActiveTab('profile')
  }

  const handleOpenDevMode = () => {
    setIsSettingsOpen(false)
    if (isDevModeUnlocked) {
      setActiveTab('developer')
    } else {
      setIsDevPasscodeModalOpen(true)
    }
  }

  const handleStartTour = () => {
    setIsSettingsOpen(false)
    setTourStep(0)
    setIsTourOpen(true)
  }

  const { t, isRu } = useTranslation()

  const xpNeeded = gamification ? gamification.level * 150 : 150
  const xpCurrent = gamification ? gamification.xp % xpNeeded : 0
  const xpProgress = (xpCurrent / xpNeeded) * 100

  return (
    <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#0e0f14]/90 backdrop-blur-2xl border-l border-white/10 text-neutral-100 p-0 flex flex-col h-full overflow-hidden shadow-2xl"
      >
        <SheetHeader className="px-6 py-4 border-b border-white/10 flex flex-row items-center justify-between bg-white/[0.02]">
          <SheetTitle className="text-lg font-semibold text-white tracking-tight">
            {t.settings.title}
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 select-none">
          {/* User Profile Card */}
          <div className="p-4 rounded-2xl glass-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-indigo-600/80 border border-indigo-500/40 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-600/30">
                {currentUser?.displayName ? (
                  currentUser.displayName.slice(0, 2).toUpperCase()
                ) : (
                  <UserIcon className="size-5 text-white/80" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="font-semibold text-sm text-white">
                  {currentUser ? (currentUser.displayName || currentUser.email) : t.common.guestMode}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <Cloud className="size-3.5" />
                  <span>{currentUser ? t.profile.cloudBadge('habit-b2d0a') : t.common.guestNotice}</span>
                </div>
              </div>
            </div>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleOpenProfile}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-200 border border-white/10 transition-all cursor-pointer active:scale-95"
                >
                  {t.settings.profileBtn}
                </button>
                <button
                  onClick={() => {
                    logoutUser()
                    alert(isRu ? 'Вы вышли из аккаунта.' : 'You have logged out.')
                  }}
                  className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                  title={t.settings.logoutBtn}
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setIsSettingsOpen(false)
                  setIsAuthModalOpen(true)
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-purple-600/30 transition-all cursor-pointer active:scale-95"
              >
                {t.settings.loginBtn}
              </button>
            )}
          </div>

          {/* Gamification Stats Card */}
          {gamification && (
            <div className="p-4 rounded-2xl glass-card space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
                  <Zap className="size-3.5" />
                  <span>{t.settings.gamificationHeader}</span>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-300">
                  {t.settings.levelBadge(gamification.level)}
                </span>
              </div>

              {/* Streak and Level Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                    <Flame className="size-4 animate-streak-fire" />
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400">{t.settings.streakTitle}</div>
                    <div className="text-sm font-bold text-white font-mono">{t.settings.streakDays(gamification.streakDays)}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400">{t.settings.totalXpTitle}</div>
                    <div className="text-sm font-bold text-white font-mono">{t.settings.totalXp(gamification.xp)}</div>
                  </div>
                </div>
              </div>

              {/* Progress to next level */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                  <span>{t.settings.toNextLevel(gamification.level + 1)}</span>
                  <span>{xpCurrent} / {xpNeeded} XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Settings Quick Glance */}
          <div className="p-4 rounded-2xl glass-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
                <Bot className="size-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{t.settings.aiHeader}</div>
                <div className="text-[11px] text-neutral-400">
                  Google Gemini (Gemini 3.5 Flash-Lite)
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSettingsOpen(false)
                setIsAiDrawerOpen(true)
              }}
              className="px-2.5 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium border border-purple-500/25 transition-all cursor-pointer active:scale-95"
            >
              Открыть чат
            </button>
          </div>

          {/* Section: РЕЖИМ РАЗРАБОТЧИКА */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
              <Terminal className="size-3.5" />
              <span>{t.settings.devConsoleHeader}</span>
            </div>

            <div className="p-4 rounded-2xl glass-card border-amber-500/20 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-neutral-200">{t.settings.devModeTitle}</div>
                <div className="text-xs text-neutral-400">
                  {isDevModeUnlocked ? t.settings.devModeActiveDesc : t.settings.devModeDesc}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isDevModeUnlocked && (
                  <button
                    onClick={() => lockDevMode()}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                    title={t.settings.lockConsoleTooltip}
                  >
                    <Lock className="size-4" />
                  </button>
                )}
                <button
                  id="btnSettingsOpenDev"
                  onClick={handleOpenDevMode}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  {isDevModeUnlocked ? <Unlock className="size-3.5" /> : <Terminal className="size-3.5" />}
                  <span>{isDevModeUnlocked ? t.settings.devModeUnlocked : t.settings.devModeLocked}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section: ИНТЕРФЕЙС */}
          <div className="space-y-3">
            <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">{t.settings.interfaceHeader}</div>

            {/* Плавные анимации */}
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-sm font-medium text-neutral-200">{t.settings.animationsTitle}</div>
                <div className="text-xs text-neutral-400">{t.settings.animationsDesc}</div>
              </div>
              <Switch
                checked={prefs.animationsEnabled !== false}
                onCheckedChange={(checked) => updatePrefs({ animationsEnabled: checked })}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>

            {/* Язык */}
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-sm font-medium text-neutral-200">{t.settings.languageTitle}</div>
                <div className="text-xs text-neutral-400">{t.settings.languageDesc}</div>
              </div>
              <div className="flex items-center glass-card p-1 rounded-xl">
                <button
                  onClick={() => updatePrefs({ lang: 'ru' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    prefs.lang === 'ru' ? 'bg-white/10 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  RU
                </button>
                <button
                  onClick={() => updatePrefs({ lang: 'en' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    prefs.lang === 'en' ? 'bg-white/10 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Тема */}
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-sm font-medium text-neutral-200">{t.settings.themeTitle}</div>
                <div className="text-xs text-neutral-400">{t.settings.themeDesc}</div>
              </div>
              <div className="flex items-center glass-card p-1 rounded-xl">
                <button
                  onClick={() => updatePrefs({ theme: 'dark' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    prefs.theme === 'dark' ? 'bg-white/10 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Glass Dark
                </button>
                <button
                  onClick={() => updatePrefs({ theme: 'light' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    prefs.theme === 'light' ? 'bg-white/10 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Light
                </button>
              </div>
            </div>

            {/* Плотность таблицы */}
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-sm font-medium text-neutral-200">{t.settings.densityTitle}</div>
                <div className="text-xs text-neutral-400">{t.settings.densityDesc}</div>
              </div>
              <div className="flex items-center glass-card p-1 rounded-xl">
                <button
                  onClick={() => updatePrefs({ tableDensity: 'normal' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    prefs.tableDensity === 'normal' ? 'bg-white/10 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {t.settings.densityNormal}
                </button>
                <button
                  onClick={() => updatePrefs({ tableDensity: 'dense' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    prefs.tableDensity === 'dense' ? 'bg-white/10 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {t.settings.densityDense}
                </button>
              </div>
            </div>
          </div>

          {/* Section: УВЕДОМЛЕНИЯ */}
          <div className="space-y-3 pt-2">
            <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">{t.settings.notificationsHeader}</div>

            {/* Напоминания */}
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-sm font-medium text-neutral-200">{t.settings.remindersTitle}</div>
                <div className="text-xs text-neutral-400">{t.settings.remindersDesc}</div>
              </div>
              <Switch
                checked={prefs.reminderEnabled}
                onCheckedChange={(checked) => updatePrefs({ reminderEnabled: checked })}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>

            {/* Итоги недели */}
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-sm font-medium text-neutral-200">{t.settings.weeklySummaryTitle}</div>
                <div className="text-xs text-neutral-400">{t.settings.weeklySummaryDesc}</div>
              </div>
              <Switch
                checked={prefs.weeklySummaryEnabled}
                onCheckedChange={(checked) => updatePrefs({ weeklySummaryEnabled: checked })}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          </div>

          {/* Section: ДАННЫЕ */}
          <div className="space-y-3 pt-2">
            <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">{t.settings.dataHeader}</div>

            {/* Cloud Sync Status */}
            {currentUser && (
              <div className="p-3.5 rounded-2xl glass-card border-indigo-500/20 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[210px]">
                  <div className="text-sm font-medium text-neutral-200 flex items-center gap-1.5">
                    <Cloud className="size-4 text-indigo-400" />
                    <span>{t.settings.cloudCardTitle('habit-b2d0a')}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 leading-tight">
                    {lastSyncTime ? t.settings.cloudSyncedAt(lastSyncTime) : t.settings.cloudAllBound}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    setIsSyncing(true)
                    await syncCloudData('push')
                    setTimeout(() => setIsSyncing(false), 500)
                  }}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 text-xs font-semibold cursor-pointer px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 transition-all active:scale-95"
                >
                  <Cloud className={`size-3.5 ${isSyncing ? 'animate-pulse text-indigo-400' : ''}`} />
                  <span>{isSyncing ? t.settings.syncingBtn : t.settings.syncNowBtn}</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <Button
                variant="outline"
                onClick={exportBackup}
                className="h-10 glass-button text-xs font-medium text-neutral-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="size-3.5" />
                <span>{t.settings.exportBackupBtn}</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 glass-button text-xs font-medium text-neutral-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="size-3.5" />
                <span>{t.settings.importBackupBtn}</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Очистить хранилище */}
            <div className="p-4 rounded-2xl glass-card border-rose-500/20 flex items-center justify-between">
              <div className="space-y-0.5 max-w-[210px]">
                <div className="text-sm font-medium text-neutral-200">{t.settings.clearStorageTitle}</div>
                <div className="text-[11px] text-neutral-400 leading-tight">
                  {t.settings.clearStorageDesc}
                </div>
              </div>
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-xs font-medium cursor-pointer transition-colors p-1 active:scale-95"
              >
                <Trash2 className="size-3.5" />
                <span>{t.settings.clearStorageBtn}</span>
              </button>
            </div>
          </div>

          {/* Section: ПОМОЩЬ */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">{t.settings.helpHeader}</div>
              <button
                onClick={handleStartTour}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="size-3.5" />
                <span>{t.settings.startTourBtn}</span>
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 glass-card divide-y divide-white/5 overflow-hidden">
              <Accordion type="single" collapsible className="w-full border-none">
                <AccordionItem value="item-1" className="border-none px-4">
                  <AccordionTrigger className="text-xs font-medium text-neutral-200 py-3 hover:no-underline">
                    {t.settings.faqXpTitle}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-neutral-400 pb-3 leading-relaxed">
                    {t.settings.faqXpDesc}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-t border-white/5 px-4">
                  <AccordionTrigger className="text-xs font-medium text-neutral-200 py-3 hover:no-underline">
                    {t.settings.faqAiTitle}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-neutral-400 pb-3 leading-relaxed">
                    {t.settings.faqAiDesc}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-t border-white/5 px-4">
                  <AccordionTrigger className="text-xs font-medium text-neutral-200 py-3 hover:no-underline">
                    {t.settings.faqDataTitle}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-neutral-400 pb-3 leading-relaxed">
                    {t.settings.faqDataDesc}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full h-10 glass-button text-xs font-medium text-neutral-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="size-3.5" />
            <span>{t.settings.shareTrackerBtn}</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
