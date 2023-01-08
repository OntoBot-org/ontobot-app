import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { AddProperties, SetDisjoinClasses } from '../components'
import SetOverlapClasses from './SetOverlapClasses'

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
            <p className="taxonomy-heading mb-4">Save Taxonomy details</p>

            <div className="grid grid-cols-3 gap-x-3 gap-y-6 text-fontcolor mb-6">
                <div className="font-semibold tracking-wide">Selected Class:</div>
                
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
                <AddProperties selectedTaxonomy={selectedTaxonomy} /> 
            }
            
            <div className="grid grid-cols-2 gap-2">
                { selectedTaxonomy.subclasses?.length > 1 && 
                    <SetDisjoinClasses selectedTaxonomy={selectedTaxonomy} />
                }

                { selectedTaxonomy.subclasses?.length > 1 && 
                    <SetOverlapClasses selectedTaxonomy={selectedTaxonomy} />
                }
            </div>
        </div>
    )
}

export default SaveTaxomony