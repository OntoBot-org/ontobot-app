import React from 'react'

import { RelationshipTree } from '../components'

const RelationshipCage = () => {
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
                    <button className='primary_btn w-auto'>
                        Subtmit all the Relationships
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RelationshipCage