import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Flex, styled } from '@galacean/editor-ui'

import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'

interface RightSideProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
}

export const RightSide = observer<RightSideProps>(({ adapter, store }) => {
  // No need for uiComponents anymore
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
    display: 'block', // 修改为 block 而不是 flex
    overflow: 'hidden',
    backgroundColor: 'var(--colors-gray1)',
  })

  useEffect(() => {
    console.log('🎨 RightSide useEffect triggered', {
      containerExists: !!containerRef.current,
      graphExists: !!store.stateMachineGraph,
    })

    if (containerRef.current && store.stateMachineGraph) {
      console.log('🎨 RightSide rendering X6 graph')
      store.stateMachineGraph.render(containerRef.current)
    }
  }, [store.stateMachineGraph])

  // 添加额外的 effect 来确保容器准备好后再渲染
  useEffect(() => {
    if (containerRef.current && store.stateMachineGraph) {
      // 使用 setTimeout 确保 DOM 完全准备好
      const timer = setTimeout(() => {
        console.log('🎨 RightSide delayed render', {
          containerSize: `${containerRef.current?.offsetWidth}x${containerRef.current?.offsetHeight}`,
        })
        if (containerRef.current && store.stateMachineGraph) {
          store.stateMachineGraph.render(containerRef.current)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [store.stateMachineGraph])

  return (
    <RightSideRoot data-testid="graph-container">
      <GraphContainer>
        <div
          ref={containerRef}
          className="x6-graph"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '100%', // 确保最小高度
            overflow: 'hidden',
          }}
        />
      </GraphContainer>
    </RightSideRoot>
  )
})
