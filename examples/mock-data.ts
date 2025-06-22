import { v4 as uuidv4 } from 'uuid'
import { 
  ParameterValueType
} from '../src/types/animator'
import type { 
  IAnimatorControllerAsset,
  IStateMachineData,
  IStateData,
  ITransitionData,
  IParameterData,
  ILayerData
} from '../src/types/animator'

// 创建模拟的AnimatorController数据
export function createMockAnimatorControllerData(controllerId?: string): IAnimatorControllerAsset {
  const entryStateId = uuidv4()
  const exitStateId = uuidv4()
  const idleStateId = uuidv4()
  const walkStateId = uuidv4()
  const runStateId = uuidv4()
  const jumpStateId = uuidv4()
  const attackStateId = uuidv4()
  const blockStateId = uuidv4()
  const rollStateId = uuidv4()
  const deathStateId = uuidv4()

  // 创建Parameters - 根据实际接口定义
  const parameters: IParameterData[] = [
    {
      name: 'Speed',
      type: ParameterValueType.Number,
      isTrigger: false,
      defaultValue: 0,
    },
    {
      name: 'IsGrounded',
      type: ParameterValueType.Boolean,
      isTrigger: false,
      defaultValue: true,
    },
    {
      name: 'Jump',
      type: ParameterValueType.Trigger,
      isTrigger: true,
      defaultValue: false,
    },
    {
      name: 'Attack',
      type: ParameterValueType.Trigger,
      isTrigger: true,
      defaultValue: false,
    },
    {
      name: 'Block',
      type: ParameterValueType.Trigger,
      isTrigger: true,
      defaultValue: false,
    },
    {
      name: 'Roll',
      type: ParameterValueType.Trigger,
      isTrigger: true,
      defaultValue: false,
    },
    {
      name: 'Health',
      type: ParameterValueType.Number,
      isTrigger: false,
      defaultValue: 100,
    },
    {
      name: 'IsBlocking',
      type: ParameterValueType.Boolean,
      isTrigger: false,
      defaultValue: false,
    }
  ]

  // 创建States - 根据实际接口定义，添加位置信息
  const states: IStateData[] = [
    {
      id: idleStateId,
      name: 'Idle',
      clip: { name: 'idle_animation', id: uuidv4() },
      speed: 1,
      wrapMode: 2, // Loop
      clipStartNormalizedTime: 0,
      clipEndNormalizedTime: 1,
      transitions: [],
      scripts: [],
      isDefault: true,
    },
    {
      id: walkStateId,
      name: 'Walk',
      clip: { name: 'walk_animation', id: uuidv4() },
      speed: 1,
      wrapMode: 2,
      clipStartNormalizedTime: 0,
      clipEndNormalizedTime: 1,
      transitions: [],
      scripts: [],
      isDefault: false,
    },
    {
      id: runStateId,
      name: 'Run',
      clip: { name: 'run_animation', id: uuidv4() },
      speed: 1.2,
      wrapMode: 2,
      clipStartNormalizedTime: 0,
      clipEndNormalizedTime: 1,
      transitions: [],
      scripts: [],
      isDefault: false,
    },
    {
      id: jumpStateId,
      name: 'Jump',
      clip: { name: 'jump_animation', id: uuidv4() },
      speed: 1,
      wrapMode: 1, // Once
      clipStartNormalizedTime: 0,
      clipEndNormalizedTime: 1,
      transitions: [],
      scripts: [],
      isDefault: false,
    },
    {
      id: attackStateId,
      name: 'Attack',
      clip: { name: 'attack_animation', id: uuidv4() },
      speed: 1.2,
      wrapMode: 1, // Once
      clipStartNormalizedTime: 0,
      clipEndNormalizedTime: 1,
      transitions: [],
      scripts: [],
      isDefault: false,
    },
    {
      id: blockStateId,
      name: 'Block',
      clip: { name: 'block_animation', id: uuidv4() },
      speed: 1,
      wrapMode: 2, // Loop
      clipStartNormalizedTime: 0,
      clipEndNormalizedTime: 1,
      transitions: [],
      scripts: [],
      isDefault: false,
    },
    {
      id: rollStateId,
      name: 'Roll',
      clip: { name: 'roll_animation', id: uuidv4() },
      speed: 1.5,
      wrapMode: 1, // Once
      clipStartNormalizedTime: 0,
      clipEndNormalizedTime: 1,
      transitions: [],
      scripts: [],
      isDefault: false,
    },
    {
      id: deathStateId,
      name: 'Death',
      clip: { name: 'death_animation', id: uuidv4() },
      speed: 1,
      wrapMode: 1, // Once
      clipStartNormalizedTime: 0,
      clipEndNormalizedTime: 1,
      transitions: [],
      scripts: [],
      isDefault: false,
    }
  ]

  // 创建Transitions - 根据实际接口定义
  const transitions: ITransitionData[] = [
    // Idle -> Walk
    {
      id: uuidv4(),
      sourceStateId: idleStateId,
      destinationStateId: walkStateId,
      solo: false,
      mute: false,
      hasExitTime: false,
      isFixedDuration: true,
      duration: 0.25,
      exitTime: 0,
      offset: 0,
      conditions: [
        {
          id: uuidv4(),
          parameterId: 'Speed',
          mode: 'Greater',
          threshold: 0.1
        }
      ]
    },
    // Walk -> Idle
    {
      id: uuidv4(),
      sourceStateId: walkStateId,
      destinationStateId: idleStateId,
      solo: false,
      mute: false,
      hasExitTime: false,
      isFixedDuration: true,
      duration: 0.25,
      exitTime: 0,
      offset: 0,
      conditions: [
        {
          id: uuidv4(),
          parameterId: 'Speed',
          mode: 'Less',
          threshold: 0.1
        }
      ]
    },
    // Walk -> Run
    {
      id: uuidv4(),
      sourceStateId: walkStateId,
      destinationStateId: runStateId,
      solo: false,
      mute: false,
      hasExitTime: false,
      isFixedDuration: true,
      duration: 0.25,
      exitTime: 0,
      offset: 0,
      conditions: [
        {
          id: uuidv4(),
          parameterId: 'Speed',
          mode: 'Greater',
          threshold: 5.0
        }
      ]
    },
    // Run -> Walk
    {
      id: uuidv4(),
      sourceStateId: runStateId,
      destinationStateId: walkStateId,
      solo: false,
      mute: false,
      hasExitTime: false,
      isFixedDuration: true,
      duration: 0.25,
      exitTime: 0,
      offset: 0,
      conditions: [
        {
          id: uuidv4(),
          parameterId: 'Speed',
          mode: 'Less',
          threshold: 5.0
        }
      ]
    },
    // Jump -> Idle
    {
      id: uuidv4(),
      sourceStateId: jumpStateId,
      destinationStateId: idleStateId,
      solo: false,
      mute: false,
      hasExitTime: true,
      isFixedDuration: true,
      duration: 0.25,
      exitTime: 0.9,
      offset: 0,
      conditions: [
        {
          id: uuidv4(),
          parameterId: 'IsGrounded',
          mode: 'Equals',
          threshold: 1 // true
        }
      ]
    },
    // Idle -> Attack
    {
      id: uuidv4(),
      sourceStateId: idleStateId,
      destinationStateId: attackStateId,
      solo: false,
      mute: false,
      hasExitTime: false,
      isFixedDuration: true,
      duration: 0.1,
      exitTime: 0,
      offset: 0,
      conditions: [
        {
          id: uuidv4(),
          parameterId: 'Attack',
          mode: 'Equals',
          threshold: 1
        }
      ]
    },
    // Attack -> Idle
    {
      id: uuidv4(),
      sourceStateId: attackStateId,
      destinationStateId: idleStateId,
      solo: false,
      mute: false,
      hasExitTime: true,
      isFixedDuration: true,
      duration: 0.2,
      exitTime: 0.8,
      offset: 0,
      conditions: []
    },
    // Idle -> Block
    {
      id: uuidv4(),
      sourceStateId: idleStateId,
      destinationStateId: blockStateId,
      solo: false,
      mute: false,
      hasExitTime: false,
      isFixedDuration: true,
      duration: 0.1,
      exitTime: 0,
      offset: 0,
      conditions: [
        {
          id: uuidv4(),
          parameterId: 'Block',
          mode: 'Equals',
          threshold: 1
        }
      ]
    },
    // Block -> Idle
    {
      id: uuidv4(),
      sourceStateId: blockStateId,
      destinationStateId: idleStateId,
      solo: false,
      mute: false,
      hasExitTime: false,
      isFixedDuration: true,
      duration: 0.2,
      exitTime: 0,
      offset: 0,
      conditions: [
        {
          id: uuidv4(),
          parameterId: 'IsBlocking',
          mode: 'Equals',
          threshold: 0 // false
        }
      ]
    },
  ]

  // 创建 Entry 和 Any state 的 transitions
  const entryTransitions: ITransitionData[] = [
    {
      id: uuidv4(),
      sourceStateId: 'entry',
      destinationStateId: idleStateId,
      solo: false,
      mute: false,
      hasExitTime: false,
      isFixedDuration: true,
      duration: 0.25,
      exitTime: 0,
      offset: 0,
      conditions: []
    }
  ]

  const anyTransitions: ITransitionData[] = [
    {
      id: uuidv4(),
      sourceStateId: 'any',
      destinationStateId: jumpStateId,
      solo: false,
      mute: false,
      hasExitTime: false,
      isFixedDuration: true,
      duration: 0.1,
      exitTime: 0,
      offset: 0,
      conditions: [
        {
          id: uuidv4(),
          parameterId: 'Jump',
          mode: 'Equals',
          threshold: 1 // Trigger fired
        },
        {
          id: uuidv4(),
          parameterId: 'IsGrounded',
          mode: 'Equals',
          threshold: 1 // true
        }
      ]
    },
    {
      id: uuidv4(),
      sourceStateId: 'any',
      destinationStateId: rollStateId,
      solo: false,
      mute: false,
      hasExitTime: false,
      isFixedDuration: true,
      duration: 0.05,
      exitTime: 0,
      offset: 0,
      conditions: [
        {
          id: uuidv4(),
          parameterId: 'Roll',
          mode: 'Equals',
          threshold: 1
        }
      ]
    },
    {
      id: uuidv4(),
      sourceStateId: 'any',
      destinationStateId: deathStateId,
      solo: false,
      mute: false,
      hasExitTime: false,
      isFixedDuration: true,
      duration: 0.3,
      exitTime: 0,
      offset: 0,
      conditions: [
        {
          id: uuidv4(),
          parameterId: 'Health',
          mode: 'Less',
          threshold: 1
        }
      ]
    }
  ]

  // 创建StateMachine - 根据实际接口定义
  const stateMachine: IStateMachineData = {
    entryTransitions,
    anyTransitions,
    states,
    transitions
  }

  // 创建Layer - 根据实际接口定义
  const layers: ILayerData[] = [
    {
      name: 'Base Layer',
      blendingMode: 0, // Override
      weight: 1,
      stateMachine,
      _stateMachineGraphData: null
    }
  ]

  // 创建AnimatorController - 根据实际接口定义
  const animatorController: IAnimatorControllerAsset & { getMetaConfig: () => any } = {
    id: controllerId || uuidv4(),
    name: 'Character Controller',
    currentLayerIndex: 0,
    layers,
    parameters,
    internalDataUpdated: true,
    isSubAsset: false,
    
    // 添加方法实现（模拟）
    addParameter: (type: any, name?: string, defaultValue?: any) => {
      console.log('Mock addParameter', type, name, defaultValue)
    },
    removeParameter: (index: number) => {
      console.log('Mock removeParameter', index)
    },
    updateParameterData: (index: number, data: any) => {
      console.log('Mock updateParameterData', index, data)
    },
    addLayer: () => {
      console.log('Mock addLayer')
    },
    removeLayer: (index: number) => {
      console.log('Mock removeLayer', index)
    },
    applyControllerData: () => {
      console.log('Mock applyControllerData')
    },
    save: () => {
      console.log('Mock save')
    },
    updateLayerName: (index: number, name: string) => {
      console.log('Mock updateLayerName', index, name)
    },
    updateLayerWeight: (index: number, weight: number) => {
      console.log('Mock updateLayerWeight', index, weight)
    },
    updateLayerBlendingMode: (index: number, blendingMode: any) => {
      console.log('Mock updateLayerBlendingMode', index, blendingMode)
    },
    updateStateMachineData: (index: number, data: any, graphData: any) => {
      console.log('Mock updateStateMachineData', index, data, graphData)
    },
    getMetaConfig: () => ({
      type: 'AnimatorController'
    })
  }

  return animatorController
}

// 创建模拟的Entity数据
export function createMockEntityData() {
  return {
    id: uuidv4(),
    name: 'Character',
    components: [
      {
        id: uuidv4(),
        type: 'Animator',
        animatorController: null, // 将由store设置
        enabled: true
      }
    ]
  }
}