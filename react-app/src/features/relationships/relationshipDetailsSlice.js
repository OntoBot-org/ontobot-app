import { createSlice } from "@reduxjs/toolkit";

const  initialState = {
    id: '',
    domain: '',
    range: '',
    relationshipTypes: []
}

const relationshipDetailsSlice = createSlice({
    name: 'relarionshipDetails',
    initialState,
    reducers: {
        saveDomain:  (state, action) => {
            const { id, attribute } = action.payload

            if (state.id === '') {
                state.id= id
                state.domain= attribute
            }
            else if (state.id === id) {
                state.domain= attribute
            }
            else {
                console.log('id: ', id)
                console.log('state.id: ', state.id)
            }
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

        saveRelationshipTypes:  (state, action) => {
            const { data } = action.payload
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

export const { resetRelationshipDetails, saveDomain, saveRange, saveRelationshipTypes } = relationshipDetailsSlice.actions

export default relationshipDetailsSlice.reducer
