import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './slices/auth.slice';
import toastSliceReducer from './slices/toast.slice'
import blogSliceReducer from './slices/blog.slice'

const Store = configureStore({
    reducer: {
        auth: authSliceReducer,
        toast: toastSliceReducer,
        blog: blogSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
    devTools: true
})

export default Store;