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

export default function NormalAppetiteKpi() {
  const [normalAppetiteDays, setNormalAppetiteDays] = React.useState<number | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Normal Appetite</CardTitle>
        <CardDescription>description</CardDescription>
        <CardAction className="text-2xl font-semibold tabular-nums">
          --
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {hasError
            ? "Unable to load normal appetite data"
            : isLoading
              ? "Loading normal appetite data...."
              : `${normalAppetiteDays} days`}
        </p>
      </CardContent>
    </Card>
  )
}