import { Collapse } from "antd"

import type { CollapseProps } from "antd"
import { useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchCategoriesRequested } from "../products/actions";
import { useSelector } from "react-redux";
import { selectCategories } from "../products/selectors";
import { Link } from "react-router-dom";
import CategorySiderSkeleton from "./CategorySiderSkeleton";

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

    const isFetching = useRef(false)

    useEffect(() => {
        if (categories.length === 0 && !isFetching.current)
            dispatch(fetchCategoriesRequested())

        isFetching.current = true
    }, [])

    const items = useMemo((): CollapseProps['items'] => {
        return categories.map(category => ({
            key: category.id,
            label: category.name,
            children: <div className="flex flex-col gap-4">
                {category.subCategories?.map((subCategory =>
                    <Link to={`/products/${subCategory.id}`} className="capitalize">{subCategory.name}</Link>
                ))}
            </div>,
            styles
        }))
    }, [categories])

    if (categories.length === 0)
        return <CategorySiderSkeleton />

    return <aside className="w-[20%] px-2 py-4 space-y-4 sticky top-10 shadow bg-white h-fit rounded-md min-h-[50vh] flex flex-col">
        <h3 className="font-bold text-2xl px-2">Category Panel</h3>
        <div className="row-center flex-1">
            <Collapse accordion ghost items={items} />
        </div>
    </aside>
}

export default CategorySider