import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../axios";

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async (postId) => {
        const { data } = await axios.get(`/posts/comments/${postId}`);
        return data;
    }
);

export const createComment = createAsyncThunk(
    'comments/createComment',
    async ({ postId, text }) => {
        const { data } = await axios.post(`/posts/comments/${postId}`, { text, post: postId });
        return data;
    }
);

const initialState = {
    items: [],
    status: 'loading', 
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.status = 'loading';
                state.items = [];
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchComments.rejected, (state) => {
                state.status = 'failed';
                state.items = [];
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export const commentsReducer = commentsSlice.reducer;