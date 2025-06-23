import React from 'react'
import { observer } from 'mobx-react-lite'
import { Flex, Button, Text, styled } from '@galacean/editor-ui'

import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'
import { defaultI18n } from '../../i18n'

interface LayerItemProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
  index: number
  selected: boolean
}

export const LayerItem = observer<LayerItemProps>(({ adapter, store, index, selected }) => {
  const {} = adapter
  // 直接使用本地i18n
  const i18n = defaultI18n
  const { editingAnimatorController } = store

  if (!editingAnimatorController) {
    return null
  }

  const layer = editingAnimatorController.layers[index]

  const StyledLayerItem = styled(Flex, {
    padding: 'var(--space-2)',
    borderBottom: '1px solid var(--colors-gray6)',
    backgroundColor: selected ? 'var(--colors-gray3)' : 'transparent',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--colors-gray2)',
    },
  })

  const handleClick = () => {
    store.selectLayer(index)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (editingAnimatorController.layers.length > 1) {
      store.removeLayer(index)
    }
  }

  return (
    <StyledLayerItem
      direction="row"
      align="center"
      justifyContent="between"
      onClick={handleClick}
      data-testid="layer-item"
      className={selected ? 'selected' : ''}>
      <Flex direction="column" gap="xs" flex={1}>
        <Text size="sm" weight="medium">
          {layer.name}
        </Text>
        <Text size="xs" secondary>
          {i18n.t('animation.weight')}: {layer.weight}
        </Text>
      </Flex>
      {editingAnimatorController.layers.length > 1 && (
        <Button size="xs" variant="ghost" onClick={handleRemove} data-testid="remove-layer-button">
          {i18n.t('common.remove')}
        </Button>
      )}
    </StyledLayerItem>
  )
})
