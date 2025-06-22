import React from 'react'
import { observer } from 'mobx-react-lite'
import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'
import { ParameterValueType } from '../../types/animator'

interface ParameterItemProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
  index: number
}

export const ParameterItem = observer<ParameterItemProps>(({ adapter, store, index }) => {
  const { uiComponents, i18n } = adapter
  const { Flex, Button, Text, Input, styled } = uiComponents
  const { editingAnimatorController } = store
  
  if (!editingAnimatorController) {
    return null
  }
  
  const parameter = editingAnimatorController.parameters[index]
  
  const StyledParameterItem = styled(Flex, {
    padding: 'var(--space-2)',
    borderBottom: '1px solid var(--colors-gray6)',
    gap: 'var(--space-2)',
  })

  const getParameterTypeLabel = (type: ParameterValueType) => {
    switch (type) {
      case ParameterValueType.Number:
        return i18n.t('animation.parameter.number')
      case ParameterValueType.String:
        return i18n.t('animation.parameter.string')
      case ParameterValueType.Boolean:
        return i18n.t('animation.parameter.boolean')
      case ParameterValueType.Trigger:
        return i18n.t('animation.parameter.trigger')
      default:
        return 'Unknown'
    }
  }

  const handleNameChange = (value: string) => {
    editingAnimatorController.updateParameterData(index, { name: value })
  }

  const handleDefaultValueChange = (value: any) => {
    editingAnimatorController.updateParameterData(index, { defaultValue: value })
  }

  const handleRemove = () => {
    editingAnimatorController.removeParameter(index)
  }

  const renderValueEditor = () => {
    switch (parameter.type) {
      case ParameterValueType.Boolean:
        return (
          <Input
            type="checkbox"
            checked={parameter.defaultValue}
            onChange={(e) => handleDefaultValueChange(e.target.checked)}
          />
        )
      case ParameterValueType.Number:
        return (
          <Input
            type="number"
            value={parameter.defaultValue}
            onChange={(e) => handleDefaultValueChange(parseFloat(e.target.value) || 0)}
          />
        )
      case ParameterValueType.String:
        return (
          <Input
            type="text"
            value={parameter.defaultValue}
            onChange={(e) => handleDefaultValueChange(e.target.value)}
          />
        )
      case ParameterValueType.Trigger:
        return (
          <Button
            size="xs"
            variant="secondary"
            onClick={() => {
              // Trigger parameter - could emit event
              console.log('Trigger parameter:', parameter.name)
            }}
          >
            {i18n.t('animation.trigger')}
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <StyledParameterItem direction="column">
      <Flex align="center" justifyContent="between">
        <Flex direction="column" gap="xs" flex={1}>
          <Input
            size="sm"
            value={parameter.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder={i18n.t('animation.parameter.name')}
          />
          <Text size="xs" secondary>
            {getParameterTypeLabel(parameter.type)}
          </Text>
        </Flex>
        <Button
          size="xs"
          variant="ghost"
          onClick={handleRemove}
        >
          {i18n.t('common.remove')}
        </Button>
      </Flex>
      <Flex align="center" gap="xs">
        <Text size="xs">{i18n.t('animation.default-value')}:</Text>
        {renderValueEditor()}
      </Flex>
    </StyledParameterItem>
  )
})