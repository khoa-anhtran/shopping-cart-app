import { Collapse } from "antd"

import type { CollapseProps } from "antd"
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchCategoriesRequested, siderToggled } from "../products/actions";
import { useSelector } from "react-redux";
import { selectCategories, selectCurrentCategory, selectSiderOpen } from "../products/selectors";
import { Link } from "react-router-dom";
import CategorySiderSkeleton from "./CategorySiderSkeleton";
import { useLockModal } from "@/hooks/useLockModal";

const styles = {
    header: {
        padding: '12px 16px',
        color: '#141414',
        borderBottom: "1px solid black",
        borderRadius: "0",
        fontWeight: "700",
        textTransform: "uppercase"
    },
    body: {
        backgroundColor: '#ffffff',
    }
};

const CategorySider = () => {
    const dispatch = useDispatch()

    const categories = useSelector(selectCategories)
    const siderOpen = useSelector(selectSiderOpen)
    const currentCategory = useSelector(selectCurrentCategory)

    const isFetching = useRef(false)
    const modalRef = useRef(null)

    useEffect(() => {
        if (categories.length === 0 && !isFetching.current)
            dispatch(fetchCategoriesRequested())

        isFetching.current = true
    }, [categories.length, dispatch])

    const onCloseSider = useCallback(() => {
        if (siderOpen)
            dispatch(siderToggled())
    }, [dispatch, siderOpen])

    const items = useMemo((): CollapseProps['items'] => {
        return categories.map(category => ({
            key: category.id,
            label: category.name,
            children: <div className="flex flex-col gap-4">
                {category.subCategories?.map(((subCategory, index) =>
                    currentCategory === subCategory.id
                        ? <span className="capitalize font-bold">{subCategory.name}</span>
                        : <Link key={index} to={`/products/${subCategory.id}`} onClick={onCloseSider} className="capitalize">{subCategory.name}</Link>
                ))}
            </div>,
            styles
        }))
    }, [categories, currentCategory, onCloseSider])

    useLockModal(siderOpen, modalRef, onCloseSider)

    if (categories.length === 0)
        return <CategorySiderSkeleton />

    return <aside
        className={`fixed z-50 lg:z-0 lg:w-[20%] h-full lg:h-fit lg:sticky lg:top-25 shadow rounded-xl min-h-[50vh] 
    lg:bg-white w-full bg-black/70 ${siderOpen ? "flex" : "hidden"} lg:flex`}
        ref={modalRef}
        onClick={onCloseSider}
    >
        <div className="space-y-4 flex flex-col lg:w-full px-2 py-4 bg-white w-[70%]" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-2xl px-2">Category Panel</h3>
            <div className="flex-1">
                <Collapse accordion ghost items={items} />
            </div>
        </div>
    </aside>
}

export default CategorySider