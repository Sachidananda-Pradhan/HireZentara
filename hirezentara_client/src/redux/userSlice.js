import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessionId: '',
  userDetails: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    clearUser: (state) => {
      state.sessionId = '';
      state.userDetails = null;
    },
  },
});

export const { setSessionId, setUserDetails, clearUser } = userSlice.actions;
export default userSlice.reducer;