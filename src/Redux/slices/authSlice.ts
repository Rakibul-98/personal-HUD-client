/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  loading: boolean;
  error: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  userId: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    payload: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        payload
      );
      return response.data.userId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Something went wrong!"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Server error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
