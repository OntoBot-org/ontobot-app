import { tooltipDescriptions } from '../data/tooltipDescriptions'
import { createDriver } from './createDriver'

export const takeTaxonomyTour = () => {
	const driver = createDriver()
	  
	driver.defineSteps([
		{
			element: "#taxonomy_tree",
			popover: {
				title: "Step 1: Create Taxonomy Tree",
				description: tooltipDescriptions.taxonomy_tree,
				position: "right",
			},
		},
		{
			element: "#taxonomy_details",
			popover: {
				title: "Step 2: Save Taxonomy Details",
				description: tooltipDescriptions.taxonomy_details,
				position: "left",
			},
		},
		{
			element: "#submit_taxonomies",
			popover: {
				title: "Step 3: Submit Taxonomy Tree",
				description: tooltipDescriptions.submit_taxonomies,
				position: "top",
			},
		},
	])

	driver.start();
}

export const takeAtour = () => {
	const driver = createDriver()
  
	driver.defineSteps([
		{
			element: "#simpleOP_cage",
			popover: {
				title: "Step 1: Add Simple object properties",
				description: tooltipDescriptions.simpleOP_cage,
				position: "right",
			},
		},
		{
			element: "#advancedOP_cage",
			popover: {
				title: "Step 2: Add Advanced object properties",
				description: tooltipDescriptions.advancedOP_cage,
				position: "left",
			},
		},
		{
			element: "#submit_all_op",
			popover: {
				title: "Step 3: Submit All Object Properties",
				description: tooltipDescriptions.submit_all_op,
				position: "top",
			},
		},
	])

	driver.start();
}