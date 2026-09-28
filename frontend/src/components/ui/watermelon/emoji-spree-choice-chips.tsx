'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface EmojiChoiceItem {
  id: string
  label: string
  emoji: string
  category?: string
}

interface Particle {
  id: string
  emoji: string
  xOffset: number
  rotate: number
}

interface Props {
  items?: EmojiChoiceItem[]
  selectedEmoji?: string
  onSelectEmoji?: (emoji: string) => void
  className?: string
  showFloatingParticles?: boolean
}

export const DEFAULT_HABIT_EMOJIS: EmojiChoiceItem[] = [
  // Здоровье и спорт
  { id: 'water', emoji: '💧', label: 'Вода', category: 'Здоровье' },
  { id: 'run', emoji: '🏃', label: 'Бег', category: 'Здоровье' },
  { id: 'gym', emoji: '🏋️', label: 'Спортзал', category: 'Здоровье' },
  { id: 'yoga', emoji: '🧘', label: 'Йога', category: 'Здоровье' },
  { id: 'sleep', emoji: '🌙', label: 'Сон', category: 'Здоровье' },
  { id: 'food', emoji: '🥗', label: 'Питание', category: 'Здоровье' },
  { id: 'walk', emoji: '🚶', label: 'Прогулка', category: 'Здоровье' },
  { id: 'vitamins', emoji: '💊', label: 'Витамины', category: 'Здоровье' },
  { id: 'bike', emoji: '🚴', label: 'Велосипед', category: 'Здоровье' },

  // Разум и продуктивность
  { id: 'read', emoji: '📖', label: 'Чтение', category: 'Разум' },
  { id: 'code', emoji: '💻', label: 'Код', category: 'Разум' },
  { id: 'focus', emoji: '🧠', label: 'Фокус', category: 'Разум' },
  { id: 'journal', emoji: '✍️', label: 'Дневник', category: 'Разум' },
  { id: 'target', emoji: '🎯', label: 'Цели', category: 'Разум' },
  { id: 'study', emoji: '📚', label: 'Учёба', category: 'Разум' },
  { id: 'art', emoji: '🎨', label: 'Творчество', category: 'Разум' },
  { id: 'early', emoji: '⏰', label: 'Подъём', category: 'Разум' },

  // Лайфстайл и баланс
  { id: 'coffee', emoji: '☕', label: 'Без кофе', category: 'Баланс' },
  { id: 'music', emoji: '🎸', label: 'Музыка', category: 'Баланс' },
  { id: 'nature', emoji: '🌿', label: 'Природа', category: 'Баланс' },
  { id: 'meditation', emoji: '🧘‍♂️', label: 'Медитация', category: 'Баланс' },
  { id: 'clean', emoji: '🧹', label: 'Порядок', category: 'Баланс' },
  { id: 'pet', emoji: '🐕', label: 'Питомец', category: 'Баланс' },
  { id: 'finance', emoji: '💰', label: 'Бюджет', category: 'Баланс' },
  { id: 'detox', emoji: '📵', label: 'Детокс', category: 'Баланс' },
]

/**
 * Watermelon Emoji Spree Choice Chips (registry: emoji-spree-choice-chips)
 * A playful multi-select/single-select component with exploding emoji particles
 * and smooth spring animations styled for Black & Purple Glass aesthetic.
 */
export const EmojiSpreeChoiceChips: React.FC<Props> = ({
  items = DEFAULT_HABIT_EMOJIS,
  selectedEmoji = '💧',
  onSelectEmoji,
  className = '',
  showFloatingParticles = true,
}) => {
  const [currentEmoji, setCurrentEmoji] = useState<string>(selectedEmoji)
  const [particles, setParticles] = useState<Particle[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('Все')
  const containerRef = React.useRef<HTMLDivElement>(null)

  const activeSelected = selectedEmoji || currentEmoji

  const spawnParticles = (emoji: string) => {
    if (!showFloatingParticles) return

    const newParticles: Particle[] = Array.from({ length: 4 }).map(() => ({
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      xOffset: (Math.random() - 0.5) * 220,
      rotate: (Math.random() - 0.5) * 50,
    }))

    setParticles(newParticles)

    setTimeout(() => {
      setParticles([])
    }, 1500)
  }

  const handleChipClick = (item: EmojiChoiceItem) => {
    setCurrentEmoji(item.emoji)
    if (onSelectEmoji) {
      onSelectEmoji(item.emoji)
    }
    spawnParticles(item.emoji)
  }

  const categories = React.useMemo(() => {
    const cats = ['Все']
    items.forEach((it) => {
      if (it.category && !cats.includes(it.category)) {
        cats.push(it.category)
      }
    })
    return cats
  }, [items])

  const filteredItems = React.useMemo(() => {
    if (activeCategory === 'Все') return items
    return items.filter((it) => it.category === activeCategory)
  }, [items, activeCategory])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl bg-white/[0.02] border border-white/10 p-3.5 space-y-3 ${className}`}
    >
      {/* Category Pills & Selected Emoji Preview */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                activeCategory === cat
                  ? 'bg-purple-600/30 border border-purple-500/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                  : 'bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Selected Emoji Badge */}
        <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs font-semibold text-purple-200">
          <span className="text-base">{activeSelected}</span>
          <span className="text-[10px] uppercase font-mono text-purple-300 hidden sm:inline">Выбрано</span>
        </div>
      </div>

      {/* Choice Chips Scrollable Grid */}
      <div className="max-h-44 overflow-y-auto pr-1 no-scrollbar">
        <div className="flex flex-wrap gap-2">
          {filteredItems.map((item) => {
            const isSelected = activeSelected === item.emoji

            return (
              <motion.button
                type="button"
                key={item.id}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                onClick={() => handleChipClick(item)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-600/30 text-white shadow-[0_0_15px_rgba(168,85,247,0.45)] ring-1 ring-purple-400/40'
                    : 'border-white/10 bg-[#14121f] text-neutral-300 hover:bg-[#1f1a33] hover:border-purple-500/30 hover:text-white'
                }`}
              >
                <span className="text-sm select-none">{item.emoji}</span>
                <span className="select-none text-[11px]">{item.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* PARTICLES EXPLOSION (Watermelon Spree Effect) */}
      <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
        <AnimatePresence>
          {particles.map((p, index) => (
            <FloatingEmoji
              key={p.id}
              emoji={p.emoji}
              delay={index * 0.05}
              xOffset={p.xOffset}
              rotate={p.rotate}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* Floating Exploding Emoji Component with Spring Physics */
const FloatingEmoji: React.FC<{
  emoji: string
  delay: number
  xOffset: number
  rotate: number
}> = ({ emoji, delay, xOffset, rotate }) => {
  return (
    <motion.div
      initial={{ y: 80, x: 0, opacity: 0, scale: 0.5, rotate: 0 }}
      animate={{
        y: [-10, -120, -170, -220],
        x: [0, xOffset * 0.5, xOffset * 0.85, xOffset],
        opacity: [0, 1, 0.9, 0],
        scale: [0.5, 1.6, 2.2, 0.8],
        rotate: [0, rotate * 0.5, rotate, rotate * 1.5],
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        delay,
      }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl drop-shadow-[0_0_12px_rgba(168,85,247,0.7)] pointer-events-none select-none"
    >
      {emoji}
    </motion.div>
  )
}
