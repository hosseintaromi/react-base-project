import { PageContainerType } from "../@types/page";
import { openPage } from "./page";
import {
  MessageAlert,
  MessageConfirm,
  MessageLoading,
  MessageLoadingPageModel,
  MessageToast,
} from "../@types/commonPage";
import { Alert } from "../components/Alert";
import { Confirm } from "../components/Confirm";
import { Toast } from "../components/Toast";
import { LoadingDialog } from "../components/LoadingDialog";

export function openToast(messageToast: MessageToast) {
  openPage<MessageToast>({
    type: PageContainerType.Toast,
    id: "toast-" + Date.now(),
    data: messageToast,
    component: Toast,
    className: "toast-message",
  });
}

export async function openAlert(messageAlert: MessageAlert) {
  return new Promise((resolve) => {
    openPage<MessageAlert>({
      type: PageContainerType.Tab,
      id: "alert-" + Date.now(),
      component: Alert,
      data: messageAlert,
      onClose: () => {
        resolve(true);
      },
    });
  });
}

export async function openConfirm(messageConfirm: MessageConfirm) {
  try {
    const ok = await openCustomConfirm<MessageConfirm>(Confirm, messageConfirm);
    if (!ok) {
      throw Error("CANCEL");
    }
    return true;
  } catch (error) {
    throw error;
  }
}

export async function openCustomConfirm<T>(
  component: (props?: any) => JSX.Element,
  data: T,
) {
  return new Promise((resolve, reject) => {
    openPage<T>({
      type: PageContainerType.Modal,
      id: "confirm-" + Date.now(),
      component: component,
      data,
      onClose: (res: any) => {
        if (res) {
          resolve(res);
        } else {
          reject(false);
        }
      },
    });
  });
}

export function openLoading(
  messageLoading: MessageLoading,
  pageType?: PageContainerType.Modal | PageContainerType.BottomSheet,
) {
  const model = messageLoading as MessageLoadingPageModel;
  openPage<MessageLoadingPageModel>({
    type: pageType || PageContainerType.Modal,
    id: "loading-" + Date.now(),
    data: model,
    component: LoadingDialog,
    className: "loading-message",
    options: {
      disableBackdrop: true,
      onClickedBackdrop: () => {
        model.onClickedBackdrop?.();
      },
    },
  });
}
