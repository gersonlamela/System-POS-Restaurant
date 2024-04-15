'use client'
import { Footer } from '@/components/pos/Footer'
import { Header } from '@/components/pos/Header'
import { SideBar } from '@/components/pos/SideBar'
import { handleGetProductsCategory } from '@/functions/Product/product'

import { ReactNode, useEffect, useState } from 'react'

interface ORDERLayoutProps {
  children: ReactNode
}

export default function ORDERLayout({ children }: ORDERLayoutProps) {
  return (
    <div className="max-w-screen flex h-screen flex-col">
      <Header />
      <main className="flex flex-1 overflow-auto border border-red-500 px-[15px] pb-[10px] pt-[15px]">
        {children}
      </main>
      <Footer />
    </div>
  )
}
