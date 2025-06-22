import { observer } from 'mobx-react-lite'
import type { IAnimatorControllerAdapter } from '../../types/adapter'
import type { AnimatorControllerStore } from '../../stores/AnimatorControllerStore'
import { AnimatorControllerItem } from '../../types/animator'
import { StateInspector } from './StateInspector'
import { TransitionInspector } from './TransitionInspector'

interface InspectorProps {
  adapter: IAnimatorControllerAdapter
  store: AnimatorControllerStore
}

export const Inspector = observer<InspectorProps>(({ adapter, store }) => {
  const { currentSelectType } = store

  switch (currentSelectType) {
    case AnimatorControllerItem.State:
      return <StateInspector adapter={adapter} store={store} />
    case AnimatorControllerItem.Transition:
      return <TransitionInspector adapter={adapter} store={store} />
    default:
      return null
  }
})