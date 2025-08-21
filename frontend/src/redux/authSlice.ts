// src/store/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface UserState {
  user: User | null;
  token: string | null;
}

// src/types/User.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'attendee' | 'employee';
  password?: string;
  googleId?: string;
  createdAt: Date;
  isBlocked?: boolean;
  updatedAt: Date;
  isVerified?: boolean;
  status?: string;
}


const initialState: UserState = {
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
