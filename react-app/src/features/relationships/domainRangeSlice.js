import { createSlice } from "@reduxjs/toolkit";

const  initialState = []

const domainRangeSlice = createSlice({
    name: 'domainrange',
    initialState,
    reducers: {
        saveDomains: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const { saveDomains } = domainRangeSlice.actions

export default domainRangeSlice.reducer