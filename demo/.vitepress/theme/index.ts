import DefaultTheme from "vitepress/theme";
import { useRoute } from "vitepress";
import mdVar from "../../../lib/index";

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
  },
  setup() {
    const route = useRoute();
    mdVar(route, {
      loadVar: (varName) => localStorage.getItem("MD_" + varName),
      storeVar: (varName, varVal) =>
        localStorage.setItem("MD_" + varName, varVal),
    });
  },
};
