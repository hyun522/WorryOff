import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "worry-off",
  brand: {
    displayName: "걱정 끄기", // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
    primaryColor: "#0863F4", // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: "https://static.toss.im/appsintoss/55295/87f2775a-6df6-4063-80a6-9eceb56d5667.png", // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
  },
  web: {
    host: "0.0.0.0",
    // host: "10.138.17.170",
    port: 5173,
    commands: {
      // dev: "vite --host 0.0.0.0 --port 5174",
      dev: "vite --host",
      build: "vite build",
    },
  },

  permissions: [
    {
      name: "clipboard",
      access: "read",
    },
    {
      name: "clipboard",
      access: "write",
    },
    {
      name: "camera",
      access: "access",
    },
    {
      name: "photos",
      access: "read",
    },
  ],
  outdir: "dist",
  webViewProps: {
    type: "partner", //비게임
  },
});
