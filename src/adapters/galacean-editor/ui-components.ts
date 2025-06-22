import React from 'react'
import type { IUIComponents } from '../../types/adapter'

export function createUIComponents(galaceanUI: any): IUIComponents {
  // 从@galacean/editor-ui和@galacean/gui中映射组件
  const {
    Button,
    Input,
    Select,
    Popover,
    ContextMenu,
    Tooltip,
    Separator,
    Flex,
    Panel,
    styled,
    ActionButton,
    DropdownMenu,
    SegmentControl,
    SegmentControlItem,
    Text,
    ScrollArea,
  } = galaceanUI

  // 从@galacean/gui导入表单组件
  const {
    FormItem,
    FormItemSlider,
    FormItemSelect,
    FormItemInput,
  } = galaceanUI.gui || {}

  // 图标映射
  const iconMap: Record<string, any> = {
    Plus: galaceanUI.icons?.IconPlus,
    Minus: galaceanUI.icons?.IconMinus,
    Settings: galaceanUI.icons?.IconSettings,
    Trash: galaceanUI.icons?.IconTrash,
    Copy: galaceanUI.icons?.IconCopy,
    SquareRounded: galaceanUI.icons?.IconSquareRounded,
  }

  return {
    // 基础组件
    Button,
    Input,
    Select: Select || galaceanUI.Select,
    Popover,
    ContextMenu,
    Tooltip,
    Separator,
    
    // 表单组件
    FormItem: FormItem || (() => null),
    FormItemSlider: FormItemSlider || (() => null),
    FormItemSelect: FormItemSelect || (() => null),
    FormItemInput: FormItemInput || (() => null),
    
    // 布局组件
    Panel,
    Flex,
    
    // 特殊组件
    ActionButton,
    DropdownMenu,
    SegmentControl,
    SegmentControlItem,
    Text,
    ScrollArea,
    
    // 图标
    icons: {
      ...iconMap,
      ...new Proxy(iconMap, {
        get(target, prop) {
          return target[prop as string] || (() => null)
        }
      })
    } as any,
    
    // 样式化组件创建函数
    styled: styled || ((component: any, styles: any) => {
      // 如果没有styled函数，返回原组件的包装器
      return (props: any) => {
        const Component = component
        return React.createElement(Component, {
          ...props,
          style: { ...styles, ...props.style }
        })
      }
    })
  }
}