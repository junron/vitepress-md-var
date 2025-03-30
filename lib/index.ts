import { nextTick, onMounted, watch } from "vue";
import {
  defaultMarkdownVariablesConfig,
  MarkdownVariablesConfig,
  styling
} from "./config";

const counters = new Map();
const varValues = new Map();
let observer: MutationObserver | null = null;
let globalConfig = defaultMarkdownVariablesConfig;

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function handleElement(elem) {
  const prefix = globalConfig.prefix!!;
  elem.innerHTML = elem.innerHTML.replace(
    new RegExp(escapeRegExp(prefix) + "(\\w+)", "g"), (fullMatch, ...args) => {
      let [varName, varPosition, ..._] = args;
      // If the item occurs at the start, it's probably not a variable
      if (varPosition == 0 || elem.innerText.indexOf(fullMatch) === 0) {
        return fullMatch;
      }
      // Some common constants
      if (["true", "false", "null"].includes(varName.toLowerCase())) {
        return fullMatch;
      }
      // Input variables probably don't start with underscore
      if (varName.startsWith("_")) {
        return fullMatch;
      }
      if (globalConfig.noVarPrefix) {
        const no_var_prefix = globalConfig.noVarPrefix;
        if (fullMatch.startsWith(no_var_prefix)) {
          return (
            prefix + varName.substring(no_var_prefix.length - prefix.length)
          );
        }
      }
      const count = (counters.get(varName) || 0) + 1;
      counters.set(varName, count);
      if (!varValues.has(varName)) {
        varValues.set(varName, fullMatch);
        if (globalConfig.loadVar) {
          const val = globalConfig.loadVar(varName);
          if (val) {
            varValues.set(varName, val);
          }
        }
      }
      const displayValue = varValues.get(varName);
      return (
        `<span class='md-var md-var-${varName}' id='md-var-span-${varName}-${count}'>${displayValue}</span>` +
        `<input class='md-var md-var-hidden md-var-${varName}' id='md-var-input-${varName}-${count}' autocomplete=off value='${displayValue}'>`
      );
    }
  );
}

function initializeInput(element: HTMLInputElement) {
  element.addEventListener("input", () => {
    const inputElement = element as HTMLInputElement;
    const [_a, _b, _c, varName, idx] = element.id.split("-");
    const spanElement = document.getElementById(
      `md-var-span-${varName}-${idx}`
    )!!;
    varValues.set(varName, inputElement.value);
    document.querySelectorAll(`span.md-var-${varName}`).forEach((elem) => {
      const spanElem = elem as HTMLSpanElement;
      spanElem.innerText = inputElement.value;
    });
    inputElement.style.width =
      (spanElement as HTMLSpanElement).offsetWidth + 5 + "px";
  });
  element.addEventListener("focusout", () => {
    const inputElement = element as HTMLInputElement;
    const [_a, _b, _c, varName, idx] = element.id.split("-");
    const spanElement = document.getElementById(
      `md-var-span-${varName}-${idx}`
    )!!;
    inputElement.classList.add("md-var-hidden");
    spanElement.classList.remove("md-var-hidden");
    document.querySelectorAll(`input.md-var-${varName}`).forEach((elem) => {
      const inputElem = elem as HTMLInputElement;
      inputElem.value = inputElement.value;
    });
    if (!inputElement.value) {
      inputElement.value = globalConfig.prefix + varName;
      document.querySelectorAll(`span.md-var-${varName}`).forEach((elem) => {
        const spanElem = elem as HTMLSpanElement;
        spanElem.innerText = inputElement.value;
      });
    }
    if (globalConfig.storeVar) {
      globalConfig.storeVar(varName, inputElement.value);
    }
  });
}

function initializeSpan(element: HTMLSpanElement) {
  element.addEventListener("click", () => {
    element.classList.add("md-var-hidden");
    const [_a, _b, _c, varName, idx] = element.id.split("-");
    const inputElement = document.getElementById(
      `md-var-input-${varName}-${idx}`
    )!! as HTMLInputElement;
    inputElement.classList.remove("md-var-hidden");
    inputElement.style.width =
      (element as HTMLSpanElement).offsetWidth + 5 + "px";
    inputElement.select();
  });
}

const refreshVars = () => {
  const style = styling.get(globalConfig.styling!!.toLowerCase()) ?? globalConfig.styling;
  const inputStyle = document.createElement("style");
  inputStyle.innerHTML = `
    input.md-var-hidden {
      display: none;
    }
    span.md-var-hidden {
      visibility: hidden;
      white-space: pre;
      position: absolute;
    }
    ` + style;
  for (const elem of document.querySelectorAll("code")) {
    handleElement(elem);
  }
  document.head.appendChild(inputStyle);
  document.querySelectorAll("span.md-var").forEach((element) => {
    initializeSpan(element as HTMLSpanElement);
  });
  document.querySelectorAll("input.md-var").forEach((element) => {
    initializeInput(element as HTMLInputElement);
  });

  function observeElementCreation(parentElement, callback) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              callback(node);
            }
          });
        }
      });
    });

    observer.observe(parentElement, {
      childList: true,
      subtree: true,
    });

    return observer;
  }

  if (observer) {
    observer.disconnect();
  }

  observer = observeElementCreation(document.body, (newElement) => {
    for (const newCodeBlock of newElement.querySelectorAll("code")) {
      handleElement(newCodeBlock);
    }
    newElement.querySelectorAll("input.md-var").forEach((elem) => {
      initializeInput(elem as HTMLInputElement);
    });
    newElement.querySelectorAll("span.md-var").forEach((elem) => {
      initializeSpan(elem as HTMLSpanElement);
    });
  });
};

const mdVar = (
  route,
  config: MarkdownVariablesConfig = defaultMarkdownVariablesConfig
) => {
  onMounted(() => {
    nextTick(refreshVars).catch();
  });
  watch(
    () => route.data,
    () => {
      nextTick(refreshVars).catch();
    }
  );
  globalConfig = { ...defaultMarkdownVariablesConfig, ...config };
};
export default mdVar;
