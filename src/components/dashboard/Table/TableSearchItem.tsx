import React from 'react'

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
    <div className="relative h-[40px] w-[400px]  rounded-[5px]">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={searchPlaceholder}
        className="absolute flex h-full  w-full flex-1 items-center  rounded-[5px] border border-secondary pl-[15px] outline-none ring-0 focus-visible:ring-0"
      />
    </div>
  )
}
