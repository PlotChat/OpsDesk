import { cn } from "cn"
import { Outlet } from "react-router"

const DashboardPage = ({className}: {className?: string}) => {
  return (
    <main className="w-full px-10">
        <div className={cn(className, "[ min-w-75 w-[90%] max-w-300 ] [ pt-8 px-5 mx-auto ]")}>
            
        </div>
        <Outlet></Outlet> 
    </main>
  )
}
export default DashboardPage