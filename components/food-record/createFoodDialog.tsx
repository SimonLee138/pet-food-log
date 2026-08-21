import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createFood } from "@/lib/actions"

type CreateFoodDialogProps = {
  onCreated?: () => Promise<void> | void
}

export default function CreateFoodDialog({ onCreated }: CreateFoodDialogProps) {
  const [isCreateFoodOpen, setIsCreateFoodOpen] = React.useState(false)
  const [newFood, setNewFood] = React.useState({
    brand: "",
    name: "",
    description: "",
  })

  const handleCreateFood = async () => {
    const { brand, name, description } = newFood

    if (!brand.trim() || !name.trim()) {
      return
    }

    await createFood(brand, name, description)
    await onCreated?.()
    setNewFood({ brand: "", name: "", description: "" })
    setIsCreateFoodOpen(false)
  }

  return (
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
  )
}