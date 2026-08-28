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
import { Bar, BarChart, CartesianGrid, LabelList, Pie, PieChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { getTriedBrands } from "../../lib/dashboardActions"
import { TrendingUp } from "lucide-react"

type TriedBrand = {
  brand_name: string
  count: number
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

export default function TriedBrandsChart() {
  const [favouriteBrands, setFavouriteBrands] = React.useState<TriedBrand[]>([])

  React.useEffect(() => {
    const fetchFavouriteBrands = async () => {
      try {
        const data = await getTriedBrands()
        setFavouriteBrands(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchFavouriteBrands()
  }, [])

  const chartData = favouriteBrands.map((brand) => ({
    brand: brand.brand_name,
    count: brand.count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pie Chart - Tried Brands</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="food" hideLabel />}
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