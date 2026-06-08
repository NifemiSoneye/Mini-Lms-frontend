// features/ui/uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

const uiSlice = createSlice({
  name: "ui",
  initialState: { sidebarOpen: false },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
  },
});

export const { toggleSidebar, closeSidebar } = uiSlice.actions;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export default uiSlice.reducer;
