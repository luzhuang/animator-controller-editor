import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Flex,
  SegmentControl,
  SegmentControlItem,
  Text,
  styled,
  ActionButton,
  DropdownMenu,
  ScrollArea,
} from '@galacean/editor-ui'
import { IconPlus } from '@tabler/icons-react'

import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'
import { ParameterItem } from './ParameterItem'
import { LayerItem } from './LayerItem'
import { ParameterTypeMenu } from './ParameterTypeMenu'
import { defaultI18n } from '../../i18n'

interface LeftSideProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
}

type TabType = 'Layers' | 'Parameters'

export const LeftSide = observer<LeftSideProps>(({ adapter, store }) => {
  // 直接使用本地i18n，不再从adapter获取
  const i18n = defaultI18n

  const [tab, setTab] = useState<TabType>('Layers')
  const { editingAnimatorController } = store

  if (!editingAnimatorController) {
    return null
  }

  const { layers, parameters } = editingAnimatorController

  // 创建样式化组件
  const LeftSideRoot = styled(Flex, {
    width: '300px',
    height: '100%',
  })

  const StyledTitleWrap = styled(Flex, {
    padding: 'var(--space-2)',
    borderBottom: '1px solid var(--colors-gray6)',
    '& > span': {
      fontSize: 'var(--fontSizes-sm)',
      color: 'var(--colors-gray12)',
      fontWeight: 'bold',
    },
  })

  const StyledTip = styled(Flex, {
    paddingTop: 'var(--space-10)',
    justifyContent: 'center',
    alignItems: 'center',
  })

  const LayerList = layers.map((_, index) => (
    <LayerItem key={index} adapter={adapter} store={store} index={index} selected={store.currentLayerIndex === index} />
  ))

  const ParameterList = parameters.length ? (
    parameters.map((_, index) => <ParameterItem key={index} adapter={adapter} store={store} index={index} />)
  ) : (
    <StyledTip>
      <Text size="sm" secondary>
        {i18n.t('animation.no-parameters')}
      </Text>
    </StyledTip>
  )

  return (
    <LeftSideRoot direction="column" wrap={false} data-testid="left-sidebar">
      <StyledTitleWrap justifyContent="between" align="v">
        <Flex gap="xs" wrap={false}>
          <SegmentControl
            value={tab}
            defaultValue="Layers"
            onValueChange={(value: any) => {
              setTab(value as TabType)
            }}>
            <SegmentControlItem value="Layers">
              <span>{i18n.t('animation.layers')}</span>
            </SegmentControlItem>
            <SegmentControlItem value="Parameters">
              <span>{i18n.t('animation.parameters')}</span>
            </SegmentControlItem>
          </SegmentControl>
        </Flex>
        {tab === 'Layers' ? (
          <ActionButton
            size="sm"
            onClick={() => {
              editingAnimatorController.addLayer()
            }}
            data-testid="add-layer-button">
            <IconPlus style={{ width: '18px', height: '18px', strokeWidth: 2 }} />
          </ActionButton>
        ) : (
          <DropdownMenu
            trigger={
              <ActionButton size="sm" data-testid="add-parameter-button">
                <IconPlus style={{ width: '18px', height: '18px', strokeWidth: 2 }} />
              </ActionButton>
            }>
            <ParameterTypeMenu adapter={adapter} store={store} />
          </DropdownMenu>
        )}
      </StyledTitleWrap>
      <ScrollArea>
        {tab === 'Layers' && LayerList}
        {tab === 'Parameters' && ParameterList}
      </ScrollArea>
    </LeftSideRoot>
  )
})
