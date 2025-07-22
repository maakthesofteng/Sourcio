import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_dashboard_index_data = createAsyncThunk(
  "dashboard/get_dashboard_index_data",
  async (userId, { rejectWithValue, fulfillWithValue, getState }) => {
    // const token = getState().auth.token;
    // const config = {
    //   headers: {
    //     authorization: `Bearer ${token}`
    //   }
    // };
    try {
      const { data } = await api.get(
        `/home/customer/gat-dashboard-data/${userId}`/*,
        config*/
      );
      return fulfillWithValue(data);
    } catch (error) {
     console.log(error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const dashboardReducer = createSlice({
  name: "dashboard",
  initialState: {
    recentOrders: [],
    errorMessage: "",
    successMessage: "",
    totalOrder: 0,
    pendingOrder: 0,
    cancelledOrder: 0
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    }
  },
   extraReducers: (builder) => {
    builder.addCase(get_dashboard_index_data.fulfilled, (state, { payload }) => {
      if (payload) {
        state.totalOrder = payload.totalOrder || 0;
        state.pendingOrder = payload.pendingOrder || 0;
        state.cancelledOrder = payload.cancelledOrder || 0;
        state.recentOrders = payload.recentOrders || [];
      } else {
        state.errorMessage = "Failed to fetch dashboard data.";
      }
    });
    builder.addCase(get_dashboard_index_data.rejected, (state, { payload }) => {
      state.errorMessage = payload || "Something went wrong";
    });
  }

});

export const { messageClear } = dashboardReducer.actions;
export default dashboardReducer.reducer;
