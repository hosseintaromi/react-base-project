import React from "react";
import { PageComponent } from "./PageComponent";
import PageContextProvider from "../../context/PageContextProvider";
import { usePageManage } from "../../hooks/usePageManage";
import {
  closeTabAnimationConfig,
  onLeaveContainerConfig,
  openTabContainerConfig,
} from "../../utils/pageAnimations";
import { PartialTabContainerType } from "../../@types/page";

const PartialTabContainer = ({
  containerName,
}: {
  containerName: PartialTabContainerType;
}) => {
  const { pagesInfo } = usePageManage(
    containerName,
    0,
    {},
    openTabContainerConfig,
    closeTabAnimationConfig,
    openTabContainerConfig,
    openTabContainerConfig,
    onLeaveContainerConfig,
  );

  return pagesInfo.length === 0 ? (
    <></>
  ) : (
    <div className="partial-tab-container">
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

export default PartialTabContainer;
