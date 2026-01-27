import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass' | 'premium'
  hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-300',
          {
            // Default: subtle shadow with border
            'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm':
              variant === 'default',
            // Bordered: just border, no shadow
            'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700':
              variant === 'bordered',
            // Elevated: prominent shadow
            'bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700':
              variant === 'elevated',
            // Glass: backdrop blur effect
            'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-sm':
              variant === 'glass',
            // Premium: enhanced styling with green accent
            'bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-md':
              variant === 'premium',
            // Hover effect
            'hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer': hover && variant !== 'premium',
            // Premium hover effect
            'hover:shadow-xl hover:border-green-300 dark:hover:border-green-700 hover:-translate-y-1 cursor-pointer': hover && variant === 'premium',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-bold leading-none tracking-tight text-gray-900 dark:text-white', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600 dark:text-gray-400', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// Premium image container with loading state
const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    aspectRatio?: 'video' | 'square' | 'portrait'
  }
>(({ className, aspectRatio = 'video', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative overflow-hidden bg-gray-100 dark:bg-gray-700',
      {
        'aspect-video': aspectRatio === 'video',
        'aspect-square': aspectRatio === 'square',
        'aspect-[3/4]': aspectRatio === 'portrait',
      },
      className
    )}
    {...props}
  />
))
CardImage.displayName = 'CardImage'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardImage }
