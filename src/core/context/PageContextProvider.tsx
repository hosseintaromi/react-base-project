import { ReactNode, useEffect, useRef, memo, createContext } from "react";
import {
  PageEventType,
  PageEvents,
  PageInfo,
  PageEventArg,
  PageContextType,
} from "../@types/page";
import { closePage } from "../utils/page";

export const PageContext = createContext<PageContextType>({} as any);

const PageContextProvider = ({
  children,
  pageInfo,
}: {
  children: ReactNode;
  pageInfo: PageInfo;
}) => {
  const eventListeners = useRef<any>({});

  const addEvent = (type: PageEventType, event?: (e: PageEventArg) => void) => {
    if (!event) {
      return;
    }
    let listener: any[] = eventListeners.current[type];
    if (!listener) {
      listener = eventListeners.current[type] = [];
    }
    listener.push(event);
  };

  const removeEvent = (
    type: PageEventType,
    event?: (e: PageEventArg) => void,
  ) => {
    if (!event) {
      return;
    }
    let listener: any[] = eventListeners.current[type];
    const index = listener.findIndex((x) => x === event);
    if (index > -1) {
      listener.splice(index, 1);
    }
  };

  const listenEvents = (events: PageEvents) => {
    addEvent(PageEventType.onEnter, events.onEnter);
    addEvent(PageEventType.onLeave, events.onLeave);
    addEvent(PageEventType.onClosing, events.onClosing);
    return () => {
      removeEvent(PageEventType.onEnter, events.onEnter);
      removeEvent(PageEventType.onLeave, events.onLeave);
      removeEvent(PageEventType.onClosing, events.onClosing);
    };
  };

  const emitEvent = (type: PageEventType, e: PageEventArg) => {
    const listeners: ((e: PageEventArg) => void)[] =
      eventListeners.current[type];
    listeners?.forEach((listener) => {
      listener(e);
    });
  };

  const getPageData = () => pageInfo.page.data;

  const close = (res?: any) => {
    closePage(pageInfo.page, res);
  };

  useEffect(() => {
    pageInfo.events = {
      onEnter: (e: PageEventArg) => {
        emitEvent(PageEventType.onEnter, e);
      },
      onLeave: (e: PageEventArg) => {
        emitEvent(PageEventType.onLeave, e);
      },
      onClosing: (e: PageEventArg) => {
        emitEvent(PageEventType.onClosing, e);
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContext.Provider
      value={{ listenEvents, emitEvent, close, getPageData }}
    >
      {children}
    </PageContext.Provider>
  );
};

export default memo(PageContextProvider, () => true);
