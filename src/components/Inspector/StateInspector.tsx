import React from 'react'
import { observer } from 'mobx-react-lite'
import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'
import { ScriptAssetPicker } from './ScriptAssetPicker'
import { defaultI18n } from '../../i18n'

interface StateInspectorProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
}

export const StateInspector = observer<StateInspectorProps>(({ adapter, store }) => {
  const { uiComponents } = adapter
  // 直接使用本地i18n
  const i18n = defaultI18n
  const { Button, Flex, styled, icons } = uiComponents
  const state = store.selectedState

  if (!state) {
    return null
  }

  const { scripts } = state.data
  const formSchema = store.getStateFormSchema()

  // 创建一个简化的表单模型
  const model = {
    ...state.data,
    getEditable: () => true,
  }

  const StyledInspector = styled('div', {
    padding: 'var(--space-4)',
    '& > * + *': {
      marginTop: 'var(--space-3)',
    },
  })

  const FormGroup = styled('div', {
    marginBottom: 'var(--space-3)',
    '& label': {
      display: 'block',
      fontSize: 'var(--fontSizes-sm)',
      fontWeight: 'medium',
      marginBottom: 'var(--space-1)',
      color: 'var(--colors-gray12)',
    },
    '& input, & select': {
      width: '100%',
      padding: 'var(--space-2)',
      border: '1px solid var(--colors-gray6)',
      borderRadius: 'var(--radii-1)',
      fontSize: 'var(--fontSizes-sm)',
    },
  })

  const handlePropertyChange = (property: string, value: any) => {
    store.updateStateData(property, value)
  }

  return (
    <StyledInspector>
      {formSchema.items.map((item) => (
        <FormGroup key={item.property}>
          <label>{item.label}</label>
          {item.type === 'Input' && (
            <input
              type="text"
              value={(model as any)[item.property] || ''}
              onChange={(e) => handlePropertyChange(item.property, e.target.value)}
            />
          )}
          {item.type === 'Number' && (
            <input
              type="number"
              value={(model as any)[item.property] || 0}
              onChange={(e) => handlePropertyChange(item.property, parseFloat(e.target.value) || 0)}
              step={item.dragStep || 1}
            />
          )}
          {item.type === 'AssetPicker' && (
            <div>
              <button
                onClick={() => {
                  // TODO: Open asset picker
                  console.log('Open asset picker for', item.assetType)
                }}>
                {(model as any)[item.property]?.name || i18n.t('common.select')}
              </button>
            </div>
          )}
        </FormGroup>
      ))}

      {/* Scripts section */}
      {scripts.map((_, index) => (
        <ScriptAssetPicker key={index} adapter={adapter} store={store} index={index} />
      ))}

      <Flex align="h" css={{ margin: 'var(--space-4) auto' }}>
        <Button
          size="sm"
          variant="secondary"
          css={{ width: 'var(--space-48)', margin: '0 var(--space-4)', height: 'var(--space-7)' }}
          startSlot={<icons.Plus />}
          onClick={() => {
            store.addStateMachineScript('')
          }}>
          {i18n.t('inspector.add-statemachine-script')}
        </Button>
      </Flex>
    </StyledInspector>
  )
})
