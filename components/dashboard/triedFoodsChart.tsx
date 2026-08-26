"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { getTriedFoods } from "../../lib/dashboardActions"
import { TrendingUp } from "lucide-react"

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

export default function TriedFoodsChart() {
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
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Tried Foods</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="food"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="tried" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="tried" radius={5} fill="var(--color-tried)">
              <LabelList
                dataKey="food"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
            </Bar>
            <Bar dataKey="finished" radius={5} fill="var(--color-finished)">
              <LabelList
                dataKey="food"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )

}