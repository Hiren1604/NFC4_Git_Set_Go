import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import navigationReducer from "./slices/navigationSlice";
import issuesReducer from "./slices/issuesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    navigation: navigationReducer,
    issues: issuesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
