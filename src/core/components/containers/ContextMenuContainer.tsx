import React, { useEffect, useRef } from "react";
import { PageComponent } from "./PageComponent";
import PageContextProvider from "../../context/PageContextProvider";
import { usePageManage } from "../../hooks/usePageManage";
import { closePage } from "../../utils/page";
import { PageAnimationConfig } from "../../@types/page";
import { bezier } from "../../utils/bezier";

export enum ContextMenuEventType {
  Click = "Click",
  RightClick = "RightClick",
  DoubleClick = "DoubleClick",
  Press = "Press",
  Hover = "Hover",
}

interface ContextMenuParamsType {
  target: HTMLElement;
  event: MouseEvent;
  position: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight";
}

const ContextMenuContainer = () => {
  const slideIn = bezier(0.25, 1, 0.5, 1);

  const backDropRef = useRef<any>(null);

  const getPosition = (params: ContextMenuParamsType) =>
    // if (
    //   window.innerWidth - pageInfo?.page.options?.params.posX <
    //   newPage.ref.offsetWidth
    // ) {
    //   newPageStyle.left =
    //     pageInfo?.page.options?.params.posX - newPage.ref.offsetWidth + "px";
    // } else {
    //   newPageStyle.left = pageInfo?.page.options?.params.posX + "px";
    // }

    // if (
    //   window.innerHeight - pageInfo?.page.options?.params.posY <
    //   newPage.ref.offsetHeight
    // ) {
    //   newPageStyle.top =
    //     pageInfo?.page.options?.params.posY -
    //     newPage.ref.offsetHeight +
    //     20 +
    //     "px";
    // } else {
    //   newPageStyle.top = pageInfo?.page.options?.params.posY + "px";
    // }

    ({
      left: params.event.clientX,

      top: params.event.clientY,
    });
  const { pagesInfo } = usePageManage(
    "ContextMenu",
    6,
    {},
    {
      duration: 500,
      start(newPage) {
        const params: ContextMenuParamsType = newPage.page.options?.params;
        if (params.target) {
          params.target.classList?.add("is-open");
        }
        const newPageStyle = newPage.ref.style;
        newPageStyle.position = "absolute";
        const { left, top } = getPosition(params);
        newPageStyle.left = left + "px";
        newPageStyle.top = top + "px";
        newPageStyle.opacity = "0";
        backDropRef.current.style.opacity = "0";
      },
      animate(t, newPage) {
        const options = newPage?.page.options;
        const newPageStyle = newPage.ref.style;
        const p = slideIn(t);
        newPageStyle.opacity = `${p}`;
        if (!options?.disableBackdrop) {
          backDropRef.current.style.opacity = p + "";
        }
      },
    } as PageAnimationConfig,
    {
      duration: 0,
      start(closePage) {
        const { target }: ContextMenuParamsType =
          closePage.page.options?.params;
        if (target) {
          target.classList.remove("is-open");
        }
      },
    } as PageAnimationConfig,
  );

  const closeModal = () => {
    if (pagesInfo.length > 0) {
      closePage(pagesInfo[0].page);
    }
  };

  useEffect(() => {}, []);

  return (
    <div
      className={pagesInfo.length === 0 ? "hidden" : "context-menu-container"}
    >
      <div ref={backDropRef} onClick={closeModal} className="backdrop" />
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

export default ContextMenuContainer;
