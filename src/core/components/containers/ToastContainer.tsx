import React from "react";
import { PageContainerType } from "../../@types/page";
import { PageComponent } from "./PageComponent";
import PageContextProvider from "../../context/PageContextProvider";
import { usePageManage } from "../../hooks/usePageManage";
import {
  onCloseToastConfig,
  onOpenToastConfig,
} from "../../utils/pageAnimations";

const ToastContainer = () => {
  const { pagesInfo } = usePageManage(
    PageContainerType.Toast,
    5,
    { disableBrowserHistory: true },
    onOpenToastConfig,
    onCloseToastConfig,
  );

  return pagesInfo.length === 0 ? (
    <></>
  ) : (
    <React.Fragment>
      <div className="toasts-container">
        {pagesInfo?.map((pageInfo) => (
          <React.Fragment key={pageInfo.id}>
            <PageContextProvider pageInfo={pageInfo}>
              <PageComponent pageInfo={pageInfo} />
            </PageContextProvider>
          </React.Fragment>
        ))}
      </div>
    </React.Fragment>
  );
};

export default ToastContainer;
