import { useProducts } from "@/hooks/useProducts"
import { HomeOutlined, ProductOutlined, UserOutlined } from "@ant-design/icons"
import { Breadcrumb } from "antd"
import { useNavigate, useParams } from "react-router-dom"

const ProductNavigator = () => {
    const navigate = useNavigate()

    const { id } = useParams<{ id: string }>();

    const { products, isLoading } = useProducts()

    const product = id && products[id]

    if (isLoading)
        return <></>

    const navigateItems = [
        {
            title: <HomeOutlined />,
            onClick: () => navigate("/"),
            className: "cursor-pointer hover:bg-gray-200 px-2 py-1"
        },
        {
            title: (
                <>
                    <ProductOutlined />
                    <span>{product && product.category}</span>
                </>
            ),
            className: "px-2 py-1"
        },
        {
            title: product && product.title,
            className: "font-bold"
        },
    ]


    return <div className="py-4 px-8">
        <Breadcrumb

            items={product ? navigateItems : [navigateItems[0]]}
        />
    </div>
}

export default ProductNavigator