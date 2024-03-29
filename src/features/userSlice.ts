import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface userState {
  user: object | null;
}
const initialState: userState = {
  user: null,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleLogin: (state, action) => {
      state.user = action.payload;
    },
    handleLogout: (state) => {
      state.user = null;
    },
  },
});

export const { handleLogin, handleLogout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
