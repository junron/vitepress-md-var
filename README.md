# VitePress Markdown Variables

## Demo
https://github.com/user-attachments/assets/81a8d859-d089-44b1-ab88-3d84b1abf646

See [./demo](./demo)

## Installation
1. Create `.vitepress/theme/index.ts`
2. Paste the following code  
```typescript
import DefaultTheme from 'vitepress/theme';
import { useRoute } from 'vitepress';
import mdVar from 'vitepress-md-var';  // TODO: actually publish this package

export default {
    ...DefaultTheme,
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp(ctx);
    },
    setup() {
        const route = useRoute();
        mdVar(route);
    }
};
```


## Configuration

```typescript
export interface MarkdownVariablesConfig {
    // Strings that start with this prefix are treated as variables
    prefix?: string,
    // Strings that start with this prefix are NOT treated as variables
    noVarPrefix?: string,
    // This function will be called to store a variable's value in persistent storage
    storeVar?: ((varName: string, varValue: string) => void),
    // This function will be called to load a variable's value from persistent storage
    loadVar?: ((varName: string) => string|null)
}
```

### Example variable persistence
```typescript
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
```
