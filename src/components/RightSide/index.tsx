import { useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'

interface RightSideProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
}

export const RightSide = observer<RightSideProps>(({ adapter, store }) => {
  const { uiComponents } = adapter
  const { Flex, styled } = uiComponents
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 创建样式化组件
  const RightSideRoot = styled(Flex, {
    flex: 1,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    minWidth: 0, // 确保 flex 子元素能正确收缩
  })

  const GraphContainer = styled('div', {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    flex: 1,
    '& .x6-graph': {
      width: '100%',
      height: '100%',
    },
    '& .x6-graph-svg': {
      backgroundColor: 'var(--colors-gray1)',
    },
    '& .x6-node': {
      cursor: 'pointer',
    },
    '& .x6-node.available': {
      '& rect': {
        stroke: 'var(--colors-blue8)',
        strokeWidth: 2,
      },
    },
    '& .x6-edge': {
      cursor: 'pointer',
    },
    '& .x6-edge.available': {
      '& path': {
        stroke: 'var(--colors-blue8)',
        strokeWidth: 2,
      },
    },
    '& .x6-edge.adsorbed': {
      '& path': {
        stroke: 'var(--colors-green8)',
        strokeWidth: 2,
      },
    },
  })

  useEffect(() => {
    if (containerRef.current && store.stateMachineGraph) {
      store.stateMachineGraph.render(containerRef.current)
    }
  })
console.log(store.editingAnimatorController)
  return (
    <RightSideRoot>
      <GraphContainer>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} >
          sad
          </div>
      </GraphContainer>
    </RightSideRoot>
  )
})