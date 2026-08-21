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
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createFood, createFoodRecord, getFoodItems } from "@/lib/actions"
import type { Food } from "@/lib/definitions"
import CreateFoodDialog from "@/components/food-record/createFoodDialog"

export default function FoodRecordPage() {
  const [foodItems, setFoodItems] = React.useState<Food[]>([])
  const [selectedFood, setSelectedFood] = React.useState<Food | null>(null)
  const [eatDate, setEatDate] = React.useState<Date | undefined>(undefined)
  const [eatTime, setEatTime] = React.useState("00:00")
  const [open, setOpen] = React.useState(false)
  const [isCreateFoodOpen, setIsCreateFoodOpen] = React.useState(false)
  const [newFood, setNewFood] = React.useState({
    brand: "",
    name: "",
    description: "",
  })
  const [foodLog, setFoodLog] = React.useState({
    food_id: 0,
    quantity: "",
    is_finished: true,
    meal_time: "",
  })

  const refreshFoodItems = React.useCallback(async () => {
    const items = await getFoodItems()
    setFoodItems(items)
  }, [])

  React.useEffect(() => {
    refreshFoodItems()

    const now = new Date()
    setEatDate(now)

    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    setEatTime(`${hours}:${minutes}`)
  }, [])

  const handleCreateFood = async () => {
    const { brand, name, description } = newFood

    if (!brand.trim() || !name.trim()) {
      return
    }

    await createFood(brand, name, description)
    setNewFood({ brand: "", name: "", description: "" })
    setIsCreateFoodOpen(false)
  }

  const handleCreateFoodRecord = async () => {
    const { food_id, quantity, is_finished, meal_time } = foodLog

    if (food_id <= 0 || !quantity.trim()) {
      return
    }

    // Call the createFoodRecord function from your actions
    await createFoodRecord(food_id, quantity, is_finished, meal_time)
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <main className="mx-auto flex max-w-md min-h-svh flex-col gap-4 p-6 pb-24">
        <h1 className="font-medium text-lg">Food Record Page</h1>

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
              <Input type="text" placeholder="Quantity" />
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="is-finished" defaultChecked />
              <FieldLabel htmlFor="is-finished">Finished</FieldLabel>
            </Field>
          </FieldGroup>

          <Button className="w-full">Save Record</Button>
        </div>
      </main>
    </div>
  )
}