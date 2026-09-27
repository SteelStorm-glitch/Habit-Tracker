import React, { useState } from 'react'
import { Plus, Search, Check, Trash2, Sparkles, Bot } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'
import type { Task } from '@/types/habit'

export const TasksView: React.FC = () => {
  const { tasks, toggleTask, addTask, deleteTask, setIsAddTaskOpen, getSimulatedNow, generateAiTask } = useHabitStore()

  const simNow = getSimulatedNow()
  const todayStr = `${simNow.getFullYear()}-${String(simNow.getMonth() + 1).padStart(2, '0')}-${String(simNow.getDate()).padStart(2, '0')}`

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'today' | 'overdue' | 'completed'>('all')

  // Inline Quick Add state
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Работа')
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium')
  const [newDueDate, setNewDueDate] = useState(todayStr)

  // Filter calculations
  const totalCount = tasks.length
  const completedCount = tasks.filter(t => t.completed).length
  const activeCount = totalCount - completedCount
  const todayTasks = tasks.filter(t => !t.completed && t.dueDate === todayStr)
  const overdueTasks = tasks.filter(t => !t.completed && t.dueDate < todayStr)
  const upcomingTasks = tasks.filter(t => !t.completed && t.dueDate > todayStr)

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    addTask({
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      dueDate: newDueDate
    })
    setNewTitle('')
  }

  // Format relative deadline string
  const formatDeadline = (dateStr: string, completed: boolean) => {
    if (completed) return { text: 'Готово', color: 'text-neutral-500' }
    if (dateStr < todayStr) return { text: 'Просрочено', color: 'text-rose-400' }
    if (dateStr === todayStr) return { text: 'Сегодня', color: 'text-amber-400' }
    const targetDate = new Date(dateStr)
    const baseDate = new Date(todayStr)
    const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return { text: 'Завтра', color: 'text-neutral-400' }
    if (diffDays > 1 && diffDays <= 7) return { text: `Через ${diffDays} дн.`, color: 'text-neutral-400' }
    return { text: 'Позже', color: 'text-neutral-400' }
  }

  const renderTaskRow = (task: Task) => {
    const deadline = formatDeadline(task.dueDate, task.completed)
    const priorityColors = {
      Urgent: 'bg-rose-500',
      High: 'bg-amber-500',
      Medium: 'bg-indigo-500',
      Low: 'bg-sky-500'
    }

    return (
      <div
        key={task.id}
        className={`group flex items-center justify-between py-3 px-4 hover:bg-white/[0.03] transition-colors ${
          task.completed ? 'opacity-40' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Checkbox circle */}
          <button
            onClick={() => toggleTask(task.id)}
            className={`size-4.5 shrink-0 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
              task.completed
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-white/20 hover:border-white/40 bg-transparent'
            }`}
          >
            {task.completed && <Check className="size-2.5 stroke-[3]" />}
          </button>

          {/* Priority indicator strip */}
          <div className={`w-0.5 h-6 shrink-0 rounded-full ${priorityColors[task.priority] || 'bg-neutral-600'}`} />

          {/* Title & Notes */}
          <div className="space-y-0.5">
            <div className={`text-xs font-semibold flex items-center gap-1.5 ${task.completed ? 'line-through text-neutral-500' : 'text-white'}`}>
              {task.aiGenerated && <Bot className="size-3 text-indigo-400 shrink-0" />}
              {task.title}
            </div>
            {task.notes && (
              <div className="text-[11px] text-neutral-500">{task.notes}</div>
            )}
          </div>
        </div>

        {/* Right Details */}
        <div className="flex items-center gap-3.5">
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-[11px] text-neutral-400 font-medium backdrop-blur-sm">
            {task.category}
          </span>
          {task.aiGenerated && !task.completed && (
            <span className="text-[9px] text-indigo-300/70 font-mono">+30 xp</span>
          )}
          {!task.aiGenerated && !task.completed && (
            <span className="text-[9px] text-indigo-300/50 font-mono">+25 xp</span>
          )}
          <span className={`text-xs font-medium ${deadline.color} min-w-[65px] text-right font-mono`}>
            {deadline.text}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-rose-400 transition-opacity p-1 cursor-pointer"
            title="Удалить задачу"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 stagger-children">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-white">Задачи</h1>
          <p className="text-xs text-neutral-400">
            Осталось {activeCount}, из них {todayTasks.length} на сегодня.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Suggest Button */}
          <button
            id="tour-btn-ai-task"
            onClick={generateAiTask}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 text-xs font-medium border border-purple-500/20 backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
            title="AI предложит задачу"
          >
            <Sparkles className="size-3.5" />
            <span className="hidden sm:inline">AI задача</span>
          </button>

          <button
            id="tour-btn-add-task"
            onClick={() => setIsAddTaskOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500/80 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 backdrop-blur-sm border border-indigo-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Добавить задачу</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1 glass-card p-1 rounded-xl overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'all' as const, label: 'Активные', count: activeCount },
            { id: 'today' as const, label: 'Сегодня', count: todayTasks.length },
            { id: 'overdue' as const, label: 'Просрочено', count: overdueTasks.length, isRed: true },
            { id: 'completed' as const, label: 'Завершено', count: completedCount },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                tab.isRed ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' : 'bg-white/8 text-neutral-300'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск задач"
            className="w-full h-9 pl-9 pr-3 rounded-xl glass-input text-xs text-neutral-200 placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Main Card Container */}
      <div className="rounded-2xl glass-card overflow-hidden">
        {/* Inline Quick Add Bar */}
        <form
          onSubmit={handleCreateTask}
          className="p-3 border-b border-white/5 flex flex-wrap items-center gap-3 bg-white/[0.02]"
        >
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Новая задача — введите название и нажмите Enter"
            className="flex-1 min-w-[220px] h-8 bg-transparent text-xs text-white placeholder:text-neutral-500 focus:outline-hidden px-2"
          />

          <div className="flex items-center gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-white/5 border border-white/8 text-xs text-neutral-300 focus:outline-hidden cursor-pointer"
            >
              <option value="Работа">Работа</option>
              <option value="Здоровье">Здоровье</option>
              <option value="Финансы">Финансы</option>
              <option value="Дом">Дом</option>
              <option value="Учёба">Учёба</option>
            </select>

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as any)}
              className="h-8 px-2.5 rounded-lg bg-white/5 border border-white/8 text-xs text-neutral-300 focus:outline-hidden cursor-pointer"
            >
              <option value="Medium">Средний</option>
              <option value="High">Высокий</option>
              <option value="Urgent">Срочный</option>
              <option value="Low">Низкий</option>
            </select>

            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-white/5 border border-white/8 text-xs text-neutral-300 focus:outline-hidden"
            />

            <button
              type="submit"
              className="size-8 rounded-lg bg-white/5 hover:bg-indigo-600/80 text-neutral-300 hover:text-white flex items-center justify-center border border-white/8 transition-all cursor-pointer"
              title="Добавить задачу"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </form>

        {/* Task Groups */}
        {overdueTasks.length > 0 && (statusFilter === 'all' || statusFilter === 'overdue') && (
          <div>
            <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5 text-[11px] font-semibold tracking-wider text-rose-400 uppercase">
              <span>ПРОСРОЧЕНО</span>
              <span className="font-mono text-neutral-500">{overdueTasks.length}</span>
            </div>
            <div className="divide-y divide-white/5 stagger-slide-up">
              {overdueTasks.map(renderTaskRow)}
            </div>
          </div>
        )}

        {todayTasks.length > 0 && (statusFilter === 'all' || statusFilter === 'today') && (
          <div>
            <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-t border-b border-white/5 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              <span>СЕГОДНЯ</span>
              <span className="font-mono text-neutral-500">{todayTasks.length}</span>
            </div>
            <div className="divide-y divide-white/5 stagger-slide-up">
              {todayTasks.map(renderTaskRow)}
            </div>
          </div>
        )}

        {upcomingTasks.length > 0 && statusFilter === 'all' && (
          <div>
            <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-t border-b border-white/5 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              <span>БЛИЖАЙШИЕ 7 ДНЕЙ</span>
              <span className="font-mono text-neutral-500">{upcomingTasks.length}</span>
            </div>
            <div className="divide-y divide-white/5 stagger-slide-up">
              {upcomingTasks.map(renderTaskRow)}
            </div>
          </div>
        )}

        {statusFilter === 'completed' && (
          <div>
            <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              <span>ЗАВЕРШЕНО</span>
              <span className="font-mono text-neutral-500">{completedCount}</span>
            </div>
            <div className="divide-y divide-white/5">
              {tasks.filter(t => t.completed).map(renderTaskRow)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
