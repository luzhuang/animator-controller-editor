import { debounce } from 'es-toolkit'
import { action, autorun, computed, makeObservable, observable, reaction, toJS } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import type {
  AnimatorControllerItem,
  AnimatorControllerEditorState,
  ContextMenuInfo,
  IAnimatorControllerAsset,
  IAnimatorComponent,
  IConditionData,
  IEntityModel,
  IRefObject,
  IStateMachineData,
  IStateData,
  ITransitionData,
  StateType,
} from '../types/animator'
import { AnimatorControllerEditorState as EditorState } from '../types/animator'
import type { IAnimatorControllerAdapter } from '../types/adapter'
import { AnimatorStateMachineGraph } from './graph'
import { State } from './state'
import { Transition } from './transition'
import { defaultI18n } from '../i18n'

export class AnimatorControllerStore {
  editingAnimator: IAnimatorComponent | null = null

  currentSelectType: AnimatorControllerItem = 0 // AnimatorControllerItem.Null

  selectedStateId = ''

  selectedTransitionId = ''

  visibility = false

  selectedEntityId: string | null = null

  contextMenuInfo: ContextMenuInfo = null

  stateMachineGraph: AnimatorStateMachineGraph

  states: State[] = []
  transitions: Transition[] = []
  statesMap: Record<string, State> = {}
  transitionsMap: Record<string, Transition> = {}

  updateStateMachineData: () => void

  private _editorState: AnimatorControllerEditorState = EditorState.NeedSelect

  private _currentLayerIndex = 0

  private _editingAnimatorControllerId: string | null = null

  private _selectAssetDisposer: (() => void) | null = null
  private _animatorControllerListenerDisposer: (() => void) | null = null
  private _selectEntityDisposer: (() => void) | null = null

  private _statesNameMap: Record<string, State> = {}
  private _globalPlayback = false

  constructor(private adapter: IAnimatorControllerAdapter) {
    makeObservable(this, {
      editingAnimator: observable,
      currentSelectType: observable,
      selectedStateId: observable,
      selectedTransitionId: observable,
      visibility: observable,
      selectedEntityId: observable,
      contextMenuInfo: observable,
      _editorState: observable,
      _currentLayerIndex: observable,
      _editingAnimatorControllerId: observable,
      editorState: computed,
      selectedEntity: computed,
      selectedState: computed,
      selectedTransition: computed,
      editingAnimatorController: computed,
      currentLayerIndex: computed,
      setVisibility: action,
      updateEditorState: action,
      selectEntity: action,
      unselectEntity: action,
      selectController: action,
      selectState: action,
      selectTransition: action,
      clearSelect: action,
      addState: action,
      updateStateData: action,
      addStateMachineScript: action,
      removeStateMachineScript: action,
      updateStateMachineScript: action,
      addTransition: action,
      updateTransitionData: action,
      addCondition: action,
      removeCondition: action,
      updateConditionData: action,
      checkAnimatorControllerAsset: action,
      selectLayer: action,
      addLayer: action,
      removeLayer: action,
      updateGlobalPlayState: action,
      _updateContextMenuInfo: action,
    } as any)

    this.updateStateMachineData = debounce(this._updateStateMachineDataImmediately.bind(this), 1000, {
      edges: ['trailing'],
    })

    this.stateMachineGraph = new AnimatorStateMachineGraph()
    this.stateMachineGraph.onStateClick = this.selectState.bind(this)
    this.stateMachineGraph.onStateMove = this._handleStateMove.bind(this)
    this.stateMachineGraph.onTransitionClick = this.selectTransition.bind(this)
    this.stateMachineGraph.onStatesDelete = this._handleStatesDelete.bind(this)
    this.stateMachineGraph.onTransitionsDelete = this._handleTransitionsDelete.bind(this)
    this.stateMachineGraph.onContextMenuUpdate = this._updateContextMenuInfo.bind(this)
    this.stateMachineGraph.onAddTransition = this._handleAddTransition.bind(this)
    this.stateMachineGraph.onUpdateTransitionTarget = this._handleUpdateTransitionTarget.bind(this)
  }

