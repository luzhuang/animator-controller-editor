# Galacean Editor 集成指南

本文档描述了如何在 Galacean Editor 项目中集成独立的 AnimatorController 组件。

## 安装

### 作为 Git Submodule

```bash
# 在主项目根目录下
git submodule add <repository-url> galacean-animator-controller
git submodule update --init --recursive

# 安装依赖
cd galacean-animator-controller
pnpm install

# 构建
pnpm build
```

### 作为 NPM 包

```bash
pnpm add galacean-animator-controller
```

## 基本使用

### 1. 替换主 AnimatorController 组件

在 `packages/pages/src/editor/components/AnimatorController/index.tsx` 中：

```tsx
import React, { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { 
  AnimatorController as StandaloneAnimatorController,
  createGalaceanEditorAdapter 
} from 'galacean-animator-controller'

import { useTranslation } from '@editor/i18n'
import { useRootStore } from '@editor/model'
import { EventBus } from '@editor/utils'
import * as EditorUI from '@galacean/editor-ui'
import * as GUI from '@galacean/gui'
import * as TablerIcons from '@tabler/icons-react'

export default observer(() => {
  const rootStore = useRootStore()
  const { t } = useTranslation()
  
  const adapter = useMemo(() => {
    return createGalaceanEditorAdapter({
      rootStore,
      uiComponents: {
        ...EditorUI,
        gui: GUI,
        icons: {
          Plus: TablerIcons.IconPlus,
          Minus: TablerIcons.IconMinus,
          Settings: TablerIcons.IconSettings,
          Trash: TablerIcons.IconTrash,
          Copy: TablerIcons.IconCopy,
          SquareRounded: TablerIcons.IconSquareRounded,
        }
      },
      eventBus: EventBus,
      i18n: { t },
    })
  }, [rootStore, t])

  return <StandaloneAnimatorController adapter={adapter} />
})
```

### 2. 替换 Inspector 组件

在 `packages/pages/src/editor/components/InspectorAnimatorController/index.tsx` 中：

```tsx
import React, { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { 
  Inspector as StandaloneInspector,
  createGalaceanEditorAdapter,
  useAnimatorControllerStore 
} from 'galacean-animator-controller'

// ... 其他导入

export const AnimatorStateInspector = observer(() => {
  const rootStore = useRootStore()
  const { t } = useTranslation()
  
  const adapter = useMemo(() => {
    return createGalaceanEditorAdapter({
      rootStore,
      uiComponents: { /* ... */ },
      eventBus: EventBus,
      i18n: { t },
    })
  }, [rootStore, t])

  const store = useAnimatorControllerStore(adapter)

  return <StandaloneInspector adapter={adapter} store={store} />
})
```

## 适配器配置

### 必需配置

- `rootStore`: Galacean Editor 的根状态存储
- `uiComponents`: UI 组件库映射
- `eventBus`: 事件总线实例
- `i18n`: 国际化函数

### 可选配置

- `shortcuts`: 快捷键管理器
- `theme`: 主题管理器

## 类型安全

该包提供完整的 TypeScript 类型定义：

```tsx
import type { 
  IAnimatorControllerAdapter,
  GalaceanEditorAdapterConfig,
  AnimatorControllerProps
} from 'galacean-animator-controller'
```

## 迁移注意事项

1. **依赖管理**: 确保主项目中的 `@galacean/engine` 版本兼容
2. **状态同步**: 适配器会自动处理与主项目状态的同步
3. **事件处理**: 所有事件会通过适配器转发到主项目的事件系统
4. **样式主题**: 组件会自动使用主项目的 CSS 变量和主题

## 开发模式

如果需要同时开发 AnimatorController 和主项目：

```bash
# 在 galacean-animator-controller 目录下
pnpm dev

# 在主项目目录下  
pnpm dev
```

## 故障排除

### 常见问题

1. **类型错误**: 确保安装了所有 peer dependencies
2. **样式问题**: 检查 CSS 变量是否正确传递
3. **事件不响应**: 验证 eventBus 配置是否正确

### 调试技巧

1. 在适配器配置中添加日志：
   ```tsx
   const adapter = createGalaceanEditorAdapter({
     // ... 配置
     onDebug: (message) => console.log('[AnimatorController]', message)
   })
   ```

2. 检查适配器状态：
   ```tsx
   console.log('Adapter state:', adapter.stateManager.getState())
   ```