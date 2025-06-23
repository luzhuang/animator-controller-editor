import React from 'react'
import { observer } from 'mobx-react-lite'
import { MenuItem } from '@galacean/editor-ui'
import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'
import { ParameterValueType } from '../../types/animator'
import { defaultI18n } from '../../i18n'

interface ParameterTypeMenuProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
}

export const ParameterTypeMenu = observer<ParameterTypeMenuProps>(({ adapter, store }) => {
  // 直接使用本地i18n
  const i18n = defaultI18n
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
      <MenuItem
        name="number"
        onClick={() => {
          editingAnimatorController.addParameter(ParameterValueType.Number, undefined, 0)
        }}
      />
      <MenuItem
        name="string"
        onClick={() => {
          editingAnimatorController.addParameter(ParameterValueType.String, undefined, '')
        }}
      />
      <MenuItem
        name="boolean"
        onClick={() => {
          editingAnimatorController.addParameter(ParameterValueType.Boolean, undefined, false)
        }}
      />
      <MenuItem
        name="trigger"
        onClick={() => {
          editingAnimatorController.addParameter(ParameterValueType.Trigger, undefined, false)
        }}
      />
    </>
  )
})
