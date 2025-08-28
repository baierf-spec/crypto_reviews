'use client'

import { Star, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
  hint?: string
  compact?: boolean
  showHelpIcon?: boolean
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  className,
  hint,
  compact = false,
  showHelpIcon = true
}: RatingStarsProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`full-${i}`}
        className={cn(
          'fill-yellow-400 text-yellow-400',
          sizeClasses[size]
        )}
      />
    )
  }

  // Half star
  if (hasHalfStar) {
    stars.push(
      <div key="half" className="relative">
        <Star
          className={cn(
            'text-gray-400',
            sizeClasses[size]
          )}
        />
        <Star
          className={cn(
            'fill-yellow-400 text-yellow-400 absolute inset-0',
            sizeClasses[size]
          )}
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
      </div>
    )
  }

  // Empty stars
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star
        key={`empty-${i}`}
        className={cn(
          'text-gray-400',
          sizeClasses[size]
        )}
      />
    )
  }

  return (
    <div className={cn('flex items-center flex-nowrap', compact ? 'space-x-1' : 'space-x-2', className)}>
      <div className="flex overflow-hidden max-w-full whitespace-nowrap">
        {stars}
      </div>
      {showValue && (
        <span className="text-sm text-gray-300 tabular-nums">
          {rating.toFixed(1)}
        </span>
      )}
      {hint && showHelpIcon && (
        <span title={hint} className="text-gray-400">
          <HelpCircle className={cn(sizeClasses[size])} />
        </span>
      )}
    </div>
  )
}
