import { tooltipDescriptions } from '../data/tooltipDescriptions'
import { createDriver, createTransparentDriver } from './createDriver'

export const takeAOPmainTour = () => {
	const driver = createDriver()
  
	driver.defineSteps([
		{
			element: "#add_advancedOP_icon",
			popover: {
				title: "Step 1: Click to add Advanced OPs",
				description: tooltipDescriptions.add_advancedOP_icon,
				position: "left",
			},
		},
		{
			element: "#advancedOP_list",
			popover: {
				title: "Step 2: Available Advanced OPs",
				description: tooltipDescriptions.advancedOP_list,
				position: "left",
			},
		},
		{
			element: "#submitAll_AOP",
			popover: {
				title: "Step 3: Submit Advanced OPs",
				description: tooltipDescriptions.submitAll_AOP,
				position: "top",
			},
		},
		{
			element: "#check_AOP_consistency",
			popover: {
				title: "Step 4: Check consistency of AOPs",
				description: tooltipDescriptions.check_AOP_consistency,
				position: "top",
			},
		},
	])

	driver.start();
}

export const takeAOPusecase01Tour = () => {
	const driver = createTransparentDriver()
  
	driver.defineSteps([
		{
			element: "#aop_label",
			popover: {
				title: "Give OP Label",
				description: tooltipDescriptions.aop_label,
				position: "top",
			},
		},
		{
			element: "#aop_domain",
			popover: {
				title: "Select a Domain",
				description: tooltipDescriptions.aop_domain,
				position: "top",
			},
		},
		{
			element: "#aop_range",
			popover: {
				title: "Select a Range",
				description: tooltipDescriptions.aop_range,
				position: "top",
			},
		},
		{
			element: "#aop_additionalAttrubutes",
			popover: {
				title: "Select additional attributes",
				description: tooltipDescriptions.aop_additionalAttrubutes,
				position: "top",
			},
		},
		{
			element: "#add_aop",
			popover: {
				title: "Add Object Property",
				description: tooltipDescriptions.add_aop,
				position: "top",
			},
		},
		{
			element: "#aop_addConstraints",
			popover: {
				title: "Cancel",
				description: tooltipDescriptions.aop_addConstraints,
				position: "top",
			},
		},
	])

	driver.start();
}

export const takeAOPusecase02Tour = () => {
	const driver = createTransparentDriver()
  
	driver.defineSteps([
		{
			element: "#aop__domain",
			popover: {
				title: "Select a Domain",
				description: tooltipDescriptions.aop_domain,
				position: "top",
			},
		},
		{
			element: "#aop__additionalAttrubutes",
			popover: {
				title: "Select additional attributes",
				description: tooltipDescriptions.aop_additionalAttrubutes,
				position: "top",
			},
		},
		{
			element: "#add_aop",
			popover: {
				title: "Add Object Property",
				description: tooltipDescriptions.add_aop,
				position: "top",
			},
		},
		{
			element: "#aop_addConstraints",
			popover: {
				title: "Add Constraints",
				description: tooltipDescriptions.aop_addConstraints,
				position: "top",
			},
		},
	])

	driver.start();
}

export const takeAOPaddConstraintsTour = () => {
	const driver = createTransparentDriver()
  
	driver.defineSteps([
		{
			element: "#range_name",
			popover: {
				title: "Added Ranges",
				description: tooltipDescriptions.range_name,
				position: "top",
			},
		},
		{
			element: "#some_quantifier",
			popover: {
				title: "Some Quantifier",
				description: tooltipDescriptions.some_constraint,
				position: "top",
			},
		},
		{
			element: "#only_quantifier",
			popover: {
				title: "Only Quantifier",
				description: tooltipDescriptions.range_name,
				position: "top",
			},
		},
		{
			element: "#min_constraint",
			popover: {
				title: "Minimum value",
				description: tooltipDescriptions.min_constraint,
				position: "top",
			},
		},
		{
			element: "#max_constraint",
			popover: {
				title: "Maximum value",
				description: tooltipDescriptions.max_constraint,
				position: "top",
			},
		},
		{
			element: "#exactly_constraint",
			popover: {
				title: "Exact value",
				description: tooltipDescriptions.exactly_constraint,
				position: "left",
			},
		},
		{
			element: "#save_constraint",
			popover: {
				title: "Save Constraints",
				description: tooltipDescriptions.save_constraint,
				position: "top",
			},
		},
	])

	driver.start();
}