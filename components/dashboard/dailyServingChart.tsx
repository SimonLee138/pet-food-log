"use client"

import * as React from "react"
import { getDailyServing } from "@/lib/dashboardActions"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

export const description = "A line chart"
const chartConfig = {
  serving_size: {
    label: "Serving Size",
    color: "var(--chart-1)",
  }
} satisfies ChartConfig

function getCurrentMonthDayRange() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date()
  endOfDay.setDate(endOfDay.getDate() + 1)

  return {
    dateFrom: startOfDay.toDateString(),
    dateTo: endOfDay.toDateString(),
  }
}

export default function DailyServingChart() {
  const [dailyServingData, setDailyServingData] = React.useState<any[]>([])

  React.useEffect(() => {
    const fetchDailyServing = async () => {
      const { dateFrom, dateTo } = getCurrentMonthDayRange()
      const data = await getDailyServing('2026-08-01', dateTo)
      setDailyServingData(data)
    }
    fetchDailyServing()
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Serving Chart</CardTitle>
        <CardDescription>Daily serving data for the current month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={dailyServingData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="serving_size"
              type="natural"
              stroke="var(--color-serving_size)"
              strokeWidth={2}
              //dot={{ r: 4, fill: "var(--color-serving_size)" }}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing daily serving data for the current month
        </div>
      </CardFooter>
    </Card>
  )
}