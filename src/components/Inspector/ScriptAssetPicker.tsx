import React from 'react'
import { observer } from 'mobx-react-lite'
import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'

interface ScriptAssetPickerProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
  index: number
}

export const ScriptAssetPicker = observer<ScriptAssetPickerProps>(({ adapter, store, index }) => {
  const { uiComponents, i18n } = adapter
  const { Flex, Button, Text, styled, icons } = uiComponents
  const state = store.selectedState
  
  if (!state) {
    return null
  }

  const { scripts } = state.data
  const scriptId = scripts[index]

  const StyledScriptPicker = styled(Flex, {
    padding: 'var(--space-2)',
    border: '1px solid var(--colors-gray6)',
    borderRadius: 'var(--radii-1)',
    marginTop: 'var(--space-2)',
    gap: 'var(--space-2)',
    alignItems: 'center',
  })

  const handleScriptChange = (newScriptId: string) => {
    store.updateStateMachineScript(index, newScriptId)
  }

  const handleRemove = () => {
    store.removeStateMachineScript(index)
  }

  const openScriptPicker = () => {
    // TODO: Open script asset picker
    console.log('Open script picker')
  }

  return (
    <StyledScriptPicker>
      <Flex direction="column" flex={1}>
        <Text size="xs" secondary>
          {i18n.t('animation.state-machine-script')}
        </Text>
        <Button
          size="sm"
          variant="outline"
          onClick={openScriptPicker}
          css={{ justifyContent: 'flex-start' }}
        >
          {scriptId || i18n.t('animation.select-script')}
        </Button>
      </Flex>
      
      <Button
        size="xs"
        variant="ghost"
        onClick={handleRemove}
      >
        <icons.Trash />
      </Button>
    </StyledScriptPicker>
  )
})