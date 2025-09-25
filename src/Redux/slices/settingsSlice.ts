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
  async (userId: string) => {
    const { data } = await api.post("/settings/get", { userId });
    return data as UserSettings;
  }
);

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async ({
    userId,
    updates,
  }: {
    userId: string;
    updates: Partial<UserSettings>;
  }) => {
    const { data } = await api.post("/settings/update", { userId, ...updates });
    return data;
  }
);

export const manualFetch = createAsyncThunk(
  "settings/manualFetch",
  async (userId: string) => {
    const { data } = await api.post("/settings/fetchNow", { userId });
    return data;
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
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
        state.error = action.error.message || "Failed to fetch settings";
      })

      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update settings";
      });
  },
});

export default settingsSlice.reducer;
