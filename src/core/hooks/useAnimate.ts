import { useEffect, useRef, useCallback } from "react";
import { requestAnimation } from "../utils/animator";

export const useAnimate = () => {
  const cancelRef = useRef<(() => void)[]>([]);

  const removeCancelRequest = useCallback((request: () => void) => {
    const index = cancelRef.current.findIndex((x) => x === request);
    if (index >= 0) {
      cancelRef.current.splice(index, 1);
    }
  }, []);

  const requestAnimate = useCallback(
    (
      duration: number,
      animate: (t: number) => void,
      completed: () => void,
      canceled?: () => void,
    ) => {
      const request = requestAnimation(
        duration,
        (t: number) => {
          animate(t);
        },
        () => {
          removeCancelRequest(request);
          completed();
        },
        () => {
          removeCancelRequest(request);
          canceled?.();
        },
      );
      cancelRef.current.push(request);
      return request;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const cancelAnimate = useCallback((cancelRequest: () => void) => {
    removeCancelRequest(cancelRequest);
    cancelRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      cancelRef.current.forEach((cancelRequest) => {
        cancelRequest();
      });
      cancelRef.current = [];
    },
    [],
  );

  return {
    requestAnimate,
    cancelAnimate,
  };
};
