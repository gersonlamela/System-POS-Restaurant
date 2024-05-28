interface LineTitleProps {
  title: string
}

export function LineTitle({ title }: LineTitleProps) {
  return (
    <div className="absolute inset-0 left-0 right-0 top-0 -z-50 mt-[80px] flex h-[50px] w-full items-center bg-secondary pl-[270px] text-[20px] font-semibold text-white">
      {title}
    </div>
  )
}
