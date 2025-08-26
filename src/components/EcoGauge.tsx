'use client'

import { getEcoColor } from '@/lib/utils'

interface EcoGaugeProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export default function EcoGauge({
  rating,
  size = 'md',
  showLabel = true,
  className = ''
}: EcoGaugeProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  // Calculate the angle for the gauge (0-10 rating to 0-360 degrees)
  const angle = (rating / 10) * 360
  const color = getEcoColor(rating)

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Background circle */}
        <div className={`w-full h-full rounded-full border-4 border-gray-700 ${sizeClasses[size]}`} />
        
        {/* Progress circle */}
        <div
          className={`absolute inset-0 rounded-full border-4 border-transparent ${color.replace('text-', 'border-')}`}
          style={{
            background: `conic-gradient(${color.replace('text-', '')} 0deg, ${color.replace('text-', '')} ${angle}deg, transparent ${angle}deg, transparent 360deg)`,
            mask: 'radial-gradient(circle at center, transparent 60%, black 60%)',
            WebkitMask: 'radial-gradient(circle at center, transparent 60%, black 60%)'
          }}
        />
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${color} ${textSizes[size]}`}>
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
      
      {showLabel && (
        <div className="mt-2 text-center">
          <p className="text-gray-400 text-xs">Eco Rating</p>
          <p className={`text-xs font-medium ${color}`}>
            {rating >= 8 ? 'Excellent' : rating >= 5 ? 'Good' : 'Poor'}
          </p>
        </div>
      )}
    </div>
  )
}
