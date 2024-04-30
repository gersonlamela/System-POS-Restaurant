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
        className="flex min-h-[35px] min-w-[35px] items-center justify-center rounded-full bg-white text-primary shadow hover:bg-primary hover:text-white"
      >
        <Minus size={16} weight="bold" />
      </div>
      <div className="flex min-h-[35px] min-w-[55px] items-center justify-center rounded-full bg-white font-semibold text-black shadow">
        {value}
      </div>
      <div
        onClick={increment}
        className="flex min-h-[35px] min-w-[35px] items-center justify-center rounded-full bg-white text-primary shadow hover:bg-primary hover:text-white"
      >
        <Plus size={16} weight="bold" />
      </div>
    </div>
  )
}
