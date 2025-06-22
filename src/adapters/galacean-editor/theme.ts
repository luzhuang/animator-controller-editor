import type { ITheme } from '../../types/adapter'

export function createTheme(theme: any): ITheme {
  return {
    getCSSVariable(name: string): string {
      if (theme && typeof theme.getCSSVariable === 'function') {
        return theme.getCSSVariable(name)
      }
      
      // 尝试从CSS自定义属性中获取
      if (typeof document !== 'undefined') {
        const value = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`)
        if (value) {
          return value.trim()
        }
      }
      
      // 返回默认值
      return ''
    },

    getCurrentTheme(): 'light' | 'dark' {
      if (theme && typeof theme.getCurrentTheme === 'function') {
        return theme.getCurrentTheme()
      }
      
      if (theme && theme.theme) {
        return theme.theme
      }
      
      // 尝试从CSS或localStorage中检测
      if (typeof document !== 'undefined') {
        const classList = document.documentElement.classList
        if (classList.contains('dark')) {
          return 'dark'
        }
      }
      
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('theme')
        if (stored === 'dark' || stored === 'light') {
          return stored
        }
      }
      
      // 默认为light主题
      return 'light'
    }
  }
}