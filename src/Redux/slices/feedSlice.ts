import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export interface Feed {
  _id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  popularityScore: number;
  externalId?: string;
  createdAt?: string;
  rankScore?: number;
}

interface FeedState {
  feeds: Feed[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  feeds: [],
  loading: false,
  error: null,
};

export const fetchFeeds = createAsyncThunk(
  "feed/fetchFeeds",
  async (payload?: { userFocus?: string[]; userId?: string }) => {
    const { data } = await api.post("/feeds/list", payload || {});
    return data;
  }
);

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.feeds = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch feeds";
      });
  },
});

export default feedSlice.reducer;
