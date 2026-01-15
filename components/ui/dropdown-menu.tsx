'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface DropdownMenuItem {
  label: string
  href: string
  icon?: React.ReactNode
  description?: string
}

interface NavDropdownProps {
  trigger: string
  icon: React.ReactNode
  items: DropdownMenuItem[]
  isActive: boolean
}

export function NavDropdown({ trigger, icon, items, isActive }: NavDropdownProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          suppressHydrationWarning
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${
              isActive
                ? 'bg-green-50 text-green-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          `}
        >
          {icon}
          <span className="hidden md:inline">{trigger}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          suppressHydrationWarning
          align="start"
          sideOffset={8}
          className="
            min-w-[220px] bg-white rounded-lg shadow-lg border border-gray-200
            overflow-hidden
            animate-in fade-in-0 zoom-in-95
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
          "
        >
          {items.map((item, index) => (
            <DropdownMenuPrimitive.Item key={index} asChild>
              <Link
                href={item.href}
                className="
                  flex items-start gap-3 px-4 py-3
                  text-sm text-gray-700
                  hover:bg-green-50 hover:text-green-700
                  focus:bg-green-50 focus:text-green-700 focus:outline-none
                  transition-colors cursor-pointer
                "
                onClick={() => setOpen(false)}
              >
                {item.icon && (
                  <span className="flex-shrink-0 mt-0.5 text-gray-400">
                    {item.icon}
                  </span>
                )}
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
              </Link>
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}