  get editorState(): Readonly<AnimatorControllerEditorState> {
    return this._editorState
  }

  get selectedEntity(): IEntityModel | null {
    if (!this.selectedEntityId) return null
    // This would be provided by the adapter
    return this.adapter.stateManager.getState()?.sceneStore?.entities?.get(this.selectedEntityId) || null
  }

  get selectedState(): State | null {
    return this.statesMap[this.selectedStateId] ?? null
  }

  get selectedTransition(): Transition | null {
    return this.transitionsMap[this.selectedTransitionId] ?? null
  }

  get editingAnimatorController(): IAnimatorControllerAsset | null {
    if (!this._editingAnimatorControllerId) {
      return null
    }

    // 从 asset store 中获取当前 controller
    const rootState = this.adapter.stateManager.getState()
    const controller = rootState?.assetStore?.assets?.[this._editingAnimatorControllerId]

    return controller || null
  }

  set editingAnimatorControllerId(id: string | null) {
    console.log('🔧 Setting editingAnimatorControllerId to:', id)
    if (this._editingAnimatorControllerId === id) {
      console.log('⏭️ Same ID, skipping')
      return
    }
    if (this._editingAnimatorControllerId) {
      this._updateStateMachineDataImmediately()
    }

    this._editingAnimatorControllerId = id
    console.log('✅ ID set to:', this._editingAnimatorControllerId)

    if (id) {
      // Select asset through adapter
      const rootState = this.adapter.stateManager.getState()
      rootState?.assetStore?.selectAsset(id)

      // 不要在setter中立即获取controller，让它通过响应式系统自然更新
      this.currentLayerIndex = 0

      // 异步执行applyControllerData以确保状态已经更新
      setTimeout(() => {
        console.log('⏰ Timeout callback executing...')
        console.log('⏰ Current ID in timeout:', this._editingAnimatorControllerId)

        // 直接从state manager获取，绕过computed
        const rootState = this.adapter.stateManager.getState()
        console.log('⏰ Direct state check - assets:', Object.keys(rootState?.assetStore?.assets || {}))
        console.log('⏰ Direct state check - selectedAssetId:', rootState?.assetStore?.selectedAssetId)
        console.log('⏰ Looking for ID:', this._editingAnimatorControllerId)
        const directController = rootState?.assetStore?.assets?.[this._editingAnimatorControllerId!]
        console.log('⏰ Direct controller retrieval:', !!directController)
        if (directController) {
          console.log('⏰ Controller found:', directController.name)
        } else {
          console.log('⏰ Controller not found. Available assets:', rootState?.assetStore?.assets)
        }

        const editingAnimatorController = this.editingAnimatorController
        console.log('🎯 Retrieved controller after timeout:', !!editingAnimatorController)
        console.log('🎯 Direct controller vs computed:', !!directController, 'vs', !!editingAnimatorController)
        console.log('🎯 _editingAnimatorControllerId:', this._editingAnimatorControllerId)
        editingAnimatorController?.applyControllerData()

        // 强制更新状态来触发React重新渲染
        this.updateEditorState(EditorState.Editable)

        // controller 现在通过 computed 属性自动获取

        // 强制重新初始化状态机图表
        if (directController) {
          console.log('🔄 Force updating state machine graph')
          this._updateStateMachineGraph()
        }
      }, 100)
    }
  }

  get currentLayerIndex() {
    return this._currentLayerIndex
  }

  set currentLayerIndex(index: number) {
    this._currentLayerIndex = index
    this._updateStateMachineGraph()
  }

