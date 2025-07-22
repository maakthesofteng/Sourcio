import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'
// import { api_url } from '../../utils/utils'
import api from '../../api/api'

export const get_admin_orders = createAsyncThunk(
    'order/get_admin_orders',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {

        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }

        try {
            const { data } = await api.get(`/admin/orders?page=${page}&searchValue=${searchValue}&parPage=${parPage}`, {withCredentials : true}/* config*/)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_seller_orders = createAsyncThunk(
    'order/get_seller_orders',
    async ({ parPage, page, searchValue, sellerId }, { rejectWithValue, fulfillWithValue, getState }) => {

        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            const { data } = await api.get(`/seller/orders/${sellerId}?page=${page}&searchValue=${searchValue}&parPage=${parPage}`, {withCredentials : true} /*config*/)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_admin_order = createAsyncThunk(
    'order/get_admin_order',
    async (orderId, { rejectWithValue, fulfillWithValue, getState }) => {

        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            const { data } = await api.get(`/admin/order/${orderId}`, {withCredentials : true}/*config*/)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_seller_order = createAsyncThunk(
    'order/get_seller_order',
    async (orderId, { rejectWithValue, fulfillWithValue, getState }) => {

        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            const { data } = await api.get(`/seller/order/${orderId}`, {withCredentials : true} /* config*/)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const admin_order_status_update = createAsyncThunk(
    'order/admin_order_status_update',
    async ({ orderId, info }, { rejectWithValue, fulfillWithValue, getState }) => {
        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }

        try {
            const { data } = await api.put(`/admin/order-status/update/${orderId}`, info, {withCredentials : true} /*config*/)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const seller_order_status_update = createAsyncThunk(
    'order/seller_order_status_update',
    async ({ orderId, info }, { rejectWithValue, fulfillWithValue, getState }) => {

        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            const { data } = await api.put(`/seller/order-status/update/${orderId}`, info, {withCredentials : true} /*config*/)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const OrderReducer = createSlice({
    name: 'order',
    initialState: {
        successMessage: '',
        errorMessage: '',
        totalOrder: 0,
        order: {},
        myOrders: []
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: (builder) => {
  builder
    .addCase(get_admin_orders.fulfilled, (state, { payload }) => {
      state.myOrders = payload.orders;
      state.totalOrder = payload.totalOrder;
    })
    .addCase(get_admin_order.fulfilled, (state, { payload }) => {
      state.order = payload.order;
    })
    .addCase(admin_order_status_update.rejected, (state, { payload }) => {
      state.errorMessage = payload.message;
    })
    .addCase(admin_order_status_update.fulfilled, (state, { payload }) => {
      state.successMessage = payload.message;
    })
    .addCase(get_seller_orders.fulfilled, (state, { payload }) => {
      state.myOrders = payload.orders;
      state.totalOrder = payload.totalOrder;
    })
    .addCase(get_seller_order.fulfilled, (state, { payload }) => {
      state.order = payload.order;
    })
    .addCase(seller_order_status_update.rejected, (state, { payload }) => {
      state.errorMessage = payload.message;
    })
    .addCase(seller_order_status_update.fulfilled, (state, { payload }) => {
      state.successMessage = payload.message;
    });
}
})

export const { messageClear } = OrderReducer.actions
export default OrderReducer.reducer