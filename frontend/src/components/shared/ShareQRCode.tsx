/**
 * Share QR Code Component
 * Displays QR code for sharing resources, courses, services, etc.
 */

import { useState } from 'react'
import { QRCode } from './QRCode'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ShareQRCodeProps {
  url: string
  title?: string
  description?: string
  className?: string
}

export function ShareQRCode({ url, title, description, className = '' }: ShareQRCodeProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Share',
          text: description || '',
          url: url,
        })
      } catch (error) {
        // User cancelled or error occurred
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm" className={className}>
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Share QR Code
      </Button>
    )
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title || 'Share'}
        </h3>
        <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
          Close
        </Button>
      </div>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      )}

      <div className="flex flex-col items-center mb-4">
        <QRCode
          value={url}
          size={200}
          title=""
          description=""
          showDownload={true}
          filename={`share-${Date.now()}`}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleShare} variant="primary" className="flex-1" size="sm">
          Share Link
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(url)
            alert('Link copied to clipboard!')
          }}
          variant="outline"
          className="flex-1"
          size="sm"
        >
          Copy Link
        </Button>
      </div>
    </Card>
  )
}

