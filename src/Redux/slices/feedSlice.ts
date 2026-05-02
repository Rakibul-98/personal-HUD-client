/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { RootState } from "../store";

export interface Feed {
  _id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  popularityScore: number;
  externalId?: string;
  summary?: string;
  tags?: string[];
  createdAt?: string;
  rankScore?: number;
}

interface FetchFeedsArgs {
  userFocus: { topics: string[] };
  feedSources?: {
    reddit?: boolean;
    hackerNews?: boolean;
    devTo?: boolean;
  } | null;
  sortingPreference?: "latest" | "rank" | "popularity";
  page?: number;
  limit?: number;
}

interface FeedState {
  feeds: Feed[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  userFocus: string[];
  page: number;
  totalPages: number;
  total: number;
}

const initialState: FeedState = {
  feeds: [],
  loading: false,
  refreshing: false,
  error: null,
  userFocus: [],
  page: 1,
  totalPages: 1,
  total: 0,
};

export const fetchFeeds = createAsyncThunk<
  { items: Feed[]; total: number; page: number; totalPages: number },
  FetchFeedsArgs,
  { state: RootState }
>(
  "feed/fetchFeeds",
  async (
    { userFocus, feedSources, sortingPreference, page = 1, limit = 20 },
    { rejectWithValue },
  ) => {
    try {
      // Backend now uses GET /feeds with query params, POST /feeds/list for legacy
      const { data } = await api.post("/feeds/list", {
        userFocus,
        feedSources,
        sortingPreference,
        page,
        limit,
      });
      return data; // { success, items, total, page, totalPages }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch feeds",
      );
    }
  },
);

export const refreshAndFetchFeeds = createAsyncThunk<
  { items: Feed[]; total: number; page: number; totalPages: number },
  FetchFeedsArgs,
  { state: RootState }
>(
  "feed/refreshAndFetchFeeds",
  async (
    { userFocus, feedSources, sortingPreference },
    { rejectWithValue },
  ) => {
    try {
      // Refresh triggers new fetch from external sources
      await api.post("/feeds/refresh", { feedSources });
      const { data } = await api.post("/feeds/list", {
        userFocus,
        feedSources,
        sortingPreference,
        page: 1,
        limit: 20,
      });
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to refresh feeds",
      );
    }
  },
);

export const fetchUserFocus = createAsyncThunk<
  string[],
  void,
  { state: RootState }
>("feed/fetchUserFocus", async (_, { rejectWithValue }) => {
  try {
    // Backend now uses GET /focus (userId from token — no URL param needed)
    const { data } = await api.get("/focus");
    return data.data?.topics || [];
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch focus",
    );
  }
});

export const addFocusKeyword = createAsyncThunk<
  string[],
  { keyword: string },
  { state: RootState }
>("feed/addFocusKeyword", async ({ keyword }, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/focus/add", { keyword });
    return data.data?.topics || [];
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to add topic",
    );
  }
});

export const removeFocusKeyword = createAsyncThunk<
  string[],
  { keyword: string },
  { state: RootState }
>("feed/removeFocusKeyword", async ({ keyword }, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/focus/remove", { keyword });
    return data.data?.topics || [];
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to remove topic",
    );
  }
});

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setUserFocus: (state, action: PayloadAction<string[]>) => {
      state.userFocus = action.payload;
    },
    clearFeedError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.feeds = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(refreshAndFetchFeeds.pending, (state) => {
        state.refreshing = true;
        state.error = null;
      })
      .addCase(refreshAndFetchFeeds.fulfilled, (state, action) => {
        state.refreshing = false;
        state.feeds = action.payload.items;
        state.total = action.payload.total;
        state.page = 1;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(refreshAndFetchFeeds.rejected, (state, action) => {
        state.refreshing = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchUserFocus.fulfilled, (state, action) => {
        state.userFocus = action.payload;
      })
      .addCase(addFocusKeyword.fulfilled, (state, action) => {
        state.userFocus = action.payload;
      })
      .addCase(removeFocusKeyword.fulfilled, (state, action) => {
        state.userFocus = action.payload;
      });
  },
});

export const { setUserFocus, clearFeedError } = feedSlice.actions;
export default feedSlice.reducer;
