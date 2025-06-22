import { Graph } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import React from 'react'

// 简化的AnimatorState组件
const AnimatorState: React.FC<{
  name: string
  isSelected: boolean
  isEntryState: boolean
  isExitState: boolean
  isAnyState: boolean
}> = ({ name, isSelected, isEntryState, isExitState, isAnyState }) => {
  let backgroundColor = '#6b7280' // gray
  let borderColor = '#374151' // gray-dark
  
  if (isEntryState) {
    backgroundColor = '#10b981' // green
    borderColor = '#059669'
  } else if (isExitState) {
    backgroundColor = '#ef4444' // red
    borderColor = '#dc2626'
  } else if (isAnyState) {
    backgroundColor = '#3b82f6' // blue
    borderColor = '#2563eb'
  }

  const style: React.CSSProperties = {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor,
    border: isSelected ? '2px solid #60a5fa' : `1px solid ${borderColor}`,
    borderRadius: '4px',
    fontSize: '12px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: isSelected ? '0 0 0 2px rgba(96, 165, 250, 0.3)' : 'none',
  }

  return (
    <div style={style}>
      {name}
    </div>
  )
}


// 注册state节点类型
register({
  shape: 'state',
  width: 200,
  height: 36,
  inherit: 'react-shape',
  ports: {
    groups: {
      in: {
        position: 'left',
        label: {
          position: 'left',
        },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            fill: '#f3f4f6',
            stroke: '#6b7280',
          },
        },
        pointerEvents: 'none',
      },
      out: {
        position: 'right',
        label: {
          position: 'right',
        },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            fill: '#f3f4f6',
            stroke: '#6b7280',
          },
        },
      },
    },
  },
  component: ({ node }) => {
    const data = node.prop('data')
    const selected = node.prop('selected')
    return (
      <AnimatorState
        name={data.name}
        isSelected={selected}
        isEntryState={data.isEntryState}
        isExitState={data.isExitState}
        isAnyState={data.isAnyState}
      />
    )
  },
})

// 注册internalState节点类型
register({
  shape: 'internalState',
  width: 100,
  height: 36,
  inherit: 'react-shape',
  ports: {
    groups: {
      in: {
        position: 'left',
        label: {
          position: 'left',
        },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            fill: '#f3f4f6',
            stroke: '#6b7280',
          },
        },
        pointerEvents: 'none',
      },
      out: {
        position: 'right',
        label: {
          position: 'right',
        },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            fill: '#f3f4f6',
            stroke: '#6b7280',
          },
        },
      },
    },
  },
  component: ({ node }) => {
    const data = node.prop('data')
    return (
      <AnimatorState
        name={data.name}
        isSelected={false}
        isEntryState={data.isEntryState}
        isExitState={data.isExitState}
        isAnyState={data.isAnyState}
      />
    )
  },
})

// 注册curve连接器
Graph.registerConnector(
  'curve',
  (source, target) => {
    const offset = 4
    const control = 80
    const v1 = { x: source.x, y: source.y + offset + control }
    const v2 = { x: target.x, y: target.y - offset - control }

    return `M ${source.x} ${source.y}
      L ${source.x} ${source.y + offset}
      C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${target.x} ${target.y - offset}
      L ${target.x} ${target.y}
    `
  },
  true
)