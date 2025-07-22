import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'
// import { api_url } from '../../utils/utils'
import api from '../../api/api';

export const add_product = createAsyncThunk(
    'product/add_product',
    async (product, { rejectWithValue, fulfillWithValue, getState }) => {
        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            // const { data } = await axios.post(`${api_url}/api/product-add`, product, config)
            const { data } = await api.post(`/product-add`, product, {withCredentials: true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: "Something went wrong" });
        }
    }
)



export const get_products = createAsyncThunk(
    'product/get_products',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {
        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            // const { data } = await axios.get(`${api_url}/api/products-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, config)
            const {data} = await api.get(`/products-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, {withCredentials: true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const get_product = createAsyncThunk(
    'product/get_product',
    async (productId, { rejectWithValue, fulfillWithValue }) => {
        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            // const { data } = await axios.get(`${api_url}/api/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, config)
            const {data} = await api.get(`/product-get/${productId}`, {withCredentials: true})
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const update_product = createAsyncThunk(
    'product/updateProduct',
    async (product, { rejectWithValue, fulfillWithValue, getState }) => {
        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            // const { data } = await axios.post(`${api_url}/api/product-update`, product, config)
            const { data } = await api.post(`/product-update`, product, {withCredentials: true})
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const product_image_update = createAsyncThunk(
    'product/product_image_update',
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/product-image-update`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : "Something went wrong");
        }
    }
);



export const productReducer = createSlice({
    name: 'product',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        products: [],
        product: '',
        totalProduct: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(add_product.pending, (state,_) => {
                state.loader = true;
            })
            .addCase(add_product.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(add_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(get_products.fulfilled, (state, { payload }) => {
                state.totalProduct = payload.totalProduct;
                state.products = payload.products;
            })
            .addCase(get_product.fulfilled, (state, { payload }) => {
                state.product = payload.product;
            })
            .addCase(update_product.pending, (state, _) => {
                state.loader = true;
            })
            .addCase(update_product.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(update_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.product = payload.product;
                state.successMessage = payload.message;
            })
            // .addCase(product_image_update.fulfilled, (state, { payload }) => {
            //     state.product = payload.product;
            //     state.successMessage = payload.message;
            // });
            .addCase(product_image_update.pending, (state) => {
                state.loader = true;
            })
            .addCase(product_image_update.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error || "Image update failed";
            })
            .addCase(product_image_update.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.product = payload.product;
                state.successMessage = payload.message;
            });
    }
});



export const { messageClear } = productReducer.actions
export default productReducer.reducer