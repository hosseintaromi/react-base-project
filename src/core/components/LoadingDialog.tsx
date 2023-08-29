import { useEffect, useRef, useState } from "react";
import { usePage } from "../hooks/usePage";
import {
  MessageLoadingResponseData,
  MessageLoadingPageModel,
  MessageLoadingResponseType,
} from "../@types/commonPage";

export function LoadingDialog() {
  const [loadingEnd, setLoadingEnd] = useState<
    MessageLoadingResponseData | undefined
  >();

  const loaded = useRef<boolean>(false);
  const { pageData, close } = usePage<MessageLoadingPageModel>({});

  const callLoading = async () => {
    try {
      const loadingEndRes = await pageData.callback();
      if (loadingEndRes.type === MessageLoadingResponseType.Close) {
        close();
      } else {
        setLoadingEnd(loadingEndRes);
      }
    } catch {
      close();
    }
  };

  useEffect(() => {
    callLoading();
    pageData.onClickedBackdrop = () => {
      if (loaded.current) {
        close();
      }
    };
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loaded.current = !!loadingEnd;
  }, [loadingEnd]);

  return (
    <div>
      {loadingEnd ? (
        <>
          <span>{loadingEnd.message}</span>
          {loadingEnd.type === MessageLoadingResponseType.Confirm && (
            <button
              className="btn btn-primary w-100"
              onClick={() => close(true)}
            >
              {loadingEnd.confirmButtonCaption}
            </button>
          )}
        </>
      ) : (
        <>
          <span>{pageData.message}</span>
          <span>loading...</span>
        </>
      )}
    </div>
  );
}
