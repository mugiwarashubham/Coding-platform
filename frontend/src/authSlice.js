import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient";

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/register", userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data ||
          error.message,
      });
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/login", credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data ||
          error.message,
      });
    }
  }
);

// CHECK AUTH
export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/user/check");
      return response.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("NO_SESSION");
      }

      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data ||
          error.message,
      });
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/user/logout");
      return null;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.data ||
          error.message,
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Login failed";
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;

        if (action.payload !== "NO_SESSION") {
          state.error = action.payload?.message || null;
        }
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Logout failed";
      });
  },
});

export default authSlice.reducer;