// src/features/taskSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  task: false, // Default state
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTask: (state, action) => {
      state.task = action.payload;
    },
  },
});

export const { setTask } = taskSlice.actions;
export default taskSlice.reducer;
