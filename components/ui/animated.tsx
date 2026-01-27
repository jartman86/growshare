'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState, useRef } from 'react'

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  children: React.ReactNode
}

// Animated card wrapper with fade-in and slide-up
export function AnimatedCard({ delay = 0, className, children, ...props }: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Staggered grid that animates children in sequence
export function StaggeredGrid({
  children,
  className,
  baseDelay = 0,
  staggerDelay = 50,
}: {
  children: React.ReactNode
  className?: string
  baseDelay?: number
  staggerDelay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), baseDelay)
          observer.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: '100px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [baseDelay])

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={cn(
                'transition-all duration-500 ease-out',
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              )}
              style={{
                transitionDelay: isVisible ? `${index * staggerDelay}ms` : '0ms',
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  )
}

// Fade in wrapper for page sections
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity duration-500 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  )
}

// Scale in animation for modals/popups
export function ScaleIn({
  children,
  className,
  show = true,
}: {
  children: React.ReactNode
  className?: string
  show?: boolean
}) {
  return (
    <div
      className={cn(
        'transition-all duration-200 ease-out',
        show
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95',
        className
      )}
    >
      {children}
    </div>
  )
}
