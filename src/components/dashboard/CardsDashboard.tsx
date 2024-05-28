import Image from 'next/image'

interface CardsDashboardProps {
  productsCount: number
  categoriesCount: number
  ordersCount: number
  userCount: number
}

export default function CardsDashboard({
  productsCount,
  categoriesCount,
  ordersCount,
  userCount,
}: CardsDashboardProps) {
  return (
    <div className="mt-[65px] flex w-full flex-row gap-[15px]">
      <div className="relative h-[150px] w-[284px] rounded-[10px] bg-[#63667B] bg-opacity-25">
        <h1 className="ml-[28px] mt-[22px] text-[20px] text-white">Produtos</h1>
        <span className="absolute bottom-[17px] right-[28px] z-50 text-[37px] text-white">
          {productsCount}
        </span>
        <Image
          src="/icons/dashboardFigur.svg"
          alt="Icon Dashboard"
          width={237}
          height={120.5}
          className="absolute bottom-0 right-0"
        />
      </div>

      <div className="relative h-[150px] w-[284px] rounded-[10px] bg-[#63667B] bg-opacity-50">
        <h1 className="ml-[28px] mt-[22px] text-[20px] text-white">
          Categorias
        </h1>
        <span className="absolute bottom-[17px] right-[28px] z-50 text-[37px] text-white">
          {categoriesCount}
        </span>
        <Image
          src="/icons/dashboardFigur2.svg"
          alt="Icon Dashboard"
          width={237}
          height={120.5}
          className="absolute bottom-0 right-0"
        />
      </div>

      <div className="relative h-[150px] w-[284px] rounded-[10px] bg-[#63667B] bg-opacity-75">
        <h1 className="ml-[28px] mt-[22px] text-[20px] text-white">Pedidos</h1>
        <span className="absolute bottom-[17px] right-[28px] z-50 text-[37px] text-white">
          {ordersCount}
        </span>
        <Image
          src="/icons/dashboardFigur3.svg"
          alt="Icon Dashboard"
          width={237}
          height={120.5}
          className="absolute bottom-0 right-0"
        />
      </div>

      <div className="relative h-[150px] w-[284px] rounded-[10px] bg-[#63667B]">
        <h1 className="ml-[28px] mt-[22px] text-[20px] text-white">
          Utilizadores
        </h1>
        <span className="absolute bottom-[17px] right-[28px] z-50 text-[37px] text-white">
          {userCount}
        </span>
        <Image
          src="/icons/dashboardFigur4.svg"
          alt="Icon Dashboard"
          width={237}
          height={120.5}
          className="absolute bottom-0 right-0"
        />
      </div>
    </div>
  )
}
