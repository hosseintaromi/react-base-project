import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChangeContainerEventType,
  PageAnimationConfig,
  PageContainerConfig,
  PageContainerType,
  PageInfo,
  PageRef,
  PageType,
} from "../@types/page";
import { registerContainer, removeContainer } from "../utils/page";
import { useAnimate } from "./useAnimate";

export const usePageManage = (
  type: PageContainerType | string,
  containerOrder: number,
  config?: PageContainerConfig,
  openConfig?: PageAnimationConfig,
  closeConfig?: PageAnimationConfig,
  activateConfig?: PageAnimationConfig,
  onEnterContainerConfig?: PageAnimationConfig,
  onLeaveContainerConfig?: PageAnimationConfig,
) => {
  const [pagesInfo, setPagesInfo] = useState<PageInfo[]>([]);
  const activePageIdRef = useRef<string>("");
  const { requestAnimate } = useAnimate();

  const doAnimate = useCallback(
    (
      newPage: PageRef,
      prevPage?: PageRef,
      config?: PageAnimationConfig,
      immediate?: boolean,
    ) =>
      new Promise<any>((resolve, reject) => {
        if (!config) {
          resolve(true);
        }
        config?.start?.(newPage, prevPage);
        if (immediate || !config?.duration) {
          config?.animate?.(1, newPage, prevPage);
          config?.end?.(newPage, prevPage);
          resolve(true);
          return;
        }
        document.body.classList.add("animating");
        requestAnimate(
          config.duration,
          (t: number) => {
            config?.animate?.(t, newPage, prevPage);
          },
          () => {
            config?.end?.(newPage, prevPage);
            document.body.classList.remove("animating");
            resolve(true);
          },
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const openPage = useCallback(
    (newPage: PageType<any>) =>
      new Promise((resolve, reject) => {
        const newPgeInfo: PageInfo = {
          id: newPage.id,
          page: newPage,
          onInit: async (el: HTMLElement) => {
            const currentPageInfo = pagesInfo.find(
              (x) => x.id === activePageIdRef.current,
            );
            activePageIdRef.current = newPage.id;
            await doAnimate(
              {
                page: newPage,
                ref: newPgeInfo.elRef as any,
              },
              currentPageInfo
                ? {
                    page: currentPageInfo?.page,
                    ref: currentPageInfo?.elRef as any,
                  }
                : undefined,
              openConfig,
            );
            if (currentPageInfo) {
              currentPageInfo.events?.onLeave?.({
                toPage: newPage,
              });
            }
            newPgeInfo.events?.onEnter?.({
              fromPage: currentPageInfo?.page,
              data: newPage.data,
            });
            resolve(true);
          },
        };
        pagesInfo.push(newPgeInfo);
        setPagesInfo([...pagesInfo]);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const activatePage = useCallback(async (page: PageType<any>) => {
    const pageInfo = pagesInfo.find((x) => x.id === page.id);
    if (!pageInfo) {
      return;
    }
    if (activePageIdRef.current === page.id) {
      return;
    }
    const currentPageInfo = pagesInfo.find(
      (x) => x.id === activePageIdRef.current,
    );
    activePageIdRef.current = page.id;
    await doAnimate(
      {
        page: pageInfo.page,
        ref: pageInfo.elRef as any,
      },
      currentPageInfo
        ? {
            page: currentPageInfo.page,
            ref: currentPageInfo.elRef as any,
          }
        : undefined,
      activateConfig,
    );
    if (currentPageInfo) {
      currentPageInfo.events?.onLeave?.({
        toPage: page,
      });
    }
    pageInfo.events?.onEnter?.({
      fromPage: currentPageInfo?.page,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closePage = useCallback(
    async (page: PageType<any>, newActivePage?: PageType<any>, res?: any) => {
      let activePageInfo: PageInfo | undefined;
      activePageIdRef.current = "";
      if (newActivePage) {
        activePageIdRef.current = newActivePage.id;
        activePageInfo = pagesInfo.find((x) => x.id === newActivePage.id);
      }
      const index = pagesInfo.findIndex((x) => x.id === page.id);
      if (index < 0) {
        return;
      }
      const closePageInfo = pagesInfo[index];
      const immediate =
        !config?.moveBetweenPages && index < pagesInfo.length - 1;
      closePageInfo.events?.onClosing?.({
        toPage: newActivePage,
      });

      await doAnimate(
        {
          page: pagesInfo[index].page,
          ref: pagesInfo[index].elRef as any,
        },
        activePageInfo
          ? {
              page: activePageInfo.page,
              ref: activePageInfo.elRef as any,
            }
          : undefined,
        closeConfig,
        immediate,
      );

      if (activePageInfo) {
        activePageInfo.events?.onEnter?.({
          fromPage: closePageInfo.page,
        });
      }

      if (index > -1) {
        pagesInfo.splice(index, 1);
        setPagesInfo([...pagesInfo]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const changeContainer = useCallback(
    async (fromPage: PageType<any>, eventType: ChangeContainerEventType) => {
      const activePageInfo = pagesInfo.find(
        (x) => x.id === activePageIdRef.current,
      );

      if (!activePageInfo) {
        return;
      }
      await doAnimate(
        {
          page: activePageInfo.page,
          ref: activePageInfo.elRef as any,
        },
        {
          page: fromPage,
          ref: null as any,
        },
        eventType === ChangeContainerEventType.onEnter
          ? onEnterContainerConfig
          : onLeaveContainerConfig,
      );
      if (eventType === ChangeContainerEventType.onEnter) {
        activePageInfo.events?.onEnter?.({
          fromPage: fromPage,
        });
      } else if (eventType === ChangeContainerEventType.onLeave) {
        activePageInfo.events?.onLeave?.({
          toPage: fromPage,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    registerContainer(
      type,
      containerOrder,
      config || {},
      openPage,
      closePage,
      activatePage,
      changeContainer,
    );
    return () => {
      removeContainer(type);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    activePageId: activePageIdRef.current,
    pagesInfo,
    openPage,
    closePage,
  };
};
