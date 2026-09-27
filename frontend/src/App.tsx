import React from 'react'
import { HabitProvider, useHabitStore } from '@/context/HabitContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { SettingsSheet } from '@/components/layout/SettingsSheet'
import { HabitsView } from '@/components/habits/HabitsView'
import { TasksView } from '@/components/tasks/TasksView'
import { FinanceView } from '@/components/finance/FinanceView'
import { DeveloperView } from '@/components/developer/DeveloperView'
import { ProfileView } from '@/components/profile/ProfileView'
import { TransactionModals } from '@/components/finance/TransactionModals'
import { SubscriptionModal } from '@/components/finance/SubscriptionModal'
import { HabitModal } from '@/components/habits/HabitModal'
import { TaskModal } from '@/components/tasks/TaskModal'
import { AuthModal } from '@/components/auth/AuthModal'
import { DevPasscodeModal } from '@/components/developer/DevPasscodeModal'
import { AiDrawer } from '@/components/ai/AiDrawer'
import { HelpTour } from '@/components/tour/HelpTour'

const MainContent: React.FC = () => {
  const { activeTab } = useHabitStore()

  return (
    <div className="min-h-screen text-neutral-100 font-sans selection:bg-indigo-600/30 selection:text-white">
      {/* Animated Gradient Background */}
      <div className="bg-mesh">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
        <div className="bg-blob bg-blob-4" />
      </div>

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen md:pl-20 pb-20 md:pb-0">
        <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
          {activeTab === 'habits' && <HabitsView />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'finance' && <FinanceView />}
          {activeTab === 'developer' && <DeveloperView />}
          {activeTab === 'profile' && <ProfileView />}
        </div>
      </main>

      {/* Modals & Right Drawers */}
      <SettingsSheet />
      <TransactionModals />
      <SubscriptionModal />
      <HabitModal />
      <TaskModal />
      <AuthModal />
      <DevPasscodeModal />
      <AiDrawer />
      <HelpTour />
    </div>
  )
}

export default function App() {
  return (
    <HabitProvider>
      <MainContent />
    </HabitProvider>
  )
}
