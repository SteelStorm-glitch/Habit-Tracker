import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Heart, Calendar, CreditCard, Sparkles } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'

export const SubscriptionModal: React.FC = () => {
  const { isAddSubOpen, setIsAddSubOpen, addSubscription } = useHabitStore()

  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('monthly')
  const [billingDay, setBillingDay] = useState(20)

  const presets = [
    { name: 'Музыка / Spotify', cost: 299, cycle: 'monthly' as const },
    { name: 'Кинопоиск / Иви', cost: 399, cycle: 'monthly' as const },
    { name: 'VPN Сервис', cost: 450, cycle: 'monthly' as const },
    { name: 'Облачное хранилище', cost: 1990, cycle: 'annual' as const },
    { name: 'Фитнес-клуб', cost: 2500, cycle: 'monthly' as const }
  ]

  const handleSelectPreset = (p: typeof presets[0]) => {
    setName(p.name)
    setCost(p.cost.toString())
    setCycle(p.cycle)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numericCost = parseFloat(cost)
    if (!name.trim() || !numericCost || numericCost <= 0) return

    addSubscription({
      name: name.trim(),
      cost: numericCost,
      cycle,
      billingDay: Number(billingDay) || 1
    })

    setName('')
    setCost('')
    setCycle('monthly')
    setBillingDay(20)
    setIsAddSubOpen(false)
  }

  return (
    <Dialog open={isAddSubOpen} onOpenChange={setIsAddSubOpen}>
      <DialogContent className="sm:max-w-md bg-[#16171a] border border-[#2d3139] text-neutral-100 p-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Heart className="size-4" />
            </div>
            <DialogTitle className="text-base font-bold text-white tracking-tight">
              Новая подписка
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Quick Presets */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Sparkles className="size-3 text-indigo-400" />
            <span>Популярные сервисы:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="px-2.5 py-1 rounded-lg bg-[#1c1e22] hover:bg-[#272a31] border border-[#2d3139] text-[11px] text-neutral-300 transition-all active:scale-95 cursor-pointer"
              >
                {p.name.split('/')[0].trim()} (₽{p.cost})
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Service Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Сервис / Подписка</label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: YouTube Premium"
              className="w-full h-10 px-3 rounded-xl bg-[#1c1e22] border border-[#2d3139] text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Cost and Cycle Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Cost */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <CreditCard className="size-3.5 text-neutral-400" />
                <span>Стоимость (₽)</span>
              </label>
              <input
                type="number"
                step="any"
                required
                min="1"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="299"
                className="w-full h-10 px-3 rounded-xl bg-[#1c1e22] border border-[#2d3139] text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Cycle */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">Период списания</label>
              <div className="flex items-center bg-[#1c1e22] p-1 rounded-xl border border-[#2d3139]">
                <button
                  type="button"
                  onClick={() => setCycle('monthly')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    cycle === 'monthly' ? 'bg-[#272a31] text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  В месяц
                </button>
                <button
                  type="button"
                  onClick={() => setCycle('annual')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    cycle === 'annual' ? 'bg-[#272a31] text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  В год
                </button>
              </div>
            </div>
          </div>

          {/* Billing Day */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-neutral-400" />
              <span>День списания (число месяца: 1 – 31)</span>
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={billingDay}
              onChange={(e) => setBillingDay(parseInt(e.target.value) || 1)}
              className="w-full h-10 px-3 rounded-xl bg-[#1c1e22] border border-[#2d3139] text-xs font-mono text-white focus:outline-hidden focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#2d3139]">
            <button
              type="button"
              onClick={() => setIsAddSubOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 cursor-pointer shadow-indigo-600/20"
            >
              Сохранить подписку
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
