import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { MdLiveHelp } from "react-icons/md";
import "driver.js/dist/driver.min.css";

import { AddProperties, SetDisjoinClasses } from '../components'
import SetOverlapClasses from './SetOverlapClasses'
import { takeTaxonomyDetailsTour } from '../tour/taxonomyTour';

const SaveTaxomony = () => {

    const selectedTaxonomy = useSelector(store => store.selectedTaxonomy)

    const [selectedTaxonomyName, setselectedTaxonomyName] = useState('')

    useEffect(() => {
        if (selectedTaxonomy.name === 'taxonomies') {
            setselectedTaxonomyName('Root taxonomy')
        } else {
            setselectedTaxonomyName(selectedTaxonomy.name)
        }
    }, [selectedTaxonomy])

    return (
        <div>
            <div className="flex items-center justify-center gap-4 mb-4">
                <p className="taxonomy-heading">Save Taxonomy details</p>
                <MdLiveHelp className="tour_icon" onClick={takeTaxonomyDetailsTour} />
            </div>

            <div className="grid grid-cols-3 gap-x-3 gap-y-6 text-fontcolor mb-6" id='selected_class'>
                <div className="font-semibold tracking-wide">Selected Class</div>
                
                <div className="col-span-2">
                    {
                        (selectedTaxonomy.name === '') ? (
                            <></>
                        ) : (
                            <p className="font-semibold capitalize text-white w-full h-full rounded bg-secondary pl-3 py-1 ">
                                { selectedTaxonomyName }
                            </p>
                        )
                    }
                </div>
            </div>

            { selectedTaxonomy.name !== 'taxonomies' && selectedTaxonomy.name !== '' && 
                <div id='taxonomy_properties'><AddProperties selectedTaxonomy={selectedTaxonomy} /></div>
            }
            
            <div className="grid grid-cols-2 gap-2">
                { selectedTaxonomy.subclasses?.length > 1 && 
                    <div id='disjoint_classes'><SetDisjoinClasses selectedTaxonomy={selectedTaxonomy} /></div>
                }

                { selectedTaxonomy.subclasses?.length > 1 && 
                    <div id='overlapping_classes'><SetOverlapClasses selectedTaxonomy={selectedTaxonomy} /></div>
                }
            </div>
        </div>
    )
}

export default SaveTaxomony