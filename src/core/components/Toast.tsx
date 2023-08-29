import { useEffect, useRef } from "react";
import { usePage } from "../hooks/usePage";
import { MessageToast } from "../@types/commonPage";

export function Toast() {
  const timer = useRef<NodeJS.Timeout>();

  const { close, pageData } = usePage<MessageToast>({});

  useEffect(() => {
    if (pageData.delay) {
      timer.current = setTimeout(() => {
        close();
      }, pageData.delay * 1000);
    }
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-100">
      <div className="row">
        <h1 className="col-8">{pageData.message}</h1>
        <button className="col-3 btn btn-success" onClick={() => close(true)}>
          delete
        </button>
      </div>
    </div>
  );
}
