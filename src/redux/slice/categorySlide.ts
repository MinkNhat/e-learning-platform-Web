import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchCategory } from '@/config/api';
import { ICategory } from '@/types/backend';

interface IState {
    isFetching: boolean;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: ICategory[]
}

export const fetchCategory = createAsyncThunk(
    'category/fetchCategory',
    async ({ query }: { query: string }) => {
        const response = await callFetchCategory(query);
        return response;
    }
)

const initialState: IState = {
    isFetching: true,
    meta: {
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: []
};

export const categorySlide = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCategory.pending, (state) => {
            state.isFetching = true;
        })

        builder.addCase(fetchCategory.rejected, (state) => {
            state.isFetching = false;
        })

        builder.addCase(fetchCategory.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        })
    },
});

export default categorySlide.reducer;
