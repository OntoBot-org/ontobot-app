import React, { useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { VscCircleFilled } from 'react-icons/vsc'

const PropertiesList = ({ isPropertiesSaved }) => {

    const selectedTaxonomy = useSelector(store => store.selectedTaxonomy)
    const taxonomies = useSelector(store => store.taxonomies)

    const [savedProperties, setsavedProperties] = useState([])

    useEffect(() => {
        const getAvailablePropertiesList = (taxonomyObj) => {
            if (taxonomyObj.id === selectedTaxonomy.id) {
                if (taxonomyObj.hasOwnProperty('propertiesList')) {
                    setsavedProperties(taxonomyObj.propertiesList)
                }
            } else {
                if (taxonomyObj.hasOwnProperty('subclasses')) {
                    taxonomyObj.subclasses?.map(subCls => getAvailablePropertiesList(subCls))
                }
            }
        }
        
        getAvailablePropertiesList(taxonomies)
    }, [selectedTaxonomy, isPropertiesSaved, taxonomies])

    return (
        <div className='grid grid-cols-3 gap-2'>
            {
                savedProperties.map((property) =>
                    <div className="flex" key={property.id}>
                        <VscCircleFilled className='mt-1 text-secondary' />
                        <p>{property.name}</p>
                    </div>
                )    
            }
        </div>
    )
}

export default PropertiesList