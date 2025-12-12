import { Collapse } from "antd";

import type { CollapseProps } from "antd";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesRequested,
  siderToggled,
  selectCategories,
  selectCurrentCategory,
  selectSiderOpen,
} from "@/pages/products";
import { Link } from "react-router-dom";
import CategorySiderSkeleton from "./CategorySiderSkeleton";
import { useLockModal } from "@/hooks";
import { ROUTES, THEME } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";

const CategorySider = () => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);
  const siderOpen = useSelector(selectSiderOpen);
  const currentCategory = useSelector(selectCurrentCategory);

  const { theme } = useTheme();

  const isFetching = useRef(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (categories.length === 0 && !isFetching.current)
      dispatch(fetchCategoriesRequested());

    isFetching.current = true;
  }, [categories.length, dispatch]);

  const onCloseSider = useCallback(() => {
    if (siderOpen) dispatch(siderToggled());
  }, [dispatch, siderOpen]);

  const items = useMemo((): CollapseProps["items"] => {
    return categories.map((category) => ({
      key: category.id,
      label: (
        <span className="uppercase font-bold dark:text-white">
          {category.name}
        </span>
      ),
      children: (
        <div className="flex flex-col gap-4 dark:text-white">
          {category.subCategories?.map((subCategory, index) =>
            currentCategory === subCategory.id ? (
              <span className="capitalize font-bold">{subCategory.name}</span>
            ) : (
              <Link
                key={index}
                to={`${ROUTES.PRODUCTS}/${subCategory.id}`}
                onClick={onCloseSider}
                className="capitalize"
              >
                {subCategory.name}
              </Link>
            )
          )}
        </div>
      ),
      className: "border-b! rounded-none! dark:text-white!",
    }));
  }, [categories, currentCategory, onCloseSider]);

  useLockModal(siderOpen, modalRef, onCloseSider);

  if (categories.length === 0) return <CategorySiderSkeleton />;

  return (
    <aside
      className={`fixed z-50 lg:z-0 lg:w-[20%] h-full lg:h-fit lg:sticky lg:top-25 shadow rounded-xl min-h-[50vh] 
    lg:bg-white w-full bg-black/70  ${siderOpen ? "flex" : "hidden"} lg:flex`}
      ref={modalRef}
      onClick={onCloseSider}
    >
      <div
        className="space-y-4 flex flex-col lg:w-full px-2 py-4 bg-white w-[70%] dark:lg:bg-gray-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-2xl px-2">Category Panel</h3>
        <div className="flex-1">
          <Collapse
            accordion
            ghost
            items={items}
            styles={{
              icon: {
                color: theme === THEME.DARK ? "white" : "black",
              },
            }}
          />
        </div>
      </div>
    </aside>
  );
};

export default CategorySider;
