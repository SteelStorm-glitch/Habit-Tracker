import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Wrench, KeyRound, AlertCircle } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'

export const DevPasscodeModal: React.FC = () => {
  const { isDevPasscodeModalOpen, setIsDevPasscodeModalOpen, unlockDevMode } = useHabitStore()
  const [passcode, setPasscode] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passcode.trim()) return

    const success = unlockDevMode(passcode.trim())
    if (success) {
      setPasscode('')
      setErrorMsg('')
      setIsDevPasscodeModalOpen(false)
    } else {
      setErrorMsg('Неверный код доступа (попробуйте 7777 или DEV)')
    }
  }

  return (
    <Dialog open={isDevPasscodeModalOpen} onOpenChange={setIsDevPasscodeModalOpen}>
      <DialogContent className="sm:max-w-xs bg-[#16171a] border border-[#2d3139] text-neutral-100 p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wrench className="size-4" />
            </div>
            <DialogTitle className="text-base font-bold text-white tracking-tight">
              Доступ разработчика
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <p className="text-xs text-neutral-400">
            Введите сервисный код для разблокировки инструментов QA и машины времени.
          </p>

          <div className="space-y-1.5">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
              <input
                type="text"
                autoFocus
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value)
                  if (errorMsg) setErrorMsg('')
                }}
                placeholder="Код (например, 7777)"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#1c1e22] border border-[#2d3139] text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-500 uppercase tracking-widest"
              />
            </div>

            {errorMsg && (
              <div className="text-[11px] text-rose-400 flex items-center gap-1.5 pt-0.5">
                <AlertCircle className="size-3 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsDevPasscodeModalOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-[#272a31] hover:bg-[#323640] text-xs font-medium text-neutral-300 transition-all cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Активировать
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
