'use client'

import { useState } from 'react'
import { ArrowUpDown, Check, ChevronDown } from 'lucide-react'

interface SortOption {
  value: string
  label: string
}

interface SortDropdownProps {
  value: string
  onChange: (value: string) => void
}

const sortOptions: SortOption[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'acreage-high', label: 'Largest plots' },
  { value: 'acreage-low', label: 'Smallest plots' },
]

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = sortOptions.find(opt => opt.value === value) || sortOptions[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
      >
        <ArrowUpDown className="h-4 w-4" />
        <span>{selectedOption.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border z-50 py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  value === option.value ? 'text-green-600 font-medium' : 'text-gray-700'
                }`}
              >
                {option.label}
                {value === option.value && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
