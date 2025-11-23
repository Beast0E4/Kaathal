import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import { showToast } from "./toast.slice";

const initialState = {
    data: JSON.parse(localStorage.getItem("data")) || undefined,
    token: localStorage.getItem("token") || "",
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
};

export const login = createAsyncThunk('/auth/login', async (data, { dispatch }) =>  {    
    try {
        const response = await axiosInstance.post("auth/signin", data);
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return  response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const signup = createAsyncThunk('/auth/signup', async (data, { dispatch }) =>  {     
    try {
        const response = await axiosInstance.post("auth/signup", data);
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return  response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});

export const updateUser = createAsyncThunk('/auth/updateUser', async (data, { dispatch }) =>  {     
    try {
        const response = await axiosInstance.patch(`auth/`, data, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if(!response) dispatch (showToast ({ message: "Something went wrong, try again!", type: 'error' }));
        return  response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
});


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.clear();
            state.data = "";
            state.isLoggedIn = false;
            state.token = "";
            state.notifications = [];
            state.isRead = false;
        }
    }, 
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            if(!action.payload) return;
            state.isLoggedIn = (action.payload.data?.token != undefined);
            state.data = action.payload.data?.userData;
            state.token = action.payload.data?.token;
            localStorage.setItem("token", action.payload.data?.token);
            localStorage.setItem("data", JSON.stringify(action.payload.data?.userData));
            localStorage.setItem("isLoggedIn", (action.payload.data?.token != undefined));
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            if(!action.payload) return;
            state.data = action.payload.data?.userData?.user;
            localStorage.setItem("data", JSON.stringify(action.payload.data?.userData?.user));
        })
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;