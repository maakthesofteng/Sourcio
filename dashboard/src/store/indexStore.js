import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'


const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware({
            serializableCheck: false
        })
    },
    devTools: true
})

export default store



// import { configureStore } from "@reduxjs/toolkit";
// import rootReducers from "./rootReducers";

// const store = configureStore({
//     reducer: { ...rootReducers },
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
//     devTools: true
// });

// export default store;
