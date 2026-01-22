import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login as loginRequest, type LoginPayload } from '../../services/auth';
import { getMe } from '../../services/user';
import { tokenStorage } from '../../services/tokenStorage';
import { HttpError } from '../../services/api';
import type { UserProfile } from '../../types/user';

type AuthStatus = 'idle' | 'loading' | 'authenticated';

type AuthState = {
  status: AuthStatus;
  error: string | null;
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
};

const resolveErrorMessage = (error: unknown) => {
  if (error instanceof HttpError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
};

const initialState: AuthState = {
  status: 'idle',
  error: null,
  user: null,
  accessToken: tokenStorage.getAccessToken(),
  refreshToken: tokenStorage.getRefreshToken(),
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await loginRequest(credentials);
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      const user = await getMe(response.accessToken);
      return { user, tokens: response };
    } catch (error) {
      return rejectWithValue(resolveErrorMessage(error));
    }
  },
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      return rejectWithValue('Missing access token');
    }

    try {
      const user = await getMe(accessToken);
      return { user, accessToken };
    } catch (error) {
      return rejectWithValue(resolveErrorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      tokenStorage.clear();
      state.status = 'idle';
      state.error = null;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'idle';
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        tokenStorage.clear();
        state.error =
          (typeof action.payload === 'string' && action.payload) ||
          'Login failed. Please verify your credentials.';
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = tokenStorage.getRefreshToken();
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = 'idle';
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        tokenStorage.clear();
        if (action.payload !== 'Missing access token') {
          state.error =
            (typeof action.payload === 'string' && action.payload) ||
            'Unable to load your session.';
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
