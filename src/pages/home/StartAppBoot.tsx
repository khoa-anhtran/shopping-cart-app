import { useAppStart } from "@/hooks/useAppStart"
import { Outlet } from "react-router-dom"

const StartAppBoot = () => {
    useAppStart()

    return <Outlet />
}

export default StartAppBoot