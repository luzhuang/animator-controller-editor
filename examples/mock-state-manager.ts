import { action, makeObservable, observable, computed } from 'mobx'
import type { IStateManager } from '../src/types/adapter'
import { createMockAnimatorControllerData, createMockEntityData } from './mock-data'
import { AnimatorControllerEditorState } from '../src/types/animator'

class MockStateManager implements IStateManager {
  // 模拟状态
  private state: any

  // 订阅器列表
  private subscribers: Array<{
    selector: () => any
    callback: (value: any) => void
    lastValue: any
  }> = []

  constructor(hasController: boolean = true) {
    // 确保使用固定的ID
    const controllerId = hasController ? '84e02b37-c4d3-4716-9a1a-faaa7ba87575' : null
    const mockController = hasController && controllerId ? createMockAnimatorControllerData(controllerId) : null
    const mockEntity = createMockEntityData()
    
    // 为Entity添加必要的方法
    const entityWithMethods = {
      ...mockEntity,
      getComponentByTypeName: (typeName: string) => {
        if (typeName === 'Animator') {
          return {
            id: 'mock-animator',
            animatorController: mockController ? {
              refId: controllerId,
              key: null
            } : null,
            enabled: true
          }
        }
        return null
      }
    }
    
    this.state = {
      editorState: hasController ? AnimatorControllerEditorState.Editable : AnimatorControllerEditorState.NeedSelect,
      selectedStateId: null as string | null,
      selectedTransitionId: null as string | null,
      selectedLayer: null as any,
      selectedParameterIndex: -1,
      // 添加AssetStore结构
      assetStore: observable({
        assets: mockController ? {
          [controllerId!]: mockController
        } : {},
        selectedAssetId: hasController ? controllerId : null,
        selectAsset: action((id: string) => {
          console.log('Mock selectAsset:', id)
          console.log('Available assets:', Object.keys(this.state.assetStore.assets))
          this.state.assetStore.selectedAssetId = id
          console.log('Updated selectedAssetId to:', this.state.assetStore.selectedAssetId)
          this.notifySubscribers()
        })
      }),
      // 添加SceneStore结构
      sceneStore: {
        lastSelectedId: mockEntity.id,
        lastSelectedEntity: hasController ? entityWithMethods : null,
        entities: new Map([
          [mockEntity.id, entityWithMethods]
        ])
      }
    }
    
    makeObservable(this, {
      state: observable,
      setState: action,
      updateEditorState: action,
      selectState: action,
      selectTransition: action,
      currentAnimatorController: computed,
      currentEditorState: computed,
    } as any)
    
    // 不需要手动设置，由AnimatorControllerStore自动处理
    
    // 模拟定时更新，触发订阅器
    setInterval(() => {
      this.notifySubscribers()
    }, 100)
  }

  subscribe<T>(selector: () => T, callback: (value: T) => void): () => void {
    const initialValue = selector()
    const subscription = {
      selector,
      callback,
      lastValue: initialValue
    }
    
    this.subscribers.push(subscription)
    
    // 立即调用一次callback
    callback(initialValue)
    
    // 返回取消订阅函数
    return () => {
      const index = this.subscribers.indexOf(subscription)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  getState() {
    return this.state
  }

  setState(updater: (state: any) => any) {
    const newState = updater(this.state)
    Object.assign(this.state, newState)
    this.notifySubscribers()
  }

  getRootStore() {
    return {
      project: {
        selectedEntity: this.state.selectedEntity,
        assetManager: {
          findAssetById: (id: string) => {
            if (id === this.state.editingAnimatorController?.id) {
              return this.state.editingAnimatorController
            }
            return null
          }
        }
      },
      editorScene: {
        selectedEntity: this.state.selectedEntity
      }
    }
  }

  getUndoManager() {
    return {
      execute: (command: any) => {
        console.log('Mock undo command executed:', command)
      },
      canUndo: true,
      canRedo: false,
      undo: () => console.log('Mock undo'),
      redo: () => console.log('Mock redo')
    }
  }

  // 模拟方法：更新编辑状态
  updateEditorState(newState: AnimatorControllerEditorState) {
    this.state.editorState = newState
    this.notifySubscribers()
  }

  // 模拟方法：选择状态
  selectState(stateId: string | null) {
    this.state.selectedStateId = stateId
    this.state.selectedTransitionId = null // 取消transition选择
    this.notifySubscribers()
  }

  // 模拟方法：选择transition
  selectTransition(transitionId: string | null) {
    this.state.selectedTransitionId = transitionId
    this.state.selectedStateId = null // 取消state选择
    this.notifySubscribers()
  }

  // 通知所有订阅器
  private notifySubscribers() {
    this.subscribers.forEach(subscription => {
      try {
        const currentValue = subscription.selector()
        if (currentValue !== subscription.lastValue) {
          subscription.lastValue = currentValue
          subscription.callback(currentValue)
        }
      } catch (error) {
        console.warn('Subscription selector error:', error)
      }
    })
  }

  // 获取计算属性
  get currentAnimatorController() {
    return this.state.editingAnimatorController
  }

  get currentEditorState() {
    return this.state.editorState
  }
}

export function createMockStateManager(hasController: boolean = true): IStateManager {
  return new MockStateManager(hasController)
}