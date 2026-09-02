"use client"

import * as React from "react"
import { getDailyServing } from "@/lib/dashboardActions"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A line chart"
const chartConfig = {
  serving_size: {
    label: "Serving Size",
    color: "var(--chart-1)",
  }
} satisfies ChartConfig

function getLastThirtyDaysRange() {
  const now = new Date()
  const startOfRange = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

  return {
    dateFrom: startOfRange.toDateString(),
    dateTo: endOfToday.toDateString(),
  }
}

export default function DailyServingChart() {
  const [dailyServingData, setDailyServingData] = React.useState<any[]>([])
  const maximumServingSize = Math.max(
    0,
    ...dailyServingData.map((record) => record.serving_size)
  )
  const yAxisMaximum = Math.max(1, Math.ceil(maximumServingSize * 1.2))

  React.useEffect(() => {
    const fetchDailyServing = async () => {
      const { dateFrom, dateTo } = getLastThirtyDaysRange()
      const data = await getDailyServing(dateFrom, dateTo)
      setDailyServingData(data)
    }
    fetchDailyServing()
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily servings</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={dailyServingData}
            margin={{
              top: 12,
              left: 16,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const [, month, day] = String(value).split("-")
                return `${Number(day)}/${Number(month)}`
              }}
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
    </Card>
  )
}