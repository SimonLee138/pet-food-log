"use client"

import * as React from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { getFoodServingSize } from "@/lib/dashboardActions"

const DAILY_SERVING_MINIMUM = 2.0
const DAILY_SERVING_TARGET = 3.5

function getCurrentDayRange() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay)
  endOfDay.setDate(endOfDay.getDate() + 1)

  return {
    dateFrom: startOfDay.toDateString(),
    dateTo: endOfDay.toDateString(),
  }
}

export default function FoodServingKpi() {
  const [totalServingSize, setTotalServingSize] = React.useState<number | null>(null)
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const fetchTodayServingSize = async () => {
      try {
        const { dateFrom, dateTo } = getCurrentDayRange()
        const total = await getFoodServingSize(dateFrom, dateTo)
        setTotalServingSize(total)
      } catch (error) {
        console.error(error)
        setHasError(true)
      }
    }

    fetchTodayServingSize()
  }, [])

  const progress = totalServingSize === null
    ? 0
    : Math.min((totalServingSize / DAILY_SERVING_TARGET) * 100, 100)
  const minProgress = totalServingSize === null
    ? 0
    : Math.min((totalServingSize / DAILY_SERVING_MINIMUM) * 100, 100)
  const status = hasError
    ? "Unable to load today’s servings"
    : totalServingSize === null
      ? "Loading today’s servings"
      : `${totalServingSize.toFixed(1)} of ${DAILY_SERVING_TARGET} servings`
  const minStatus = hasError
    ? "Unable to load today’s servings"
    : totalServingSize === null
      ? "Loading today’s servings"
      : `${totalServingSize.toFixed(1)} of ${DAILY_SERVING_MINIMUM} minimum servings`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s food</CardTitle>
        <CardDescription>Target: {DAILY_SERVING_TARGET} servings</CardDescription>
        <CardAction className="text-2xl font-semibold tabular-nums">
          {totalServingSize === null ? "--" : totalServingSize.toFixed(1)}
        </CardAction>
      </CardHeader>
      <CardContent>

        <Progress
          value={minProgress}
          aria-label="Minimum serving progress"
          aria-valuemin={0}
          aria-valuemax={DAILY_SERVING_MINIMUM}
          aria-valuenow={totalServingSize ?? 0}
        >
          <ProgressLabel>Minimum</ProgressLabel>
          <ProgressValue />
        </Progress>
        <p className="text-sm text-muted-foreground">{minStatus}</p>

        <Progress
          value={progress}
          aria-label="Target serving progress"
          aria-valuemin={0}
          aria-valuemax={DAILY_SERVING_TARGET}
          aria-valuenow={totalServingSize ?? 0}
        >
          <ProgressLabel>Standard</ProgressLabel>
          <ProgressValue />
        </Progress>
        <p className="text-sm text-muted-foreground">{status}</p>
      </CardContent>
    </Card>
  )
}