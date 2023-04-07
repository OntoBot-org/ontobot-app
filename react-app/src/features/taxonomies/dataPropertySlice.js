import { createSlice } from "@reduxjs/toolkit";

const  initialState = []

const dataPropertySlice = createSlice({
    name: 'objectProperties',
    initialState,
    reducers: {
        saveDataProperties: (state, action) => {
            const { newDataPropertyArray } = action.payload
            console.log('newDataPropertyArray: ', newDataPropertyArray)
            // state.splice(0, state.length, ...newOPList);
            newDataPropertyArray.forEach((dataprop) => {
                console.log('dataprop: ', dataprop)
                state.push(dataprop);
            })
            // console.log("newOPList in objectPropertySlice: ", newOPList)
            // console.log("prevOPList in objectPropertySlice: ", prevOPList)
        },
    }
})

export const { saveDataProperties } = dataPropertySlice.actions

export default dataPropertySlice.reducer