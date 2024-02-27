import React from 'react'
import { Input } from '@/components/ui/input'

// Define an interface for the component's props
interface SearchInputProps {
  searchTerm: string
  searchPlaceholder: string
  setSearchTerm: (value: string) => void
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  searchPlaceholder,
}) => {
  return (
    <div className="relative h-[40px] w-[380px] rounded-3xl">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={searchPlaceholder}
        className="absolute flex  flex-1 items-center  border p-[10px] outline-none ring-0 focus-visible:ring-0"
      />
    </div>
  )
}
