'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Switch } from './switch'
import { MoonIcon, SunIcon } from 'lucide-react'

export default function ButtonDarkmode() {
  const [isSelected, setIsSelected] = useState(true)
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex flex-col items-center justify-center gap-[25px] md:flex-row">
      <div className="flex h-[65px] w-[30px] flex-col items-center justify-between rounded-3xl bg-[#f4f0f9] p-[5px] md:h-[30px] md:w-[65px] md:flex-row">
        <button
          onClick={() => setTheme('light')}
          className={`${
            theme === 'light' ? '  bg-black-foreground bg-opacity-10 ' : ''
          } flex h-[25px] w-[25px] items-center justify-center rounded-full`}
        >
          <SunIcon size={14} className="text-primary" />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`${
            theme === 'dark' ? '  bg-black-foreground bg-opacity-10 ' : ''
          } flex h-[25px] w-[25px] items-center justify-center rounded-full`}
        >
          <MoonIcon size={14} className="text-primary" />
        </button>
      </div>
    </div>
  )
}
