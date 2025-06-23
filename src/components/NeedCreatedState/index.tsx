import { useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Flex, Button, Text, styled } from '@galacean/editor-ui'
import { IconSquareRounded } from '@tabler/icons-react'

import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { IEntityModel, IAnimatorComponent, IAnimatorControllerAsset } from '../../types/animator'
import { defaultI18n } from '../../i18n'

interface NeedCreatedStateProps {
  adapter: IAnimatorControllerAdapter
  targetEntity: IEntityModel | null
  clipAsset?: any
  animator: IAnimatorComponent | null
  animatorController: IAnimatorControllerAsset | null
  needAddClip: boolean
  onCreating: () => void
  onCreated: () => void
}

function NeedCreatedStateComponent(props: NeedCreatedStateProps) {
  const {
    adapter,
    targetEntity,
    clipAsset,
    animator,
    animatorController,
    needAddClip = true,
    onCreating,
    onCreated,
  } = props

  const [creating, setCreating] = useState<boolean>(false)
  const {} = adapter
  // 直接使用本地i18n
  const i18n = defaultI18n

  // 创建样式化组件
  const StyledContent = styled(Flex, {
    height: '100%',
    color: 'var(--colors-gray11)',
    '& > svg': {
      width: 'var(--space-15)',
      height: 'var(--space-15)',
      color: 'var(--colors-amber9)',
      opacity: 0.8,
      marginBottom: 'var(--space-2)',
    },
  })

  const entityName = targetEntity?.name || ''
  const targetClipName = clipAsset?.name ? `"${clipAsset?.name}"` : i18n.t('animation.clip.an-clip')

  const createAnimatorAndState = async () => {
    if (!targetEntity) return

    setCreating(true)
    onCreating?.()

    try {
      // Get asset store from adapter
      const rootState = adapter.stateManager.getState()
      const assetStore = rootState?.assetStore

      let newAnimator: IAnimatorComponent =
        animator ||
        ((await targetEntity.addEditorComponent({ class: 'Animator', refId: null }, true)) as IAnimatorComponent)

      let newAnimatorController =
        animatorController ||
        ((await assetStore?.createAssetByAdd({
          assetType: 'AnimatorController',
          name: `${entityName}`,
        })) as IAnimatorControllerAsset)

      if (needAddClip) {
        if (newAnimatorController.isSubAsset) {
          newAnimatorController = (await assetStore?.createAssetByAdd({
            assetType: 'AnimatorController',
            name: `${entityName}`,
          })) as IAnimatorControllerAsset
        }

        let clip: any = clipAsset
        if (!clip) {
          clip = await assetStore?.createAssetByAdd({
            assetType: 'AnimationClip',
          })
        }

        ;(newAnimatorController as any).addStateByClip(clip, 0)
      }

      newAnimator.animatorController = (newAnimatorController as any).getCurrentRef()
      newAnimator.triggerPropertyChange('animatorController')

      onCreated?.()
    } catch (error) {
      console.error('Failed to create animator and state:', error)
    } finally {
      setCreating(false)
    }
  }

  const tipText = useMemo(() => {
    return animator
      ? animatorController
        ? i18n.t('animation.clip.tip-0', [entityName, targetClipName])
        : i18n.t('animation.clip.tip-1', [entityName])
      : `${i18n.t('animation.clip.tip-2', [entityName])} ${
          needAddClip ? `${i18n.t('animation.clip.tip-3', [targetClipName])}` : `${i18n.t('animation.clip.tip-4')}`
        }`
  }, [animator, animatorController, needAddClip, entityName, targetClipName, i18n])

  const btnText = !animator
    ? i18n.t('animation.clip.create')
    : !animatorController
      ? i18n.t('animation.clip.create-animator-controller')
      : `${i18n.t('animation.clip.add-target')} ${targetClipName}`

  return (
    <StyledContent direction="column" align="both" gap="xs" data-testid="need-created-state">
      <IconSquareRounded />
      <Text secondary size={1}>
        {tipText}
      </Text>
      <Button
        css={{ marginTop: 'var(--space-4)' }}
        disabled={creating}
        size="sm"
        variant="secondary"
        onClick={createAnimatorAndState}
        data-testid="create-animator-button">
        {btnText}
      </Button>
    </StyledContent>
  )
}

export const NeedCreatedState = observer(NeedCreatedStateComponent)
