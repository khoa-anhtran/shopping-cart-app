import { Collapse } from "antd"

import type { CollapseProps } from "antd"
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { fetchCategoriesRequested } from "../products/actions";
import { useSelector } from "react-redux";
import { selectCategories } from "../products/selectors";
import { Link } from "react-router-dom";

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

    useEffect(() => {
        if (categories.length === 0)
            dispatch(fetchCategoriesRequested())
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

    return <aside className="w-[20%] px-2 py-4 space-y-4 sticky shadow bg-white">
        <h3 className="font-bold text-2xl">Category</h3>
        <Collapse accordion ghost items={items} />
    </aside>
}

export default CategorySider