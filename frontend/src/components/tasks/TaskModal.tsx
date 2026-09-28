import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckSquare, Calendar, Flag, Tag, AlignLeft } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'
import { SmoothInput } from '@/components/ui/skiper-ui/skiper106'

export const TaskModal: React.FC = () => {
  const { isAddTaskOpen, setIsAddTaskOpen, addTask, getSimulatedNow } = useHabitStore()

  const getTodayISO = () => {
    const now = getSimulatedNow()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }

  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [category, setCategory] = useState('Работа')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium')
  const [dueDate, setDueDate] = useState(getTodayISO)

  const handleOpenChange = (open: boolean) => {
    setIsAddTaskOpen(open)
    if (open) {
      setDueDate(getTodayISO())
    }
  }

  const categories = ['Работа', 'Личное', 'Учёба', 'Здоровье', 'Финансы', 'Дом']
  const priorities: Array<{ id: 'Low' | 'Medium' | 'High' | 'Urgent'; label: string; color: string }> = [
    { id: 'Low', label: 'Низкий', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    { id: 'Medium', label: 'Средний', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { id: 'High', label: 'Высокий', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { id: 'Urgent', label: 'Срочный', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addTask({
      title: title.trim(),
      notes: notes.trim() || undefined,
      category,
      priority,
      dueDate
    })

    setTitle('')
    setNotes('')
    setCategory('Работа')
    setPriority('Medium')
    setDueDate(getTodayISO())
    setIsAddTaskOpen(false)
  }

  return (
    <Dialog open={isAddTaskOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#0f1117]/95 backdrop-blur-2xl border border-white/10 text-neutral-100 p-6 rounded-3xl shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <CheckSquare className="size-4" />
            </div>
            <DialogTitle className="text-base font-bold text-white tracking-tight">
              Новая задача
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Название задачи</label>
            <SmoothInput
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Завершить квартальный отчёт"
              className="w-full h-10 px-3 rounded-xl glass-input text-xs text-white placeholder:text-neutral-500 focus:outline-hidden"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
              <AlignLeft className="size-3.5 text-neutral-400" />
              <span>Детали / Заметки</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Дополнительные детали или ссылки..."
              className="w-full p-3 rounded-xl glass-input text-xs text-white placeholder:text-neutral-500 focus:outline-hidden resize-none"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <Tag className="size-3.5 text-neutral-400" />
                <span>Категория</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#1c1e22] border border-[#2d3139] text-xs text-neutral-200 focus:outline-hidden focus:border-indigo-500 cursor-pointer transition-all"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#1c1e22] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-neutral-400" />
                <span>Срок выполнения</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#1c1e22] border border-[#2d3139] text-xs text-neutral-200 focus:outline-hidden focus:border-indigo-500 cursor-pointer transition-all"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
              <Flag className="size-3.5 text-neutral-400" />
              <span>Приоритет</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`py-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer active:scale-95 ${
                    priority === p.id
                      ? `${p.color} ring-1 ring-white/20 shadow-sm font-semibold`
                      : 'bg-[#1c1e22] border-[#2d3139] text-neutral-400 hover:text-neutral-200 hover:bg-[#252830]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#2d3139]">
            <button
              type="button"
              onClick={() => setIsAddTaskOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer shadow-indigo-600/20"
            >
              Создать задачу
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
