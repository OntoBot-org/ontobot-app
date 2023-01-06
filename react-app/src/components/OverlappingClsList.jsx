import React, { useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { VscCircleFilled } from 'react-icons/vsc'

const OverlappingClsList = ({ isOverlapSaved }) => {

    const selectedTaxonomy = useSelector(store => store.selectedTaxonomy)
    const taxonomies = useSelector(store => store.taxonomies)

    const [overlapClsSets, setoverlapClsSets] = useState([])

    useEffect(() => {
        const getOverlapClassSets = (taxonomyObj) => {
            if (taxonomyObj.id === selectedTaxonomy.id) {
                if (taxonomyObj.hasOwnProperty('overlap')) {
                    setoverlapClsSets(taxonomyObj.overlap)
                }
            } else {
                if (taxonomyObj.hasOwnProperty('subclasses')) {
                    taxonomyObj.subclasses?.map(subCls => getOverlapClassSets(subCls))
                }
            }
        }
        
        getOverlapClassSets(taxonomies)
    }, [selectedTaxonomy, isOverlapSaved, taxonomies])
    

    return (
        <div>
            {
                overlapClsSets?.map((overlapSet, index) => 
                    <div className='flex' key={index}>
                        <VscCircleFilled className='mt-1 mx-2 text-secondary' />
                        <li className='flex gap-2'>
                            { overlapSet?.map((item, i) => 
                                <p key={i}>{item}, </p>
                            )}
                        </li>
                    </div>
                )
            }
        </div>
    )
}

export default OverlappingClsList