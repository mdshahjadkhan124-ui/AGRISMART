import { useCallback } from 'react'

// RTK Query's generated mutation hooks return a `[trigger, state]` tuple
// with `isLoading`/no `.mutate`, whereas every page in this app was written
// against TanStack Query's `useMutation()` shape (`.mutate(vars, {onSuccess,
// onError})`, `.isPending`). Rather than touch 40+ page files, every
// feature's hooks.ts wraps its RTK Query mutation hooks with this adapter so
// the exported hook shape — and every page's call site — stays identical.
export function useMutationCompat([trigger, state]) {
  const mutate = useCallback(
    (arg, options) => {
      trigger(arg)
        .unwrap()
        .then((data) => options?.onSuccess?.(data))
        .catch((error) => options?.onError?.(error))
    },
    [trigger]
  )

  const mutateAsync = useCallback((arg) => trigger(arg).unwrap(), [trigger])

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
