import { useEffect, useRef } from "react";
import { PageInfo } from "../@types/page";

export function PageComponent({ pageInfo }: { pageInfo: PageInfo }) {
  const elRef = useRef<any>(null);
  const className = pageInfo.page.className;

  useEffect(() => {
    pageInfo.elRef = elRef.current;
    pageInfo.onInit?.(elRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={elRef}
      className={"tab-container" + (className ? " " + className : "")}
    >
      {pageInfo.page.component()}
    </div>
  );
}
