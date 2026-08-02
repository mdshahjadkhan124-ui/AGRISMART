import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import { setAccessToken } from '@/lib/axios'
import { connectSocket, disconnectSocket } from '@/lib/socket'
import * as authApi from './authApi'
import type { AuthResponseData, User } from './types'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

interface AuthState {
  user: User | null
  accessToken: string | null
  status: AuthStatus
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
}

function extractErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { message?: string; details?: string[] } | undefined
    return data?.details?.[0] ?? data?.message ?? err.message
  }
  return 'Something went wrong'
}

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }, { rejectWithValue }) => {
  try {
    return await authApi.loginRequest(payload)
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err))
  }
})

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { name: string; email: string; password: string; phone?: string }, { rejectWithValue }) => {
    try {
      return await authApi.registerRequest(payload)
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

export const googleLogin = createAsyncThunk('auth/googleLogin', async (idToken: string, { rejectWithValue }) => {
  try {
    return await authApi.googleLoginRequest(idToken)
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err))
  }
})

// Silently re-establishes a session on app load using the httpOnly refresh
// cookie. Rejecting here just means "not logged in" — never surfaced as an
// error to the user.
export const bootstrapSession = createAsyncThunk('auth/bootstrap', async (_: void, { rejectWithValue }) => {
  try {
    return await authApi.refreshRequest()
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err))
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logoutRequest()
  } catch {
    // Best-effort: clear local state regardless of whether the server call succeeded.
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionExpired(state) {
      state.user = null
      state.accessToken = null
      state.status = 'unauthenticated'
      disconnectSocket()
    },
  },
  extraReducers: (builder) => {
    const onAuthSucceeded = (state: AuthState, action: PayloadAction<AuthResponseData>) => {
      state.status = 'authenticated'
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.error = null
      setAccessToken(action.payload.accessToken)
      connectSocket(action.payload.accessToken)
    }

    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, onAuthSucceeded)
      .addCase(login.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = action.payload as string
      })

      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, onAuthSucceeded)
      .addCase(register.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = action.payload as string
      })

      .addCase(googleLogin.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(googleLogin.fulfilled, onAuthSucceeded)
      .addCase(googleLogin.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = action.payload as string
      })

      .addCase(bootstrapSession.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(bootstrapSession.fulfilled, onAuthSucceeded)
      .addCase(bootstrapSession.rejected, (state) => {
        state.status = 'unauthenticated'
        state.user = null
        state.accessToken = null
        setAccessToken(null)
        disconnectSocket()
      })

      .addCase(logout.fulfilled, (state) => {
        state.status = 'unauthenticated'
        state.user = null
        state.accessToken = null
        setAccessToken(null)
        disconnectSocket()
      })
  },
})

export const { sessionExpired } = authSlice.actions
export default authSlice.reducer
