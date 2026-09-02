import { supabase } from "./supabase"
import { QueryData, QueryError, QueryResult } from '@supabase/supabase-js'

export async function getFoodServingSize(dateFrom: string, dateTo: string) {
  const FoodServingQuery = supabase.from("food_log").select(`serving_size`).gte("meal_time", dateFrom).lt("meal_time", dateTo)

  type FoodServingData = QueryData<typeof FoodServingQuery>

  const { data, error } = await FoodServingQuery
  if (error) {
    throw error
  }
  const foodServingData: FoodServingData = data

  let totalServingSize = 0
  for (const record of foodServingData) {
    if (typeof record.serving_size === "number") {
      totalServingSize += record.serving_size
    }
  }
  console.log(`Total serving size from ${dateFrom} to ${dateTo}:`, totalServingSize)

  return totalServingSize
}

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

  return foodScores ?? []
}

export async function getTriedBrands() {
  const FoodLogWithBrandQuery = supabase.from("food_log").select(`food!food_id (food_brand)`).is("is_finished", true)

  type FoodLogWithBrand = QueryData<typeof FoodLogWithBrandQuery>
  type TriedBrand = {
    brand_name: string
    count: number
  }

  const { data, error } = await FoodLogWithBrandQuery
  if (error) {
    throw error
  }
  const foodLogWithBrand: FoodLogWithBrand = data

  let brandData: TriedBrand[] = []

  for (const record of foodLogWithBrand) {
    const relatedFood = Array.isArray(record.food) ? record.food[0] : record.food
    const foodBrand = relatedFood?.food_brand

    if (typeof foodBrand !== "string") {
      continue
    }

    let brand = brandData.find(b => b.brand_name === foodBrand)
    if (!brand) {
      brand = { brand_name: foodBrand, count: 0 }
      brandData.push(brand)
    }
    brand.count += 1
  }

  return brandData ?? []
}

export async function getDailyServing(dateFrom: string, dateTo: string) {
  const dailyServingQuery = supabase.from("food_log").select(`serving_size, meal_time`).gte("meal_time", dateFrom).lt("meal_time", dateTo)
  const { data, error } = await dailyServingQuery
  if (error) {
    throw error
  }

  type DailyServing = {
    date: string
    serving_size: number
  }
  let dailyServing: DailyServing[] = []
  const foodLog: { serving_size: number; meal_time: string }[] = data

  for (const record of foodLog) {
    const date = new Date(record.meal_time).toISOString().split("T")[0]
    let dailyRecord = dailyServing.find(d => d.date === date)
    if (!dailyRecord) {
      dailyRecord = { date, serving_size: 0 }
      dailyServing.push(dailyRecord)
    }
    dailyRecord.serving_size += record.serving_size
  }
console.log(`Daily serving from ${dateFrom} to ${dateTo}:`, dailyServing)
  return dailyServing
}

export async function getFoodInventory() {
  const foodInventoryQuery = supabase
    .from("food_inventory")
    .select(`quantity_left, unit, last_updated, food!food_id (food_name, food_brand)`)
    .order("quantity_left", { ascending: true })

  type FoodInventoryData = QueryData<typeof foodInventoryQuery>

  const { data, error } = await foodInventoryQuery
  if (error) {
    throw error
  }

  const foodInventory: FoodInventoryData = data

  return foodInventory.flatMap((record) => {
    const relatedFood = Array.isArray(record.food) ? record.food[0] : record.food

    if (!relatedFood?.food_name) {
      return []
    }

    return [{
      foodName: relatedFood.food_name,
      foodBrand: relatedFood.food_brand ?? "Unknown brand",
      quantityLeft: Number(record.quantity_left),
      unit: record.unit,
      lastUpdated: record.last_updated,
    }]
  })
}
