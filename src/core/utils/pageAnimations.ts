import { PageAnimationConfig } from "../@types/page";
import { bezier } from "./bezier";

const slideIn = bezier(0.25, 1, 0.5, 1);

export const closeTabAnimationConfig: PageAnimationConfig = {
  duration: 400,
  start(closePage, activePage) {
    const closeStyle = closePage.ref.style;
    const activeStyle = activePage?.ref.style;
    closeStyle.display = "1";
    if (activeStyle) {
      activeStyle.display = "block";
      activeStyle.opacity = "1";
    }
  },
  animate(t, closePage, activePage) {
    const closeStyle = closePage.ref.style;
    const activeStyle = activePage?.ref.style;

    const p = slideIn(t);
    closeStyle.transform = `translateX(${p * 100}%)`;
    if (activeStyle) {
      activeStyle.filter = `brightness(${t * 20 + 80}%)`;
      activeStyle.transform = `translateX(${(p - 1) * 0.2 * 100}%)`;
    }
  },
  end(closePage, activePage) {
    const closeStyle = closePage.ref.style;
    const activeStyle = activePage?.ref.style;

    closeStyle.opacity = "0";
    closeStyle.display = "none";
    if (activeStyle) {
      activeStyle.opacity = "1";
    }
  },
};

export const openTabAnimationConfig: PageAnimationConfig = {
  duration: 300,
  start(newPage, prevPage) {
    const newPageStyle = newPage.ref.style;
    newPageStyle.display = "block";
    newPageStyle.opacity = "0";
  },
  animate(t, newPage, prevPage) {
    const newPageStyle = newPage.ref.style;
    const prevPageStyle = prevPage?.ref.style;

    if (prevPageStyle) {
      prevPageStyle.opacity = `${1 - t}`;
    }
    newPageStyle.opacity = `${t}`;
  },
  end(newPage, prevPage) {
    const prevPageStyle = prevPage?.ref.style;
    if (prevPageStyle) {
      prevPageStyle.display = "none";
    }
  },
};

export const onEnterContainerConfig: PageAnimationConfig = {
  duration: 300,
  animate(t, activePage) {
    const activePageStyle = activePage.ref.style;
    activePageStyle.opacity = `${0.5 + 0.5 * t}`;
  },
};

export const onLeaveContainerConfig: PageAnimationConfig = {
  duration: 500,
  start(closePage, activePage) {},
  animate(t, closePage, activePage) {},
  end(closePage, activePage) {},
};

export const activateTabConfig: PageAnimationConfig = {
  duration: 200,
  start(newPage, prevPage) {
    const newStyle = newPage.ref.style;
    newStyle.display = "block";
    newStyle.opacity = "0";
  },
  animate(t, newPage, prevPage) {
    const newStyle = newPage.ref.style;
    const prevStyle = prevPage?.ref.style;
    newStyle.opacity = `${t}`;
    if (prevStyle) {
      prevStyle.opacity = `${1 - t}`;
    }
  },
  end(newPage, prevPage) {
    const prevPageStyle = prevPage?.ref.style;
    if (prevPageStyle) {
      prevPageStyle.display = "none";
    }
  },
};

export const openTabContainerConfig: PageAnimationConfig = {
  duration: 400,
  start(newPage, prevPage) {
    const newStyle = newPage.ref.style;
    const prevStyle = prevPage?.ref?.style;
    newStyle.display = "block";
    newStyle.zIndex = "2";
    newStyle.transform = "translateX(100%)";

    if (prevStyle) {
      prevStyle.zIndex = "1";
    }
  },
  animate(t, newPage, prevPage) {
    const p = slideIn(t);
    const newStyle = newPage.ref.style;
    const prevStyle = prevPage?.ref?.style;
    newStyle.transform = `translateX(${100 * (1 - p)}%)`;

    if (prevStyle) {
      prevStyle.transform = `translateX(${-p * 100 * 0.2}%)`;
      prevStyle.filter = `brightness(${(1 - t) * 20 + 80}%)`;
    }
  },
  end(newPage, prevPage) {
    const prevStyle = prevPage?.ref?.style;
    if (prevStyle) {
      prevStyle.display = "none";
    }
  },
};

export const onEnterTabContainerConfig: PageAnimationConfig = {
  duration: 400,
  start(newPage, prevPage) {},
  animate(t, newPage, prevPage) {},
  end(newPage, prevPage) {},
};

export const openPartialTabAnimationConfig: PageAnimationConfig = {
  duration: 300,
  start(newPage, prevPage) {
    const newStyle = newPage.ref.style;
    newStyle.display = "block";
    newStyle.opacity = "0";
  },
  animate(t, newPage, prevPage) {
    const newStyle = newPage.ref.style;
    const prevPageStyle = prevPage?.ref.style;

    newStyle.opacity = `${t}`;
    if (prevPageStyle) {
      prevPageStyle.opacity = `${1 - t / 2}`;
    }
  },
};

export const activePartialTabAnimationConfig: PageAnimationConfig = {
  duration: 300,
  start(newPage, prevPage) {
    const newStyle = newPage.ref.style;
    newStyle.display = "block";
    newStyle.opacity = "0";
  },
  animate(t, newPage, prevPage) {
    const newStyle = newPage.ref.style;
    const prevPageStyle = prevPage?.ref.style;

    newStyle.opacity = `${t}`;
    if (prevPageStyle) {
      prevPageStyle.opacity = `${1 - t / 2}`;
    }
  },
};

export const leaveContainerMasterTabAnimationConfig: PageAnimationConfig = {
  duration: 300,
  start(newPage, prevPage) {
    const newStyle = newPage.ref.style;

    newStyle.display = "block";
    newStyle.opacity = "0";
  },
  animate(t, newPage, prevPage) {
    const newStyle = newPage.ref.style;
    const prevPageStyle = prevPage?.ref.style;

    newStyle.opacity = `${t}`;
    if (prevPageStyle) {
      prevPageStyle.opacity = `${1 - t / 2}`;
    }
  },
};

export const onOpenToastConfig: PageAnimationConfig = {
  duration: 300,
  start(newPage, prevPage) {
    const newPageStyle = newPage.ref.style;
    newPageStyle.position = "relative";
    newPageStyle.zIndex = "1";
    newPageStyle.opacity = "0";
  },
  animate(t, newPage, prevPage) {
    const newPageStyle = newPage.ref.style;
    newPageStyle.opacity = t + "";
  },
};

export const onCloseToastConfig: PageAnimationConfig = {
  duration: 300,
  start(closePage, activePage) {
    const closedPageStyle = closePage.ref.style;
    closedPageStyle.zIndex = "0";
  },
  animate(t, closePage, activePage) {
    const p = slideIn(t);
    const closedPageStyle = closePage.ref.style;
    closedPageStyle.opacity = 1 - t + "";
    const offsetHeight = closePage.ref.offsetHeight;
    closedPageStyle.marginTop = `${-offsetHeight * p}px`;
  },
  end(closePage, activePage) {},
};
