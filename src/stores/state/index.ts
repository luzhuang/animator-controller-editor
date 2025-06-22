import { action, computed, makeObservable, observable, toJS } from 'mobx'
import type { IStateData, StateType } from '../../types/animator'
import type { AnimatorStateMachineGraph } from '../graph'
import type { Transition } from '../transition'

export class State {
  x = 400
  y = 50
  
  private _data: IStateData = {
    id: '',
    name: '',
    clip: null,
    speed: 1,
    wrapMode: undefined,
    clipStartNormalizedTime: 0,
    clipEndNormalizedTime: 1,
    transitions: [],
    scripts: [],
    isDefault: false,
  }

  _inTransitions: Record<string, Transition> = {}
  _outTransitions: Record<string, Transition> = {}

  get data(): IStateData {
    this._data.name = this.name
    this._data.transitions.length = 0
    Object.values(this._outTransitions).forEach((transition) => {
      this._data.transitions.push(transition.id)
    })
    this._data.id = this.id
    return this._data
  }

  set data(data: IStateData) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        ;(this._data as any)[key] = toJS((data as any)[key])
      }
    }
    this._syncData()
  }

  get isEntryState() {
    return this.stateType === 1 // StateType.Entry
  }

  get isExitState() {
    return this.stateType === 2 // StateType.Exit
  }

  get isAnyState() {
    return this.stateType === 3 // StateType.AnyState
  }

  constructor(
    private readonly _graph: AnimatorStateMachineGraph,
    public name: string,
    public readonly id: string,
    public readonly stateType: StateType = 0 // StateType.Normal
  ) {
    makeObservable(this, {
      _data: observable,
      data: computed,
      addStateMachineScript: action,
      removeStateMachineScript: action,
      updateStateMachineScript: action,
      updateData: action,
    } as any)
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
    this._syncData()
  }

  addStateMachineScript(scriptId: string) {
    this._data.scripts.push(scriptId)
    this._syncData()
  }

  removeStateMachineScript(index: number) {
    this._data.scripts.splice(index, 1)
    this._syncData()
  }

  updateStateMachineScript(index: number, scriptId: string) {
    this._data.scripts[index] = scriptId
    this._syncData()
  }

  updateData(property: string, value: any) {
    if (property === 'name') {
      this.name = value
    }
    ;(this._data as any)[property] = value
    this._syncData()
  }

  private _syncData() {
    this._graph.syncNodeData(this)
  }
}