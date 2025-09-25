import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "./slices/feedSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    auth: authReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
