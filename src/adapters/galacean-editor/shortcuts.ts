import type { IShortcuts } from '../../types/adapter'

export function createShortcuts(shortcuts: any): IShortcuts {
  return {
    useShortcutsScope(scope: string): void {
      if (shortcuts && typeof shortcuts.useShortcutsScope === 'function') {
        shortcuts.useShortcutsScope(scope)
      }
    },

    register(key: string, callback: () => void): () => void {
      if (shortcuts && typeof shortcuts.register === 'function') {
        return shortcuts.register(key, callback)
      }
      
      if (shortcuts && typeof shortcuts.on === 'function') {
        shortcuts.on(key, callback)
        return () => {
          if (typeof shortcuts.off === 'function') {
            shortcuts.off(key, callback)
          }
        }
      }
      
      // 返回空的清理函数
      return () => {}
    }
  }
}