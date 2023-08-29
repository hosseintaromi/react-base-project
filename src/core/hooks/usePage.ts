import { PageEvents } from "../@types/page";
import { useContext, useEffect } from "react";
import { PageContext } from "../context/PageContextProvider";

export const usePage = <T = any>(events?: PageEvents) => {
  const pageContext = useContext(PageContext);

  useEffect(() => {
    if (events) {
      const unListener = pageContext.listenEvents(events);
      return () => {
        unListener();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = (res?: any) => {
    pageContext.close?.(res);
  };
  return {
    close,
    pageData: pageContext.getPageData() as T,
  };
};
