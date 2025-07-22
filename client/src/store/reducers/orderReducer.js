import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const place_order = createAsyncThunk(
  "order/place_order",
  async (
    { price, products, shipping_fee, shippingInfo, userId, items },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post("/home/order/palce-order", {
        price,
        products,
        shipping_fee,
        shippingInfo,
        userId,
        items
      });
      return {
        price: price + shipping_fee,
        items,
        orderId: data.orderId
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_orders = createAsyncThunk(
  "order/get_orders",
  async (
    { customerId, status },
    { rejectWithValue, fulfillWithValue, getState }
  ) => {
    // const token = getState().auth.token;
    // const config = {
    //   headers: {
    //     authorization: `Bearer ${token}`
    //   }
    // };
    try {
      const { data } = await api.get(
        `/home/customer/gat-orders/${customerId}/${status}` /*,
        config*/
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const get_order = createAsyncThunk(
  "order/get_order",
  async (orderId, { rejectWithValue, fulfillWithValue, getState }) => {
    // const token = getState().auth.token;
    // const config = {
    //   headers: {
    //     authorization: `Bearer ${token}`
    //   }
    // };
    try {
      const { data } = await api.get(
        `/home/customer/gat-order/${orderId}`/*,
        config*/
      );
      console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const orderReducer = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    errorMessage: "",
    successMessage: "",
    myOrder: {}
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    }
  },
  extraReducers: builder => {
    builder
      .addCase(get_orders.fulfilled, (state, { payload }) => {
        state.myOrders = payload.orders;
      })
      .addCase(get_order.fulfilled, (state, { payload }) => {
        state.myOrder = payload.order;
      });
  }
});

export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;