  setVisibility(visibility: boolean) {
    if (this.visibility === visibility) return

    this.visibility = visibility
    if (visibility) {
      this.updateEditorState(EditorState.Visible)
      this.checkAnimatorControllerAsset()

      this._selectEntityDisposer?.()
      this._selectEntityDisposer = autorun(() => {
        const rootState = this.adapter.stateManager.getState()
        const id = rootState?.sceneStore?.lastSelectedId
        if (id) {
          this.selectEntity(id)
        } else {
          this.unselectEntity()
        }
      })

      this._selectAssetDisposer?.()
      this._selectAssetDisposer = autorun(() => {
        const rootState = this.adapter.stateManager.getState()
        const id = rootState?.assetStore?.selectedAssetId
        console.log('📦 Asset autorun - selectedAssetId:', id)
        if (id) {
          const asset = rootState?.assetStore?.assets?.[id]
          console.log('📦 Asset found:', !!asset)
          if (asset) {
            console.log('📦 Asset getMetaConfig:', asset.getMetaConfig())
            if (asset.getMetaConfig().type === 'AnimatorController') {
              console.log('✅ Asset is AnimatorController, selecting...')
              this.selectController(id)
            } else {
              console.log('❌ Asset is not AnimatorController:', asset.getMetaConfig().type)
            }
          }
        }
      })
    } else {
      this.updateEditorState(EditorState.NoVisible)
      this._selectEntityDisposer?.()
      this._selectAssetDisposer?.()
      this.clearSelect()
    }
  }

  updateEditorState(state: AnimatorControllerEditorState) {
    this._editorState = state
  }

  selectEntity(entityId: string) {
    if (this.selectedEntityId === entityId) return

    this.checkAnimatorControllerAsset()

    this._animatorControllerListenerDisposer?.()
    this._animatorControllerListenerDisposer = reaction(
      () => {
        const rootState = this.adapter.stateManager.getState()
        const animator = rootState?.sceneStore?.entities?.get(entityId)?.getComponentByTypeName('Animator')
        return (animator as any)?.animatorController
      },
      (controllerRef: IRefObject) => {
        if (entityId !== this.selectedEntityId) return

        let assetId = controllerRef?.refId
        if (controllerRef?.key) {
          assetId = `${assetId}-${controllerRef.key}`
        }

        if (this.editorState === EditorState.Loading) {
          return
        }

        if (!assetId) return

        this.editingAnimatorControllerId = assetId
        this.playAnimator()
      }
    )

    this.selectedEntityId = entityId
    this.playAnimator()
  }

  unselectEntity() {
    this._animatorControllerListenerDisposer?.()
    this.selectedEntityId = null
    if (this.editorState === EditorState.NeedCreate) {
      this.updateEditorState(EditorState.NeedSelect)
    }

    this.pauseAnimator()
  }

  selectController(assetId: string) {
    console.log('🎯 selectController called with assetId:', assetId)
    if (this.editingAnimatorControllerId === assetId) {
      console.log('✅ Already selected this controller, skipping')
      return
    }
    console.log('🔄 Selecting new controller')
    this.clearSelect()
    this.editingAnimatorControllerId = assetId
    this.updateEditorState(EditorState.Editable)
    console.log('✅ Controller selected, state updated to Editable')
  }

  selectState(id: string) {
    if (id === 'entry' || id === 'exit' || id === 'any') return

    const rootState = this.adapter.stateManager.getState()
    if (this._editingAnimatorControllerId) {
      rootState?.assetStore?.selectAsset(this._editingAnimatorControllerId)
    }
    this.selectedStateId = id
    this.currentSelectType = id ? 1 : 0 // AnimatorControllerItem.State : Null
  }

  selectTransition(id: string) {
    const rootState = this.adapter.stateManager.getState()
    if (this._editingAnimatorControllerId) {
      rootState?.assetStore?.selectAsset(this._editingAnimatorControllerId)
    }
    this.selectedTransitionId = id
    this.currentSelectType = id ? 2 : 0 // AnimatorControllerItem.Transition : Null
  }

