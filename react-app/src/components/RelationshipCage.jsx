import React from 'react'
import { useSelector } from 'react-redux'

import { RelationshipTree } from '../components'

const RelationshipCage = () => {

    const relationships = useSelector(store => store.relationships)

    return (
        <div className="w-full h-screen">
            <div className="h-full">
                <div className="flex h-3/4">
                    <div className="w-1/2 border p-3">
                        <RelationshipTree />
                    </div>
                    <div className="w-1/2 border p-3">
                        <p className="">Relationship Details</p>
                    </div>
                </div>
                <div className="w-full h-1/4 flex justify-center items-center">
                    <button className='primary_btn w-auto' onClick={() => console.log('relationships: ', relationships)}>
                        Submit all the Relationships
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RelationshipCage