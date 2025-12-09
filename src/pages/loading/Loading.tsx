import { useSelector } from "react-redux"
import { selectIsShowLoading, selectLoadingStyle } from "./selectors"
import { notification, Spin } from "antd"
import { LOADING_STYLE } from "@/constants/ui"
import { useRef } from "react"

const Loading = () => {
    const prevState = useRef(false)
    const showLoading = useSelector(selectIsShowLoading)
    const loadingStyle = useSelector(selectLoadingStyle)

    if (!showLoading) {
        prevState.current = showLoading
        return
    }

    if (showLoading !== prevState.current) {
        if (loadingStyle === LOADING_STYLE.NOTIFICATION)
            notification.open({
                title: <div className="space-x-6"><Spin spinning={true}></Spin><span className="ml-4">Is Loading ...</span></div>, duration: 2
            })

        if (loadingStyle === LOADING_STYLE.OVERLAY)
            return <Spin spinning={showLoading} fullscreen />

        prevState.current = showLoading
    }
}

export default Loading