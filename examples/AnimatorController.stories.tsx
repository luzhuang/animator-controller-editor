import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { AnimatorController } from '../src'
import type { IAnimatorControllerAdapter } from '../src/types/adapter'

// Mock adapter for Storybook
const createMockAdapter = (): IAnimatorControllerAdapter => ({
  stateManager: {
    subscribe: () => () => {},
    getState: () => ({}),
    setState: () => {},
    getRootStore: () => ({}),
    getUndoManager: () => ({}),
  },
  uiComponents: {
    Button: ({ children, ...props }) => <button {...props}>{children}</button>,
    Input: (props) => <input {...props} />,
    Select: ({ children, ...props }) => <select {...props}>{children}</select>,
    Popover: ({ children }) => <div>{children}</div>,
    ContextMenu: ({ children }) => <div>{children}</div>,
    Tooltip: ({ children }) => <div>{children}</div>,
    Separator: () => <hr />,
    FormItem: ({ children }) => <div>{children}</div>,
    FormItemSlider: ({ children }) => <div>{children}</div>,
    FormItemSelect: ({ children }) => <div>{children}</div>,
    FormItemInput: ({ children }) => <div>{children}</div>,
    Panel: ({ children, ...props }) => <div {...props}>{children}</div>,
    Flex: ({ children, ...props }) => <div style={{ display: 'flex' }} {...props}>{children}</div>,
    ActionButton: ({ children, ...props }) => <button {...props}>{children}</button>,
    DropdownMenu: ({ children }) => <div>{children}</div>,
    SegmentControl: ({ children, onValueChange, value, defaultValue }) => {
      const [currentValue, setCurrentValue] = React.useState(value || defaultValue)
      return (
        <div>
          {React.Children.map(children, (child: any) => 
            React.cloneElement(child, {
              onClick: () => {
                setCurrentValue(child.props.value)
                onValueChange?.(child.props.value)
              },
              style: {
                padding: '8px 16px',
                border: '1px solid #ccc',
                backgroundColor: currentValue === child.props.value ? '#007bff' : 'white',
                color: currentValue === child.props.value ? 'white' : 'black',
                cursor: 'pointer',
              }
            })
          )}
        </div>
      )
    },
    SegmentControlItem: ({ children, ...props }) => <div {...props}>{children}</div>,
    Text: ({ children, ...props }) => <span {...props}>{children}</span>,
    ScrollArea: ({ children, ...props }) => <div style={{ overflow: 'auto' }} {...props}>{children}</div>,
    icons: {
      Plus: () => <span>+</span>,
      Minus: () => <span>-</span>,
      Settings: () => <span>⚙️</span>,
      Trash: () => <span>🗑️</span>,
      Copy: () => <span>📋</span>,
    },
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
    emit: () => {},
    on: () => () => {},
    off: () => {},
  },
  i18n: {
    t: (key: string) => key,
    getCurrentLanguage: () => 'en',
  },
})

const meta: Meta<typeof AnimatorController> = {
  title: 'AnimatorController/Basic',
  component: AnimatorController,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    adapter: createMockAdapter(),
  },
  render: (args) => (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <AnimatorController {...args} />
    </div>
  ),
}

export const WithCustomStyle: Story = {
  args: {
    adapter: createMockAdapter(),
    style: { border: '2px solid #007bff', borderRadius: '8px' },
  },
  render: (args) => (
    <div style={{ width: '800px', height: '600px', padding: '20px' }}>
      <AnimatorController {...args} />
    </div>
  ),
}