  getStateFormSchema() {
    // This would be created through adapter
    return {
      items: [
        {
          label: defaultI18n.t('animation.animator-controller.state.name'),
          property: 'name',
          type: 'Input',
        },
        {
          label: defaultI18n.t('animation.animator-controller.state.clip'),
          property: 'clip',
          type: 'AssetPicker',
          assetType: 'AnimationClip',
        },
        {
          label: defaultI18n.t('animation.animator-controller.state.speed'),
          property: 'speed',
          type: 'Number',
          dragStep: 0.1,
        },
      ],
    }
  }

  getTransitionFormSchema() {
    const selectedData = this.selectedTransition?.data

    return {
      items: [
        {
          label: defaultI18n.t('animation.animator-controller.transition.solo'),
          property: 'solo',
          type: 'Boolean',
        },
        {
          label: defaultI18n.t('animation.animator-controller.transition.mute'),
          property: 'mute',
          type: 'Boolean',
        },
        {
          label: defaultI18n.t('animation.animator-controller.transition.has-exit-time'),
          property: 'hasExitTime',
          type: 'Boolean',
        },
        {
          label: defaultI18n.t('animation.animator-controller.transition.fixed-duration'),
          property: 'isFixedDuration',
          type: 'Boolean',
        },
        {
          label: `${defaultI18n.t('animation.animator-controller.transition.duration')}(${selectedData?.isFixedDuration ? 's' : '%'})`,
          property: 'duration',
          type: 'Number',
          min: 0,
        },
      ],
    }
  }

  clearSelect() {
    this.selectedStateId = ''
    this.selectedTransitionId = ''
    this.currentSelectType = 0 // AnimatorControllerItem.Null
  }

  addState(name?: string, id?: string, type: StateType = 0): State {
    // StateType.Normal
    if (!name) {
      name = this._makeUniqueStateName('New State')
    }
    if (!id) {
      id = uuidv4()
    }
    console.log(`➕ Adding state: ${name} (${id}) type: ${type}`)
    const state = new State(this.stateMachineGraph, name, id, type)
    this.states.push(state)
    this.statesMap[state.id] = state
    this._statesNameMap[state.name] = state
    this.stateMachineGraph.addState(state)
    this.updateStateMachineData()
    console.log(`✅ State added. Total states: ${this.states.length}`)
    return state
  }

  updateStateData(property: string, value: any) {
    if (!this.selectedState) return

    if (property === 'name') {
      delete this._statesNameMap[this.selectedState.name]
      const state = this._statesNameMap[value]
      if (state && state.id !== this.selectedState.id) {
        value = this._makeUniqueStateName(value)
        // Show error toast through adapter
        defaultI18n.t('animation.animator-controller.state.validation.must-be-unique')
      }
      this._statesNameMap[value] = this.selectedState
    }
    this.selectedState.updateData(property, value)
    this.updateStateMachineData()
  }

  addStateMachineScript(scriptId: string) {
    if (!this.selectedState) return
    this.selectedState.addStateMachineScript(scriptId)
    this.updateStateMachineData()
  }

  removeStateMachineScript(index: number) {
    if (!this.selectedState) return
    this.selectedState.removeStateMachineScript(index)
    this.updateStateMachineData()
  }

  updateStateMachineScript(index: number, scriptId: string) {
    if (!this.selectedState) return
    this.selectedState.updateStateMachineScript(index, scriptId)
    this.updateStateMachineData()
  }

  addTransition(id: string, sourceStateId: string, destinationStateId: string): Transition {
    if (!id) {
      id = uuidv4()
    }
    const { statesMap } = this

    // Check if source and destination states exist
    const sourceState = statesMap[sourceStateId]
    const destinationState = statesMap[destinationStateId]

    if (!sourceState) {
      console.error(`❌ Cannot create transition ${id}: source state '${sourceStateId}' not found`)
      throw new Error(`Source state '${sourceStateId}' not found`)
    }

    if (!destinationState) {
      console.error(`❌ Cannot create transition ${id}: destination state '${destinationStateId}' not found`)
      throw new Error(`Destination state '${destinationStateId}' not found`)
    }

    console.log(`✅ Creating transition ${id}: ${sourceStateId} -> ${destinationStateId}`)
    const transition = new Transition(this.stateMachineGraph, id, sourceState, destinationState)
    this.transitions.push(transition)
    this.transitionsMap[transition.id] = transition
    this.stateMachineGraph.addTransition(transition)
    this.updateStateMachineData()
    return transition
  }

