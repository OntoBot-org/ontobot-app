import React from 'react'
import { useSelector } from 'react-redux'

import RelationshipBranch from './RelationshipBranch'

const RelationshipTree = () => {

    const relationship = useSelector(store => store.relationships)

    return (
        <div className='w-full h-full overflow-y-scroll'>
            <RelationshipBranch relationship={relationship} titleStyle='taxonomy-heading' />
        </div>
    )
}

export default RelationshipTree