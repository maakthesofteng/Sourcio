import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import api from '../../api/api';

export const categoryAdd = createAsyncThunk(
    'category/categoryAdd',
    async ({ name, image }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('image', image);
            const { data } = await api.post(`/category-add`, formData, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: "Something went wrong" });
        }
    }
);

export const get_category = createAsyncThunk(
    'category/get_category',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {
        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            // const { data } = await axios.get(`${api_url}/api/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, config)
            const {data} = await api.get(`/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, {withCredentials: true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: "Failed to fetch categories" });
        }
    }
)


export const categoryReducer = createSlice({
    name: 'category',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        categorys: [],
        totalCategory: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(categoryAdd.pending, (state, _) => {
                state.loader = true;
            })
            .addCase(categoryAdd.rejected, (state, { payload }) => {
                // console.log("Rejected Payload:", payload); 
                state.loader = false;
                state.errorMessage = payload?.error || "Failed to add category";
            })
            .addCase(categoryAdd.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.categorys = [...state.categorys, payload.category];
            })
            .addCase(get_category.fulfilled,(state, { payload } ) => {
                state.totalCategory = payload.totalCategory
                state.categorys = payload.categorys
            })
    }
});


export const { messageClear } = categoryReducer.actions;
export default categoryReducer.reducer;
