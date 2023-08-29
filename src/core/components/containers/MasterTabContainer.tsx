import React from "react";
import { PageContainerType } from "../../@types/page";
import { PageComponent } from "./PageComponent";
import PageContextProvider from "../../context/PageContextProvider";
import { usePageManage } from "../../hooks/usePageManage";
import {
  onEnterTabContainerConfig,
  closeTabAnimationConfig,
  onLeaveContainerConfig,
  activateTabConfig,
} from "../../utils/pageAnimations";

const MasterTabContainer = () => {
  const { pagesInfo } = usePageManage(
    PageContainerType.MasterTab,
    0,
    {
      moveBetweenPages: true,
    },
    activateTabConfig,
    closeTabAnimationConfig,
    activateTabConfig,
    onEnterTabContainerConfig,
    onLeaveContainerConfig,
  );

  return pagesInfo.length === 0 ? (
    <></>
  ) : (
    <div className="tab-wrapper">
      {pagesInfo?.map((pageInfo) => (
        <React.Fragment key={pageInfo.id}>
          <PageContextProvider pageInfo={pageInfo}>
            <PageComponent pageInfo={pageInfo} />
          </PageContextProvider>
        </React.Fragment>
      ))}
    </div>
  );
};

export default MasterTabContainer;
