import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./CustomerSlice"
import authReducer from "./authSlice"

const store = configureStore({
  reducer: {
    customer: customerReducer,
    auth: authReducer,
  },
});

export default store;
