import { Minus, Plus } from '@phosphor-icons/react'
import React, { ChangeEvent } from 'react'

interface NumberInputWithIconsProps {
  min: number
  max: number
  label?: string
  value: number
  onChange: (value: number) => void
}

function NumberInputWithIcons({
  min,
  max,
  label,
  value,
  onChange,
}: NumberInputWithIconsProps): JSX.Element {
  const decrement = () => {
    const newValue = value - 1
    onChange(newValue < min ? min : newValue)
  }

  const increment = () => {
    const newValue = value + 1
    onChange(newValue > max ? max : newValue)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  return (
    <div className="h-10 w-32">
      <label className="w-full text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative mt-1 flex h-10 w-full flex-row rounded-lg bg-transparent">
        <button
          type="button"
          onClick={decrement}
          className="h-full w-10 cursor-pointer rounded-l bg-gray-300 text-gray-600 outline-none hover:bg-gray-400 hover:text-gray-700"
          data-action="decrement"
        >
          <Minus size={20} />
        </button>
        <input
          type="number"
          className="text-md flex w-full cursor-default items-center bg-gray-300 text-center font-semibold text-gray-700 outline-none outline-none hover:text-black focus:text-black focus:outline-none md:text-base"
          name="custom-input-number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
        />
        <button
          type="button"
          onClick={increment}
          className="h-full w-10 cursor-pointer rounded-r bg-gray-300 text-gray-600 hover:bg-gray-400 hover:text-gray-700"
          data-action="increment"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  )
}

export default NumberInputWithIcons
