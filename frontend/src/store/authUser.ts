import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authenticatedFetch, getToken, clearAuthTokens } from '@src/helpers/api';
import type { User } from '@src/types/user';

interface AuthUserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthUserState = {
  user: null,
  loading: false,
  error: null,
};

// Getter to check if user is authenticated (checks for token)
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Async thunk to fetch authenticated user
export const fetchUser = createAsyncThunk(
  'authUser/fetchUser',
  async (_, { rejectWithValue }) => {
    if (!isAuthenticated()) {
      return null;
    }

    try {
      const response = await authenticatedFetch('/api/user/', { method: 'GET' });

      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        // Token is invalid, clear tokens
        clearAuthTokens();
        return null;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      clearAuthTokens();
      return rejectWithValue('Failed to fetch user data');
    }
  }
);

const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      clearAuthTokens();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload as string || 'Failed to fetch user data';
      });
  },
});

export const { setUser, clearUser } = authUserSlice.actions;

export default authUserSlice.reducer;

