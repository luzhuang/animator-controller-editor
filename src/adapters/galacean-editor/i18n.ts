import type { II18n } from '../../types/adapter'

// 简化的 adapter i18n，只提供接口兼容性
export function createI18n(externalI18n?: any): II18n {
  return {
    t(key: string, params?: Record<string, any> | any[]): string {
      // 简单的降级实现，返回 key
      return key
    },

    getCurrentLanguage(): string {
      return 'en'
    },
  }
}
