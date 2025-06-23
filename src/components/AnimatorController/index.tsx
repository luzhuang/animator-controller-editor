import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'

import type { IAnimatorControllerAdapter } from '../../types/adapter'
import { AnimatorControllerEditorState } from '../../types/animator'
import { useAnimatorControllerStore } from '../../hooks/useAnimatorControllerStore'
import { LeftSide } from '../LeftSide'
import { RightSide } from '../RightSide'
import { NeedCreatedState } from '../NeedCreatedState'

export interface AnimatorControllerProps {
  /** 适配器实例 */
  adapter: IAnimatorControllerAdapter

  /** 额外的样式类名 */
  className?: string

  /** 额外的样式 */
  style?: React.CSSProperties
}

export const AnimatorController = observer<AnimatorControllerProps>(({ adapter, className, style }) => {
  const store = useAnimatorControllerStore(adapter)
  const { editorState, selectedEntity, editingAnimator } = store

  const { uiComponents, eventBus, i18n } = adapter
  const { Flex, styled } = uiComponents
  const layoutListener = useRef<(() => void) | null>(null)
  const [isReady, setIsReady] = React.useState(false)

  // 创建样式化组件
  const StyledAnimatorControllerWrap = styled(Flex, {
    width: '100%',
    height: '100%',
    opacity: isReady ? 1 : 0,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  })

  const StyledContent = styled('div', {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: 'var(--colors-slate-11)',
    fontSize: 'var(--fontSizes-1)',
  })

  const ReadOnlyMask = styled('div', {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  })

  useEffect(() => {
    store.setVisibility(true)

    // 监听面板可见性变化
    const unsubscribe = eventBus.on('panel-visible-change', (data: any) => {
      if (data.panelId === 'AnimatorController') {
        store.setVisibility(data.visible)
      }
    })

    layoutListener.current = unsubscribe

    // 延迟渲染，确保容器有尺寸
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100) // 给更多时间确保 DOM 完全准备好

    return () => {
      clearTimeout(timer)
      if (layoutListener.current) {
        layoutListener.current()
      }
      store.setVisibility(false)
    }
  }, [store, eventBus])

  // 没有编辑中的AnimatorController
  if (!store.editingAnimatorController) {
    if (editorState === AnimatorControllerEditorState.NeedCreate) {
      return (
        <NeedCreatedState
          adapter={adapter}
          targetEntity={selectedEntity}
          needAddClip={false}
          animator={editingAnimator}
          animatorController={null}
          onCreating={() => {
            store.updateEditorState(AnimatorControllerEditorState.Loading)
          }}
          onCreated={() => {
            store.checkAnimatorControllerAsset()
          }}
        />
      )
    }
    return <StyledContent>{i18n.t('animation.select-controller')}</StyledContent>
  }

  return (
    <StyledAnimatorControllerWrap wrap={false} className={className} style={style}>
      <LeftSide adapter={adapter} store={store} />
      <RightSide adapter={adapter} store={store} />
    </StyledAnimatorControllerWrap>
  )
})

AnimatorController.displayName = 'AnimatorController'
