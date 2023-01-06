import { createSlice } from "@reduxjs/toolkit";

const  initialState = {
    id: '',
    name: '',
    subclasses: [],
    propertiesList: [],
    disjoint: [],
    overlapList: []
}

const selectedTaxonomySlice = createSlice({
    name: 'selectedTaxonomy',
    initialState,
    reducers: {
        setSelectedTaxonomy: (state, action) => {
            const { id, name, subclasses, propertiesList, disjoint, overlap } = action.payload
            state.id = id
            state.name = name
            state.subclasses = subclasses
            state.propertiesList = propertiesList
            state.disjoint = disjoint
            state.overlap = overlap
        },
    }
})

export const { setSelectedTaxonomy } = selectedTaxonomySlice.actions

export default selectedTaxonomySlice.reducer