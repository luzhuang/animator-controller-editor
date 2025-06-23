import React, { useState, useEffect, useCallback } from 'react'

// 导入真实的 editor-ui 组件
import {
  Button,
  Input,
  Select,
  Popover,
  Tooltip,
  Separator,
  Flex,
  ActionButton,
  DropdownMenu,
  SegmentControl,
  SegmentControlItem,
  ScrollArea,
  styled,
  Text,
  ThemeProvider,
} from '@galacean/editor-ui'

// 导入可用的图标 (editor-ui 中可用的图标有限)
import { EyeDropperIcon, IconUnknownFile } from '@galacean/editor-ui'

// 导入真实的 Tabler 图标
import {
  IconPlus,
  IconMinus,
  IconTrash,
  IconSettings,
  IconCopy,
  IconSquareRounded,
  IconDots,
  IconChevronDown,
} from '@tabler/icons-react'

import { IAnimatorControllerAdapter } from '../src'

// Real animator controller data from the JSON file
const realAnimatorController = {
  name: 'RealAnimatorController',
  layers: [
    {
      name: 'Base',
      weight: 1,
      blendingMode: 0,
      stateMachine: {
        entryTransitions: [
          {
            id: 'entryTransition-0-Idle',
            duration: 0,
            offset: 0,
            exitTime: 0,
            hasExitTime: false,
            isFixedDuration: false,
            destinationStateId: 'Idle',
            solo: false,
            mute: false,
            isExit: false,
            conditions: [],
          },
        ],
        anyTransitions: [],
        transitions: [
          {
            id: 'Idle-Walk',
            duration: 0.25,
            offset: 0,
            exitTime: 0.75,
            hasExitTime: false,
            isFixedDuration: false,
            destinationStateId: 'Walk',
            solo: false,
            mute: false,
            isExit: false,
            conditions: [
              {
                mode: 3,
                parameterName: 'speed',
                threshold: 0.01,
              },
            ],
          },
          {
            id: 'Walk-Idle',
            duration: 0.25,
            offset: 0,
            exitTime: 0.75,
            hasExitTime: false,
            isFixedDuration: false,
            destinationStateId: 'Idle',
            solo: false,
            mute: false,
            isExit: false,
            conditions: [
              {
                mode: 4,
                parameterName: 'speed',
                threshold: 0.01,
              },
            ],
          },
          {
            id: 'Walk-Run',
            duration: 0.25,
            offset: 0,
            exitTime: 0.75,
            hasExitTime: false,
            isFixedDuration: false,
            destinationStateId: 'Run',
            solo: false,
            mute: false,
            isExit: false,
            conditions: [
              {
                mode: 3,
                parameterName: 'speed',
                threshold: 0.6,
              },
            ],
          },
          {
            id: 'Run-Walk',
            duration: 0.25,
            offset: 0,
            exitTime: 0.75,
            hasExitTime: false,
            isFixedDuration: false,
            destinationStateId: 'Walk',
            solo: false,
            mute: false,
            isExit: false,
            conditions: [
              {
                mode: 4,
                parameterName: 'speed',
                threshold: 0.6,
              },
            ],
          },
          {
            id: 'Idle-Crouch',
            duration: 0.25,
            offset: 0,
            exitTime: 0.75,
            hasExitTime: false,
            isFixedDuration: false,
            destinationStateId: 'Crouch',
            solo: false,
            mute: false,
            isExit: false,
            conditions: [
              {
                mode: 1,
                parameterName: 'crouch',
                threshold: 0,
              },
            ],
          },
          {
            id: 'Walk-Crouch',
            duration: 0.25,
            offset: 0,
            exitTime: 0.75,
            hasExitTime: false,
            isFixedDuration: false,
            destinationStateId: 'Crouch',
            solo: false,
            mute: false,
            isExit: false,
            conditions: [
              {
                mode: 1,
                parameterName: 'crouch',
                threshold: 0,
              },
            ],
          },
          {
            id: 'Run-Crouch',
            duration: 0.25,
            offset: 0,
            exitTime: 0.75,
            hasExitTime: false,
            isFixedDuration: false,
            destinationStateId: 'Crouch',
            solo: false,
            mute: false,
            isExit: false,
            conditions: [
              {
                mode: 1,
                parameterName: 'crouch',
                threshold: 0,
              },
            ],
          },
          {
            id: 'Crouch-Idle',
            duration: 0.25,
            offset: 0,
            exitTime: 0.75,
            hasExitTime: false,
            isFixedDuration: false,
            destinationStateId: 'Idle',
            solo: false,
            mute: false,
            isExit: false,
            conditions: [
              {
                mode: 2,
                parameterName: 'crouch',
                threshold: 0,
              },
            ],
          },
          {
            id: 'Crouch-Walk',
            duration: 0.25,
            offset: 0,
            exitTime: 0.75,
            hasExitTime: false,
            isFixedDuration: false,
            destinationStateId: 'Walk',
            solo: false,
            mute: false,
            isExit: false,
            conditions: [
              {
                mode: 2,
                parameterName: 'crouch',
                threshold: 0,
              },
            ],
          },
          {
            id: 'Crouch-Run',
            duration: 0.25,
            offset: 0,
            exitTime: 0.75,
            hasExitTime: false,
            isFixedDuration: false,
            destinationStateId: 'Run',
            solo: false,
            mute: false,
            isExit: false,
            conditions: [
              {
                mode: 2,
                parameterName: 'crouch',
                threshold: 0,
              },
            ],
          },
          {
            id: 'Attack-Idle',
            duration: 0.25,
            offset: 0,
            exitTime: 0.75,
            hasExitTime: true,
            isFixedDuration: false,
            destinationStateId: 'Idle',
            solo: false,
            mute: false,
            isExit: false,
            conditions: [],
          },
        ],
        states: [
          {
            id: 'Idle',
            name: 'Idle',
            clip: {
              refId: 'aaec08e5-e225-4752-8a46-727548a744a3',
              key: 'aaec08e5-e225-4752-8a46-727548a744a3',
            },
            speed: 1,
            wrapMode: 1,
            clipStartNormalizedTime: 0,
            clipEndNormalizedTime: 1,
            isEntryState: false,
            isExitState: false,
            isAnyState: false,
            transitions: ['Idle-Walk', 'Idle-Crouch'],
            scripts: [],
          },
          {
            id: 'Walk',
            name: 'Walk',
            clip: {
              refId: 'aaec08e5-e225-4752-8a46-727548a744a3',
              key: 'aaec08e5-e225-4752-8a46-727548a744a3',
            },
            speed: 1,
            wrapMode: 1,
            clipStartNormalizedTime: 0.125,
            clipEndNormalizedTime: 0.375,
            isEntryState: false,
            isExitState: false,
            isAnyState: false,
            transitions: ['Walk-Idle', 'Walk-Run', 'Walk-Crouch'],
            scripts: [],
          },
          {
            id: 'Run',
            name: 'Run',
            clip: {
              refId: 'aaec08e5-e225-4752-8a46-727548a744a3',
              key: 'aaec08e5-e225-4752-8a46-727548a744a3',
            },
            speed: 1,
            wrapMode: 1,
            clipStartNormalizedTime: 0.375,
            clipEndNormalizedTime: 0.625,
            isEntryState: false,
            isExitState: false,
            isAnyState: false,
            transitions: ['Run-Walk', 'Run-Crouch'],
            scripts: [],
          },
          {
            id: 'Crouch',
            name: 'Crouch',
            clip: {
              refId: 'aaec08e5-e225-4752-8a46-727548a744a3',
              key: 'aaec08e5-e225-4752-8a46-727548a744a3',
            },
            speed: 1,
            wrapMode: 1,
            clipStartNormalizedTime: 0.625,
            clipEndNormalizedTime: 0.875,
            isEntryState: false,
            isExitState: false,
            isAnyState: false,
            transitions: ['Crouch-Idle', 'Crouch-Walk', 'Crouch-Run'],
            scripts: [],
          },
          {
            id: 'Attack',
            name: 'Attack',
            clip: {
              refId: 'aaec08e5-e225-4752-8a46-727548a744a3',
              key: 'aaec08e5-e225-4752-8a46-727548a744a3',
            },
            speed: 1,
            wrapMode: 1,
            clipStartNormalizedTime: 0.875,
            clipEndNormalizedTime: 1,
            isEntryState: false,
            isExitState: false,
            isAnyState: false,
            transitions: ['Attack-Idle'],
            scripts: [],
          },
        ],
      },
    },
  ],
  parameters: [
    {
      name: 'attack',
      type: 3,
      isTrigger: true,
      defaultValue: false,
    },
    {
      name: 'crouch',
      type: 1,
      isTrigger: false,
      defaultValue: false,
    },
    {
      name: 'speed',
      type: 0,
      isTrigger: false,
      defaultValue: 0,
    },
  ],
  getMetaConfig: () => ({ type: 'AnimatorController' }),
  internalDataUpdated: true,
  updateStateMachineData: (layerIndex: number, data: any, graphData: any) => {
    console.log('📊 Mock updateStateMachineData called:', { layerIndex, data, graphData })
  },
  applyControllerData: () => {
    console.log('🔄 Mock applyControllerData called')
  },
}

