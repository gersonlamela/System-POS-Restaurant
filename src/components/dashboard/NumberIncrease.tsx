import { Minus, Plus } from '@phosphor-icons/react/dist/ssr'

interface NumberIncreaseProps {
  value: number
  onChange: (value: number) => void
}

export function NumberIncrease({ value, onChange }: NumberIncreaseProps) {
  const decrement = () => {
    if (value >= 1) {
      onChange(value - 1)
    }
  }

  const increment = () => {
    onChange(value + 1)
  }

  return (
    <div className="flex  min-w-[139px] flex-row items-center gap-[7px]">
      <div
        onClick={decrement}
        className="shadow-button5 flex min-h-[35px] min-w-[35px] items-center justify-center rounded-full bg-white text-primary hover:bg-primary hover:text-white"
      >
        <Minus size={16} weight="bold" />
      </div>
      <div className="shadow-button5 flex min-h-[35px] min-w-[55px] items-center justify-center rounded-full bg-white font-semibold text-black">
        {value}
      </div>
      <div
        onClick={increment}
        className="shadow-button5 flex min-h-[35px] min-w-[35px] items-center justify-center rounded-full bg-white text-primary hover:bg-primary hover:text-white"
      >
        <Plus size={16} weight="bold" />
      </div>
    </div>
  )
}
