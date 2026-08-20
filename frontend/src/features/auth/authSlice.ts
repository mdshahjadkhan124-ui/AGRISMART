import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { connectSocket, disconnectSocket } from '@/lib/socket'
import { apiSlice } from '@/app/apiSlice'
import { authApi } from './authApi'
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

// RTK Query's `.unwrap()` rejects with the FetchBaseQueryError itself, whose
// `data` field is our backend's parsed JSON error body.
function extractErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'data' in err) {
    const data = (err as { data?: { message?: string; details?: string[] } }).data
    return data?.details?.[0] ?? data?.message ?? 'Something went wrong'
  }
  return 'Something went wrong'
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      return await dispatch(authApi.endpoints.login.initiate(payload)).unwrap()
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { name: string; email: string; password: string; phone?: string }, { dispatch, rejectWithValue }) => {
    try {
      return await dispatch(authApi.endpoints.register.initiate(payload)).unwrap()
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (idToken: string, { dispatch, rejectWithValue }) => {
    try {
      return await dispatch(authApi.endpoints.googleLogin.initiate(idToken)).unwrap()
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

// Silently re-establishes a session on app load using the httpOnly refresh
// cookie. Rejecting here just means "not logged in" — never surfaced as an
// error to the user.
export const bootstrapSession = createAsyncThunk('auth/bootstrap', async (_: void, { dispatch, rejectWithValue }) => {
  try {
    return await dispatch(authApi.endpoints.refresh.initiate()).unwrap()
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err))
  }
})

export const logout = createAsyncThunk('auth/logout', async (_: void, { dispatch }) => {
  try {
    await dispatch(authApi.endpoints.logout.initiate()).unwrap()
  } catch {
    // Best-effort: clear local state regardless of whether the server call succeeded.
  } finally {
    // Drops every cached query/mutation result so no stale data from this
    // session survives into whoever logs in next on this device.
    dispatch(apiSlice.util.resetApiState())
  }
})

function applyCredentials(state: AuthState, payload: AuthResponseData) {
  state.status = 'authenticated'
  state.user = payload.user
  state.accessToken = payload.accessToken
  state.error = null
  connectSocket(payload.accessToken)
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Dispatched directly by apiSlice's baseQueryWithReauth after a
    // successful silent refresh triggered by some other request's 401.
    credentialsReceived(state, action: PayloadAction<AuthResponseData>) {
      applyCredentials(state, action.payload)
    },
    // Dispatched directly by apiSlice's baseQueryWithReauth when that
    // silent refresh itself fails.
    sessionExpired(state) {
      state.user = null
      state.accessToken = null
      state.status = 'unauthenticated'
      disconnectSocket()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => applyCredentials(state, action.payload))
      .addCase(login.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = action.payload as string
      })

      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => applyCredentials(state, action.payload))
      .addCase(register.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = action.payload as string
      })

      .addCase(googleLogin.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(googleLogin.fulfilled, (state, action) => applyCredentials(state, action.payload))
      .addCase(googleLogin.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = action.payload as string
      })

      .addCase(bootstrapSession.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => applyCredentials(state, action.payload))
      .addCase(bootstrapSession.rejected, (state) => {
        state.status = 'unauthenticated'
        state.user = null
        state.accessToken = null
        disconnectSocket()
      })

      .addCase(logout.fulfilled, (state) => {
        state.status = 'unauthenticated'
        state.user = null
        state.accessToken = null
        disconnectSocket()
      })
  },
})

export const { credentialsReceived, sessionExpired } = authSlice.actions
export default authSlice.reducer
