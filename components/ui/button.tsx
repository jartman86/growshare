'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200',
          // Active/press feedback
          'active:scale-[0.97] active:transition-transform active:duration-75',
          // Focus ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500',
          // Disabled state
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
          // Variant styles
          {
            // Primary - green gradient
            'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 dark:from-green-600 dark:to-green-700 dark:hover:from-green-500 dark:hover:to-green-600':
              variant === 'primary',
            // Secondary - soft background
            'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600':
              variant === 'secondary',
            // Outline - border only
            'border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20':
              variant === 'outline',
            // Ghost - minimal
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800':
              variant === 'ghost',
            // Danger - red
            'bg-red-600 text-white hover:bg-red-700 shadow-md':
              variant === 'danger',
          },
          // Size styles
          {
            'text-sm px-3 py-1.5 gap-1.5': size === 'sm',
            'text-sm px-4 py-2.5 gap-2': size === 'md',
            'text-base px-6 py-3 gap-2': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className={cn('animate-spin', size === 'sm' ? 'h-4 w-4' : 'h-5 w-5')} />
            {children && <span className="ml-2">{children}</span>}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

// Icon-only button variant
export interface IconButtonProps extends Omit<ButtonProps, 'icon' | 'iconPosition' | 'children'> {
  icon: React.ReactNode
  'aria-label': string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg transition-all duration-200',
          // Active/press feedback
          'active:scale-[0.92] active:transition-transform active:duration-75',
          // Focus ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500',
          // Disabled state
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
          // Variant styles
          {
            'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800':
              variant === 'primary',
            'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600':
              variant === 'secondary',
            'border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20':
              variant === 'outline',
            'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800':
              variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 shadow-md':
              variant === 'danger',
          },
          // Size styles - square for icons
          {
            'p-1.5': size === 'sm',
            'p-2': size === 'md',
            'p-3': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {icon}
      </button>
    )
  }
)
IconButton.displayName = 'IconButton'

export { Button, IconButton }
