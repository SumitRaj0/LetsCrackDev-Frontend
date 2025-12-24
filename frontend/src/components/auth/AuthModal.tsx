import { Modal } from '@/components/ui/modal'
import { AuthContent } from './AuthContent'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AuthContent
        initialMode={initialMode}
        onClose={onClose}
        variant="modal"
        showCloseButton={true}
      />
    </Modal>
  )
}
