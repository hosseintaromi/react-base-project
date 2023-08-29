import { ReactNode, useEffect, useRef } from "react";
import { ContextMenuConfig, useContextMenu } from "../hooks/useContextMenu";

export function ContextMenuWrapper<T, U>({
  children,
  contextMenuConfig,
  data,
  onSelect,
}: {
  children: ReactNode;
  contextMenuConfig: ContextMenuConfig<T, U>;
  data?: T;
  onSelect?: (res?: U) => void;
}) {
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    menuRef.current = elRef.current?.children[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuRef = useContextMenu<T, U>({
    component: contextMenuConfig.component,
    backdrop: contextMenuConfig.backdrop,
    className: contextMenuConfig.className,
    onClose: (res?: U) => {
      onSelect?.(res);
      contextMenuConfig.onClose(res);
    },
    position: contextMenuConfig.position,
    positionType: contextMenuConfig.positionType,
    event: contextMenuConfig.event,
    data,
    mapDataTo: contextMenuConfig.mapDataTo,
  });

  return <span ref={elRef}>{children}</span>;
}
