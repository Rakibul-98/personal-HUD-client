/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export interface FeedSources {
  reddit: boolean;
  hackerNews: boolean;
  devTo: boolean;
}

export interface UserSettings {
  feedSources: FeedSources;
  sortingPreference: "latest" | "rank" | "popularity";
  scrollSpeed: number;
}

interface SettingsState {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      // Changed from POST /settings/get to GET /settings
      const { data } = await api.get("/settings");
      return data.data as UserSettings;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch settings",
      );
    }
  },
);

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (updates: Partial<UserSettings>, { rejectWithValue }) => {
    try {
      // Changed from POST /settings/update to PUT /settings
      const { data } = await api.put("/settings", updates);
      return data.data as UserSettings;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update settings",
      );
    }
  },
);

export const manualFetch = createAsyncThunk(
  "settings/manualFetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/settings/fetch-now");
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  },
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // Optimistic update — apply locally before API confirms
    applySettingsUpdate(state, action) {
      if (state.settings) {
        state.settings = { ...state.settings, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { applySettingsUpdate } = settingsSlice.actions;
export default settingsSlice.reducer;
