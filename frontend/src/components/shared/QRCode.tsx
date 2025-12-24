/**
 * QR Code Component
 * Displays QR codes for various purposes (sharing, profiles, etc.)
 */

import { QRCodeSVG } from 'qrcode.react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface QRCodeProps {
  value: string
  size?: number
  level?: 'L' | 'M' | 'Q' | 'H'
  includeMargin?: boolean
  title?: string
  description?: string
  showDownload?: boolean
  filename?: string
  className?: string
}

export function QRCode({
  value,
  size = 256,
  level = 'M',
  includeMargin = true,
  title,
  description,
  showDownload = false,
  filename = 'qrcode',
  className = '',
}: QRCodeProps) {
  const handleDownload = () => {
    const svg = document.getElementById('qrcode-svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = size
      canvas.height = size
      ctx?.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${filename}.png`
          link.click()
          URL.revokeObjectURL(url)
        }
      })
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
          {description}
        </p>
      )}
      <Card className="p-4 inline-block bg-white dark:bg-white">
        {value ? (
          <QRCodeSVG
            id="qrcode-svg"
            value={value}
            size={size}
            level={level}
            includeMargin={includeMargin}
            className="bg-white"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ width: size, height: size }}>
            <p className="text-gray-500">Invalid QR data</p>
          </div>
        )}
      </Card>
      {showDownload && (
        <Button variant="outline" size="sm" onClick={handleDownload} className="mt-4">
          Download QR Code
        </Button>
      )}
    </div>
  )
}

