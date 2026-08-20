import { supabase } from "./supabase"

export async function createFood(brand: string, name: string, description: string) {
  const { error } = await supabase.from("food").insert({
    food_brand: brand,
    food_name: name,
    description: description,
  })
  if (error) {
    throw error
  }

  return { brand, name, description }
}

export async function createFoodRecord(food: string, eatDate: Date, eatTime: string) {
  const eatDateTime = new Date(eatDate)
  const [hours, minutes] = eatTime.split(":").map(Number)
  eatDateTime.setHours(hours, minutes)
  const { error } = await supabase.from("food_log").insert({
    food,
    eat_time: eatDateTime.toISOString(),
  })
  if (error) {
    throw error
  }
}