import React from 'react'
import type { IAnimatorControllerAdapter } from '../src/types/adapter'
import { createMockStateManager } from './mock-state-manager'

export function createMockAdapter(type: 'basic' | 'advanced' = 'basic', hasController: boolean = true): IAnimatorControllerAdapter {
  const stateManager = createMockStateManager(hasController)

  return {
    stateManager,
    uiComponents: {
      // 基础组件
      Button: ({ children, ...props }) => 
        React.createElement('button', {
          ...props,
          style: {
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            ...props.style
          }
        }, children),
      
      Input: (props) => 
        React.createElement('input', {
          ...props,
          style: {
            padding: '6px 8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            ...props.style
          }
        }),
      
      Select: ({ children, ...props }) => 
        React.createElement('select', {
          ...props,
          style: {
            padding: '6px 8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            ...props.style
          }
        }, children),
      
      Popover: ({ children }) => React.createElement('div', {}, children),
      ContextMenu: ({ children }) => React.createElement('div', {}, children),
      Tooltip: ({ children }) => React.createElement('div', {}, children),
      Separator: () => React.createElement('hr', { style: { margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }}),
      
      // 表单组件
      FormItem: ({ children, ...props }) => 
        React.createElement('div', {
          ...props,
          style: { marginBottom: '12px', ...props.style }
        }, children),
      FormItemSlider: ({ children }) => React.createElement('div', {}, children),
      FormItemSelect: ({ children }) => React.createElement('div', {}, children),
      FormItemInput: ({ children }) => React.createElement('div', {}, children),
      
      // 布局组件
      Panel: ({ children, ...props }) => 
        React.createElement('div', {
          ...props,
          style: {
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '12px',
            ...props.style
          }
        }, children),
      
      Flex: ({ children, gap, wrap, justifyContent, align, ...props }) => 
        React.createElement('div', {
          ...props,
          style: {
            display: 'flex',
            gap: gap === 'xs' ? '4px' : gap === 'sm' ? '8px' : gap === 'md' ? '12px' : '16px',
            flexWrap: wrap === false ? 'nowrap' : 'wrap',
            justifyContent: justifyContent === 'between' ? 'space-between' : justifyContent,
            alignItems: align === 'v' ? 'center' : align,
            ...props.style
          }
        }, children),
      
      // 特殊组件
      ActionButton: ({ children, ...props }) => 
        React.createElement('button', {
          ...props,
          style: {
            padding: '4px 8px',
            border: '1px solid #007bff',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            ...props.style
          }
        }, children),
      
      DropdownMenu: ({ children }) => React.createElement('div', {}, children),
      
      SegmentControl: ({ children, onValueChange, value, defaultValue, ...props }) => {
        const [currentValue, setCurrentValue] = React.useState(value || defaultValue)
        return React.createElement('div', {
          ...props,
          style: {
            display: 'flex',
            border: '1px solid #ccc',
            borderRadius: '4px',
            overflow: 'hidden',
            ...props.style
          }
        }, React.Children.map(children, (child: any) => 
          React.cloneElement(child, {
            onClick: () => {
              setCurrentValue(child.props.value)
              onValueChange?.(child.props.value)
            },
            style: {
              padding: '6px 12px',
              border: 'none',
              backgroundColor: currentValue === child.props.value ? '#007bff' : 'white',
              color: currentValue === child.props.value ? 'white' : 'black',
              cursor: 'pointer',
              borderRight: '1px solid #ccc',
              ...child.props.style
            }
          })
        ))
      },
      
      SegmentControlItem: ({ children, ...props }) => 
        React.createElement('button', props, children),
      
      Text: ({ children, ...props }) => 
        React.createElement('span', props, children),
      
      ScrollArea: ({ children, ...props }) => 
        React.createElement('div', {
          ...props,
          style: { overflow: 'auto', ...props.style }
        }, children),
      
      // 图标
      icons: {
        Plus: () => React.createElement('span', {}, '+'),
        Minus: () => React.createElement('span', {}, '-'),
        Settings: () => React.createElement('span', {}, '⚙️'),
        Trash: () => React.createElement('span', {}, '🗑️'),
        Copy: () => React.createElement('span', {}, '📋'),
      },
      
      // 样式化组件创建函数
      styled: (component: any, styles: any) => {
        return (props: any) => {
          const Component = typeof component === 'string' ? component : component
          return React.createElement(Component, {
            ...props,
            style: { ...styles, ...props?.style }
          })
        }
      },
    },
    eventBus: {
      emit: (event: string, ...args: any[]) => {
        console.log(`Event emitted: ${event}`, args)
      },
      on: (event: string, callback: (...args: any[]) => void) => {
        console.log(`Event listener added: ${event}`)
        return () => console.log(`Event listener removed: ${event}`)
      },
      off: () => {},
    },
    i18n: {
      t: (key: string, params?: Record<string, any>) => {
        // 简单的模拟翻译
        const translations: Record<string, string> = {
          'animation.select-controller': 'Please select an animator controller',
          'animation.layers': 'Layers',
          'animation.parameters': 'Parameters',
          'animation.add-layer': 'Add Layer',
          'animation.add-parameter': 'Add Parameter',
          'animation.state': 'State',
          'animation.transition': 'Transition',
        }
        return translations[key] || key
      },
      getCurrentLanguage: () => 'en',
    },
    shortcuts: type === 'advanced' ? {
      useShortcutsScope: (scope: string) => {
        console.log(`Shortcuts scope: ${scope}`)
      },
      register: (key: string, callback: () => void) => {
        console.log(`Shortcut registered: ${key}`)
        return () => console.log(`Shortcut unregistered: ${key}`)
      },
    } : undefined,
    theme: type === 'advanced' ? {
      getCSSVariable: (name: string) => {
        const variables: Record<string, string> = {
          '--colors-gray1': '#f8f9fa',
          '--colors-gray10': '#333',
          '--colors-blue8': '#007bff',
        }
        return variables[name] || '#000'
      },
      getCurrentTheme: () => 'light' as const,
    } : undefined,
  }
}