export enum PageContainerType {
  MasterTab = "MasterTab",
  Tab = "Tab",
  Modal = "Modal",
  BottomSheet = "BottomSheet",
  Toast = "Toast",
}

export enum PageEventType {
  onInit = "onInit",
  onEnter = "onEnter",
  onLeave = "onLeave",
  onClosing = "onClosing",
}

export interface PageContainerConfig {
  moveBetweenPages?: boolean;
  disableBrowserHistory?: boolean;
}

export interface PageEventArg {
  fromPage?: PageType<any>;
  toPage?: PageType<any>;
  data?: any;
}

export enum ChangeContainerEventType {
  onEnter = "onEnter",
  onLeave = "onLeave",
}

export enum PartialTabContainerType {
  tab1 = "tab1",
  tab2 = "tab2",
  tab3 = "tab3",
}

export interface PageContainerDataType {
  pages: PageType<any>[];
  containerOrder: number;
  config?: PageContainerConfig;
  openPage: (newPage: PageType<any>) => Promise<any>;
  closePage: (
    page: PageType<any>,
    newActivePage?: PageType<any>,
    res?: any,
  ) => Promise<any>;
  activatePage: (page: PageType<any>) => Promise<any>;
  changeContainer: (
    fromPage: PageType<any>,
    eventType: ChangeContainerEventType,
  ) => Promise<any>;
}

export interface PageEvents {
  onEnter?: (e: PageEventArg) => void;
  onLeave?: (e: PageEventArg) => void;
  onClosing?: (e: PageEventArg) => void;
}

export interface PageContextType {
  listenEvents: (events: PageEvents) => () => void;
  emitEvent: (type: PageEventType, e: PageEventArg) => void;
  getPageData: () => any;
  close?: (res?: any) => void;
}

export interface OpenPageOptions {
  disableBackdrop?: boolean;
  params?: any;
  onClickedBackdrop?: () => void;
}
export interface PageType<T> {
  type: PageContainerType | string;
  id: string;
  data?: T;
  className?: string;
  component: (props?: any) => JSX.Element;
  onClose?: (res?: any) => void;
  onClosed?: (res?: any) => void;
  onOpened?: () => void;
  options?: OpenPageOptions;
}

export interface PageInfo {
  id: string;
  page: PageType<any>;
  events?: PageEvents;
  elRef?: HTMLElement;
  onInit?: (el: HTMLElement) => void;
}

export interface PageAnimationConfig {
  duration?: number;
  start?: (newPage: PageRef, prevPage?: PageRef) => void;
  end?: (newPage: PageRef, prevPage?: PageRef) => void;
  animate?: (t: number, newPage: PageRef, prevPage?: PageRef) => void;
}

export interface HistoryItem {
  id: string;
  back: () => void;
}

export interface PageRef {
  page: PageType<any>;
  ref: HTMLElement;
}
