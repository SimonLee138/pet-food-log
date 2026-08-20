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
import { createFood } from "@/lib/actions"

const foodItems = [
  "chicken",
  "beef",
  "pork",
]

export default function FoodRecordPage() {
  const [selectedFood, setSelectedFood] = React.useState<string>("")
  const [eatDate, setEatDate] = React.useState<Date | undefined>(undefined)
  const [eatTime, setEatTime] = React.useState("00:00")
  const [open, setOpen] = React.useState(false)
  const [isCreateFoodOpen, setIsCreateFoodOpen] = React.useState(false)
  const [newFood, setNewFood] = React.useState({
    brand: "",
    name: "",
    description: "",
  })

  React.useEffect(() => {
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
            <Combobox items={foodItems}>
              <ComboboxInput placeholder="Select a food" />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {foodItems.map((item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <Dialog open={isCreateFoodOpen} onOpenChange={setIsCreateFoodOpen}>
              <DialogTrigger
                render={
                  <Button type="button" className="shrink-0">
                    Create Food
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a new food</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Field>
                    <FieldLabel htmlFor="new-food-brand">Brand</FieldLabel>
                    <Input
                      id="new-food-brand"
                      value={newFood.brand}
                      onChange={(event) =>
                        setNewFood((prev) => ({ ...prev, brand: event.target.value }))
                      }
                      placeholder="e.g. Royal Canin"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="new-food-name">Name</FieldLabel>
                    <Input
                      id="new-food-name"
                      value={newFood.name}
                      onChange={(event) =>
                        setNewFood((prev) => ({ ...prev, name: event.target.value }))
                      }
                      placeholder="e.g. salmon"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="new-food-description">Description</FieldLabel>
                    <Input
                      id="new-food-description"
                      value={newFood.description}
                      onChange={(event) =>
                        setNewFood((prev) => ({
                          ...prev,
                          description: event.target.value,
                        }))
                      }
                      placeholder="e.g. High-quality salmon"
                    />
                  </Field>
                  <Button className="w-full" onClick={handleCreateFood}>
                    Save Food
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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