  updateTransitionData(property: string, value: any) {
    if (!this.selectedTransition) return
    this.selectedTransition.updateData(property, value)
    this.updateStateMachineData()
  }

  addCondition() {
    if (!this.selectedTransition) return
    const editingAnimatorController = this.editingAnimatorController
    const parameterName = editingAnimatorController?.parameters[0]?.name || ''
    this.selectedTransition.addCondition(parameterName)
    this.updateStateMachineData()
  }

  removeCondition(index: number) {
    if (!this.selectedTransition) return
    this.selectedTransition.removeCondition(index)
    this.updateStateMachineData()
  }

  updateConditionData(index: number, data: Partial<IConditionData>) {
    if (!this.selectedTransition) return
    this.selectedTransition.updateConditionData(index, data)
    this.updateStateMachineData()
  }

  checkAnimatorControllerAsset() {
    console.log('🔍 checkAnimatorControllerAsset called, current editingId:', this.editingAnimatorControllerId)

    if (this.editingAnimatorControllerId) {
      console.log('✅ Already has editingAnimatorControllerId, skipping')
      return
    }

    const rootState = this.adapter.stateManager.getState()
    const selectedEntity = rootState?.sceneStore?.lastSelectedEntity
    console.log('🎯 selectedEntity:', selectedEntity)

    if (!selectedEntity) {
      console.log('❌ No selected entity, setting NeedSelect state')
      this.updateEditorState(EditorState.NeedSelect)
      return
    }

    this.selectedEntityId = selectedEntity.id

    const editingAnimator = selectedEntity.getComponentByTypeName('Animator') as any
    if (!editingAnimator) {
      this.updateEditorState(EditorState.NeedCreate)
      return
    }

    this.editingAnimator = editingAnimator

    const controllerRef = editingAnimator.animatorController
    if (!controllerRef) {
      this.updateEditorState(EditorState.NeedCreate)
      return
    }

    let assetId = controllerRef?.refId
    if (controllerRef?.key) {
      assetId = `${assetId}-${controllerRef.key}`
    }

    this.editingAnimatorControllerId = assetId
  }

  selectLayer(index: number) {
    if (index === this.currentLayerIndex) return
    this._updateStateMachineDataImmediately()
    this.currentLayerIndex = index
  }

  addLayer() {
    const editingAnimatorController = this.editingAnimatorController
    if (!editingAnimatorController) return

    editingAnimatorController.layers.push({
      name: 'Layer',
      blendingMode: 0, // AnimatorLayerBlendingMode.Override
      weight: 1,
    })
    this.updateStateMachineData()
  }

  removeLayer(index: number) {
    const editingAnimatorController = this.editingAnimatorController
    if (!editingAnimatorController) return

    editingAnimatorController.layers.splice(index, 1)
    this.currentLayerIndex = 0
    this.updateStateMachineData()
  }

  playAnimator() {
    if (this.editingAnimator) {
      this.editingAnimator.engineObject.enabled = this.editingAnimator.enabled
    }
  }

  pauseAnimator() {
    if (this._globalPlayback) return

    if (this.editingAnimator) {
      const animator = this.editingAnimator
      animator.engineObject._reset()
      animator.engineObject.enabled = false
    }
  }

  updateGlobalPlayState(play: boolean) {
    this._globalPlayback = play
  }

  private _updateStateMachineDataImmediately() {
    const { stateMachineGraph, editingAnimatorController } = this
    if (!editingAnimatorController) return

    editingAnimatorController.updateStateMachineData(
      this.currentLayerIndex,
      this._exportData(),
      stateMachineGraph.exportGraphData()
    )
  }

