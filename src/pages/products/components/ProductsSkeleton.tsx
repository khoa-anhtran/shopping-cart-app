import { Skeleton } from "antd"

const ProductsSkeleton = () => {
    return <section className="dark:bg-black dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4 px-8">
            {(new Array(12).fill("")).map((_, index) =>
                <article
                    className={`rounded-xl shadow flex flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-xl justify-between dark:bg-gray-900`}
                    role="article"
                    key={index}
                >
                    <Skeleton.Image className="min-h-60! w-full!" active />

                    <div className="px-4 py-2 space-y-4 flex flex-col w-full">
                        <Skeleton.Input className="w-48!" block active />
                        <Skeleton.Input className="w-20!" block active size="small" />
                    </div>

                    <button
                        className="py-4 bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-800"
                        disabled
                    >
                        Add to cart
                    </button>
                </article>
            )}
        </div>
    </section>
}

export default ProductsSkeleton