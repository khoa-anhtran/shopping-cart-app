import { useAppStart } from "@/hooks"
import { Outlet } from "react-router-dom"

const StartAppBoot = () => {
    useAppStart()

    return <Outlet />
}

export default StartAppBoot