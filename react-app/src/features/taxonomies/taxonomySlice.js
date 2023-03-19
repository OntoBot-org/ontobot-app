import { createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";

const  initialState = {
    id: v4(),
    name: "taxonomies",
    label: "taxonomies",
    subclasses: [],
    propertiesList: [],
    disjoint: [],
    overlap: [],
    submitted: false,
}

const taxonomySlice = createSlice({
    name: 'taxonomy',
    initialState,
    reducers: {
        saveSubclass: (state, action) => {
            const { id, name, stereotype, equivalentClass, parentId } = action.payload

            const findParent = (taxonomy) => {
                if (taxonomy.id === parentId) {
                    taxonomy.subclasses.push({
                        id: id,
                        name: name,
                        label: name,
                        stereotype: stereotype,
                        equivalentClass: equivalentClass,
                        subclasses: [],
                        propertiesList: [],
                        disjoint: [],
                        overlap: [],
                    })
                    // console.log('Num of subclasses: ', taxonomy.subclasses?.length)
                } else {
                    if (taxonomy.hasOwnProperty('subclasses')) {
                        taxonomy.subclasses?.map(subCls => findParent(subCls))
                    }
                }
            }

            findParent(state)
        },

        removeTaxonomy: (state, action) => {
            const { id } = action.payload

            const findTaxonomy = (taxonomy) => {
                const requiredIndex = taxonomy.subclasses?.findIndex(el => {
                    return el.id === id
                })

                if(requiredIndex === -1){
                    if (taxonomy.hasOwnProperty('subclasses')) {
                        taxonomy.subclasses?.map(subCls => findTaxonomy(subCls))
                    }
                }
                else {
                    return !!taxonomy.subclasses?.splice(requiredIndex, 1)
                }
            }

            findTaxonomy(state)
        },

        updateTaxonomy: (state, action) => {
            const { id, name, stereotype, equivalentClass } = action.payload

            const findTaxonomy = (taxonomy) => {
                if (taxonomy.id === id) {
                    taxonomy.name = name
                    taxonomy.label = name
                    taxonomy.stereotype = stereotype
                    taxonomy.equivalentClass = equivalentClass
                } else {
                    if (taxonomy.hasOwnProperty('subclasses')) {
                        taxonomy.subclasses?.map(subCls => findTaxonomy(subCls))
                    }
                }
            }

            findTaxonomy(state)
        },

        saveProperties: (state, action) => {
            const { taxonomyId, propertiesList } = action.payload

            const findTaxonomy = (taxonomy) => {
                if (taxonomy.id === taxonomyId) {
                    taxonomy.propertiesList = propertiesList
                    // taxonomy = { ...taxonomy, propertiesList: propertiesList }
                    // console.log('first property:', taxonomy.propertiesList[0].name)
                } else {
                    if (taxonomy.hasOwnProperty('subclasses')) {
                        taxonomy.subclasses?.map(subCls => findTaxonomy(subCls))
                    }
                }
            }

            findTaxonomy(state)
        },

        saveDisjointClasses: (state, action) => {
            const { taxonomyId, disjointList } = action.payload

            const findTaxonomy = (taxonomy) => {
                if (taxonomy.id === taxonomyId) {
                    taxonomy.disjoint = disjointList
                    // taxonomy = { ...taxonomy, disjoint: disjointList }
                    // console.log('num of disjoint classes: ', taxonomy.disjoint.length)
                    // console.log('first disjoint ', taxonomy.disjoint[0])
                } else {
                    if (taxonomy.hasOwnProperty('subclasses')) {
                        taxonomy.subclasses?.map(subCls => findTaxonomy(subCls))
                    }
                }
            }

            findTaxonomy(state)
        },

        saveOverlapClasses: (state, action) => {
            const { taxonomyId, overlapList } = action.payload

            const findTaxonomy = (taxonomy) => {
                if (taxonomy.id === taxonomyId) {
                    taxonomy.overlap = overlapList
                    // taxonomy = { ...taxonomy, overlap: overlapList }
                    // console.log('num of overlap classes: ', taxonomy.overlap.length)
                    // console.log('first overlap ', taxonomy.overlap[0])
                } else {
                    if (taxonomy.hasOwnProperty('subclasses')) {
                        taxonomy.subclasses?.map(subCls => findTaxonomy(subCls))
                    }
                }
            }

            findTaxonomy(state)
        },

        setSubmittedState: (state, action) => {
            const { submittedState } = action.payload
            // console.log('submittedState: ', submittedState)
            state.submitted = submittedState
        },
    }
})

export const { 
    removeTaxonomy, 
    saveDisjointClasses, 
    saveOverlapClasses, 
    saveProperties, 
    saveSubclass, 
    setSubmittedState, 
    updateTaxonomy
} = taxonomySlice.actions

export default taxonomySlice.reducer