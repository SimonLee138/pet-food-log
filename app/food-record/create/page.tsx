"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createFoodRecord, getFoodItems } from "@/lib/actions"
import type { Food } from "@/lib/definitions"
import CreateFoodDialog from "@/components/food-record/createFoodDialog"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

type alertMessage = {
  variant: "default" | "destructive"
  title: string
  description: string
}

export default function CreateFoodRecordPage() {
  const now = React.useMemo(() => new Date(), [])

  const [foodItems, setFoodItems] = React.useState<Food[]>([])
  const [selectedFood, setSelectedFood] = React.useState<Food | null>(null)
  const [eatDate, setEatDate] = React.useState<Date | undefined>(now)
  const [eatTime, setEatTime] = React.useState(() => {
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    return `${hours}:${minutes}`
  })
  const [open, setOpen] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState(false)
  const [alertMessage, setAlertMessage] = React.useState<alertMessage | null>(null)
  const [foodLog, setFoodLog] = React.useState({
    food_id: 0,
    quantity: "",
    is_finished: true,
  })

  const refreshFoodItems = React.useCallback(async () => {
    const items = await getFoodItems()
    setFoodItems(items)
  }, [])

  React.useEffect(() => {
    if (!showAlert) {
      return
    }

    const timer = setTimeout(() => {
      setShowAlert(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [showAlert])

  React.useEffect(() => {
    refreshFoodItems()
  }, [refreshFoodItems])

  const handleCreateFoodRecord = async () => {
    const { food_id, quantity, is_finished } = foodLog

    if (food_id <= 0 || !quantity.trim()) {
      return
    }

    const finalMealTime = `${eatDate?.toISOString().split("T")[0] ?? ""} ${eatTime}`

    setFoodLog((prev) => ({
      ...prev,
      meal_time: finalMealTime,
    }))

    await createFoodRecord(food_id, quantity, is_finished, finalMealTime).catch((error) => {
      console.error("Error creating food record:", error)
      setAlertMessage({
        variant: "destructive",
        title: "Error creating food log",
        description: "There was an error while saving your food record.",
      })
    }).then(() => {
      setAlertMessage({
        variant: "default",
        title: "Food log created successfully!",
        description: "Your food record has been saved.",
      })
    }).finally(() => {
      setShowAlert(true)
    })
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <main className="mx-auto flex max-w-md min-h-svh flex-col gap-4 p-6 pb-24">
        <h1 className="font-medium text-lg">Create Food Record</h1>

        <FieldGroup className="flex-row mx-auto">
          <Field>
            <FieldLabel htmlFor="eat-date">Date</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger render={
                <Button variant="outline" id="eat-date">{eatDate ? eatDate.toLocaleDateString() : "Eat Date"}</Button>
              }>

              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Calendar mode="single" selected={eatDate} onSelect={(date) => { setEatDate(date); setOpen(false); }} defaultMonth={eatDate} />
              </PopoverContent>
            </Popover>
          </Field>
          <Field>
            <FieldLabel htmlFor="eat-time">Time</FieldLabel>
            <Input
              type="time"
              id="eat-time"
              step="60"
              value={eatTime}
              onChange={(event) => setEatTime(event.target.value)}
            />
          </Field>
        </FieldGroup>

        <div className="flex min-w-0 flex-col gap-4 text-sm leading-loose">
          <div className="flex items-center gap-3">
            <Combobox
              items={foodItems}
              value={selectedFood}
              itemToStringLabel={(item) => item?.food_name ?? ""}
              itemToStringValue={(item) => String(item?.id ?? "")}
              onValueChange={(value) => {
                const nextFood = value as Food | null
                setSelectedFood(nextFood)
                setFoodLog((prev) => ({
                  ...prev,
                  food_id: nextFood?.id ?? 0,
                }))
              }}
            >
              <ComboboxInput placeholder="Select a food" />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {foodItems.map((item) => (
                    <ComboboxItem key={item.id} value={item}>
                      {item.food_name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <CreateFoodDialog onCreated={refreshFoodItems} />
          </div>

          <FieldGroup className="mx-auto flex-row">
            <Field>
              <Input
                type="text"
                placeholder="Quantity"
                value={foodLog.quantity}
                onChange={(event) =>
                  setFoodLog((prev) => ({
                    ...prev,
                    quantity: event.target.value,
                  }))
                }
              />
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="is-finished"
                checked={foodLog.is_finished}
                onCheckedChange={(checked) =>
                  setFoodLog((prev) => ({
                    ...prev,
                    is_finished: checked === true,
                  }))
                }
              />
              <FieldLabel htmlFor="is-finished">Finished</FieldLabel>
            </Field>
          </FieldGroup>

          <Button className="w-full" onClick={handleCreateFoodRecord}>Save Record</Button>
        </div>

        {showAlert && (
          <Alert variant={alertMessage?.variant ?? "default"} className="mt-4">
            <InfoIcon />
            <AlertTitle>{alertMessage?.title ?? ""}</AlertTitle>
            <AlertDescription>
              {alertMessage?.description ?? ""}
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  )
}