import { createSlice } from '@reduxjs/toolkit';

const helloSlice = createSlice({
  name: 'hello',
  initialState: { name: '' },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    hello: (state) => {
      state.name = 'CSR';
    },
  },
});

export const { setName, hello } = helloSlice.actions;
export default helloSlice.reducer;
