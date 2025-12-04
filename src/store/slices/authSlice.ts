import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import axiosClient from '@/lib/api/axiosClient'

type AuthUser = {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
  phone?: string
  createdAt?: string
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: 'idle',
  error: null,
}

interface AuthResponse {
  success: boolean
  data?: {
    user: AuthUser
    accessToken: string
    refreshToken: string
  }
  message?: string
  error?: string
}

export const signupThunk = createAsyncThunk<
  NonNullable<AuthResponse['data']>,
  { name: string; email: string; password: string; avatar?: string }
>('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<AuthResponse>(`/auth/signup`, payload)
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    return rejectWithValue(response.data.error || response.data.message || 'Signup failed')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.error || error.message)
    }
    return rejectWithValue('Signup failed')
  }
})

export const loginThunk = createAsyncThunk<
  NonNullable<AuthResponse['data']>,
  { email: string; password: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<AuthResponse>(`/auth/login`, payload)
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    return rejectWithValue(response.data.error || response.data.message || 'Login failed')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.error || error.message)
    }
    return rejectWithValue('Login failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.status = 'idle'
      state.error = null
    },
    setTokens(
      state,
      action: PayloadAction<{ accessToken: string | null; refreshToken: string | null }>
    ) {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signupThunk.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload) {
          state.user = action.payload.user
          state.accessToken = action.payload.accessToken
          state.refreshToken = action.payload.refreshToken
        }
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || action.error.message || 'Signup failed'
      })
      .addCase(loginThunk.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload) {
          state.user = action.payload.user
          state.accessToken = action.payload.accessToken
          state.refreshToken = action.payload.refreshToken
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || action.error.message || 'Login failed'
      })
  },
})

export const { logout, setTokens } = authSlice.actions
export default authSlice.reducer


