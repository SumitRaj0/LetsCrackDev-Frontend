import { Modal } from '@/components/ui/modal'
import { AuthContent } from './AuthContent'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
  blankBackground?: boolean
}

export function AuthModal({ isOpen, onClose, initialMode = 'login', blankBackground = false }: AuthModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} blankBackground={blankBackground}>
      <AuthContent
        initialMode={initialMode}
        onClose={onClose}
        variant="modal"
        showCloseButton={true}
      />
    </Modal>
  )
}
