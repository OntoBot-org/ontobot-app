import { createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";

const  initialState = {
    id: v4(),
    relationshipLabel: "relationships",
    subrelationships: [],
}

const relationshipSlice = createSlice({
    name: 'taxonomy',
    initialState,
    reducers: {
        saveSubrelationships: (state, action) => {
            const { id, relationshipLabel, inverse, equivalentLabel, domain, range, type, parentId } = action.payload
            // console.log('action.payload: ', action.payload)

            const findParent = (relationship) => {
                if (relationship.id === parentId) {
                    relationship.subrelationships.push({
                        id, 
                        relationshipLabel, 
                        inverse, 
                        equivalentLabel, 
                        domain, 
                        range, 
                        type,
                        subrelationships: []
                    })
                } else {
                    if (relationship.hasOwnProperty('subrelationships')) {
                        relationship.subrelationships?.map(subCls => findParent(subCls))
                    }
                }
            }

            findParent(state)
            // console.log('Num of subrelationships ', state.subrelationships?.length)
        },

        removeRelationship: (state, action) => {
            const { id } = action.payload

            const findRelationship = (relationship) => {
                const requiredIndex = relationship.subrelationships?.findIndex(el => {
                    return el.id === id
                })

                if(requiredIndex === -1){
                    if (relationship.hasOwnProperty('subrelationships')) {
                        relationship.subrelationships?.map(subCls => findRelationship(subCls))
                    }
                }
                else {
                    return !!relationship.subrelationships?.splice(requiredIndex, 1)
                }
            }

            findRelationship(state)
        },

        updateRelationship: (state, action) => {
            const { id, relationshipLabel, inverse, equivalentLabel, domain, range, type } = action.payload
            console.log('action.payload in updateRelationship: ', action.payload)

            const findRelationship = (relationship) => {
                if (relationship.id === id) {
                    relationship.relationshipLabel= relationshipLabel
                    relationship.inverse= inverse
                    relationship.equivalentLabel= equivalentLabel
                    relationship.domain= domain
                    relationship.range= range
                    relationship.type= type
                } else {
                    if (relationship.hasOwnProperty('subrelationships')) {
                        relationship.subrelationships?.map(subRelation => findRelationship(subRelation))
                    }
                }
            }

            findRelationship(state)
        },
    }
})

export const { removeRelationship, saveSubrelationships, updateRelationship } = relationshipSlice.actions

export default relationshipSlice.reducer
