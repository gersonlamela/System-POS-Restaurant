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
import { handleGetProductsCategory } from '@/functions/Product/product'
import { useEffect, useState } from 'react'

interface SideBarProps {
  categories: ProductCategory[]
}

export function SideBar({ categories }: SideBarProps) {
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
    <div className="flex h-full min-w-[202px]  max-w-[202px] flex-col rounded-[10px] bg-LightGray p-[15px]  ">
      <div className="flex  h-full flex-col items-center justify-between gap-[15px] overflow-scroll">
        <Link
          href={`/order/`} // Adiciona o número da mesa na URL
          className="flex h-[100px] w-full flex-col items-center justify-center gap-[10px] rounded-[10px] bg-white text-sm font-medium text-primary shadow"
        >
          <Notebook size={40} />
          <span>Todos Produtos</span>
        </Link>
        {categories.map((category: ProductCategory) => (
          <Link
            href={`/order/${category.id}`} // Adiciona o número da mesa e o ID da categoria na URL
            key={category.id}
            className="flex h-[100px] w-full flex-col items-center justify-center gap-[10px] rounded-[10px] bg-white text-sm font-medium text-primary shadow"
          >
            {getCategoryIcon(category.name)}
            <span>{category.name}</span>
          </Link>
        ))}
        <button
          onClick={() =>
            signOut({
              redirect: true,
              callbackUrl: `${window.location.origin}/`,
            })
          }
          className="flex h-[84px]  w-[80px] flex-col items-center justify-center rounded-[10px] bg-secondary text-base font-medium text-white"
        >
          <SignOut size={25} />
          Sair
        </button>
      </div>
    </div>
  )
}
