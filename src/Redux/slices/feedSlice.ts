import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
  userFocus: string[];
}

const initialState: FeedState = {
  feeds: [],
  loading: false,
  error: null,
  userFocus: [],
};

export const fetchFeeds = createAsyncThunk(
  "feed/fetchFeeds",
  async ({
    userFocus,
    userId,
  }: {
    userFocus: { topics: string[] };
    userId?: string;
    feedSources?: {
      reddit?: boolean;
      hackerNews?: boolean;
      devTo?: boolean;
    } | null;
    sortingPreference?: "latest" | "rank" | "popularity";
  }) => {
    const { data } = await api.post("/feeds/list", { userFocus, userId });
    return data as Feed[];
  }
);

export const fetchUserFocus = createAsyncThunk(
  "feed/fetchUserFocus",
  async (userId: string) => {
    const { data } = await api.get(`/focus/${userId}`);
    return data.topics || [];
  }
);

export const addFocusKeyword = createAsyncThunk(
  "feed/addFocusKeyword",
  async ({ userId, keyword }: { userId: string; keyword: string }) => {
    const { data } = await api.post("/focus/add", { userId, keyword });
    return data.topics || [];
  }
);

export const removeFocusKeyword = createAsyncThunk(
  "feed/removeFocusKeyword",
  async ({ userId, keyword }: { userId: string; keyword: string }) => {
    const { data } = await api.post("/focus/remove", { userId, keyword });
    return data.topics || [];
  }
);

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setUserFocus: (state, action: PayloadAction<string[]>) => {
      state.userFocus = action.payload;
    },
  },
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
      })
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

export const { setUserFocus } = feedSlice.actions;
export default feedSlice.reducer;