  private _updateContextMenuInfo(contextMenuInfo: ContextMenuInfo) {
    this.contextMenuInfo = contextMenuInfo
  }

  private _handleStateMove(id: string, { x, y }: { x: number; y: number }) {
    const state = this.statesMap[id]
    if (state) {
      state.x = x
      state.y = y
      this.updateStateMachineData()
    }
  }

  private _updateStateMachineGraph() {
    console.log('🎨 _updateStateMachineGraph called')
    console.log('🎨 _editingAnimatorControllerId:', this._editingAnimatorControllerId)
    this._reset()

    const editingAnimatorController = this.editingAnimatorController
    console.log('📊 editingAnimatorController:', !!editingAnimatorController)
    if (!editingAnimatorController && this._editingAnimatorControllerId) {
      console.log('⚠️ ID set but controller not found via computed')
      const rootState = this.adapter.stateManager.getState()
      const directCheck = rootState?.assetStore?.assets?.[this._editingAnimatorControllerId]
      console.log('⚠️ Direct check in _updateStateMachineGraph:', !!directCheck)
    }
    if (!editingAnimatorController) {
      console.log('❌ No controller available, trying direct access...')
      // 临时hack：直接获取controller
      const rootState = this.adapter.stateManager.getState()
      const directController = rootState?.assetStore?.assets?.[this._editingAnimatorControllerId!]
      if (directController) {
        console.log('✅ Got direct controller, proceeding...')
        const { internalDataUpdated } = directController
        console.log('🔄 internalDataUpdated:', internalDataUpdated)
        if (internalDataUpdated) {
          console.log('🚀 Initializing by StateMachine data')
          this._initByStateMachineData(directController.layers[0].stateMachine!)
          directController.internalDataUpdated = false
        } else {
          // 如果没有内部数据更新，但也没有图形数据，就初始化基础状态
          console.log('🎭 No internal data, initializing basic states')
          this._initStates()
        }
        this._updateStateMachineDataImmediately()

        // 强制设置编辑器状态为可编辑
        this.updateEditorState(EditorState.Editable)
      }
      return
    }

    const { internalDataUpdated } = editingAnimatorController
    console.log('🔄 internalDataUpdated:', internalDataUpdated)
    if (internalDataUpdated) {
      console.log('🚀 Initializing by StateMachine data')
      this._initByStateMachineData(editingAnimatorController.layers[0].stateMachine!)
      editingAnimatorController.internalDataUpdated = false
    } else {
      const graphData = editingAnimatorController.layers[this.currentLayerIndex]._stateMachineGraphData
      if (graphData) {
        console.log('📥 Importing graph data')
        this._importGraphData(graphData)
      } else {
        console.log('🎭 Initializing states only')
        this._initStates()
      }
    }

    this._updateStateMachineDataImmediately()
  }

  private _makeUniqueStateName(name = 'New State'): string {
    const { _statesNameMap: statesNameMap } = this
    const originName = name
    let index = 0
    while (statesNameMap[name]) {
      index++
      name = `${originName}${index}`
    }
    return name
  }

  private _reset() {
    this.states.length = 0
    this.statesMap = {}
    this._statesNameMap = {}
    this.transitions.length = 0
    this.transitionsMap = {}
    this.stateMachineGraph.reset()
  }

  private _exportData() {
    const entryTransitions: ITransitionData[] = []
    const anyTransitions: ITransitionData[] = []
    const transitions: ITransitionData[] = []

    this.transitions.forEach((transition) => {
      if (transition.sourceState.isEntryState) {
        entryTransitions.push(transition.data)
      } else if (transition.sourceState.isAnyState) {
        anyTransitions.push(transition.data)
      } else {
        transitions.push(transition.data)
      }
    })

    return {
      entryTransitions,
      anyTransitions,
      transitions,
      states: this.states
        .filter((state) => !state.isEntryState && !state.isExitState && !state.isAnyState)
        .map((state) => state.data),
    }
  }

