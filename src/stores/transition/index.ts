import { action, computed, makeObservable, observable } from 'mobx'
import type { ITransitionData, IConditionData } from '../../types/animator'
import type { AnimatorStateMachineGraph } from '../graph'
import type { State } from '../state'

export class Transition {
  private _data: ITransitionData = {
    id: '',
    sourceStateId: '',
    destinationStateId: '',
    isFixedDuration: false,
    duration: 0.25,
    offset: 0,
    exitTime: 0.75,
    solo: false,
    mute: false,
    hasExitTime: true,
    conditions: [],
  }

  get data(): ITransitionData {
    this._data.id = this.id
    this._data.sourceStateId = this.sourceState.id
    this._data.destinationStateId = this.targetState.id
    return this._data
  }

  set data(data: Partial<ITransitionData>) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        ;(this._data as any)[key] = (data as any)[key]
      }
    }
    this._syncData()
  }

  get sourceState() {
    return this._sourceState
  }

  get targetState() {
    return this._targetState
  }

  get isExit() {
    return this.targetState?.isExitState
  }

  constructor(
    private readonly _graph: AnimatorStateMachineGraph,
    public readonly id: string,
    private _sourceState: State,
    private _targetState: State
  ) {
    if (_sourceState) {
      _sourceState._outTransitions[id] = this
    }
    if (_targetState) {
      _targetState._inTransitions[id] = this
    }

    if (_sourceState.name === 'entry') {
      this._data.duration = 0
    }

    if (_sourceState.name === 'entry' || _sourceState.name === 'any' || _targetState.name === 'exit') {
      this._data.hasExitTime = false
    }
    
    makeObservable(this, {
      _data: observable,
      data: computed,
      addCondition: action,
      removeCondition: action,
      updateConditionData: action,
      updateData: action,
    } as any)
  }

  updateTarget(targetState: State) {
    if (this._targetState) {
      delete this._targetState._inTransitions[this.id]
    }
    this._targetState = targetState
    targetState._inTransitions[this.id] = this
  }

  addCondition(parameterName = '') {
    this._data.conditions.push({
      id: `condition_${Date.now()}`,
      parameterId: parameterName,
      mode: 'Greater', // Default condition mode
      threshold: 0,
    })
    this._syncData()
  }

  removeCondition(index: number) {
    this._data.conditions.splice(index, 1)
    this._syncData()
  }

  updateConditionData(index: number, data: Partial<IConditionData>) {
    const conditionData = this._data.conditions[index]
    if (!conditionData) return

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key === 'threshold') {
          const value = (data as any)[key]
          const formatValue = isNaN(value) || !value ? value : parseFloat(value)
          ;(conditionData as any)[key] = formatValue
        } else {
          ;(conditionData as any)[key] = (data as any)[key]
        }
      }
    }
    this._syncData()
  }

  updateData(property: string, value: any) {
    ;(this._data as any)[property] = value
    this._syncData()
  }

  private _syncData() {
    this._graph.syncEdgeData(this)
  }
}