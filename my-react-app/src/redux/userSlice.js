import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  username: "",
  birthdate: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.birthdate = action.payload.birthdate;
    },
    clearUser: (state) => {
      state.email = "";
      state.username = "";
      state.birthdate = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;