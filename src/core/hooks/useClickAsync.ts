import { useEffect, MutableRefObject, useRef } from "react";
export const useClickAsync = <T>(
  asyncRequest: () => Promise<T>,
  success?: (res: T) => void,
  failed?: (error: string) => void,
) => {
  const loadingRef = useRef<boolean>(false);

  const elRef: MutableRefObject<any | undefined> = { current: undefined };

  useEffect(() => {
    const element = elRef.current;
    if (!element) {
      return;
    }
    element.addEventListener("click", async (e: any) => {
      try {
        if (loadingRef.current) {
          return;
        }
        element.classList.add("loading");
        loadingRef.current = true;
        const res = await asyncRequest();
        loadingRef.current = false;
        element.classList.remove("loading");
        success?.(res);
      } catch (error: any) {
        element.classList.remove("loading");
        loadingRef.current = false;
        failed?.(error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return elRef;
};
