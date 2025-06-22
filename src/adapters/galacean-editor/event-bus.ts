import type { IEventBus } from '../../types/adapter'

export function createEventBus(eventBus: any): IEventBus {
  return {
    emit(event: string, ...args: any[]): void {
      if (eventBus && typeof eventBus.emit === 'function') {
        eventBus.emit(event, ...args)
      } else if (eventBus && typeof eventBus.trigger === 'function') {
        eventBus.trigger(event, ...args)
      }
    },

    on(event: string, callback: (...args: any[]) => void): () => void {
      if (eventBus && typeof eventBus.on === 'function') {
        eventBus.on(event, callback)
        return () => {
          if (typeof eventBus.off === 'function') {
            eventBus.off(event, callback)
          } else if (typeof eventBus.removeListener === 'function') {
            eventBus.removeListener(event, callback)
          }
        }
      }
      
      // 返回空的清理函数
      return () => {}
    },

    off(event: string, callback: (...args: any[]) => void): void {
      if (eventBus && typeof eventBus.off === 'function') {
        eventBus.off(event, callback)
      } else if (eventBus && typeof eventBus.removeListener === 'function') {
        eventBus.removeListener(event, callback)
      }
    }
  }
}