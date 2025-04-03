import { defineConfig } from "vitepress";

export default defineConfig({
  title: "md-var demo",
  description: "md-var demo",
  themeConfig: {
    sidebar: [
      {
        text: "Demo",
        link: "/index.html",
      },
      {
        text: "Rule test",
        link: "/rule-test.html",
      },
      {
        text: "XSS test",
        link: "/xss-test.html",
      },
    ],
  },
});
