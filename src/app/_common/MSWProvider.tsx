"use client";

import { PropsWithChildren, useEffect, useState } from "react";

const isAPIMockingMode = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

const unhandledRequest = [
  "/ellipsisIcon.svg",
  "/?_rsc",
  "_next",
  "www.gstatic.com",
  "translate.googleapis.com",
  "fonts.gstatic.com",
] as const;

const MSWProvider = ({ children }: PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined") {
        if (isAPIMockingMode) {
          const { worker } = await import("@/mocks/browser");
          await worker.start({
            onUnhandledRequest: (request) => {
              for (let i = 0; i < unhandledRequest.length; i++) {
                if (request.url.includes(unhandledRequest[i])) {
                  return;
                }
              }
            },
          });

          setIsReady(true);
        }
      }
    };
    if (!isReady) init();
  }, [isReady]);
  if (isAPIMockingMode && !isReady) return null;
  return <>{children}</>;
};
export default MSWProvider;
