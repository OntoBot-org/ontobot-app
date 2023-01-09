import { createSlice } from "@reduxjs/toolkit";

const  initialState = {
    id: '',
    domain: '',
    ranges: [],
    relationshipTypes: []
}

const relationshipDetailsSlice = createSlice({
    name: 'relarionshipDetails',
    initialState,
    reducers: {
        saveDomain:  (state, action) => {
            const { id, attribute } = action.payload

            state.id = id
            state.domain = attribute
        },

        saveRange:  (state, action) => {
            const { id, attribute } = action.payload

            if (state.id === '') {
                state.id= id
                state.range= attribute
            }
            else if (state.id === id) {
                state.range= attribute
            }
            else {
                console.log('Id miss-match')
            }
        },

        saveRanges: (state, action) => {
            const { data } = action.payload
            // console.log('payload ranges: ', data)
            data.filter((a, b) => data.indexOf(a) === b)
            state.ranges = []
            data.map((d) => state.ranges.push(d.label))
        },

        saveRelationshipTypes:  (state, action) => {
            const { data } = action.payload
            state.relationshipTypes = []
            data.map((d) => state.relationshipTypes.push(d.label))
        },

        resetRelationshipDetails: (state, action) => {
            const { id, domain, range, relationshipTypes } = action.payload

            state.id= id
            state.domain= domain
            state.range= range
            state.relationshipTypes= relationshipTypes
        }
    }
})

export const { resetRelationshipDetails, saveDomain, saveRange, saveRanges, saveRelationshipTypes } = relationshipDetailsSlice.actions

export default relationshipDetailsSlice.reducer
