import { tooltipDescriptions } from '../data/tooltipDescriptions'
import { createDriver, createTransparentDriver } from './createDriver'

export const takeAddSubclsTaxonomyTour = () => {
	const driver = createTransparentDriver()
	  
    driver.defineSteps([
        {
            element: "#stereotypes_list",
            popover: {
                title: "Step 1: Check available stereotypes",
                description: tooltipDescriptions.stereotypes_list,
                position: "top",
            },
        },
        {
            element: "#taxonomy_classname",
            popover: {
                title: "Step 2: Give Class Name",
                description: tooltipDescriptions.taxonomy_classname,
                position: "bottom",
            },
        },
        {
            element: "#taxonomy_stereotype",
            popover: {
                title: "Step 3: Select the Stereotype",
                description: tooltipDescriptions.taxonomy_stereotype,
                position: "bottom",
            },
        },
        {
            element: "#taxonomy_equivalentclass",
            popover: {
                title: "Step 4: Give an Equivalent Class",
                description: tooltipDescriptions.taxonomy_equivalentclass,
                position: "bottom",
            },
        },
        {
            element: "#save_taxonomybranch",
            popover: {
                title: "Step 5: Save the taxonomy",
                description: tooltipDescriptions.save_taxonomybranch,
                position: "bottom",
            },
        },
    ])

    driver.start();
}

export const takeTaxonomyDetailsTour = () => {
    const driver = createDriver();
	  
    driver.defineSteps([
        {
            element: "#selected_class",
            popover: {
                title: "Step 1: Selected Taxonomy",
                description: tooltipDescriptions.selected_class,
                position: "top",
            },
        },
        {
            element: "#taxonomy_properties",
            popover: {
                title: "Step 2: Add Properites",
                description: tooltipDescriptions.taxonomy_properties,
                position: "top",
            },
        },
        {
            element: "#disjoint_classes",
            popover: {
                title: "Step 3: Add Disjoint classes",
                description: tooltipDescriptions.disjoint_classes,
                position: "top",
            },
        },
        {
            element: "#overlapping_classes",
            popover: {
                title: "Step 4: Add Overlap classes",
                description: tooltipDescriptions.overlapping_classes,
                position: "top",
            },
        },
    ])

    driver.start();
}

export const takeAddPropertiesTour = () => {
    const driver = createTransparentDriver();
  
    driver.defineSteps([
        {
            element: "#property_name",
            popover: {
                title: "Step 1: Give property name",
                description: tooltipDescriptions.property_name,
                position: "bottom",
            },
        },
        {
            element: "#property_datatype",
            popover: {
                title: "Step 2: Give Datatype of the property",
                description: tooltipDescriptions.property_datatype,
                position: "bottom",
            },
        },
        {
            element: "#property_restrictions",
            popover: {
                title: "Step 3: Give any restrictions",
                description: tooltipDescriptions.property_restrictions,
                position: "bottom",
            },
        },
        {
            element: "#property_functional",
            popover: {
                title: "Step 4: Mark functional",
                description: tooltipDescriptions.property_functional,
                position: "bottom",
            },
        },
        {
            element: "#add_property",
            popover: {
                title: "Step 5: Add new property",
                description: tooltipDescriptions.add_property,
                position: "bottom",
            },
        },
        {
            element: "#view_property",
            popover: {
                title: "Step 6: View Property Table",
                description: tooltipDescriptions.view_property,
                position: "top",
            },
        },
        {
            element: "#submit_properties",
            popover: {
                title: "Step 7: Submit all properties",
                description: tooltipDescriptions.submit_properties,
                position: "top",
            },
        },
    ])

    driver.start();
}