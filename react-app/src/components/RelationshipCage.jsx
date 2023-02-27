import React from 'react'
import { useSelector } from 'react-redux'
import { MdLiveHelp } from 'react-icons/md' 
import Driver from "driver.js"; 
import "driver.js/dist/driver.min.css"; 

import { RelationshipTree } from '../components'
import { tooltipDescriptions } from '../data/tooltipDescriptions'

const RelationshipCage = () => {

    const relationships = useSelector(store => store.relationships)

    const takeAtour = () => {
		const driver = new Driver({
			animate: true,
			opacity: 0.50,
			allowClose: false,
			doneBtnText: "Finish",
		});
	  
		driver.defineSteps([
			{
				element: "#relationship_tree",
				popover: {
					title: "Step 1: Add relationships",
					description: tooltipDescriptions.relationship_tree,
					position: "right",
				},
			},
			{
				element: "#relationship_details",
				popover: {
					title: "Step 2: Save relationship details",
					description: tooltipDescriptions.relationship_details,
					position: "left",
				},
			},
			{
				element: "#submit_relationships",
				popover: {
					title: "Step 3: Submit Relationships",
					description: tooltipDescriptions.submit_relationships,
					position: "top",
				},
			},
		])

		driver.start();
	}

    return (
        <div className="w-full h-screen">
         	<div className="flex w-full items-center justify-center gap-4 text-secondary text-2xl mb-4">
				<h1 className="tracking-widest">Add Relationships</h1>
				<MdLiveHelp className="cursor-pointer hover:text-primary" onClick={takeAtour} />
			</div>
            <div className="h-full">
                <div className="flex h-3/4">
                    <div className="w-1/2 border p-3" id='relationship_tree'>
                        <RelationshipTree />
                    </div>
                    <div className="w-1/2 border p-3" id='relationship_details'>
                        <p className="">Relationship Details</p>
                    </div>
                </div>
                <div className="w-full h-1/4 flex justify-center items-center">
                    <button 
                        className='primary_btn w-auto' 
                        onClick={() => console.log('relationships: ', relationships)}
                        id='submit_relationships'
                    >
                        Submit all the Relationships
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RelationshipCage