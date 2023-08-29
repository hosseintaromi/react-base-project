import {
  ChangeContainerEventType,
  PageContainerConfig,
  PageContainerDataType,
  PageContainerType,
  PageType,
} from "../@types/page";
import { listenBack, unlistenBack } from "./history";

const pageContainers: { [name: string]: PageContainerDataType } = {};
const loadedPagesStack: PageType<any>[] = [];

export function registerContainer(
  containerName: string,
  containerOrder: number,
  config: PageContainerConfig,
  openPage: (page: PageType<any>) => Promise<any>,
  closePage: (page: PageType<any>, res?: any) => Promise<any>,
  activatePage: (page: PageType<any>) => Promise<any>,
  changeContainer: (
    fromPage: PageType<any>,
    eventType: ChangeContainerEventType,
  ) => Promise<any>,
) {
  if (pageContainers[containerName]) {
    console.warn("PageModule", "Duplicate container type");
    return;
  }

  pageContainers[containerName] = {
    pages: [],
    containerOrder,
    config,
    openPage,
    closePage,
    activatePage,
    changeContainer,
  };
}

export function removeContainer(containerName: string) {
  if (pageContainers[containerName]) {
    delete pageContainers[containerName];
  }
}

export async function openPage<T = any>(
  page: Omit<PageType<T>, "id"> & {
    id?: string;
  },
) {
  try {
    if (!page.id) {
      page.id = page.type + "-" + Date.now();
    }
    const container = pageContainers[page.type];
    if (!container) {
      return;
    }

    const foundPage = container.pages.find((x) => x.id === page.id);
    if (foundPage && !container.config?.moveBetweenPages) {
      return;
    }

    const topPage = getTopPageFromStack();
    const isSameType = topPage?.type === page.type;
    if (isSameType && topPage?.id === page.id) {
      return;
    }
    if (topPage && !isSameType) {
      const topPageContainer = pageContainers[topPage.type];
      topPageContainer.changeContainer(
        page as PageType<T>,
        ChangeContainerEventType.onLeave,
      );
    }

    if (!container.config?.disableBrowserHistory) {
      listenBack({
        id: page.id,
        back: () => {
          closePage(page as PageType<any>);
        },
      });
    }

    if (foundPage) {
      await container.activatePage(foundPage);
      movePageToTop(foundPage);
    } else {
      container.pages.push(page as PageType<T>);
      await container.openPage(page as PageType<T>);
      page.onOpened?.();
      addToLoadedPageStack(page as PageType<T>);
    }
  } catch (error) {}
}

export async function closePage<T>(page: PageType<T>, res?: any) {
  try {
    const container = pageContainers[page.type];
    if (!container) {
      return;
    }

    const index = container.pages.findIndex((x) => x.id === page.id);
    if (index < 0) {
      return;
    }
    if (isMasterPage()) {
      return;
    }
    const topPage = getTopPageFromStack(page.id);
    const topPageWithSameType = getTopPageFromStack(page.id, page.type as any);
    const isSameType = topPage?.type === page.type;
    if (topPage && !isSameType) {
      const topPageContainer = pageContainers[topPage.type];
      topPageContainer.changeContainer(page, ChangeContainerEventType.onEnter);
    }
    if (!container.config?.disableBrowserHistory) {
      unlistenBack(page.id);
    }
    page.onClose?.(res);
    await container.closePage(page, topPageWithSameType);
    page.onClosed?.(res);
    container.pages.splice(index, 1);
    removeFromLoadedPageStack(page);
  } catch {}
}

function addToLoadedPageStack(page: PageType<any>) {
  loadedPagesStack.push(page);
}

function removeFromLoadedPageStack(page: PageType<any>) {
  const stackIndex = loadedPagesStack.findIndex((x) => x.id === page.id);
  if (stackIndex > -1) {
    loadedPagesStack.splice(stackIndex, 1);
  }
}

function isMasterPage() {
  return loadedPagesStack.length < 2;
}

function movePageToTop(page: PageType<any>) {
  const index = loadedPagesStack.findIndex((x) => x.id === page.id);
  if (index > -1) {
    let temp = loadedPagesStack[index];
    loadedPagesStack.splice(index, 1);
    loadedPagesStack.push(temp);
  }
}

function getTopPageFromStack(
  ignorePageId?: string,
  type?: PageContainerType,
): PageType<any> | undefined {
  for (let i = loadedPagesStack.length - 1; i >= 0; i--) {
    const page = loadedPagesStack[i];
    if (
      page.id !== ignorePageId &&
      (type === undefined || page.type === type)
    ) {
      return page;
    }
  }
}
