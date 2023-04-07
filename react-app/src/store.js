import { configureStore } from "@reduxjs/toolkit";

import domainRangeReducer from "./features/relationships/domainRangeSlice";
import objectPropertyReducer from "./features/objectProperties/objectPropertySlice";
import relationshipReducer from "./features/relationships/relationshipSlice";
import relationshipDetailsReducer from "./features/relationships/relationshipDetailsSlice";
import selectedTaxonomyReducer from "./features/taxonomies/selectedTaxonomySlice";
import dataPropertyReducer from "./features/taxonomies/dataPropertySlice";
import taxonomyReducer from './features/taxonomies/taxonomySlice'

export const store = configureStore({
    reducer: {
        domains: domainRangeReducer,
        totalDatapProperties: dataPropertyReducer,
        relationships: relationshipReducer,
        relationshipDetails: relationshipDetailsReducer,
        selectedTaxonomy: selectedTaxonomyReducer,
        taxonomies: taxonomyReducer,
        objectProperties: objectPropertyReducer,
    }
})