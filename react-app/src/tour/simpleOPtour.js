import { tooltipDescriptions } from '../data/tooltipDescriptions'
import { createDriver, createTransparentDriver } from './createDriver'

export const takeSOPmainTour = () => {
	const driver = createDriver()
  
	driver.defineSteps([
		{
			element: "#add_simpleOP_icon",
			popover: {
				title: "Step 1: Click to add Simple OPs",
				description: tooltipDescriptions.add_simpleOP_icon,
				position: "right",
			},
		},
		{
			element: "#simpleOP_list",
			popover: {
				title: "Step 2: Available Simple OPs",
				description: tooltipDescriptions.simpleOP_list,
				position: "right",
			},
		},
		{
			element: "#submitAll_SOP",
			popover: {
				title: "Step 3: Submit Simple OPs",
				description: tooltipDescriptions.submitAll_SOP,
				position: "top",
			},
		},
		{
			element: "#check_SOP_consistency",
			popover: {
				title: "Step 4: Check consistency of SOPs",
				description: tooltipDescriptions.check_SOP_consistency,
				position: "top",
			},
		},
	])

	driver.start();
}

export const takeSOPmodalTour = () => {
	const driver = createTransparentDriver()
  
	driver.defineSteps([
		{
			element: "#single_range_entry",
			popover: {
				title: "Step 1: Add Simple OPs with single range",
				description: tooltipDescriptions.single_range_entry,
				position: "right",
			},
		},
		{
			element: "#multi_range_entry",
			popover: {
				title: "Step 2: Add Simple OPs with multiple ranges",
				description: tooltipDescriptions.multi_range_entry,
				position: "left",
			},
		},
	])

	driver.start();
}

export const takeSOPsingleRangeTour = () => {
	const driver = createTransparentDriver()
  
	driver.defineSteps([
		{
			element: "#sop_label",
			popover: {
				title: "Give OP Label",
				description: tooltipDescriptions.sop_label,
				position: "top",
			},
		},
		{
			element: "#sop_inverse",
			popover: {
				title: "Give an Inverse",
				description: tooltipDescriptions.sop_inverse,
				position: "top",
			},
		},
		{
			element: "#sop_equivalentname",
			popover: {
				title: "Give an Equivalentname",
				description: tooltipDescriptions.sop_equivalentname,
				position: "top",
			},
		},
		{
			element: "#sop_domain",
			popover: {
				title: "Select a Domain",
				description: tooltipDescriptions.sop_domain,
				position: "top",
			},
		},
		{
			element: "#sop_range",
			popover: {
				title: "Select a Range",
				description: tooltipDescriptions.sop_range,
				position: "top",
			},
		},
		{
			element: "#sop_quantifiers",
			popover: {
				title: "Add Quantifiers",
				description: tooltipDescriptions.sop_quantifiers,
				position: "top",
			},
		},
		{
			element: "#sop_relationship_types",
			popover: {
				title: "Select Relationship Types",
				description: tooltipDescriptions.sop_relationship_types,
				position: "top",
			},
		},
		{
			element: "#sop_constraints",
			popover: {
				title: "Give Constraints",
				description: tooltipDescriptions.sop_constraints,
				position: "top",
			},
		},
		{
			element: "#add_sop",
			popover: {
				title: "Add Object Property",
				description: tooltipDescriptions.add_sop,
				position: "top",
			},
		},
		{
			element: "#cancel_sop",
			popover: {
				title: "Cancel",
				description: tooltipDescriptions.cancel_sop,
				position: "top",
			},
		},
	])

	driver.start();
}

export const takeSOPmultiRangeTour = () => {
	const driver = createTransparentDriver()

	driver.defineSteps([
		{
			element: "#sop__label",
			popover: {
				title: "Give OP Label",
				description: tooltipDescriptions.sop_label,
				position: "top",
			},
		},
		{
			element: "#sop__domain",
			popover: {
				title: "Select a Domain",
				description: tooltipDescriptions.sop_domain,
				position: "top",
			},
		},
		{
			element: "#add_multiRanges",
			popover: {
				title: "Click to Add Ranges",
				description: tooltipDescriptions.add_multiRanges,
				position: "top",
			},
		},
	])

	driver.start();
}

export const takeSOPmultiRangeModalTour = () => {
	const driver = createTransparentDriver()

	driver.defineSteps([
		{
			element: "#sop__range",
			popover: {
				title: "Give OP Label",
				description: tooltipDescriptions.sop_range,
				position: "top",
			},
		},
		{
			element: "#sop_relationshiptypes",
			popover: {
				title: "Select a Domain",
				description: tooltipDescriptions.sop_relationship_types,
				position: "top",
			},
		},
		{
			element: "#sop__quantifiers",
			popover: {
				title: "Click to Add Ranges",
				description: tooltipDescriptions.sop_quantifiers,
				position: "top",
			},
		},
		{
			element: "#sop__constraints",
			popover: {
				title: "Click to Add Ranges",
				description: tooltipDescriptions.sop_constraints,
				position: "top",
			},
		},
		{
			element: "#sop_addRange",
			popover: {
				title: "Click to Add Ranges",
				description: tooltipDescriptions.sop_addRange,
				position: "top",
			},
		},
		{
			element: "#sop_addedMultiRange",
			popover: {
				title: "Click to Add Ranges",
				description: tooltipDescriptions.sop_addedMultiRange,
				position: "top",
			},
		},
		{
			element: "#save_sop_multiRanges",
			popover: {
				title: "Click to Add Ranges",
				description: tooltipDescriptions.save_sop_multiRanges,
				position: "top",
			},
		},
		{
			element: "#cancel__sop",
			popover: {
				title: "Click to Add Ranges",
				description: tooltipDescriptions.cancel_sop,
				position: "top",
			},
		},
	])

	driver.start();
}