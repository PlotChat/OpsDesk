import { cn } from "cn"
import { Outlet } from "react-router"

const DashboardPage = ({className}: {className?: string}) => {

  return (
    <main className="w-full p-5">
        <div className={cn(className, "[ min-w-75 w-[95%] max-w-300 ] [ pt-8 mx-auto ]")}>
          <Outlet></Outlet>
        </div>
    </main>
  )
}
export default DashboardPage