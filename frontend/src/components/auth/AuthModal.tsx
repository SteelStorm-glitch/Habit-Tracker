import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { useHabitStore } from '@/context/HabitContext'
import { AuthFormView } from './AuthFormView'

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useHabitStore()

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent
        aria-describedby={undefined}
        showCloseButton={false}
        className="max-w-4xl w-[95vw] p-0 border-0 bg-transparent shadow-none overflow-visible focus:outline-none"
      >
        <DialogTitle className="sr-only">Авторизация HabitSpace</DialogTitle>
        <div className="relative w-full">
          {/* Close Modal Button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 sm:top-7 sm:right-7 size-10 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-30 border border-white/10 backdrop-blur-md"
            title="Закрыть"
          >
            <X className="size-5" />
          </button>

          <AuthFormView isModal onSuccess={() => setIsAuthModalOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
