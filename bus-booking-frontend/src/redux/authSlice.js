import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set your backend API base
const API_URL = "http://localhost:5000/api/auth";

// Async thunks
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/register`, userData);
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, userData);
      localStorage.setItem("token", res.data.token);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; state.success = "Registered successfully"; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
