import ProductsTable from "@/features/inventory/ui/ProductsTable"
import OrdersTable from "@/features/orders/ui/OrdersTable"
import { cn } from "cn"
import { Suspense } from "react"
import { Outlet } from "react-router"

const DashboardPage = ({className}: {className?: string}) => {

  return (
    <main className="w-full p-5">
      <Suspense fallback={<div>Loading...</div>}>
        <div className={cn(className, "[ min-w-75 w-[95%] max-w-300 ] [ pt-8 mx-auto ]")}>
          <ProductsTable></ProductsTable>
          <OrdersTable></OrdersTable>
        </div>
        <Outlet></Outlet>
      </Suspense>
    </main>
  )
}
export default DashboardPage