  private _importGraphData(data: any) {
    data = toJS(data)
    const { cells } = data
    const transitions: any[] = []

    cells.forEach((cell: any) => {
      const shape = cell.shape
      if (shape === 'state' || shape === 'internalState') {
        const { id, stateType, position, data } = cell
        const state = this.addState(data.name, id, stateType)
        state.setPosition(position.x, position.y)
        state.data = data
      }

      if (shape === 'edge') {
        transitions.push(cell)
      }
    })

    transitions.forEach((cell) => {
      const { id, source, target, data } = cell
      const transition = this.addTransition(id, source.cell, target.cell)
      transition.data = data
    })
  }

  private _initByStateMachineData(data: IStateMachineData) {
    data = toJS(data)
    this._initStates()
    const { states, transitions, entryTransitions, anyTransitions } = data
    const transitionMap: Record<string, ITransitionData> = {}

    transitions.forEach((transition) => {
      transitionMap[transition.id] = transition
    })

    // First, create all states
    states.forEach((stateData: IStateData, index: number) => {
      const { id, name } = stateData
      const newState = this.addState(name, id!)
      newState.data = stateData
      newState.x += index * 24
      newState.y += index * 24
    })

    // Then, create all transitions after all states exist
    states.forEach((stateData: IStateData) => {
      const { id, transitions: transitionIds } = stateData
      transitionIds.forEach((transitionId) => {
        const transitionData = transitionMap[transitionId]
        if (transitionData) {
          const transition = this.addTransition(transitionData.id, id!, transitionData.destinationStateId)
          transition.data = transitionData
        }
      })
    })

    entryTransitions.forEach((transitionData) => {
      const transition = this.addTransition(transitionData.id, 'entry', transitionData.destinationStateId)
      transition.data = transitionData
    })

    anyTransitions.forEach((transitionData) => {
      const transition = this.addTransition(transitionData.id, 'any', transitionData.destinationStateId)
      transition.data = transitionData
    })
  }

  private _initStates() {
    const anyNode = this.addState('any', 'any', 3) // StateType.AnyState
    const entryNode = this.addState('entry', 'entry', 1) // StateType.Entry
    const exitNode = this.addState('exit', 'exit', 2) // StateType.Exit

    anyNode.setPosition(120, 40)
    entryNode.setPosition(120, 180)
    exitNode.setPosition(600, 180)
  }

  private _handleAddTransition(id: string, sourceStateId: string, destinationStateId: string) {
    const { statesMap } = this
    const transition = new Transition(
      this.stateMachineGraph,
      id,
      statesMap[sourceStateId],
      statesMap[destinationStateId]
    )
    this.transitions.push(transition)
    this.transitionsMap[transition.id] = transition
    this.updateStateMachineData()
  }

  private _handleUpdateTransitionTarget(transitionId: string, destinationStateId: string) {
    const transition = this.transitionsMap[transitionId]
    if (transition) {
      transition.updateTarget(this.statesMap[destinationStateId])
      this.updateStateMachineData()
    }
  }

  private _handleStatesDelete(ids: string[]) {
    ids.forEach((id) => {
      const state = this.statesMap[id]
      if (state) {
        this.states.splice(this.states.indexOf(state), 1)
        delete this.statesMap[id]

        this._handleTransitionsDelete(Object.keys(state._inTransitions))
        this._handleTransitionsDelete(Object.keys(state._outTransitions))
      }
    })

    this.clearSelect()
    this.updateStateMachineData()
  }

  private _handleTransitionsDelete(ids: string[]) {
    ids.forEach((id) => {
      const transition = this.transitionsMap[id]
      if (!transition) return
      this.transitions.splice(this.transitions.indexOf(transition), 1)
      delete this.transitionsMap[id]
      delete transition.sourceState._outTransitions[transition.id]
      delete transition.targetState._inTransitions[transition.id]
    })

    this.clearSelect()
    this.updateStateMachineData()
  }
}
