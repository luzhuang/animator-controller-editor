import React from 'react'
import { observer } from 'mobx-react-lite'
import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'
import { ConditionItem } from './ConditionItem'

interface TransitionInspectorProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
}

export const TransitionInspector = observer<TransitionInspectorProps>(({ adapter, store }) => {
  const { uiComponents, i18n } = adapter
  const { Button, Flex, Text, styled, icons } = uiComponents
  const transition = store.selectedTransition
  
  if (!transition) {
    return null
  }

  const { conditions } = transition.data
  const formSchema = store.getTransitionFormSchema()

  // 创建一个简化的表单模型
  const model = {
    ...transition.data,
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

  const SectionTitle = styled(Text, {
    fontSize: 'var(--fontSizes-sm)',
    fontWeight: 'bold',
    color: 'var(--colors-gray12)',
    marginBottom: 'var(--space-2)',
  })

  const handlePropertyChange = (property: string, value: any) => {
    store.updateTransitionData(property, value)
  }

  return (
    <StyledInspector>
      {formSchema.items.map((item) => (
        <FormGroup key={item.property}>
          <label>{item.label}</label>
          {item.type === 'Boolean' && (
            <input
              type="checkbox"
              checked={(model as any)[item.property] || false}
              onChange={(e) => handlePropertyChange(item.property, e.target.checked)}
            />
          )}
          {item.type === 'Number' && (
            <input
              type="number"
              value={(model as any)[item.property] || 0}
              onChange={(e) => handlePropertyChange(item.property, parseFloat(e.target.value) || 0)}
              min={item.min || undefined}
              max={item.max || undefined}
            />
          )}
        </FormGroup>
      ))}
      
      {/* Conditions section */}
      <div>
        <Flex align="center" justifyContent="between">
          <SectionTitle>{i18n.t('animation.conditions')}</SectionTitle>
          <Button
            size="xs"
            variant="secondary"
            startSlot={<icons.Plus />}
            onClick={() => store.addCondition()}
          >
            {i18n.t('animation.add-condition')}
          </Button>
        </Flex>
        
        {conditions.map((_, index) => (
          <ConditionItem 
            key={index}
            adapter={adapter} 
            store={store} 
            index={index} 
          />
        ))}
        
        {conditions.length === 0 && (
          <Text size="sm" secondary css={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            {i18n.t('animation.no-conditions')}
          </Text>
        )}
      </div>
    </StyledInspector>
  )
})