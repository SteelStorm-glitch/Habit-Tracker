import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'

const PRESET_ICONS = ['💧', '🏃', '📖', '💻', '🌙', '🧘', '🏋️', '🥗', '☕', '🎯', '🎸', '🧠']
const PRESET_COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#6366f1', '#f43f5e', '#a855f7', '#ec4899', '#3b82f6']

export const HabitModal: React.FC = () => {
  const { isAddHabitOpen, setIsAddHabitOpen, addHabit } = useHabitStore()

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('Здоровье')
  const [selectedEmoji, setSelectedEmoji] = useState('💧')
  const [selectedColor, setSelectedColor] = useState('#06b6d4')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addHabit({
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      category,
      emoji: selectedEmoji,
      color: selectedColor
    })
    setTitle('')
    setSubtitle('')
    setIsAddHabitOpen(false)
  }

  return (
    <Dialog open={isAddHabitOpen} onOpenChange={setIsAddHabitOpen}>
      <DialogContent className="sm:max-w-md bg-[#0f1117]/95 backdrop-blur-2xl border border-white/10 text-white p-6 rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-white">
            <div className="size-7 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Plus className="size-4" />
            </div>
            <span>Новая привычка</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-400 font-medium">Название привычки</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например, Зарядка"
              autoFocus
              className="w-full h-9 px-3 rounded-xl glass-input text-xs text-white placeholder:text-neutral-500 focus:outline-hidden"
            />
          </div>

          {/* Subtitle / Goal */}
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-400 font-medium">Цель / описание</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Например, 15 минут утром"
              className="w-full h-9 px-3 rounded-xl glass-input text-xs text-white placeholder:text-neutral-500 focus:outline-hidden"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-400 font-medium">Категория</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-200 focus:outline-hidden"
            >
              <option value="Здоровье">Здоровье</option>
              <option value="Спорт">Спорт</option>
              <option value="Саморазвитие">Саморазвитие</option>
              <option value="Работа">Работа</option>
              <option value="Дом">Дом</option>
            </select>
          </div>

          {/* Icons Grid */}
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-400 font-medium">Иконка</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_ICONS.map(emoji => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`size-8 rounded-lg flex items-center justify-center text-sm border transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-[#272a31] border-indigo-500 shadow-xs'
                      : 'bg-[#16171a] border-[#2d3139] hover:bg-[#202227]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-400 font-medium">Цвет акцента</label>
            <div className="flex items-center gap-2.5">
              {PRESET_COLORS.map(color => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`size-6 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-white scale-110' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddHabitOpen(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
            >
              Создать привычку
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
