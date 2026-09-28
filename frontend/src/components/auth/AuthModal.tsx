import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { useHabitStore } from '@/context/HabitContext'
import { AuthFormView } from './AuthFormView'

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useHabitStore()

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent
        aria-describedby={undefined}
        showCloseButton={false}
        className="w-[95vw] max-w-[95vw] sm:max-w-4xl lg:max-w-5xl p-0 border-0 bg-transparent shadow-none overflow-hidden rounded-3xl sm:rounded-[32px] focus:outline-none my-auto max-h-[92vh] overflow-y-auto"
      >
        <DialogTitle className="sr-only">Авторизация HabitSpace</DialogTitle>
        <AuthFormView
          isModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
