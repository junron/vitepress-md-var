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
        mdVar({route});
    }
};
```
