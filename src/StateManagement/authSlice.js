// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  login_type: null,
  login_id: null,
  manage_user_type: null,
  can_manage_user_types: {},
  user_permissions: [],
  first_name: '',
  last_name: '',
  refresh: null,
  is_superadmin:null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      const {
        login_type,
        login_id,
        manage_user_type,
        can_manage_user_types,
        user_permissions,
        first_name,
        last_name,
        refresh,
        is_superadmin
      } = action.payload;

      state.login_type = login_type;
      state.login_id = login_id;
      state.manage_user_type = manage_user_type;
      state.can_manage_user_types = can_manage_user_types;
      state.user_permissions = user_permissions;
      state.first_name = first_name;
      state.last_name = last_name;
      state.refresh = refresh;
      state.is_superadmin = is_superadmin;
    },

    logout: (state) => {
      // Clear on logout
      return initialState;
    },
  },
});

export const { setLogin, logout } = authSlice.actions;
export default authSlice.reducer;
