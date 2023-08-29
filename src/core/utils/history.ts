import { HistoryItem } from "../@types/page";

let registeredHistory = false;
let browserAction = true;
const historyStack: HistoryItem[] = [];
var queryParams: any;

(function registerBrowserHistory() {
  if (registeredHistory) {
    return;
  }
  window.onpopstate = onPopState;
  document.addEventListener("popstate", onPopState);
  document.addEventListener("keydown", escapeHandler, false);
  registeredHistory = true;
})();

function onPopState(e: any) {
  if (browserAction) {
    handleBrowserAction(e.state);
  }
}

function handleBrowserAction(state: any) {
  if (historyStack.length > 0) {
    doBack();
  }
}

function escapeHandler(e: any) {
  if (e.key === "Escape") {
    window.history.back();
  }
}

export function listenBack(historyItem: HistoryItem) {
  setTimeout(() => {
    window.history.pushState(
      {
        id: historyItem.id,
        name: historyItem.id,
      },
      historyItem.id,
    );
  }, 100);
  historyStack.push(historyItem);
}

export function unlistenBack(pageId: string) {
  const index = historyStack.findIndex((x) => x.id === pageId);
  if (index >= 0) {
    historyStack.splice(index, 1);
  }
}

function doBack() {
  const backItem = historyStack.pop();
  if (backItem) {
    backItem.back();
  }
}

export function disableBrowserAction() {
  browserAction = false;
  setTimeout(() => {
    browserAction = true;
  }, 1000);
}

function getAllQueryParams() {
  const href = window.location.href;
  let index = href.indexOf("?");
  let params: string = "";
  if (index > 0) {
    params = href.substring(index + 1);
  }
  return params.split("&").reduce((result, item) => {
    const param = item.split("=");
    (result as any)[param[0]] = param[1];
    return result;
  }, {});
}

export function getQueryParam(key: string) {
  if (!queryParams) {
    queryParams = getAllQueryParams();
  }
  return queryParams[key];
}

export function replaceUrlWithoutQueryParam(key: string) {
  const sourceURL = window.location.href;
  const newUrl = removeParam(key, sourceURL);
  window.history.replaceState({}, document.title, newUrl);
}

function removeParam(key: string, sourceURL: string) {
  var rtn = sourceURL.split("?")[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=")[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    if (params_arr.length) rtn = "/?" + params_arr.join("&");
  }
  return rtn;
}