// Mock entity with animator component
const mockEntity = {
  id: 'entity1',
  name: 'Character',
  getComponentByTypeName: (typeName: string) => {
    if (typeName === 'Animator') {
      return {
        animatorController: {
          refId: 'controller1',
          key: null,
        },
      }
    }
    return null
  },
}

// Mock state to simulate a real state manager
const mockState = {
  sceneStore: {
    lastSelectedId: 'entity1',
    lastSelectedEntity: mockEntity,
    entities: new Map([['entity1', mockEntity]]),
  },
  assetStore: {
    selectedAssetId: 'controller1',
    assets: {
      controller1: realAnimatorController,
    },
    selectAsset: (id: string) => {
      mockState.assetStore.selectedAssetId = id
    },
  },
}

export function createMockAdapter(): IAnimatorControllerAdapter {
  return {
    stateManager: {
      getState: () => mockState,
      setState: (updater) => {
        const newState = updater(mockState)
        Object.assign(mockState, newState)
      },
      subscribe: (selector, callback) => {
        // Simple mock - in real implementation this would use MobX autorun
        return () => {}
      },
      getRootStore: () => mockState,
      getUndoManager: () => ({}),
    },
    uiComponents: {
      // 使用真实的 editor-ui 组件
      Flex,
      Button,
      Input,
      Select,
      Popover,
      Tooltip,
      Separator,
      ActionButton,
      SegmentControl,
      SegmentControlItem,
      ScrollArea,
      Text,
      DropdownMenu: Object.assign(
        ({ children, trigger, ...props }: any) => {
          const [isOpen, setIsOpen] = useState(false)

          const handleTriggerClick = () => {
            setIsOpen(!isOpen)
          }

          const handleDocumentClick = useCallback(
            (e: Event) => {
              if (isOpen) {
                setIsOpen(false)
              }
            },
            [isOpen]
          )

          useEffect(() => {
            if (isOpen) {
              document.addEventListener('click', handleDocumentClick)
              return () => document.removeEventListener('click', handleDocumentClick)
            }
          }, [isOpen, handleDocumentClick])

          return React.createElement(
            'div',
            {
              style: {
                position: 'relative',
                display: 'inline-block',
                ...props.style,
              },
              ...props,
            },
            [
              React.cloneElement(trigger, {
                key: 'trigger',
                onClick: handleTriggerClick,
              }),
              isOpen &&
                React.createElement(
                  'div',
                  {
                    key: 'menu',
                    style: {
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      minWidth: '120px',
                      padding: '4px 0',
                    },
                  },
                  children
                ),
            ]
          )
        },
        {
          Item: ({ children, onClick, ...props }: any) => {
            const handleClick = (e: any) => {
              e.stopPropagation()
              if (onClick) onClick(e)
            }

            return React.createElement(
              'div',
              {
                style: {
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderBottom: 'none',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                  ...props.style,
                },
                onClick: handleClick,
                onMouseEnter: (e: any) => {
                  e.target.style.backgroundColor = '#f5f5f5'
                },
                onMouseLeave: (e: any) => {
                  e.target.style.backgroundColor = 'transparent'
                },
                ...props,
              },
              children
            )
          },
        }
      ),

      // 图标组件 (使用真实的 Tabler 图标)
      icons: {
        // 真实的 Tabler 图标
        Plus: IconPlus,
        Minus: IconMinus,
        Trash: IconTrash,
        Settings: IconSettings,
        Copy: IconCopy,
        SquareRounded: IconSquareRounded,
        More: IconDots,
        ChevronDown: IconChevronDown,
        // editor-ui 中的图标
        EyeDropper: EyeDropperIcon,
        UnknownFile: IconUnknownFile,
      },

      // 使用真实的 styled 函数
      styled,
    },
    eventBus: {
      on: () => () => {},
      emit: () => {},
      off: () => {},
    },
    i18n: {
      t: (key: string) => key,
    },
  }
}
