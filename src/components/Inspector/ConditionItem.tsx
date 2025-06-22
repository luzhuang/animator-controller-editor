import React from 'react'
import { observer } from 'mobx-react-lite'
import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'

interface ConditionItemProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
  index: number
}

export const ConditionItem = observer<ConditionItemProps>(({ adapter, store, index }) => {
  const { uiComponents, i18n } = adapter
  const { Flex, Button, Select, styled, icons } = uiComponents
  const transition = store.selectedTransition
  const { editingAnimatorController } = store
  
  if (!transition || !editingAnimatorController) {
    return null
  }

  const condition = transition.data.conditions[index]
  if (!condition) {
    return null
  }

  const StyledConditionItem = styled(Flex, {
    padding: 'var(--space-2)',
    border: '1px solid var(--colors-gray6)',
    borderRadius: 'var(--radii-1)',
    marginTop: 'var(--space-2)',
    gap: 'var(--space-2)',
    alignItems: 'center',
  })

  const conditionModes = [
    { value: 'If', label: i18n.t('animation.condition.if') },
    { value: 'IfNot', label: i18n.t('animation.condition.if-not') },
    { value: 'Greater', label: i18n.t('animation.condition.greater') },
    { value: 'Less', label: i18n.t('animation.condition.less') },
    { value: 'Equals', label: i18n.t('animation.condition.equals') },
    { value: 'NotEqual', label: i18n.t('animation.condition.not-equal') },
  ]

  const handleParameterChange = (parameterId: string) => {
    store.updateConditionData(index, { parameterId })
  }

  const handleModeChange = (mode: string) => {
    store.updateConditionData(index, { mode })
  }

  const handleThresholdChange = (threshold: any) => {
    store.updateConditionData(index, { threshold })
  }

  const handleRemove = () => {
    store.removeCondition(index)
  }

  return (
    <StyledConditionItem>
      {/* Parameter selector */}
      <Select
        value={condition.parameterId}
        onValueChange={handleParameterChange}
        placeholder={i18n.t('animation.select-parameter')}
      >
        {editingAnimatorController.parameters.map((param) => (
          <Select.Item key={param.name} value={param.name}>
            {param.name}
          </Select.Item>
        ))}
      </Select>

      {/* Condition mode selector */}
      <Select
        value={condition.mode}
        onValueChange={handleModeChange}
      >
        {conditionModes.map((mode) => (
          <Select.Item key={mode.value} value={mode.value}>
            {mode.label}
          </Select.Item>
        ))}
      </Select>

      {/* Threshold input (only for numeric conditions) */}
      {(condition.mode === 'Greater' || condition.mode === 'Less' || condition.mode === 'Equals' || condition.mode === 'NotEqual') && (
        <input
          type="number"
          value={condition.threshold || 0}
          onChange={(e) => handleThresholdChange(parseFloat(e.target.value) || 0)}
          style={{
            padding: 'var(--space-1)',
            border: '1px solid var(--colors-gray6)',
            borderRadius: 'var(--radii-1)',
            fontSize: 'var(--fontSizes-sm)',
            width: '80px',
          }}
        />
      )}

      {/* Remove button */}
      <Button
        size="xs"
        variant="ghost"
        onClick={handleRemove}
      >
        <icons.Trash />
      </Button>
    </StyledConditionItem>
  )
})