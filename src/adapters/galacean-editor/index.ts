import type { IAnimatorControllerAdapter } from '../../types/adapter'
import { createStateManager } from './state-manager'
import { createUIComponents } from './ui-components'
import { createEventBus } from './event-bus'
import { createI18n } from './i18n'
import { createShortcuts } from './shortcuts'
import { createTheme } from './theme'

export interface GalaceanEditorAdapterConfig {
  /** 根存储实例 */
  rootStore: any
  
  /** UI组件库实例 */
  uiComponents: any
  
  /** 事件总线实例 */
  eventBus: any
  
  /** 国际化实例 */
  i18n: any
  
  /** 快捷键管理器（可选） */
  shortcuts?: any
  
  /** 主题管理器（可选） */
  theme?: any
}

/**
 * 创建Galacean Editor适配器
 * @param config 适配器配置
 * @returns 适配器实例
 */
export function createGalaceanEditorAdapter(config: GalaceanEditorAdapterConfig): IAnimatorControllerAdapter {
  const {
    rootStore,
    uiComponents: rawUIComponents,
    eventBus: rawEventBus,
    i18n: rawI18n,
    shortcuts: rawShortcuts,
    theme: rawTheme
  } = config

  return {
    stateManager: createStateManager(rootStore),
    uiComponents: createUIComponents(rawUIComponents),
    eventBus: createEventBus(rawEventBus),
    i18n: createI18n(rawI18n),
    shortcuts: rawShortcuts ? createShortcuts(rawShortcuts) : undefined,
    theme: rawTheme ? createTheme(rawTheme) : undefined,
  }
}

// 重新导出相关函数
export { createStateManager, createUIComponents, createEventBus, createI18n, createShortcuts, createTheme }