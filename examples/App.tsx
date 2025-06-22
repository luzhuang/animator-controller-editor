import React from 'react'
import { AnimatorController } from '../src'
import { createMockAdapter } from './mock-adapter'

// 创建适配器实例
const adapter = createMockAdapter()

export function App() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h1 style={{ margin: '10px', fontSize: '16px' }}>AnimatorController 容器尺寸测试</h1>
      
      {/* 容器尺寸测试 */}
      <div 
        style={{ 
          flex: 1,
          border: '2px solid red', 
          margin: '10px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0 // 重要：允许 flex 子元素收缩
        }}
      >
        <div style={{ padding: '5px', background: '#f0f0f0', fontSize: '12px' }}>
          容器边框（红色）- 应该包含整个 AnimatorController
        </div>
        
        <div style={{ 
          flex: 1, 
          border: '2px solid blue',
          margin: '5px',
          display: 'flex',
          minHeight: 0
        }}>
          <AnimatorController adapter={adapter} />
        </div>
      </div>
    </div>
  )
}