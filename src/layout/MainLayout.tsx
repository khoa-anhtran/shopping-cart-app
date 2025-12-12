import { App as AntdApp, ConfigProvider } from "antd";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/pages/error";
import { ReactNode } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { MediaViewer } from "@/pages/product-details";
import { PostReviewModal } from "@/pages/reviews";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigProvider>
      <AntdApp>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <CartProvider>
            <div className="min-h-screen dark:bg-black">{children}</div>
            <MediaViewer />
            <PostReviewModal
              open={false}
              onClose={() => {}}
              onSubmit={() => {}}
            ></PostReviewModal>
          </CartProvider>
        </ErrorBoundary>
      </AntdApp>
    </ConfigProvider>
  );
};

export default MainLayout;
