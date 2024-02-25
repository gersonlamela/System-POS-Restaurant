import React from 'react'
import { SearchIcon } from 'lucide-react'

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
    <div className="mb-5 flex w-[300px] items-center gap-[6px] rounded-3xl border border-dotted px-[6px] py-3">
      <SearchIcon size={16} className="text-zinc-500" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={searchPlaceholder}
        className="flex flex-1 focus:bg-white focus:text-gray-900 focus:outline-none"
      />
    </div>
  )
}
