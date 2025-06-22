import type { II18n } from '../../types/adapter'

export function createI18n(i18n: any): II18n {
  return {
    t(key: string, params?: Record<string, any>): string {
      if (i18n && typeof i18n.t === 'function') {
        return i18n.t(key, params)
      }
      
      // 如果i18n是一个Hook（如useTranslation的返回值）
      if (i18n && typeof i18n === 'function') {
        return i18n(key, params)
      }
      
      // 降级到返回key本身
      if (params && Array.isArray(params)) {
        // 简单的参数替换
        return key.replace(/\{(\d+)\}/g, (match, index) => {
          return params[parseInt(index)] || match
        })
      }
      
      return key
    },

    getCurrentLanguage(): string {
      if (i18n && typeof i18n.getCurrentLanguage === 'function') {
        return i18n.getCurrentLanguage()
      }
      
      if (i18n && i18n.language) {
        return i18n.language
      }
      
      return 'en'
    }
  }
}