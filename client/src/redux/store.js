import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './slices/auth.slice';
import toastSliceReducer from './slices/toast.slice'

const Store = configureStore({
    reducer: {
        auth: authSliceReducer,
        toast: toastSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
    devTools: true
})

export default Store;