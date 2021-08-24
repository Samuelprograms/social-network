import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
export interface channelState {
  selectedChannel: {};
}
const initialState: channelState = {
  selectedChannel: {}
}
export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    handleSelectChannel: (state, action) => {
      state.selectedChannel = action.payload;
    },
    handleUnselectChannel: (state) => {
      state.selectedChannel = {};
    },
  },
});

export const { handleSelectChannel, handleUnselectChannel } = channelSlice.actions;

export const selectChannel = (state:RootState) => state.channel.selectedChannel;

export default channelSlice.reducer;
