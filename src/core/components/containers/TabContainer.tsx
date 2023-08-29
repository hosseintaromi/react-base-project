import React from "react";
import { PageContainerType } from "../../@types/page";
import { PageComponent } from "./PageComponent";
import PageContextProvider from "../../context/PageContextProvider";
import { usePageManage } from "../../hooks/usePageManage";
import {
  closeTabAnimationConfig,
  openTabContainerConfig,
} from "../../utils/pageAnimations";

const TabContainer = () => {
  const { pagesInfo } = usePageManage(
    PageContainerType.Tab,
    2,
    {},
    openTabContainerConfig,
    closeTabAnimationConfig,
    openTabContainerConfig,
  );

  return pagesInfo.length === 0 ? (
    <></>
  ) : (
    <React.Fragment>
      <div className="tab-container">
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

export default TabContainer;
