"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
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
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const fetchFavouriteFoods = async () => {
      try {
        const data = await getTriedFoods()
        setFavouriteFoods(data)
      } catch (error) {
        console.error(error)
        setHasError(true)
      } finally {
        setIsLoading(false)
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
        <CardTitle>Meal completion by food</CardTitle>
        <CardDescription>Completed versus finished servings</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || hasError || chartData.length === 0 ? (
          <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground" aria-live="polite">
            {hasError
              ? "Unable to load food data."
              : isLoading
                ? "Loading food data..."
                : "No meals logged yet."}
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}