import { Collapse } from "antd"

import type { CollapseProps } from "antd"

const data = ['All', 'Beauty & Makeup', 'Fragrances', 'Furniture', 'Groceries', 'Pet Supplies']
const text = "test"

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

const test = <div className="space-y-4">
    <div>Thịt heo</div>
    <div>Thịt bò</div>
    <div>Thịt gà, vịt</div>
    <div>Cá, hải sản</div>
    <div>Trứng gà, vịt, cút</div>
</div>

const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'Thịt, cá, trứng, hải sản',
        children: test,
        styles
    },
    {
        key: '2',
        label: 'Rau, củ, nấm, trái cây',
        children: test,
        styles
    },
    {
        key: '3',
        label: 'Dầu ăn, nước chấm, gia vị',
        children: test,
        styles
    },
];


const CategorySider = () => {
    return <aside className="w-[20%] px-2 py-4 space-y-4 sticky shadow bg-white">
        <h3 className="font-bold text-2xl">Category</h3>
        <Collapse accordion ghost items={items} />
    </aside>
}

export default CategorySider