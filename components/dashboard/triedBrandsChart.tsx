"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { getTriedBrands } from "../../lib/dashboardActions"

type TriedBrand = {
  brand_name: string
  count: number
}

const chartConfig = {
  count: {
    label: "Completed meals",
  },
} satisfies ChartConfig

export default function TriedBrandsChart() {
  const [favouriteBrands, setFavouriteBrands] = React.useState<TriedBrand[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const fetchFavouriteBrands = async () => {
      try {
        const data = await getTriedBrands()
        setFavouriteBrands(data)
      } catch (error) {
        console.error(error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavouriteBrands()
  }, [])

  const chartData = favouriteBrands.map((brand, index) => ({
    brand: brand.brand_name,
    count: brand.count,
    fill: `var(--chart-${(index % 5) + 1})`,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed meals by brand</CardTitle>
        <CardDescription>Brands your cat has finished</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || hasError || chartData.length === 0 ? (
          <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground" aria-live="polite">
            {hasError
              ? "Unable to load brand data."
              : isLoading
                ? "Loading brand data..."
                : "No completed meals yet."}
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <PieChart accessibilityLayer>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="brand" hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                labelLine={false}
                label={({ payload, ...props }) => {
                  return (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="var(--foreground)"
                    >
                      {payload.count}
                    </text>
                  )
                }}
                nameKey="brand"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}