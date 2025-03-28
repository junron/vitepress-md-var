import { nextTick, onMounted, watch, onUpdated, onBeforeUpdate } from "vue";

function handleElement(elem, counters, varValues){
  elem.innerHTML = elem.innerHTML.replace(/\$(\w+)/g, (a, ...args) => {
    if(args[1] == 0){
      // If the item occurs at the start, it's probably not a variable
      return a;
    }
    if(["$true", "$false", "$null"].includes(a.toLowerCase())){
      // Some common constants
      return a;
    }
    if(a.startsWith("$_")){
      return a;
    }
    if(a.startsWith("$no_md_var_")){
      return "$"+a.substring("$no_md_var_".length);
    }
    a = a.substring(1);
    const count = (counters.get(a) || 0) + 1;
    counters.set(a, count);
    if (!varValues.has(a)) {
      varValues.set(a, "$" + a);
    }
    return (
      `<span class='md-var md-var-${a}' id='md-var-span-${a}-${count}'>$${a}</span>` +
      `<input class='md-var md-var-hidden md-var-${a}' id='md-var-input-${a}-${count}' autocomplete=off value=${varValues.get(
        a
      )}>`
    );
  });
}

function findVarsInCode() {
  const counters = new Map();
  const varValues = new Map();

  for(const elem of document.querySelectorAll(':not(.vp-doc) code')){
    handleElement(elem, counters, varValues);
  }

  return varValues;
}

const refreshVars = () => {
  const varValues = findVarsInCode();
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
    html:not(.dark) span.md-var{
      color: #d01884 !important;
      border-bottom: 1px dotted #d01884;
    }
    html.dark span.md-var{
      color: #ff8bcb !important;
      border-bottom: 1px dotted #ff8bcb;
    }
    input.md-var {
      font: inherit;
      background: white;
      color: black;
      padding: 1px;
    }
  `;
  document.head.appendChild(inputStyle);
  document.querySelectorAll("span.md-var").forEach((element) => {
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
  });
  document.querySelectorAll("input.md-var").forEach((element) => {
    element.addEventListener("input", () => {
      const inputElement = element as HTMLInputElement;
      const [_a, _b, _c, varName, idx] = element.id.split("-");
      const spanElement = document.getElementById(
        `md-var-span-${varName}-${idx}`
      )!!;
      varValues.set(varName.substring(1), inputElement.value);
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
    });
  });
}

const mdVar = (vitepressObj) => {
  const { route } = vitepressObj;
  onMounted(() => {
    nextTick(refreshVars).catch();
  });
  watch(() => route.data, () => {
    nextTick(refreshVars).catch();
});
};
export default mdVar;
