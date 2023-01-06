import React from 'react'
import { useSelector } from 'react-redux'

import TaxonomyBranch from './TaxonomyBranch'

const TaxonomyTree = () => {

    const taxonomy = useSelector(store => store.taxonomies)

    return (
        <div className='w-full h-full overflow-y-scroll'>
            <TaxonomyBranch taxonomy={taxonomy} taxonomyStyle='taxonomy-heading' />
        </div>
    )
}

export default TaxonomyTree