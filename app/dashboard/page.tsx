"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { getTriedFoods } from "../../lib/dashboardActions"
import TriedFoodsChart from "@/components/dashboard/triedFoodsChart"

type TriedFood = {
  food_name: string
  tried: number
  finished: number
}

const chartConfig = {
  tried: {
    label: "Completed meals",
    color: "var(--chart-1)",
  },
  finished: {
    label: "Finished meals",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const [favouriteFoods, setFavouriteFoods] = React.useState<TriedFood[]>([])

  React.useEffect(() => {
    const fetchFavouriteFoods = async () => {
      try {
        const data = await getTriedFoods()
        setFavouriteFoods(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchFavouriteFoods()
  }, [])

  const chartData = favouriteFoods.map((food) => ({
    food: food.food_name,
    tried: food.tried,
    finished: food.finished,
  }))

  return (
    <div className="min-h-svh bg-muted/30">
      <main className="mx-auto flex max-w-md min-h-svh flex-col gap-4 p-6 pb-24">
        <h1 className="font-medium text-lg">Dashboard</h1>

        <TriedFoodsChart />
      </main>
    </div>
  )
}
