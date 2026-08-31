import { supabase } from "./supabase"


export async function getFoodItems() {
  const { data, error } = await supabase.from("food").select("id, food_brand, food_name, description")
  if (error) {
    throw error
  }
  return data
}
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

export async function createFoodRecord(food_id: number, serving_size: number, is_finished: boolean, meal_time: string) { 
  const { error } = await supabase.from("food_log").insert({
    food_id: food_id,
    serving_size: serving_size,
    is_finished: is_finished,
    meal_time: meal_time,
  })
  if (error) {
    throw error
  }
}