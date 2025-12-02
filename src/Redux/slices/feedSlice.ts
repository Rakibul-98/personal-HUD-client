// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import api from "../../lib/axios";
// import { RootState } from "../store";

// // export interface Feed {
// //   _id: string;
// //   title: string;
// //   content: string;
// //   source: string;
// //   category: string;
// //   popularityScore: number;
// //   externalId?: string;
// //   createdAt?: string;
// //   rankScore?: number;
// // }

// export interface Feed {
//   _id: string;
//   title: string;
//   content: string;
//   source: string;
//   category: string;
//   popularityScore: number;
//   externalId?: string;
//   summary?: string;
//   tags?: string[];
//   createdAt?: string;
//   rankScore?: number;
// }

// interface FetchFeedsArgs {
//   userFocus: { topics: string[] };
//   userId?: string;
//   feedSources?: {
//     reddit?: boolean;
//     hackerNews?: boolean;
//     devTo?: boolean;
//   } | null;
//   sortingPreference?: "latest" | "rank" | "popularity";
// }

// interface FeedState {
//   feeds: Feed[];
//   loading: boolean;
//   error: string | null;
//   userFocus: string[];
// }

// const initialState: FeedState = {
//   feeds: [],
//   loading: false,
//   error: null,
//   userFocus: [],
// };

// export const fetchFeeds = createAsyncThunk<
//   Feed[],
//   FetchFeedsArgs,
//   { state: RootState }
// >(
//   "feed/fetchFeeds",
//   async ({ userFocus, userId }, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token;
//       const { data } = await api.post(
//         "/feeds/list",
//         { userFocus, userId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return data as Feed[];
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.error || "Failed to fetch feeds"
//       );
//     }
//   }
// );

// export const refreshAndFetchFeeds = createAsyncThunk<
//   Feed[],
//   {
//     userFocus: { topics: string[] };
//     userId?: string;
//     feedSources?: {
//       reddit?: boolean;
//       hackerNews?: boolean;
//       devTo?: boolean;
//     } | null;
//   },
//   { state: RootState }
// >(
//   "feed/refreshAndFetchFeeds",
//   async ({ userFocus, userId, feedSources }, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token;
//       await api.post(
//         "/feeds/refresh",
//         { userFocus, userId, feedSources },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const { data } = await api.post(
//         "/feeds/list",
//         { userFocus, userId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return data as Feed[];
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.error || "Failed to refresh feeds"
//       );
//     }
//   }
// );

// export const fetchUserFocus = createAsyncThunk<
//   string[],
//   string,
//   { state: RootState }
// >("feed/fetchUserFocus", async (userId, { getState, rejectWithValue }) => {
//   try {
//     const token = getState().auth.token;
//     const { data } = await api.get(`/focus/${userId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return data.topics || [];
//   } catch (err: any) {
//     return rejectWithValue(
//       err.response?.data?.error || "Failed to fetch user focus"
//     );
//   }
// });

// export const addFocusKeyword = createAsyncThunk<
//   string[],
//   { userId: string; keyword: string },
//   { state: RootState }
// >(
//   "feed/addFocusKeyword",
//   async ({ userId, keyword }, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token;
//       const { data } = await api.post(
//         "/focus/add",
//         { userId, keyword },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return data.topics || [];
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.error || "Failed to add focus keyword"
//       );
//     }
//   }
// );

// export const removeFocusKeyword = createAsyncThunk<
//   string[],
//   { userId: string; keyword: string },
//   { state: RootState }
// >(
//   "feed/removeFocusKeyword",
//   async ({ userId, keyword }, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token;
//       const { data } = await api.post(
//         "/focus/remove",
//         { userId, keyword },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return data.topics || [];
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.error || "Failed to remove focus keyword"
//       );
//     }
//   }
// );

// const feedSlice = createSlice({
//   name: "feed",
//   initialState,
//   reducers: {
//     setUserFocus: (state, action: PayloadAction<string[]>) => {
//       state.userFocus = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchFeeds.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchFeeds.fulfilled, (state, action) => {
//         state.loading = false;
//         state.feeds = action.payload;
//       })
//       .addCase(fetchFeeds.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to fetch feeds";
//       })
//       .addCase(refreshAndFetchFeeds.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(refreshAndFetchFeeds.fulfilled, (state, action) => {
//         state.loading = false;
//         state.feeds = action.payload;
//       })
//       .addCase(refreshAndFetchFeeds.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.error.message || "Failed to refresh and fetch new feeds";
//       })
//       .addCase(fetchUserFocus.fulfilled, (state, action) => {
//         state.userFocus = action.payload;
//       })
//       .addCase(addFocusKeyword.fulfilled, (state, action) => {
//         state.userFocus = action.payload;
//       })
//       .addCase(removeFocusKeyword.fulfilled, (state, action) => {
//         state.userFocus = action.payload;
//       });
//   },
// });

// export const { setUserFocus } = feedSlice.actions;
// export default feedSlice.reducer;

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
  userId?: string;
  feedSources?: {
    reddit?: boolean;
    hackerNews?: boolean;
    devTo?: boolean;
  } | null;
  sortingPreference?: "latest" | "rank" | "popularity";
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

export const fetchFeeds = createAsyncThunk<
  Feed[],
  FetchFeedsArgs,
  { state: RootState }
>(
  "feed/fetchFeeds",
  async ({ userFocus, userId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const { data } = await api.post(
        "/feeds/list",
        { userFocus, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data as Feed[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch feeds"
      );
    }
  }
);

export const refreshAndFetchFeeds = createAsyncThunk<
  Feed[],
  {
    userFocus: { topics: string[] };
    userId?: string;
    feedSources?: {
      reddit?: boolean;
      hackerNews?: boolean;
      devTo?: boolean;
    } | null;
  },
  { state: RootState }
>(
  "feed/refreshAndFetchFeeds",
  async ({ userFocus, userId, feedSources }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await api.post(
        "/feeds/refresh",
        { userFocus, userId, feedSources },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { data } = await api.post(
        "/feeds/list",
        { userFocus, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data as Feed[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to refresh feeds"
      );
    }
  }
);

export const fetchUserFocus = createAsyncThunk<
  string[],
  string,
  { state: RootState }
>("feed/fetchUserFocus", async (userId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const { data } = await api.get(`/focus/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.topics || [];
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.error || "Failed to fetch user focus"
    );
  }
});

export const addFocusKeyword = createAsyncThunk<
  string[],
  { userId: string; keyword: string },
  { state: RootState }
>(
  "feed/addFocusKeyword",
  async ({ userId, keyword }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const { data } = await api.post(
        "/focus/add",
        { userId, keyword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.topics || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to add focus keyword"
      );
    }
  }
);

export const removeFocusKeyword = createAsyncThunk<
  string[],
  { userId: string; keyword: string },
  { state: RootState }
>(
  "feed/removeFocusKeyword",
  async ({ userId, keyword }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const { data } = await api.post(
        "/focus/remove",
        { userId, keyword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.topics || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to remove focus keyword"
      );
    }
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
      .addCase(refreshAndFetchFeeds.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAndFetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.feeds = action.payload;
      })
      .addCase(refreshAndFetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to refresh and fetch new feeds";
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
