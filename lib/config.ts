export interface MarkdownVariablesConfig {
  // Strings that start with this prefix are treated as variables
  prefix?: string;
  // Strings that start with this prefix are NOT treated as variables
  noVarPrefix?: string;
  // Theme to use. Specify either "default" (google cloud docs), "thr" (the hacker recipes) or specify your own CSS
  styling?: string;
  // This function will be called to store a variable's value in persistent storage
  storeVar?: (varName: string, varValue: string) => void;
  // This function will be called to load a variable's value from persistent storage
  loadVar?: (varName: string) => string | null;
}

export const defaultMarkdownVariablesConfig: MarkdownVariablesConfig = {
  prefix: "$",
  noVarPrefix: "$no_md_var_",
  styling: "default",
};

export const styling = new Map([
  [
    "thr",
    `html:not(.dark) span.md-var{
        color: #d01884 !important;
        border-bottom: 1px dashed #d01884;
    }

    html.dark span.md-var{
        color: #ff8bcb !important;
        border-bottom: 1px dashed #ff8bcb;
    }

    html:not(.dark) input.md-var {
        font: inherit;
        background: transparent;
        color: #d01884;
    }

    html.dark input.md-var {
        font: inherit;
        background: transparent;
        color: #ff8bcb;
    }`,
  ],
  [
    "default",
    `
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
    `
  ]
]);
