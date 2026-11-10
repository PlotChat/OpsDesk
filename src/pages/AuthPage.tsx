import { Outlet } from "react-router"

const AuthPage = () => {
  return (
    <div className="p-20">
        <Outlet></Outlet>
    </div>
  )
}
export default AuthPage