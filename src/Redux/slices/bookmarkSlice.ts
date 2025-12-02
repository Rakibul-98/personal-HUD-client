/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { logAnalyticsEvent } from "../../lib/analytics";

interface BookmarkState {
  bookmarks: any[];
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
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookmarks/${userId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

export const addBookmark = createAsyncThunk(
  "bookmark/addBookmark",
  async (data: { user: string; feedItem: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/bookmarks", data);
      // Log analytics event
      logAnalyticsEvent({
        eventType: "BOOKMARK_SAVE",
        targetId: data.feedItem,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

export const removeBookmark = createAsyncThunk(
  "bookmark/removeBookmark",
  async (bookmarkId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/bookmarks/${bookmarkId}`);
      return bookmarkId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong!"
      );
    }
  }
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
        state.bookmarks = action.payload;
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.bookmarks.unshift(action.payload);
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter(
          (b) => b._id !== action.payload
        );
      });
  },
});

export default bookmarkSlice.reducer;
