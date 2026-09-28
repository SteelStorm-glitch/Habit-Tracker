import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Minus, Briefcase, Laptop, Gift, TrendingUp, Box, ShoppingBag, Car, Home, Gamepad2, Lightbulb, Pill, BookOpen } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'
import { SmoothInput } from '@/components/ui/skiper-ui/skiper106'

export const TransactionModals: React.FC = () => {
  const {
    isAddIncomeOpen,
    setIsAddIncomeOpen,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    addTransaction,
    getSimulatedNow
  } = useHabitStore()

  const getTodayISO = () => {
    const now = getSimulatedNow()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }

  // Income state
  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeCategory, setIncomeCategory] = useState('Зарплата')
  const [incomeNote, setIncomeNote] = useState('')
  const [incomeDate, setIncomeDate] = useState(getTodayISO)

  // Expense state
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseCategory, setExpenseCategory] = useState('Еда')
  const [expenseNote, setExpenseNote] = useState('')
  const [expenseDate, setExpenseDate] = useState(getTodayISO)

  const handleOpenIncome = (open: boolean) => {
    setIsAddIncomeOpen(open)
    if (open) setIncomeDate(getTodayISO())
  }

  const handleOpenExpense = (open: boolean) => {
    setIsAddExpenseOpen(open)
    if (open) setExpenseDate(getTodayISO())
  }

  const incomeCategories = [
    { name: 'Зарплата', icon: <Briefcase className="size-4" /> },
    { name: 'Фриланс', icon: <Laptop className="size-4" /> },
    { name: 'Подарок', icon: <Gift className="size-4" /> },
    { name: 'Инвестиции', icon: <TrendingUp className="size-4" /> },
    { name: 'Прочее', icon: <Box className="size-4" /> }
  ]

  const expenseCategories = [
    { name: 'Еда', icon: <ShoppingBag className="size-4" /> },
    { name: 'Транспорт', icon: <Car className="size-4" /> },
    { name: 'Жильё', icon: <Home className="size-4" /> },
    { name: 'Развлечения', icon: <Gamepad2 className="size-4" /> },
    { name: 'Коммуналка', icon: <Lightbulb className="size-4" /> },
    { name: 'Здоровье', icon: <Pill className="size-4" /> },
    { name: 'Обучение', icon: <BookOpen className="size-4" /> },
    { name: 'Прочее', icon: <Box className="size-4" /> }
  ]

  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(incomeAmount)
    if (!val || val <= 0) return
    addTransaction({
      type: 'income',
      amount: val,
      category: incomeCategory,
      note: incomeNote.trim() || undefined,
      date: incomeDate
    })
    setIncomeAmount('')
    setIncomeNote('')
    setIncomeDate(getTodayISO())
    setIsAddIncomeOpen(false)
  }

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(expenseAmount)
    if (!val || val <= 0) return
    addTransaction({
      type: 'expense',
      amount: val,
      category: expenseCategory,
      note: expenseNote.trim() || undefined,
      date: expenseDate
    })
    setExpenseAmount('')
    setExpenseNote('')
    setExpenseDate(getTodayISO())
    setIsAddExpenseOpen(false)
  }

  return (
    <>
      {/* 1. Modal: Добавить доход */}
      <Dialog open={isAddIncomeOpen} onOpenChange={handleOpenIncome}>
        <DialogContent className="sm:max-w-md bg-[#1c1e22] border border-[#2d3139] text-white p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-white">
              <div className="size-6 rounded-md bg-emerald-950 flex items-center justify-center text-emerald-400">
                <Plus className="size-3.5" />
              </div>
              <span>Добавить доход</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveIncome} className="space-y-4 pt-2">
            {/* Amount Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-medium">Сумма</label>
              <div className="relative rounded-xl border border-indigo-500/60 bg-[#16171a] p-3 flex items-center gap-3 focus-within:border-indigo-500">
                <div className="flex flex-col items-center justify-center text-emerald-400 font-bold text-sm">
                  <span>+</span>
                  <span>₽</span>
                </div>
                <SmoothInput
                  type="number"
                  step="any"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  placeholder="0"
                  autoFocus
                  className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-neutral-600 focus:outline-hidden"
                  caretClassName="bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.85)]"
                />
              </div>
            </div>

            {/* Category Grid */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-medium">Категория</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {incomeCategories.map(cat => {
                  const isSelected = incomeCategory === cat.name
                  return (
                    <button
                      type="button"
                      key={cat.name}
                      onClick={() => setIncomeCategory(cat.name)}
                      className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#272a31] border-indigo-500 text-white shadow-xs'
                          : 'bg-[#16171a] border-[#2d3139] text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {cat.icon}
                      <span className="text-[11px] truncate w-full text-center">{cat.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Note & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">Заметка</label>
                <SmoothInput
                  type="text"
                  value={incomeNote}
                  onChange={(e) => setIncomeNote(e.target.value)}
                  placeholder="Например, премия"
                  className="w-full h-9 px-3 rounded-xl bg-[#16171a] border border-[#2d3139] text-xs text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">Дата</label>
                <input
                  type="date"
                  value={incomeDate}
                  onChange={(e) => setIncomeDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#16171a] border border-[#2d3139] text-xs text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddIncomeOpen(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="bg-[#272a31] hover:bg-emerald-600 text-neutral-200 hover:text-white text-xs border border-[#373c47]"
              >
                Сохранить доход
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Modal: Добавить расход */}
      <Dialog open={isAddExpenseOpen} onOpenChange={handleOpenExpense}>
        <DialogContent className="sm:max-w-md bg-[#1c1e22] border border-[#2d3139] text-white p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-white">
              <div className="size-6 rounded-md bg-rose-950 flex items-center justify-center text-rose-400">
                <Minus className="size-3.5" />
              </div>
              <span>Добавить расход</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveExpense} className="space-y-4 pt-2">
            {/* Amount Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-medium">Сумма</label>
              <div className="relative rounded-xl border border-indigo-500/60 bg-[#16171a] p-3 flex items-center gap-3 focus-within:border-indigo-500">
                <div className="flex flex-col items-center justify-center text-rose-400 font-bold text-sm">
                  <span>−</span>
                  <span>₽</span>
                </div>
                <SmoothInput
                  type="number"
                  step="any"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="0"
                  autoFocus
                  className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-neutral-600 focus:outline-hidden"
                  caretClassName="bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.85)]"
                />
              </div>
            </div>

            {/* Category Grid */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-medium">Категория</label>
              <div className="grid grid-cols-4 gap-2">
                {expenseCategories.map(cat => {
                  const isSelected = expenseCategory === cat.name
                  return (
                    <button
                      type="button"
                      key={cat.name}
                      onClick={() => setExpenseCategory(cat.name)}
                      className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#272a31] border-indigo-500 text-white shadow-xs'
                          : 'bg-[#16171a] border-[#2d3139] text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {cat.icon}
                      <span className="text-[10px] truncate w-full text-center">{cat.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Note & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">Заметка</label>
                <SmoothInput
                  type="text"
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  placeholder="Например, обед с коллегами"
                  className="w-full h-9 px-3 rounded-xl bg-[#16171a] border border-[#2d3139] text-xs text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">Дата</label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#16171a] border border-[#2d3139] text-xs text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddExpenseOpen(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="bg-[#272a31] hover:bg-rose-600 text-neutral-200 hover:text-white text-xs border border-[#373c47]"
              >
                Сохранить расход
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
