import React from 'react'
import { ThemeProvider } from '@galacean/editor-ui'

import { createMockAdapter } from './mock-adapter'

import { AnimatorController } from '../src'

// 创建适配器实例
const adapter = createMockAdapter()

export function App() {
  return (
    <ThemeProvider>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
        <AnimatorController adapter={adapter} />
      </div>
    </ThemeProvider>
  )
}
