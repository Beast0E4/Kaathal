import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import { showToast } from "./toast.slice";

const initialState = {
    blogList: [],
};

export const createBlog = createAsyncThunk('Blog/createBlog', async (blogData, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('blog/create', blogData, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });

        dispatch(showToast({ message: 'Blog published successfully!', type: 'success' }));
        return response;
    } catch (error) {
        console.log (error.response);
        dispatch(showToast({ message: error.response?.data?.error, type: 'error' }));
        return rejectWithValue (error.response?.data?.error);
    }
});

export const uploadImage = createAsyncThunk('Blog/uploadImage', async (imageData, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('blog/uploadImage', imageData, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });

        return response;
    } catch (error) {
        dispatch(showToast({ message: error.response?.data?.error, type: 'error' }));
        return rejectWithValue (error.response?.data?.error);
    }
});

export const getBlog = createAsyncThunk('Blog/get_blog', async (slug, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`blog/${slug}`);

        return response;
    } catch (error) {
        dispatch(showToast({ message: error.response?.data?.error, type: 'error' }));
        return rejectWithValue (error.response?.data?.error);
    }
});

export const getAllBlogs = createAsyncThunk('Blog/get_blogs', async (_, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`blog`);

        return response;
    } catch (error) {
        dispatch(showToast({ message: error.response?.data?.error, type: 'error' }));
        return rejectWithValue (error.response?.data?.error);
    }
});

export const deleteBlog = createAsyncThunk('Blog/deleteBlog', async (slug, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete (`blog/${slug}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });

        return response;
    } catch (error) {
        dispatch(showToast({ message: error.response?.data?.error, type: 'error' }));
        return rejectWithValue (error.response?.data?.error);
    }
});

export const updateBlog = createAsyncThunk('/blog/updateBlog', async (data, { dispatch }) =>  {     
    try {
        const response = await axiosInstance.patch(`blog/`, data, {
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

const BlogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(createBlog.fulfilled, (state, action) => {
                console.log (action.payload);
                if (!action.payload?.data) return;
                state.blogList = [action.payload?.data?.blogsData?.blog, ...state.blogList];
            })
            .addCase(getAllBlogs.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                state.blogList = action.payload?.data?.blogsData?.blog;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                const deletedBlog = action.payload?.data?.blogsData?.blog;
                if (!deletedBlog) return;

                state.blogList = state.blogList.filter ((blog) => blog._id !== deletedBlog._id
                );
            });
    }
});

export const {} = BlogSlice.actions;

export default BlogSlice.reducer;
