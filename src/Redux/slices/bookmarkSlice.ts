/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export interface Bookmark {
  _id: string;
  user: string;
  feedItem: {
    _id: string;
    title: string;
    content: string;
    source: string;
    category: string;
    popularityScore: number;
    summary?: string;
    tags?: string[];
    createdAt?: string;
  };
  createdAt?: string;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
}

const initialState: BookmarkState = {
  bookmarks: [],
  loading: false,
  error: null,
};

export const fetchBookmarks = createAsyncThunk(
  "bookmark/fetchBookmarks",
  async (_, { rejectWithValue }) => {
    try {
      // Backend now derives userId from the auth token — no userId in URL
      const response = await api.get("/bookmarks");
      return response.data.data; // { success, data: [...] }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch bookmarks",
      );
    }
  },
);

export const addBookmark = createAsyncThunk(
  "bookmark/addBookmark",
  async (feedItemId: string, { rejectWithValue }) => {
    try {
      // Backend derives user from token; only need feedItem ID
      const response = await api.post("/bookmarks", { feedItem: feedItemId });
      // Fire analytics in background — don't block the bookmark action
      api
        .post("/analytics/log", {
          eventType: "BOOKMARK_SAVE",
          targetId: feedItemId,
        })
        .catch(() => {});
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add bookmark",
      );
    }
  },
);

export const removeBookmark = createAsyncThunk(
  "bookmark/removeBookmark",
  async (bookmarkId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/bookmarks/${bookmarkId}`);
      api
        .post("/analytics/log", {
          eventType: "BOOKMARK_REMOVE",
          targetId: bookmarkId,
        })
        .catch(() => {});
      return bookmarkId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove bookmark",
      );
    }
  },
);

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload || [];
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        if (action.payload) state.bookmarks.unshift(action.payload);
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter(
          (b) => b._id !== action.payload,
        );
      });
  },
});

export default bookmarkSlice.reducer;
