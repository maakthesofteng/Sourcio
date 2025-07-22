import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode"; 
// import axios from 'axios'
// import { api_url } from '../../utils/utils'

export const admin_login = createAsyncThunk(
  "auth/admin_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/admin-login", info, {
        withCredentials: true
      });
      localStorage.setItem('accessToken', data.token)
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);


export const seller_register = createAsyncThunk(
  'auth/seller_register',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log(info)
      const { data } = await api.post("/seller_register", info, {
        withCredentials: true
      });
      localStorage.setItem('accessToken', data.token)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



export const seller_login = createAsyncThunk(
  'auth/seller_login ',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/seller-login ", info, {
        withCredentials: true
      });
      localStorage.setItem('accessToken', data.token)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const get_user_info = createAsyncThunk(
  'auth/get_user_info',
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
      // const token = getState().auth.token
      // const config = {
      //     headers: {
      //         'Authorization': `Bearer ${token}`
      //     }
      // }
      try {
          const { data } = await api.get(`/get-user`, {withCredentials: true})
          return fulfillWithValue(data)
      } catch (error) {
          return rejectWithValue(error.response.data)
      }
  }
)



export const profile_image_upload = createAsyncThunk(
  "auth/profile_image_upload",
  async (formData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/profile-image-upload`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return fulfillWithValue(data);
    } catch (error) {
      console.log("Upload error:", error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);





export const profile_info_add = createAsyncThunk(
    'auth/profile_info_add',
    async (info, { rejectWithValue, fulfillWithValue, getState }) => {
        // const token = getState().auth.token
        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // }
        try {
            const { data } = await api.post(`/profile-info-add`, info, {withCredentials: true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const logout = createAsyncThunk(
    'auth/logout',
    async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/logout', { withCredentials: true })
            localStorage.removeItem('accessToken')
            if (role === 'admin') {
                navigate('/admin/login')
            } else {
                navigate('/login')
            }
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


const returnRole = (token) => {
    if (token) {
      const decodeToken = jwtDecode(token)  
        const expireTime = new Date(decodeToken.exp * 1000)
        if (new Date() > expireTime) {
            localStorage.removeItem('accessToken')
            return ''
        } else {
            return decodeToken.role
        }
    } else {
        return ''
    }
}

const authReducer = createSlice({
  name: "auth",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    userInfo: "",
    role: returnRole(localStorage.getItem('accessToken')),
    token: localStorage.getItem('accessToken')
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    }
  },
  extraReducers: (builder) => {
    builder
    // Admin Login
      .addCase(admin_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(admin_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Something went wrong!";
      })
      .addCase(admin_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.token = payload.token;
        state.role = returnRole(payload.token);
      })
      // Seller Register
      .addCase(seller_register.pending, (state) => {
        state.loader = true;
      })
      .addCase(seller_register.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error;
      })
      .addCase(seller_register.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.token = payload.token;
        state.role = returnRole(payload.token);
      })
      // Seller Login
      .addCase(seller_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(seller_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error;
      })
      .addCase(seller_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.token = payload.token;
        state.role = returnRole(payload.token);
      })
      .addCase(get_user_info.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.userInfo;
        state.role = payload.userInfo.role;
      })
      .addCase(profile_image_upload.pending, (state, _) => {
        state.loader = true;
      })
      // .addCase(profile_image_upload.fulfilled, (state, { payload }) => {
      //   state.loader = false;
      //   state.userInfo = payload.userInfo;
      //   state.successMessage = payload.message;
      // })
      .addCase(profile_info_add.pending, (state, _) => {
        state.loader = true;
      })
      .addCase(profile_info_add.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.userInfo;
        state.successMessage = payload.message;
      })
      .addCase(profile_image_upload.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = {
          ...state.userInfo,
          profileImage: payload.profileImage, // Ensure profile image is updated
        };
        state.successMessage = payload.message;
      });
  }
});

export const { messageClear } = authReducer.actions;
export default authReducer.reducer;





// export const admin_login = createAsyncThunk(
//     'auth/admin_login',
//     async (info, { rejectWithValue, fulfillWithValue }) => {
//         try {
//             const { data } = await axios.post(`${api_url}/api/admin-login`, info)
//             localStorage.setItem('accessToken', data.token)
//             return fulfillWithValue(data)
//         } catch (error) {
//             return rejectWithValue(error.response.data)
//         }
//     }
// )

// export const seller_login = createAsyncThunk(
//     'auth/seller_login',
//     async (info, { rejectWithValue, fulfillWithValue }) => {
//         try {
//             const { data } = await axios.post(`${api_url}/api/seller-login`, info, { withCredentials: true })
//             localStorage.setItem('accessToken', data.token)
//             return fulfillWithValue(data)
//         } catch (error) {
//             return rejectWithValue(error.response.data)
//         }
//     }
// )



// export const seller_register = createAsyncThunk(
//     'auth/seller_register',
//     async (info, { rejectWithValue, fulfillWithValue, getState }) => {
//         try {
//             const { data } = await axios.post(`${api_url}/api/seller-register`, info, { withCredentials: true })
//             localStorage.setItem('accessToken', data.token)
//             return fulfillWithValue(data)
//         } catch (error) {
//             return rejectWithValue(error.response.data)
//         }
//     }
// )









// export const get_user_info = createAsyncThunk(
//     'auth/get_user_info',
//     async (_, { rejectWithValue, fulfillWithValue, getState }) => {
//         const token = getState().auth.token
//         const config = {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         }
//         try {
//             const { data } = await axios.get(`${api_url}/api/get-user`, config)
//             return fulfillWithValue(data)
//         } catch (error) {
//             return rejectWithValue(error.response.data)
//         }
//     }
// )




// export const authReducer = createSlice({
//     name: 'auth',
//     initialState: {
//         successMessage: '',
//         errorMessage: '',
//         loader: false,
//         userInfo: '',
//         role: returnRole(localStorage.getItem('accessToken')),
//         token: localStorage.getItem('accessToken')
//     },
//     reducers: {
//         messageClear: (state, _) => {
//             state.errorMessage = ""
//             state.successMessage = ""
//         }
//     },
//     extraReducers: {
//         [admin_login.pending]: (state, _) => {
//             state.loader = true
//         },
//         [admin_login.rejected]: (state, { payload }) => {
//             state.loader = false
//             state.errorMessage = payload.error
//         },
//         [admin_login.fulfilled]: (state, { payload }) => {
//             state.loader = false
//             state.successMessage = payload.message
//             state.token = payload.token
//             state.role = returnRole(payload.token)
//         },
//         [seller_login.pending]: (state, _) => {
//             state.loader = true
//         },
//         [seller_login.rejected]: (state, { payload }) => {
//             state.loader = false
//             state.errorMessage = payload.error
//         },
//         [seller_login.fulfilled]: (state, { payload }) => {
//             state.loader = false
//             state.successMessage = payload.message
//             state.token = payload.token
//             state.role = returnRole(payload.token)
//         },
//         [seller_register.pending]: (state, _) => {
//             state.loader = true
//         },
//         [seller_register.rejected]: (state, { payload }) => {
//             state.loader = false
//             state.errorMessage = payload.error
//         },
//         [seller_register.fulfilled]: (state, { payload }) => {
//             state.loader = false
//             state.successMessage = payload.message
//             state.token = payload.token
//             state.role = returnRole(payload.token)
//         },
//         [get_user_info.fulfilled]: (state, { payload }) => {
//             state.loader = false
//             state.userInfo = payload.userInfo
//             state.role = payload.userInfo.role
//         },
//         [profile_image_upload.pending]: (state, _) => {
//             state.loader = true
//         },
//         [profile_image_upload.fulfilled]: (state, { payload }) => {
//             state.loader = false
//             state.userInfo = payload.userInfo
//             state.successMessage = payload.message
//         },
//         [profile_info_add.pending]: (state, _) => {
//             state.loader = true
//         },
//         [profile_info_add.fulfilled]: (state, { payload }) => {
//             state.loader = false
//             state.userInfo = payload.userInfo
//             state.successMessage = payload.message
//         },
//     }

// })
// export const { messageClear } = authReducer.actions
// export default authReducer.reducer