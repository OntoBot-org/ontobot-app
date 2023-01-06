import React, { useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { VscCircleFilled } from 'react-icons/vsc'

const DisjointClsList = ({ isDisjointSaved }) => {

    const selectedTaxonomy = useSelector(store => store.selectedTaxonomy)
    const taxonomies = useSelector(store => store.taxonomies)

    const [disjointClsSets, setdisjointClsSets] = useState([])

    useEffect(() => {
        const getDisjointClassSets = (taxonomyObj) => {
            if (taxonomyObj.id === selectedTaxonomy.id) {
                if (taxonomyObj.hasOwnProperty('disjoint')) {
                    setdisjointClsSets(taxonomyObj.disjoint)
                }
            } else {
                if (taxonomyObj.hasOwnProperty('subclasses')) {
                    taxonomyObj.subclasses?.map(subCls => getDisjointClassSets(subCls))
                }
            }
        }
        
        getDisjointClassSets(taxonomies)
    }, [selectedTaxonomy, isDisjointSaved, taxonomies])

    return (
        <div>
            {
                disjointClsSets?.map((singleSet, index) => 
                    <div className='flex' key={index}>
                        <VscCircleFilled className='mt-1 mx-2 text-secondary' />
                        <li className='flex gap-2'>
                            { singleSet?.map((item, i) => 
                                <p key={i}>{item}, </p>
                            )}
                        </li>
                    </div>
                )
            }
        </div>
    )
}

export default DisjointClsList