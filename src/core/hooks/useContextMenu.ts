import { MutableRefObject, useEffect } from "react";
import { openPage } from "../utils/page";
import { ContextMenuEventType } from "../components/containers/ContextMenuContainer";

export interface ContextMenuData<T, U> {
  event: ContextMenuEventType;
  component: (props?: any) => JSX.Element;
  data?: T;
  backdrop?: boolean;
  className?: string;
  positionType?: "ByEvent" | "ByElement";
  position?: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight";
  getTargetElement?: () => HTMLElement;
  onClose?: (res?: U) => void;
  mapDataTo?: (data?: T) => any;
}

export interface ContextMenuConfig<T, U> {
  event: ContextMenuEventType;
  component: (props?: any) => JSX.Element;
  backdrop?: boolean;
  className?: string;
  positionType?: "ByEvent" | "ByElement";
  position?: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight";
  onClose: (res?: U) => void;
  mapDataTo?: (data?: T) => any;
}

export const useContextMenu = <T, U>(
  contextMenuData: ContextMenuData<T, U>,
) => {
  const elRef: MutableRefObject<any> = { current: null };

  const openMenu = (event: MouseEvent) => {
    openPage<T>({
      type: "ContextMenu",
      component: contextMenuData.component,
      data: contextMenuData.mapDataTo?.(contextMenuData.data),
      onClose: (res?: U) => {
        contextMenuData.onClose?.(res);
      },
      options: {
        disableBackdrop: !contextMenuData.backdrop,
        params: {
          event,
          target:
            contextMenuData.getTargetElement?.() ||
            elRef.current ||
            event.target,
          position: contextMenuData.position,
        },
      },
    });
  };

  useEffect(() => {
    switch (contextMenuData.event) {
      case ContextMenuEventType.Click:
        elRef.current.addEventListener("click", (event: MouseEvent) => {
          openMenu(event);
        });
        return;
      case ContextMenuEventType.DoubleClick:
        elRef.current.addEventListener("dblclick", (event: MouseEvent) => {
          openMenu(event);
        });
        return;
      case ContextMenuEventType.RightClick:
        return;
      default:
        return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return elRef;
};
