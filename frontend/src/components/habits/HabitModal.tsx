import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'
import { useTranslation } from '@/locales'
import { SmoothInput } from '@/components/ui/skiper-ui/skiper106'
import { EmojiSpreeChoiceChips } from '@/components/ui/watermelon/emoji-spree-choice-chips'

const PRESET_COLORS = [
  '#a855f7', // Purple
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#ec4899', // Pink
  '#3b82f6', // Blue
]

export const HabitModal: React.FC = () => {
  const { isAddHabitOpen, setIsAddHabitOpen, addHabit } = useHabitStore()
  const { t } = useTranslation()

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('Здоровье')
  const [selectedEmoji, setSelectedEmoji] = useState('💧')
  const [selectedColor, setSelectedColor] = useState('#a855f7')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addHabit({
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      category,
      emoji: selectedEmoji,
      color: selectedColor,
    })
    setTitle('')
    setSubtitle('')
    setIsAddHabitOpen(false)
  }

  return (
    <Dialog open={isAddHabitOpen} onOpenChange={setIsAddHabitOpen}>
      <DialogContent className="sm:max-w-lg bg-[#0c0919]/95 backdrop-blur-2xl border border-purple-500/20 text-white p-6 rounded-[28px] shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 size-60 rounded-full bg-purple-600/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 size-60 rounded-full bg-indigo-600/20 blur-[90px]" />

        <DialogHeader className="relative z-10">
          <DialogTitle className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white">
            <div className="size-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md shadow-purple-600/20">
              <Plus className="size-4" />
            </div>
            <span>{t.habits.modalNewTitle}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-300 font-medium">
              {t.habits.titleField}
            </label>
            <SmoothInput
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.habits.titlePlaceholder}
              autoFocus
              className="w-full h-10 px-3.5 rounded-xl bg-[#141024] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition-all"
            />
          </div>

          {/* Subtitle / Goal */}
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-300 font-medium">
              {t.habits.subtitleField}
            </label>
            <SmoothInput
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder={t.habits.subtitlePlaceholder}
              className="w-full h-10 px-3.5 rounded-xl bg-[#141024] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition-all"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-300 font-medium">
              {t.habits.categoryField}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-[#141024] border border-white/10 text-xs text-neutral-200 focus:border-purple-500 focus:outline-none cursor-pointer"
            >
              <option value="Здоровье" className="bg-[#141024]">Здоровье</option>
              <option value="Спорт" className="bg-[#141024]">Спорт</option>
              <option value="Саморазвитие" className="bg-[#141024]">Саморазвитие</option>
              <option value="Работа" className="bg-[#141024]">Работа</option>
              <option value="Дом" className="bg-[#141024]">Дом</option>
              <option value="Баланс" className="bg-[#141024]">Баланс</option>
            </select>
          </div>

          {/* Watermelon Emoji Spree Choice Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
                <Sparkles className="size-3 text-purple-400" />
                <span>Эмодзи привычки (Choice Chips)</span>
              </label>
              <span className="text-[10px] text-neutral-400 font-mono">нажмите для выбора</span>
            </div>

            <EmojiSpreeChoiceChips
              selectedEmoji={selectedEmoji}
              onSelectEmoji={(emoji) => setSelectedEmoji(emoji)}
              className="border-purple-500/20"
            />
          </div>

          {/* Color Palette */}
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-300 font-medium">
              {t.habits.colorField}
            </label>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/10">
              {PRESET_COLORS.map(color => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`size-6 rounded-full border-2 transition-all cursor-pointer ${
                    selectedColor === color
                      ? 'border-white scale-125 shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                      : 'border-transparent opacity-75 hover:opacity-100 hover:scale-110'
                  }`}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddHabitOpen(false)}
              className="text-xs text-neutral-400 hover:text-white cursor-pointer"
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md shadow-purple-600/30 active:scale-95 cursor-pointer"
            >
              {t.habits.createBtn}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

