'use client'

import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { handleGetOrders } from '@/functions/Order/order'
import { Order } from '@/types/Order'
import { startOfDay, format } from 'date-fns'
import { ApexOptions } from 'apexcharts'

interface SalesData {
  x: number
  y: number
}

export default function Example() {
  const [series, setSeries] = useState<{ name: string; data: SalesData[] }[]>([
    { name: 'Vendas', data: [] },
  ])
  const options: ApexOptions = {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    title: {
      text: 'Vendas por dia',
      align: 'left',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return val.toLocaleString('pt-PT', {
            style: 'currency',
            currency: 'EUR',
          })
        },
      },
      title: {
        text: 'Vendas',
      },
    },
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val: number) {
          return val.toLocaleString('pt-PT', {
            style: 'currency',
            currency: 'EUR',
          })
        },
      },
    },
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedOrders: Order[] = await handleGetOrders()

        console.log(fetchedOrders)
        const salesByDay: { [key: string]: number } = {}

        fetchedOrders.forEach((order) => {
          const orderDate = startOfDay(new Date(order.dateOrder))
          const formattedDate = format(orderDate, 'yyyy-MM-dd')

          if (!salesByDay[formattedDate]) {
            salesByDay[formattedDate] = 0
          }

          salesByDay[formattedDate] += order.totalPrice
        })

        const salesData: SalesData[] = Object.entries(salesByDay).map(
          ([date, total]) => ({
            x: new Date(date).getTime(),
            y: total,
          }),
        )

        setSeries([{ name: 'Vendas', data: salesData }])
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  )
}
