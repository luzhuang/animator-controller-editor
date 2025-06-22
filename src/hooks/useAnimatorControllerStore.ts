import { useMemo } from 'react'
import type { IAnimatorControllerAdapter } from '../types/adapter'
import { AnimatorControllerStore } from '../stores/AnimatorControllerStore'

export function useAnimatorControllerStore(adapter: IAnimatorControllerAdapter) {
  return useMemo(() => {
    return new AnimatorControllerStore(adapter)
  }, [adapter])
}