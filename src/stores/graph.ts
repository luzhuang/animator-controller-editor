import { Edge, Graph, Node } from '@antv/x6'
import { Selection } from '@antv/x6-plugin-selection'
import type { ContextMenuInfo, ITransitionData } from '../types/animator'
import { StateType } from '../types/animator'
import type { State } from './state'
import type { Transition } from './transition'
import './x6-nodes' // 导入X6节点注册

export class AnimatorStateMachineGraph {
  nodeMap: Record<string, Node> = {}
  edgeMap: Record<string, Edge> = {}

  onContextMenuUpdate: (info: ContextMenuInfo) => void = () => {}
  onStateClick: (id: string) => void = () => {}
  onStateMove: (id: string, position: { x: number; y: number }) => void = () => {}
  onTransitionClick: (id: string) => void = () => {}
  onStatesDelete: (ids: string[]) => void = () => {}
  onTransitionsDelete: (ids: string[]) => void = () => {}
  onAddTransition: (id: string, sourceStateId: string, destinationStateId: string) => void = () => {}
  onUpdateTransitionTarget: (transitionId: string, destinationStateId: string) => void = () => {}

  private _graph: Graph | null = null
  private _container: HTMLElement
  private _resizeObserver: ResizeObserver | null = null

  constructor() {
    this._container = document.createElement('div')
    this._container.style.width = '100%'
    this._container.style.height = '100%'
    this._container.style.position = 'relative'
    console.log('🎨 AnimatorStateMachineGraph initializing with X6...')
    
    this._graph = new Graph({
      grid: 1,
      container: this._container,
      autoResize: true,
      panning: true,
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: ['ctrl', 'meta'],
        factor: 1.1,
        minScale: 0.3,
      },
      highlighting: {
        nodeAvailable: {
          name: 'className',
          args: {
            className: 'available',
          },
        },
        magnetAvailable: {
          name: 'className',
          args: {
            className: 'available',
          },
        },
        magnetAdsorbed: {
          name: 'className',
          args: {
            className: 'adsorbed',
          },
        },
      },
      connecting: {
        router: 'normal',
        snap: {
          radius: 20,
        },
        highlight: true,
        connectionPoint: 'anchor',
        validateMagnet: ({ magnet }) => {
          return magnet.getAttribute('port-group') !== 'in'
        },
        validateConnection: ({ sourceView, targetView, sourceMagnet, targetMagnet }) => {
          if (!sourceView || !targetView) return false
          
          const targetIds = sourceView.cell.data?.transitions?.map(
            (transition: ITransitionData) => transition.destinationStateId
          ) || []
          // 不能重复连接
          if (targetIds.includes(targetView.cell.id)) {
            return false
          }
          // 只能从输出链接桩创建连接
          if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
            return false
          }

          // 只能连接到输入链接桩
          if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
            return false
          }
          return true
        },
        createEdge() {
          return this.createEdge({
            attrs: {
              line: {
                stroke: 'var(--colors-gray10)',
                strokeWidth: 1.5,
                targetMarker: {
                  name: 'block',
                  args: {
                    size: '4',
                  },
                },
              },
            },
            zIndex: 1,
          })
        },
      },
    })

    this._graph.use(
      new Selection({
        enabled: true,
        rubberband: true,
        showNodeSelectionBox: true,
      })
    )

    this._bindEvents()
    console.log('✅ X6 Graph initialized successfully')
  }

  addState(state: State) {
    console.log(`➕ Adding X6 state node: ${state.name} (${state.id})`)
    const { _graph: graph } = this
    if (!graph) return
    
    let ports: { id: string; group: string }[]
    let shape: 'internalState' | 'state'
    
    switch (state.stateType) {
      case StateType.Entry:
        shape = 'internalState'
        ports = [
          {
            id: 'out',
            group: 'out',
          },
        ]
        break
      case StateType.AnyState:
        shape = 'internalState'
        ports = [
          {
            id: 'out',
            group: 'out',
          },
        ]
        break
      case StateType.Exit:
        shape = 'internalState'
        ports = [
          {
            id: 'in',
            group: 'in',
          },
        ]
        break
      default:
        shape = 'state'
        ports = [
          {
            id: 'in',
            group: 'in',
          },
          {
            id: 'out',
            group: 'out',
          },
        ]
        break
    }
    
    const cell = graph.addNode({
      id: state.id,
      position: { x: state.x, y: state.y },
      shape: shape,
      data: state.data,
      ports: ports,
      stateType: state.stateType,
      zIndex: 2,
    })

    this.nodeMap[state.id] = cell
    this.syncNodeData(state)
    console.log(`✅ X6 state node added: ${state.name}`)
  }

  addTransition(transition: Transition) {
    console.log(`➕ Adding X6 transition edge: ${transition.id}`)
    const { _graph: graph } = this
    if (!graph) return
    
    const { sourceState, targetState } = transition
    const edge = graph.addEdge({
      id: transition.id,
      source: { cell: sourceState.id, port: 'out' },
      target: { cell: targetState.id, port: 'in' },
      attrs: {
        line: {
          stroke: 'var(--colors-gray10)',
          strokeWidth: 1.5,
          targetMarker: {
            name: 'block',
            args: {
              size: '4',
            },
          },
        },
      },
      connector: 'curve',
      zIndex: 1,
    })

    this.edgeMap[transition.id] = edge
    this.syncEdgeData(transition)
    console.log(`✅ X6 transition edge added: ${transition.id}`)
  }

  removeState(id: string) {
    console.log(`🗑️ Removing X6 state node: ${id}`)
    const cell = this.nodeMap[id]
    if (cell) {
      cell.remove()
      delete this.nodeMap[id]
      console.log(`✅ X6 state node removed: ${id}`)
    }
  }

  removeTransition(id: string) {
    console.log(`🗑️ Removing X6 transition edge: ${id}`)
    const edge = this.edgeMap[id]
    if (edge) {
      edge.remove()
      delete this.edgeMap[id]
      console.log(`✅ X6 transition edge removed: ${id}`)
    }
  }

  clearContextMenuInfo = () => {
    this.onContextMenuUpdate(null)
  }

  deleteSelectedCell = () => {
    console.log('🗑️ Deleting selected X6 cells')
    const { _graph: graph } = this
    if (!graph) return
    
    // 使用 Selection 插件的方法获取选中的元素
    const selectedCells = (graph as any).getSelectedCells ? (graph as any).getSelectedCells() : []
    if (selectedCells.length) {
      graph.removeCells(selectedCells)
      console.log(`✅ Deleted ${selectedCells.length} X6 cells`)
    } else {
      console.log('⚠️ No cells selected for deletion')
    }
  }

  deleteNodeFromContextMenu = async (node: Node) => {
    console.log('🗑️ Deleting X6 node from context menu')
    this._deleteNodes([node])
  }

  deleteEdgeFromContextMenu = async (edge: Edge) => {
    console.log('🗑️ Deleting X6 edge from context menu')
    this._deleteEdges([edge])
  }

  exportGraphData() {
    const { _graph: graph } = this
    if (!graph) return null
    
    return graph.toJSON()
  }

  render(root: HTMLDivElement) {
    console.log('🎨 Rendering X6 graph to container')
    const { _graph: graph } = this
    if (!graph) {
      console.log('❌ No X6 graph instance available')
      return
    }
    console.log('📊 Graph container info:', {
      containerExists: !!this._container,
      containerParent: this._container.parentElement,
      containerChildren: this._container.children.length,
      graphContainer: graph.container,
      graphContainerChildren: graph.container?.children.length
    })
    


    root.appendChild(this._container)
    if (this._resizeObserver) {
      this._resizeObserver.disconnect()
    }
    this._resizeObserver = new ResizeObserver(() => {
      this._resizeGraph()
    })
    this._resizeObserver.observe(this._container.parentElement)
  }

  syncNodeData(state: State) {
    const cell = this.nodeMap[state.id]
    if (cell) {
      cell.setPosition(state.x, state.y)
      cell.updateData(state.data)
    }
  }

  syncEdgeData(transition: Transition) {
    // 边数据同步逻辑
  }

  reset() {
    console.log('🔄 Resetting X6 graph')
    const { _graph: graph } = this
    this.nodeMap = {}
    this.edgeMap = {}
    if (graph) {
      graph.clearCells()
      console.log('✅ X6 graph cleared')
    }
  }

  graphPointToOffsetPoint(graphPoint: { x: number; y: number }) {
    const { _graph: graph } = this
    if (!graph) return graphPoint
    
    const containerRect = this._container.getBoundingClientRect()
    const graphRect = graph.container.getBoundingClientRect()
    
    const scale = graph.transform.getScale()
    const translate = graph.transform.getTranslation()
    
    return {
      x: (graphPoint.x - translate.tx) / scale.sx + (graphRect.left - containerRect.left),
      y: (graphPoint.y - translate.ty) / scale.sy + (graphRect.top - containerRect.top),
    }
  }

  private _bindEvents() {
    const { _graph: graph } = this
    if (!graph) return
    
    console.log('🔗 Binding X6 graph events')
    
    graph.on('node:click', this._onNodeClick)
    graph.on('edge:click', this._onEdgeClick)
    graph.on('blank:click', this._cancelSelected)
    graph.on('node:moved', this._onMoveItem)
    graph.on('node:contextmenu', this._onNodeContextMenu)
    graph.on('edge:contextmenu', this._onEdgeContextMenu)
    graph.on('edge:connected', this._onEdgeConnected)
    graph.on('edge:mouseup', this._onEdgeMouseUp)
    graph.on('edge:removed', this._onEdgeRemoved)
    
    console.log('✅ X6 graph events bound')
  }

  private _resizeGraph() {
    const { _graph: graph } = this
    if (!graph) return
    
    graph.resize()
  }

  private _deleteNodes = (nodes: Node[]) => {
    console.log(`🗑️ Deleting ${nodes.length} X6 nodes`)
    const ids = nodes.map((node) => node.id)
    this.onStatesDelete(ids)
  }

  private _deleteEdges = (edges: Edge[]) => {
    console.log(`🗑️ Deleting ${edges.length} X6 edges`)
    const ids = edges.map((edge) => edge.id)
    this.onTransitionsDelete(ids)
  }

  private _onNodeClick = ({ cell }: { cell: Node }) => {
    console.log(`🖱️ X6 node clicked: ${cell.id}`)
    this.onStateClick(cell.id)
  }

  private _onEdgeClick = ({ cell }: { cell: Edge }) => {
    console.log(`🖱️ X6 edge clicked: ${cell.id}`)
    this.onTransitionClick(cell.id)
  }

  private _cancelSelected = () => {
    console.log('🖱️ X6 blank area clicked - clearing selection')
    this.onStateClick('')
    this.onTransitionClick('')
  }

  private _onMoveItem = ({ cell }: { cell: Node }) => {
    const position = cell.getPosition()
    console.log(`🚚 X6 node moved: ${cell.id} to (${position.x}, ${position.y})`)
    this.onStateMove(cell.id, position)
  }

  private _onNodeContextMenu = (data: any) => {
    console.log('🖱️ X6 node context menu')
    // 节点右键菜单逻辑
  }

  private _onEdgeContextMenu = (data: any) => {
    console.log('🖱️ X6 edge context menu')
    // 边右键菜单逻辑
  }

  private _onEdgeConnected = (args: any) => {
    console.log('🔗 X6 edge connected')
    this._checkEdge(args)
  }

  private _onEdgeMouseUp = (args: any) => {
    console.log('🖱️ X6 edge mouse up')
    // 边鼠标抬起逻辑
  }

  private _onEdgeRemoved = (args: any) => {
    console.log('🗑️ X6 edge removed')
    // 边移除逻辑
  }

  private _checkEdge = (args: any) => {
    const { edge } = args
    const sourceId = edge.getSourceCellId()
    const targetId = edge.getTargetCellId()
    
    if (sourceId && targetId) {
      console.log(`🔗 Creating transition: ${sourceId} -> ${targetId}`)
      this.onAddTransition(edge.id, sourceId, targetId)
    }
  }
}