import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface performanceState {
  showSidebar: boolean;
}
const initialState: performanceState = {
  showSidebar: false,
};
export const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    handleShowSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
  },
});

export const { handleShowSidebar } = performanceSlice.actions;

export const selectShowSidebar = (state:RootState) => state.performance.showSidebar;

export default performanceSlice.reducer;
