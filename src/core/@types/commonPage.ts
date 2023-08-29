export interface MessageConfirm {
  message: string;
  title?: string;
}

export enum MessageType {
  Success = "Success",
  Error = "Error",
}

export enum MessageLoadingResponseType {
  Close = "Close",
  Confirm = "Confirm",
}

export interface MessageAlert {
  message: string;
  title?: string;
  type?: MessageType;
}

export interface MessageToast {
  message: string;
  type?: MessageType;
  delay?: number;
}

export interface MessageLoadingResponseData {
  type: MessageLoadingResponseType;
  message?: string;
  messageType?: MessageType;
  confirmButtonCaption?: string;
}

export interface MessageLoading {
  message: string;
  callback: () => Promise<MessageLoadingResponseData>;
}

export interface MessageLoadingPageModel extends MessageLoading {
  onClickedBackdrop?: () => void;
}
