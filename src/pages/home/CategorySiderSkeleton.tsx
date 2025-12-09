import { Skeleton } from "antd"

const CategorySiderSkeleton = () => {

    return <aside className="w-[20%] px-2 py-4 space-y-4 sticky top-10 shadow bg-white h-fit rounded-md min-h-[50vh] flex flex-col">
        <h3 className="font-bold text-2xl px-2">Category Panel</h3>
        <div className="row-center flex-1">
            <div className="w-full flex items-center flex-col gap-4">
                {[1, 2, 3, 4, 5].map(index => <Skeleton.Input key={index} className="w-full! px-4" active />)}
            </div>
        </div>
    </aside>
}

export default CategorySiderSkeleton