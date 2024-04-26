'use client'

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

interface SideBarProps {
  categories: ProductCategory[]
}

export function SideBar({ categories }: SideBarProps) {
  const params = useParams<{ tableNumber: string; categoryId: string }>()

  // ID da categoria ativa na URL
  const activeCategoryId = params.categoryId

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
        return <BowlSteam className="fill-primary " />
      case 'Bebidas':
        return <BeerBottle size={40} />
      case 'Sobremesas':
        return <IceCream size={40} />
      default:
        return null
    }
  }

  return (
    <div className="flex h-full min-w-[202px] max-w-[202px] flex-col rounded-[10px] bg-LightGray p-[15px]">
      <div className="flex flex-1 flex-col items-center justify-between overflow-scroll">
        {/* Seção para todos os produtos */}
        <div className="flex w-full flex-1 flex-col gap-[15px]">
          <Link
            href={`/order/${params.tableNumber}/`} // Adiciona o número da mesa na URL
            className={`flex h-[100px] w-full flex-col items-center justify-center gap-[10px] rounded-[10px] text-sm font-medium shadow ${!params.categoryId ? 'bg-primary text-white' : 'bg-white text-primary'} `}
          >
            <Notebook size={40} />
            <span>Todos Produtos</span>
          </Link>

          {/* Loop através das categorias */}
          {categories.map((category: ProductCategory) => (
            <Link
              href={`/order/${params.tableNumber}/category/${category.id}`} // Adiciona o número da mesa e o ID da categoria na URL
              key={category.id}
              className={`flex h-[100px] w-full flex-col items-center justify-center gap-[10px] rounded-[10px] text-sm font-medium shadow ${activeCategoryId === category.id ? 'bg-primary text-white' : ' bg-white text-primary'} `}
            >
              {getCategoryIcon(category.name)}
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
        {/* Botão de saída */}
        <button
          onClick={() =>
            signOut({
              redirect: true,
              callbackUrl: `${window.location.origin}/`,
            })
          }
          className="flex h-[84px] w-[80px] flex-col items-center justify-center rounded-[10px] bg-secondary text-base font-medium text-white"
        >
          <SignOut size={25} />
          Sair
        </button>
      </div>
    </div>
  )
}
