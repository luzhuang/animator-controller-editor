/**
 * Galacean Editor 集成示例
 * 
 * 此示例展示了如何在 Galacean Editor 中集成独立的 AnimatorController 组件
 */

import React, { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { 
  AnimatorController,
  createGalaceanEditorAdapter 
} from 'galacean-animator-controller'
import type { GalaceanEditorAdapterConfig } from 'galacean-animator-controller'

// 假设这些是从 Galacean Editor 导入的
import { useTranslation } from '@editor/i18n'
import { useRootStore } from '@editor/model'
import { EventBus } from '@editor/utils'
import * as EditorUI from '@galacean/editor-ui'
import * as GUI from '@galacean/gui'
import * as TablerIcons from '@tabler/icons-react'

export const IntegratedAnimatorController = observer(() => {
  const rootStore = useRootStore()
  const { t } = useTranslation()
  
  const adapter = useMemo(() => {
    const config: GalaceanEditorAdapterConfig = {
      rootStore,
      uiComponents: {
        // 传递所有 UI 组件
        ...EditorUI,
        gui: GUI,
        icons: {
          // 映射图标
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
      // 可选的其他适配器
      // shortcuts: useShortcuts(),
      // theme: useTheme(),
    }
    
    return createGalaceanEditorAdapter(config)
  }, [rootStore, t])

  return (
    <AnimatorController 
      adapter={adapter}
      style={{ width: '100%', height: '100%' }}
    />
  )
})

export default IntegratedAnimatorController