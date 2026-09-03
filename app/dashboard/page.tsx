import TriedBrandsChart from "@/components/dashboard/triedBrandsChart"
import TriedFoodsChart from "@/components/dashboard/triedFoodsChart"
import FoodServingKpi from "@/components/dashboard/foodServingKpi"
import FoodAcceptanceRateChart from "@/components/dashboard/foodAcceptanceRateChart"
import DailyServingChart from "@/components/dashboard/dailyServingChart"
import FoodInventoryTable from "@/components/dashboard/foodInventoryTable"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date())

  return (
    <div className="min-h-svh bg-muted/30">
      <main className="mx-auto flex min-h-svh max-w-5xl flex-col gap-5 p-4 pb-24 sm:p-6">
        <header>
          <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">{today}</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2" aria-label="Meal insights">
          <div className="md:col-span-2">
            <FoodServingKpi />
          </div>
          <TriedFoodsChart />
          <TriedBrandsChart />
          <DailyServingChart />
          <FoodInventoryTable />
        </section>
      </main>
    </div>
  )
}
