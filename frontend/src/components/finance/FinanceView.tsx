import React from 'react'
import { Plus, Minus, ArrowUpRight, ArrowDownRight, Gift, ShoppingBag, Gamepad2, Briefcase, Car, Box, Heart, Trash2 } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'

export const FinanceView: React.FC = () => {
  const { 
    finances, 
    deleteTransaction, 
    setIsAddIncomeOpen, 
    setIsAddExpenseOpen, 
    setIsAddSubOpen, 
    deleteSubscription 
  } = useHabitStore()

  const txns = finances.transactions || []
  const subs = finances.subscriptions || []

  // Calculations
  const incomeTotal = txns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expenseTotal = txns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = incomeTotal - expenseTotal
  const incomeCount = txns.filter(t => t.type === 'income').length
  const expenseCount = txns.filter(t => t.type === 'expense').length

  const totalMonthlySubsCost = subs.reduce((sum, s) => {
    return sum + (s.cycle === 'annual' ? Math.round(s.cost / 12) : s.cost)
  }, 0)

  // Structure breakdown by category
  const expenseCategoryMap: Record<string, number> = {}
  txns.filter(t => t.type === 'expense').forEach(t => {
    expenseCategoryMap[t.category] = (expenseCategoryMap[t.category] || 0) + t.amount
  })

  const categoryColors: Record<string, string> = {
    'Еда': '#f59e0b',
    'Прочее': '#64748b',
    'Развлечения': '#f43f5e',
    'Транспорт': '#38bdf8',
    'Подписки': '#818cf8',
    'Здоровье': '#10b981',
    'Обучение': '#a855f7'
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    'Подарок': <Gift className="size-4 text-emerald-400" />,
    'Зарплата': <Briefcase className="size-4 text-emerald-400" />,
    'Еда': <ShoppingBag className="size-4 text-amber-400" />,
    'Развлечения': <Gamepad2 className="size-4 text-rose-400" />,
    'Транспорт': <Car className="size-4 text-sky-400" />,
    'Подписки': <Heart className="size-4 text-indigo-400" />,
    'Прочее': <Box className="size-4 text-neutral-400" />
  }

  // Bar progress breakdown
  const totalVolume = incomeTotal + expenseTotal
  const incomeBarWidth = totalVolume > 0 ? (incomeTotal / totalVolume) * 100 : 50

  return (
    <div className="space-y-6 stagger-children">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-white">Финансы</h1>
          <p className="text-xs text-neutral-400">
            Доходы, расходы и подписки за текущий месяц.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="tour-btn-finance-sub"
            onClick={() => setIsAddSubOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/20 text-xs font-medium backdrop-blur-sm transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Plus className="size-3.5" />
            <span>Подписка</span>
          </button>

          <button
            id="tour-btn-finance-income"
            onClick={() => setIsAddIncomeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/20 text-xs font-medium backdrop-blur-sm transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Plus className="size-3.5" />
            <span>Доход</span>
          </button>

          <button
            id="tour-btn-finance-expense"
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 text-rose-300 border border-rose-500/20 text-xs font-medium backdrop-blur-sm transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Minus className="size-3.5" />
            <span>Расход</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Balance + History | Right Structure + Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Balance Card & Operations Feed */}
        <div className="lg:col-span-8 space-y-5">
          {/* Balance Card with Glassmorphism */}
          <div id="tour-finance-balance" className="p-6 rounded-2xl glass-card space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-neutral-400">Чистый баланс за месяц</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span className={balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {balance >= 0 ? `+₽${balance.toLocaleString('ru-RU')}` : `-₽${Math.abs(balance).toLocaleString('ru-RU')}`}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-neutral-400 block">Оборот</span>
                <span className="text-xs font-mono font-medium text-neutral-300">₽{totalVolume.toLocaleString('ru-RU')}</span>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2 rounded-full bg-white/5 flex overflow-hidden p-0.5">
                <div 
                  className="bg-emerald-500 rounded-l-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                  style={{ width: `${incomeBarWidth}%` }} 
                />
                <div 
                  className="bg-rose-500 rounded-r-full transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" 
                  style={{ width: `${100 - incomeBarWidth}%` }} 
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>{Math.round(incomeBarWidth)}% доходы</span>
                <span>{Math.round(100 - incomeBarWidth)}% расходы</span>
              </div>
            </div>

            {/* Incomes & Expenses Summary */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
              {/* Incomes */}
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 backdrop-blur-sm">
                  <ArrowUpRight className="size-4" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Доходы</div>
                  <div className="text-sm font-bold text-white font-mono">₽{incomeTotal.toLocaleString('ru-RU')}</div>
                  <div className="text-[10px] text-neutral-500">{incomeCount} операций</div>
                </div>
              </div>

              {/* Expenses */}
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 backdrop-blur-sm">
                  <ArrowDownRight className="size-4" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Расходы</div>
                  <div className="text-sm font-bold text-white font-mono">₽{expenseTotal.toLocaleString('ru-RU')}</div>
                  <div className="text-[10px] text-neutral-500">{expenseCount} операций</div>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Feed */}
          <div className="rounded-2xl glass-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-white tracking-wide">История операций</span>
              <span className="text-neutral-500 font-mono text-[11px]">{txns.length} операций</span>
            </div>

            {/* Transactions List */}
            <div className="divide-y divide-white/5 stagger-slide-up">
              {txns.length === 0 ? (
                <div className="text-xs text-neutral-500 py-6 text-center">
                  Операций пока нет. Добавьте первый доход или расход.
                </div>
              ) : (
                txns.map(txn => {
                  const isInc = txn.type === 'income'
                  return (
                    <div
                      key={txn.id}
                      className="py-3 flex items-center justify-between group hover:bg-white/[0.03] rounded-xl px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-8.5 rounded-xl flex items-center justify-center backdrop-blur-sm ${
                            isInc
                              ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400'
                              : 'bg-white/5 border border-white/8 text-neutral-300'
                          }`}
                        >
                          {categoryIcons[txn.category] || <Box className="size-4 text-neutral-400" />}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{txn.category}</div>
                          {txn.note && (
                            <div className="text-[11px] text-neutral-400">{txn.note}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono font-bold ${isInc ? 'text-emerald-400' : 'text-neutral-200'}`}>
                          {isInc ? `+₽${txn.amount.toLocaleString('ru-RU')}` : `—₽${txn.amount.toLocaleString('ru-RU')}`}
                        </span>

                        <button
                          onClick={() => deleteTransaction(txn.id)}
                          className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-rose-400 transition-opacity p-1 cursor-pointer"
                          title="Удалить операцию"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Expense Structure & Subscriptions */}
        <div className="lg:col-span-4 space-y-5">
          {/* Expense Structure Card */}
          <div className="p-5 rounded-2xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-wide">Структура расходов</span>
              <span className="text-xs font-mono font-bold text-neutral-300">₽{expenseTotal.toLocaleString('ru-RU')}</span>
            </div>

            {/* Segmented Color Bar */}
            <div className="w-full h-2 rounded-full bg-white/5 flex overflow-hidden gap-0.5 p-0.5">
              {Object.entries(expenseCategoryMap).map(([cat, amount]) => {
                const width = expenseTotal > 0 ? (amount / expenseTotal) * 100 : 0
                return (
                  <div
                    key={cat}
                    style={{ width: `${width}%`, backgroundColor: categoryColors[cat] || '#94a3b8' }}
                    className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
                  />
                )
              })}
            </div>

            {/* Category breakdown list */}
            <div className="space-y-2 pt-1 text-xs">
              {Object.keys(expenseCategoryMap).length === 0 ? (
                <div className="text-[11px] text-neutral-500 py-2 text-center">Расходов нет</div>
              ) : (
                Object.entries(expenseCategoryMap).map(([cat, amount]) => {
                  const percent = expenseTotal > 0 ? Math.round((amount / expenseTotal) * 100) : 0
                  return (
                    <div key={cat} className="flex items-center justify-between py-1 px-1 rounded-lg hover:bg-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-2 rounded-full shadow-xs"
                          style={{ backgroundColor: categoryColors[cat] || '#94a3b8' }}
                        />
                        <span className="text-neutral-300">{cat}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-neutral-500 text-[11px]">{percent}%</span>
                        <span className="text-neutral-300 font-medium">₽{amount.toLocaleString('ru-RU')}</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Subscriptions Card */}
          <div className="p-5 rounded-2xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">Подписки</span>
                <button
                  onClick={() => setIsAddSubOpen(true)}
                  className="px-2 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-[11px] font-medium text-indigo-400 border border-indigo-500/20 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                  title="Добавить подписку"
                >
                  <Plus className="size-3" />
                  <span>Добавить</span>
                </button>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">₽{totalMonthlySubsCost.toLocaleString('ru-RU')}/мес</span>
            </div>

            <div className="space-y-2 pt-1">
              {subs.length === 0 ? (
                <div className="text-xs text-neutral-500 py-3 text-center">
                  Нет активных подписок
                </div>
              ) : (
                subs.map(sub => {
                  const isUrgent = sub.name === 'Музыка' || sub.id === 's-1'
                  const daysText = sub.name === 'Музыка' ? 'через 6 дн.' : sub.name === 'VPN' ? 'через 28 дн.' : 'через 120 дн.'
                  const dateText = sub.name === 'Музыка' ? '28 сент.' : sub.name === 'VPN' ? '20 окт.' : '20 янв.'
                  return (
                    <div key={sub.id} className="group/sub flex items-center justify-between py-1.5 hover:bg-white/[0.03] px-2 rounded-xl transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-white">{sub.name}</div>
                        <div className="text-[10px] text-neutral-400">
                          {dateText} <span className={isUrgent ? 'text-amber-400 font-medium' : 'text-neutral-500'}>· {daysText}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-mono font-medium text-neutral-300">
                          ₽{sub.cost.toLocaleString('ru-RU')}/{sub.cycle === 'annual' ? 'год' : 'мес'}
                        </div>
                        <button
                          onClick={() => deleteSubscription(sub.id)}
                          className="opacity-0 group-hover/sub:opacity-100 text-neutral-500 hover:text-rose-400 transition-opacity p-1 cursor-pointer"
                          title="Удалить подписку"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
