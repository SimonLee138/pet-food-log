"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getFoodInventory } from "@/lib/dashboardActions"

type FoodInventoryItem = Awaited<ReturnType<typeof getFoodInventory>>[number]

export default function FoodInventoryTable() {
  const [inventory, setInventory] = React.useState<FoodInventoryItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const fetchInventory = async () => {
      try {
        setInventory(await getFoodInventory())
      } catch (error) {
        console.error(error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInventory()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>Low stock first</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || hasError || inventory.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground" aria-live="polite">
            {hasError
              ? "Unable to load inventory."
              : isLoading
                ? "Loading inventory..."
                : "No inventory items yet."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food</TableHead>
                <TableHead className="text-right">Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={`${item.foodName}-${item.unit}`}>
                  <TableCell>
                    <div className="font-medium">{item.foodName}</div>
                    <div className="text-xs text-muted-foreground">{item.foodBrand}</div>
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {item.quantityLeft.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })} {item.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}