/**
 * Chatbot Modal Component
 * Opens chatbot as a modal overlay instead of navigating to a new page
 */

import { Modal } from '@/components/ui/modal'
import { Chatbot } from './Chatbot'

interface ChatbotModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="light" size="xl">
      <div className="w-full h-[85vh] flex flex-col p-0 -m-0">
        <Chatbot onClose={onClose} className="h-full rounded-lg" />
      </div>
    </Modal>
  )
}
