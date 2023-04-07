import React from 'react'
import { MdLiveHelp } from 'react-icons/md'

import { AddObjectProperties } from '../components'
// import { RelationshipTree, SimpleOP } from '../components'
import { takeAtour } from '../tour/mainTours'

const RelationshipCage = () => {

    return (
        <div className="w-full h-screen mt-8">
         	<div className="flex w-full items-center justify-center gap-4 text-secondary text-2xl mb-4">
				<h1 className="tracking-widest">Add Object Properties</h1>
				<MdLiveHelp className="cursor-pointer hover:text-primary" onClick={takeAtour} />
			</div>
            <AddObjectProperties />
        </div>
    )
}

export default RelationshipCage