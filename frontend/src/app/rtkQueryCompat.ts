import { useCallback } from 'react'

// RTK Query's generated mutation hooks return a `[trigger, state]` tuple
// with `isLoading`/no `.mutate`, whereas every page in this app was written
// against TanStack Query's `useMutation()` shape (`.mutate(vars, {onSuccess,
// onError})`, `.isPending`). Rather than touch 40+ page files, every
// feature's hooks.ts wraps its RTK Query mutation hooks with this adapter so
// the exported hook shape — and every page's call site — stays identical.
interface RtkMutationTrigger<Arg, Result> {
  (arg: Arg): { unwrap: () => Promise<Result> }
}

interface RtkMutationState<Result> {
  data?: Result
  error?: unknown
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  reset: () => void
}

interface MutateOptions<Result> {
  onSuccess?: (data: Result) => void
  onError?: (error: unknown) => void
}

export function useMutationCompat<Arg, Result>([trigger, state]: readonly [
  RtkMutationTrigger<Arg, Result>,
  RtkMutationState<Result>,
]) {
  const mutate = useCallback(
    (arg: Arg, options?: MutateOptions<Result>) => {
      trigger(arg)
        .unwrap()
        .then((data) => options?.onSuccess?.(data))
        .catch((error: unknown) => options?.onError?.(error))
    },
    [trigger]
  )

  const mutateAsync = useCallback((arg: Arg) => trigger(arg).unwrap(), [trigger])

  return {
    mutate,
    mutateAsync,
    data: state.data,
    error: state.error,
    isPending: state.isLoading,
    isSuccess: state.isSuccess,
    isError: state.isError,
    reset: state.reset,
  }
}
