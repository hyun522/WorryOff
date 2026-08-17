import { useEffect, useRef, type CSSProperties } from "react";
import { TossAds } from "@apps-in-toss/web-framework";

// 테스트 배너 광고 ID (리스트형). 실제 배포 전 콘솔에서 발급받은 운영용 adGroupId로 교체해야 함
const AD_GROUP_ID = "ait-ad-test-banner-id";

let initializePromise: Promise<boolean> | null = null;

function ensureTossAdsInitialized() {
  if (!TossAds.initialize.isSupported()) {
    console.warn("[toss-ad] Banner ads are not supported in this environment.");
    return Promise.resolve(false);
  }

  initializePromise ??= new Promise((resolve) => {
    TossAds.initialize({
      callbacks: {
        onInitialized: () => {
          console.info("[toss-ad] SDK initialized.");
          resolve(true);
        },
        onInitializationFailed: (error) => {
          if (error.message.includes("Already initialized")) {
            resolve(true);
            return;
          }

          console.error("[toss-ad] SDK initialization failed.", error);
          resolve(false);
        },
      },
    });
  });

  return initializePromise;
}

function BannerAdSlot() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCleanedUp = false;
    let attachedBanner: { destroy: () => void } | null = null;

    ensureTossAdsInitialized().then((isInitialized) => {
      if (isCleanedUp || !isInitialized || !containerRef.current) return;

      if (!TossAds.attachBanner.isSupported()) {
        console.warn("[toss-ad] attachBanner is not supported in this environment.");
        return;
      }

      attachedBanner = TossAds.attachBanner(AD_GROUP_ID, containerRef.current, {
        callbacks: {
          onAdRendered: (payload) => {
            console.info("[toss-ad] Banner rendered.", payload);
          },
          onNoFill: (payload) => {
            console.warn("[toss-ad] No banner ad fill.", payload);
          },
          onAdFailedToRender: (payload) => {
            console.error("[toss-ad] Banner failed to render.", payload);
          },
        },
      });
    });

    return () => {
      isCleanedUp = true;
      attachedBanner?.destroy();
    };
  }, []);

  return <div ref={containerRef} style={bannerContainerStyle} />;
}

const bannerContainerStyle: CSSProperties = {
  width: "100%",
  height: 96,
  flexShrink: 0,
};

export default BannerAdSlot;
