import { Skeleton } from "antd"

const ProductDetailsSkeleton = () => {
    return <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-4 w-screen h-[90vh] md:w-[90vw] md:h-[70vh] 
            lg:w-[60vw] lg:h-[90vh] flex flex-col"
        onClick={(e) => {
            e.stopPropagation()
        }}>

        <div className="px-4 py-3 text-gray-700 dark:text-gray-200 flex h-[95%] flex-col md:flex-row overflow-y-scroll md:overflow-hidden">
            {/* <ImageWithPreview src={product.thumbnail} className="md:w-[40%] w-full h-96" isMobile={isMobile} /> */}

            <div className="md:w-[40%] w-full h-96 row-center">
                <Skeleton.Image active ></Skeleton.Image>
            </div>

            <div className="md:w-[60%] border-l border-gray-200 dark:border-gray-700 px-4 flex flex-col gap-4">

                <div className="font-extrabold text-xl">
                    <Skeleton.Input active size="large"></Skeleton.Input>
                </div>
                <div className="font-bold">Comments</div>

                <div className="flex flex-col md:overflow-y-scroll gap-4 md:h-[80%] relative">
                    <Skeleton active avatar></Skeleton>
                    <Skeleton active avatar></Skeleton>
                    <Skeleton active avatar></Skeleton>
                    <Skeleton active avatar></Skeleton>
                    <Skeleton active avatar></Skeleton>

                </div>

                <div className="h-[15%] flex flex-col border-t border-gray-200 py-1">
                    <div className="row-center flex-1 gap-2">
                        <div className="bg-black text-white rounded-full row-center px-1 py-1 border border-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                fill="currentColor" viewBox="0 0 24 24" >
                                <path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1"></path>
                            </svg>
                        </div>

                        <textarea
                            placeholder="Write a comment..."
                            className="flex-1 border-none outline-none text-sm placeholder-gray-400 bg-transparent resize-none h-full"
                            rows={3}
                            disabled
                        />
                    </div>

                    <div className="flex w-full items-center justify-between h-fit">
                        <div>
                            <div className="hover:bg-gray-200 p-1 cursor-pointer block rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    fill="currentColor" viewBox="0 0 24 24" >
                                    <path d="M5 21h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2m0-2v-1.59l3-3 1.29 1.29c.39.39 1.02.39 1.41 0l5.29-5.29 3 3V19h-14ZM19 5v5.59L16.71 8.3a.996.996 0 0 0-1.41 0l-5.29 5.29-1.29-1.29a.996.996 0 0 0-1.41 0l-2.29 2.29V5h14Z"></path><path d="M8.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3"></path>
                                </svg>
                            </div>
                        </div>
                        <button disabled className="px-2 py-1 bg-blue-500 text-gray-200 rounded-md cursor-pointer hover:opacity-70 text-xs" type="submit">SEND</button>
                    </div>

                </div>

                {/* <CommentInput id={id} depth={0} setScrolToBottom={() => setScrolToBottom(true)}></CommentInput> */}
            </div>
        </div>

        <div className="flex justify-end items-center gap-4 border-t border-gray-200 dark:border-gray-700 px-4 py-3 h-[5%] dark:text-white">
            <div className="px-4 py-2 space-y-4">
                <div className="md:text-xl font-bold row-center gap-4">
                    <Skeleton.Input active size="small"></Skeleton.Input>
                    <span> $</span>
                </div>
            </div>

            <button
                type="button"
                disabled
                className="px-2 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-500 active:bg-green-700  cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" >
                    <path d="M10.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M8.82 15.77c.31.75 1.04 1.23 1.85 1.23h6.18c.79 0 1.51-.47 1.83-1.2l3.24-7.4c.14-.31.11-.67-.08-.95A1 1 0 0 0 21 7H7.33L5.92 3.62C5.76 3.25 5.4 3 5 3H2v2h2.33zM11 11h2V9h2v2h2v2h-2v2h-2v-2h-2z"></path>
                </svg>
            </button>
        </div>
        {/* <ProductDetailsFooter price={product.price} productId={id}></ProductDetailsFooter> */}
    </div>
}

export default ProductDetailsSkeleton