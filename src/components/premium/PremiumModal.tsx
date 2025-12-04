import { Modal } from '@/components/ui/modal'
import { useNavigate } from 'react-router-dom'

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const navigate = useNavigate()

  const handleUpgrade = () => {
    onClose()
    navigate('/premium')
  }

  const handleLearnMore = () => {
    onClose()
    navigate('/premium')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="light">
      <div className="p-8">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-4">
          Ready to Level Up?
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-center mb-8 leading-relaxed">
          Get unlimited access to premium courses, exclusive resources, and personalized learning
          paths.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleUpgrade}
            className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Upgrade to Premium
          </button>
          <button
            onClick={handleLearnMore}
            className="flex-1 bg-white border border-gray-300 text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </Modal>
  )
}
