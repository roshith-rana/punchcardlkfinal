'use client'

import { useCallback, useState } from 'react'

interface SearchInputProps {
  placeholder?: string
  onSearch: (value: string) => void
  debounceMs?: number
}

export function SearchInput({ placeholder = 'Search...', onSearch, debounceMs = 300 }: SearchInputProps) {
  const [value, setValue] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)
    const timer = setTimeout(() => onSearch(v), debounceMs)
    return () => clearTimeout(timer)
  }, [onSearch, debounceMs])

  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">⌕</span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-8 pr-4 py-2 w-full sm:w-72 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  )
}
