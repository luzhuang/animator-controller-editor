import React from 'react'
import { observer } from 'mobx-react-lite'
import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'
import { ParameterValueType } from '../../types/animator'

interface ParameterTypeMenuProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
}

export const ParameterTypeMenu = observer<ParameterTypeMenuProps>(({ adapter, store }) => {
  const { uiComponents, i18n } = adapter
  const { DropdownMenu, Text } = uiComponents
  const { editingAnimatorController } = store
  
  if (!editingAnimatorController) {
    return null
  }

  const handleAddParameter = (type: ParameterValueType) => {
    let defaultValue: any
    switch (type) {
      case ParameterValueType.Number:
        defaultValue = 0
        break
      case ParameterValueType.String:
        defaultValue = ''
        break
      case ParameterValueType.Boolean:
        defaultValue = false
        break
      case ParameterValueType.Trigger:
        defaultValue = false
        break
      default:
        defaultValue = null
    }
    
    editingAnimatorController.addParameter(type, undefined, defaultValue)
  }

  return (
    <>
      <DropdownMenu.Item onClick={() => handleAddParameter(ParameterValueType.Number)}>
        <Text size="sm">{i18n.t('animation.parameter.number')}</Text>
      </DropdownMenu.Item>
      <DropdownMenu.Item onClick={() => handleAddParameter(ParameterValueType.String)}>
        <Text size="sm">{i18n.t('animation.parameter.string')}</Text>
      </DropdownMenu.Item>
      <DropdownMenu.Item onClick={() => handleAddParameter(ParameterValueType.Boolean)}>
        <Text size="sm">{i18n.t('animation.parameter.boolean')}</Text>
      </DropdownMenu.Item>
      <DropdownMenu.Item onClick={() => handleAddParameter(ParameterValueType.Trigger)}>
        <Text size="sm">{i18n.t('animation.parameter.trigger')}</Text>
      </DropdownMenu.Item>
    </>
  )
})