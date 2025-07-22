import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
// import { api_url } from '../../utils/utils'
import api from '../../api/api'

export const get_seller_dashboard_index_data = createAsyncThunk(
    'dashboardIndex/get_seller_dashboard_index_data',
    async (_, { rejectWithValue, fulfillWithValue, getState }) => {
        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            // const { data } = await axios.get(`${api_url}/api/seller/get-dashboard-index-data`, config)
            const { data } = await api.get(`/seller/get-dashboard-index-data`, {withCredentials : true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_admin_dashboard_index_data = createAsyncThunk(
    'dashboardIndex/get_admin_dashboard_index_data',
    async (_, { rejectWithValue, fulfillWithValue, getState }) => {
        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            // const { data } = await axios.get(`${api_url}/api/admin/get-dashboard-index-data`, config)
            const { data } = await api.get(`/admin/get-dashboard-index-data`, {withCredentials : true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



export const dashboardIndexReducer = createSlice({
    name: 'dashboardIndex',
    initialState: {
        totalSale: 0,
        totalOrder: 0,
        totalProduct: 0,
        totalPendingOrder: 0,
        totalSeller: 0,
        recentOrders: [],
        recentMessage: []
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: (builder) => {
  builder
    .addCase(get_seller_dashboard_index_data.fulfilled, (state, { payload }) => {
      state.totalSale = payload.totalSale;
      state.totalOrder = payload.totalOrder;
      state.totalProduct = payload.totalProduct;
      state.totalPendingOrder = payload.totalPendingOrder;
      state.recentOrders = payload.recentOrders;
      state.recentMessage = payload.messages;
    })
    .addCase(get_admin_dashboard_index_data.fulfilled, (state, { payload }) => {
      state.totalSale = payload.totalSale;
      state.totalOrder = payload.totalOrder;
      state.totalProduct = payload.totalProduct;
      state.totalSeller = payload.totalSeller;
      state.recentOrders = payload.recentOrders;
      state.recentMessage = payload.messages;
    });
}
})
export const { messageClear } = dashboardIndexReducer.actions
export default dashboardIndexReducer.reducer