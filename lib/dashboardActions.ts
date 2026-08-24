import { supabase } from "./supabase"
import { QueryData, QueryError, QueryResult } from '@supabase/supabase-js'

export async function getTriedFoods() {
  //const { data, error } = await supabase.rpc("get_favourite_foods")
  const FoodLogWithNameQuery = supabase.from("food_log").select(`food!food_id (food_name), is_finished`)

  type FoodLogWithName = QueryData<typeof FoodLogWithNameQuery>
  type TriedFood = {
    food_name: string
    tried: number
    finished: number
  }

  const { data, error } = await FoodLogWithNameQuery
  if (error) {
    throw error
  }
  const foodLogWithName: FoodLogWithName = data

  let foodScores: TriedFood[] = []
  console.log("foodLogWithName:", foodLogWithName)
  for (const record of foodLogWithName) {
    const relatedFood = Array.isArray(record.food) ? record.food[0] : record.food
    const foodName = relatedFood?.food_name

    if (typeof foodName !== "string") {
      continue
    }

    let food = foodScores.find(f => f.food_name === foodName)
    if (!food) {
      food = { food_name: foodName, tried: 0, finished: 0 }
      foodScores.push(food)
    }
    food.tried += 1
    if (record.is_finished) {
      food.finished += 1
    }
  }
  console.log("foodScores:", foodScores)
  return foodScores ?? []
}

export async function getFavouriteBrands() {

}

export async function getFoodServings() {

}