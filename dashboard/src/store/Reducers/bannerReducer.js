import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
// import {api_url} from '../../utils/Utils'
import api from '../../api/api'

export const add_banner = createAsyncThunk(
    'banner/add_banner',
    async (info, { fulfillWithValue, rejectWithValue, getState }) => {
        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            // const { data } = await axios.post(`${api_url}/api/banner/add`, info, config)
            const { data } = await api.post(`/banner/add`, info, {withCredentials : true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const update_banner = createAsyncThunk(
    'banner/update_banner',
    async ({ bannerId, info }, { fulfillWithValue, rejectWithValue, getState }) => {
        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            // const { data } = await axios.put(`${api_url}/api/banner/update/${bannerId}`, info, config)
            const { data } = await api.put(`/banner/update/${bannerId}`, info, {withCredentials : true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_banner = createAsyncThunk(
    'banner/get_banner',
    async (productId, { fulfillWithValue, rejectWithValue, getState }) => {
        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            // const { data } = await axios.get(`${api_url}/api/banner/get/${productId}`, config)
            const { data } = await api.get(`/banner/get/${productId}`, {withCredentials : true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const bannerReducer = createSlice({
    name: 'category',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        banners: [],
        banner: ""
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: (builder) => {
  builder
    .addCase(add_banner.pending, (state) => {
      state.loader = true;
    })
    .addCase(add_banner.rejected, (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.message;
    })
    .addCase(add_banner.fulfilled, (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.banner = payload.banner;
    })
    .addCase(get_banner.fulfilled, (state, { payload }) => {
      state.banner = payload.banner;
    })
    .addCase(update_banner.pending, (state) => {
      state.loader = true;
    })
    .addCase(update_banner.rejected, (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.message;
    })
    .addCase(update_banner.fulfilled, (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.banner = payload.banner;
    });
}
})
export const { messageClear } = bannerReducer.actions
export default bannerReducer.reducer