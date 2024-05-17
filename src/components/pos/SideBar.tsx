import {
  BeerBottle,
  CookingPot,
  ForkKnife,
  Hamburger,
  IceCream,
  Notebook,
  SignOut,
} from '@phosphor-icons/react'
import { ProductCategory } from '@prisma/client'
import BowlSteam from '../../../public/icons/Bowl'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Função para obter o ícone da categoria
const getCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    case 'Entradas':
      return <ForkKnife size={40} />
    case 'Sopas':
      return <CookingPot size={40} />
    case 'Hamburguers':
      return <Hamburger size={40} />
    case 'Acompanhamentos':
      return <BowlSteam className="fill-primary" />
    case 'Bebidas':
      return <BeerBottle size={40} />
    case 'Sobremesas':
      return <IceCream size={40} />
    default:
      return null
  }
}

interface SideBarProps {
  categories: ProductCategory[]
}

export function SideBar({ categories }: SideBarProps) {
  const params = useParams<{ tableNumber: string; categoryId: string }>()
  const activeCategoryId = params.categoryId

  // Classes condicionais
  const linkClass = (isActive: boolean) =>
    `flex max-h-[100px] w-full flex-col items-center justify-center gap-[10px] rounded-[10px] py-[15px] text-sm font-medium shadow ${isActive ? 'bg-primary text-white' : 'bg-white text-primary'}`

  return (
    <div className="flex min-w-[202px] max-w-[202px] flex-col rounded-[10px] bg-LightGray p-[15px]">
      <div className="flex h-full flex-col items-center justify-between gap-[15px]">
        <div className="flex w-full flex-col gap-[15px] overflow-y-auto">
          <Link
            href={`/order/${params.tableNumber}/`}
            as={`/order/${params.tableNumber}/`}
            className={linkClass(!params.categoryId)}
          >
            <Notebook size={40} />
            <span>Todos Produtos</span>
          </Link>

          {categories.map((category: ProductCategory) => (
            <Link
              href={`/order/${params.tableNumber}/category/${category.id}`}
              as={`/order/${params.tableNumber}/category/${category.id}`}
              key={category.id}
              className={linkClass(activeCategoryId === category.id)}
            >
              {getCategoryIcon(category.name)}
              <span>{category.name}</span>
            </Link>
          ))}
        </div>

        <div className="flex h-[84px] w-[80px]">
          <button
            onClick={() =>
              signOut({
                redirect: true,
                callbackUrl: `${location.origin}/`,
              })
            }
            className="flex flex-1 flex-col items-center justify-center rounded-[10px] bg-secondary py-[15px] text-base font-medium text-white"
          >
            <SignOut size={25} />
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
