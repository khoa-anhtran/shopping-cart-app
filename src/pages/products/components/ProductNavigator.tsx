import { ROUTES } from "@/constants"
import { useProducts } from "@/hooks"
import { PathParams } from "@/types"
import { HomeOutlined, ProductOutlined } from "@ant-design/icons"
import { Breadcrumb } from "antd"
import { useNavigate, useParams } from "react-router-dom"

const ProductNavigator = () => {
    const navigate = useNavigate()

    const { productId, categoryId } = useParams<PathParams>();

    const { products, categoriesMap } = useProducts({ isDisabled: !productId && !categoryId })

    const product = productId && products[productId]
    const category = categoryId && categoriesMap[categoryId]

    const navigateItems = [
        {
            title: <HomeOutlined />,
            onClick: () => navigate(ROUTES.HOME),
            className: "cursor-pointer hover:bg-gray-200 px-2 py-1"
        },
        {
            title: (
                <>
                    <ProductOutlined />
                    <span className="ml-4 capitalize">{category && category.name}</span>
                </>
            ),
            className: `px-2 py-1 ${productId ? "cursor-pointer hover:bg-gray-200" : ""}`,
            onClick: () => {
                if (productId)
                    navigate(`${ROUTES.PRODUCTS}/${categoryId}`)
            },
        },
        {
            title: product && product.title,
            className: "font-bold"
        },
    ]


    return <div className="py-4 px-8">
        <Breadcrumb
            items={product ? navigateItems : category ? navigateItems.slice(0, 2) : [navigateItems[0]]}
        />
    </div>
}

export default ProductNavigator