import { createSlice } from "@reduxjs/toolkit";

const  initialState = []

const objectPropertySlice = createSlice({
    name: 'objectProperties',
    initialState,
    reducers: {
        saveObjectProperties: (state, action) => {
            const { newOPList, prevOPList } = action.payload
            state.splice(0, state.length, ...newOPList);
            state.push(...prevOPList);
            // console.log("newOPList in objectPropertySlice: ", newOPList)
            // console.log("prevOPList in objectPropertySlice: ", prevOPList)
        },
    }
})

export const { saveObjectProperties } = objectPropertySlice.actions

export default objectPropertySlice.reducer