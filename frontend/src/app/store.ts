import { configureStore } from '@reduxjs/toolkit'
import authReducer, { sessionExpired } from '@/features/auth/authSlice'
import { setOnRefreshFailed } from '@/lib/axios'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

setOnRefreshFailed(() => store.dispatch(sessionExpired()))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
