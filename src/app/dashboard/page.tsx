import CardsDashboard from '@/components/dashboard/CardsDashboard'
import { LineTitle } from '@/components/dashboard/LineTitle'
import { ApexChart } from '@/components/dashboard/ReactApexChart'
import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function Page() {
  const productsCount = await prisma.product.count()
  const categoriesCount = await prisma.productCategory.count()
  const ordersCount = await prisma.order.count()
  const userCount = await prisma.user.count()
  return (
    <div className="flex h-full w-full flex-col">
      <LineTitle title="Dashboard" />
      <CardsDashboard
        categoriesCount={categoriesCount}
        ordersCount={ordersCount}
        productsCount={productsCount}
        userCount={userCount}
      />
      <div className="mt-[15px]  w-full">
        <ApexChart />
      </div>
    </div>
  )
}
