import React from 'react'
import { observer } from 'mobx-react-lite'
import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'

interface LayerItemProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
  index: number
  selected: boolean
}

export const LayerItem = observer<LayerItemProps>(({ adapter, store, index, selected }) => {
  const { uiComponents, i18n } = adapter
  const { Flex, Button, Text, styled } = uiComponents
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
    >
      <Flex direction="column" gap="xs" flex={1}>
        <Text size="sm" weight="medium">
          {layer.name}
        </Text>
        <Text size="xs" secondary>
          {i18n.t('animation.weight')}: {layer.weight}
        </Text>
      </Flex>
      {editingAnimatorController.layers.length > 1 && (
        <Button
          size="xs"
          variant="ghost"
          onClick={handleRemove}
        >
          {i18n.t('common.remove')}
        </Button>
      )}
    </StyledLayerItem>
  )
})