import type { IStateManager } from '../../types/adapter'

export function createStateManager(rootStore: any): IStateManager {
  return {
    subscribe<T>(selector: () => T, callback: (value: T) => void): () => void {
      // 在MobX中，可以使用autorun或reaction来订阅状态变化
      // 这里需要根据实际的rootStore实现来适配
      let previousValue = selector()
      
      const dispose = rootStore.subscribe?.(() => {
        const currentValue = selector()
        if (currentValue !== previousValue) {
          previousValue = currentValue
          callback(currentValue)
        }
      })
      
      return dispose || (() => {})
    },

    getState(): any {
      return rootStore
    },

    setState(updater: (state: any) => any): void {
      // MobX通常通过actions来更新状态
      // 这里可能需要根据具体的rootStore实现来适配
      const newState = updater(rootStore)
      if (newState !== rootStore) {
        Object.assign(rootStore, newState)
      }
    },

    getRootStore(): any {
      return rootStore
    },

    getUndoManager(): any {
      return rootStore.undoManager
    }
  }
}