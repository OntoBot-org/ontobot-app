import React from 'react'
import { MdLiveHelp } from 'react-icons/md' 
import Driver from "driver.js"; 
import "driver.js/dist/driver.min.css"; 

import { AddObjectProperties } from '../components'
// import { RelationshipTree, SimpleOP } from '../components'
import { tooltipDescriptions } from '../data/tooltipDescriptions'

const RelationshipCage = () => {

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