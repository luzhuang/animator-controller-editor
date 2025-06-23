// 主要组件
export { AnimatorController } from './components/AnimatorController'
export type { AnimatorControllerProps } from './components/AnimatorController'

// 类型定义
export type { IAnimatorControllerAdapter } from './types/adapter'
export type {
  AnimatorControllerItem,
  AnimatorControllerEditorState,
  StateType,
  ParameterValueType,
  ContextMenuInfo,
  IStateData,
  IConditionData,
  ITransitionData,
  IStateMachineData,
  ILayerData,
  IParameterData,
  IAnimatorControllerAsset,
  IGraphNodeData,
  IGraphEdgeData,
  IRefObject,
  IEntityModel,
  IAnimatorComponent,
} from './types/animator'

// 存储
export { AnimatorControllerStore } from './stores/AnimatorControllerStore'
export { AnimatorStateMachineGraph } from './stores/graph'
export { State } from './stores/state'
export { Transition } from './stores/transition'

// Hooks
export { useAnimatorControllerStore } from './hooks/useAnimatorControllerStore'

// 独立组件（可选导出）
export { LeftSide } from './components/LeftSide'
export { RightSide } from './components/RightSide'
export { NeedCreatedState } from './components/NeedCreatedState'
export { Inspector } from './components/Inspector'

// 适配器
export { createGalaceanEditorAdapter } from './adapters/galacean-editor'
export type { GalaceanEditorAdapterConfig } from './adapters/galacean-editor'

// 国际化
export { createI18n, defaultI18n, translations, SUPPORTED_LANGUAGES } from './i18n'
export type { II18nInstance, II18nResource, SupportedLanguage } from './i18n'
