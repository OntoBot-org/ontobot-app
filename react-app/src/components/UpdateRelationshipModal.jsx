import React, { useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { TbAlertTriangle } from 'react-icons/tb'

import { SearchSelect, Modal } from '../components'
import { saveDomain, saveRange, saveRelationshipTypes, resetRelationshipDetails } from '../features/relationships/relationshipDetailsSlice'
import { updateRelationship } from '../features/relationships/relationshipSlice'

import { relationshipTypes } from '../data/relationshipTypes'

const UpdateRelationshipModal = ({ domainsList, open, onClose, relationship }) => {
    
    const relationshipDetails = useSelector(store => store.relationshipDetails)
    const relationships = useSelector(store => store.relationships)

    const dispatch = useDispatch()

    const [isAlertVisible, setisAlertVisible] = useState(false)
    const [alertMsg, setalertMsg] = useState('')
    const [availableSubRelationships, setavailableSubRelationships] = useState([])
    const [savedRelationshipTypes, setsavedRelationshipTypes] = useState([])
    const [updatedRelationship, setupdatedRelationship] = useState({
        id: relationship.id, 
        relationshipLabel: relationship.relationshipLabel, 
        inverse: relationship.inverse, 
        equivalentLabel: relationship.equivalentLabel, 
        domain: relationship.domain, 
        range: relationship.range, 
        type: relationship.type
    })
    
    useEffect(() => {
        const getAvailableSubrelationships = (relationshipObj) => {
            if (relationshipObj.id === relationship.id) {
                if (relationshipObj.hasOwnProperty('subrelationships')) {
                    setavailableSubRelationships(relationshipObj.subrelationships)
                }
            } else {
                if (relationshipObj.hasOwnProperty('subrelationships')) {
                    relationshipObj.subrelationships?.map(subrelationship => getAvailableSubrelationships(subrelationship))
                }
            }
        }

        getAvailableSubrelationships(relationships)
    }, [relationships, relationship])

    useEffect(() => {
        let fetchedTypes = []

        relationship.type?.forEach((relation) => {
            const newType = {
                label: relation,
                value: relation
            }
            fetchedTypes = [...fetchedTypes, newType]
        })
        fetchedTypes.filter((type, index, self) => 
            index === self.findIndex(t => t.label === type.label)
        )
        setsavedRelationshipTypes(fetchedTypes)
    }, [relationship])

    const handleUpdateRelationship = () => {
        if (updatedRelationship.relationshipLabel === '') {
            setisAlertVisible(true)
            setalertMsg('Please note that Relationship Label field is required.')
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else {
            let nameDuplication = availableSubRelationships.filter(subCls => subCls.relationshipLabel === updatedRelationship.relationshipLabel)

            if (nameDuplication.length > 0) {
                setisAlertVisible(true)
                setalertMsg('Relationship label cannot be duplicated.')
                setTimeout(() => {
                    setisAlertVisible(false)
                }, 3000);
            } else {
                let domain = ''
                let range = ''
                let type = []

                domain = relationshipDetails.domain === '' ? updatedRelationship.domain : relationshipDetails.domain
                range = relationshipDetails.range === '' ? updatedRelationship.range : relationshipDetails.range
                type = relationshipDetails.type === '' || relationshipDetails.type === [] ? updatedRelationship.type : relationshipDetails.type

                dispatch(updateRelationship({
                    id: relationship.id,
                    relationshipLabel: updatedRelationship.relationshipLabel,
                    inverse: updatedRelationship.inverse,
                    equivalentLabel: updatedRelationship.equivalentLabel,
                    domain: domain,
                    range: range,
                    type: type,
                }))
                handleCancel()
                onClose()
            }
        }
    }

    const handleCancel = () => {
        dispatch(resetRelationshipDetails({
            id: '', 
            domain: '', 
            range: '', 
            relationshipTypes: []
        }))
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-between w-full mb-2">
                <p className="modal_title">
                    Update the sub-relationship <span className="font-bold text-secondary">{relationship.relationshipLabel}</span>.
                </p>
                <AiOutlineCloseCircle 
                    onClick={onClose} 
                    className='modal_close_icon' 
                />
            </div>

            { isAlertVisible && (
                <div className="alert_style">
                    <TbAlertTriangle className='mr-2' />
                    <p>{alertMsg}</p>
                </div>
            )}

            <div className="flex gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <p className="mb-1">Relationship label*: </p>
                        <input 
                            type="text" 
                            className="border p-2 rounded-sm"
                            value={updatedRelationship.relationshipLabel}
                            placeholder='growsIn' 
                            onChange={(e) => setupdatedRelationship({...updatedRelationship, relationshipLabel: e.target.value})}
                        />
                    </div>

                    <div className="flex flex-col">
                        <p className="mb-1">Domain*: </p>
                        <SearchSelect 
                            optionList={domainsList} 
                            reducerFunction={saveDomain}
                            relationshipId={updatedRelationship.id}
                            selectedChoice={{
                                label: updatedRelationship.domain,
                                value: updatedRelationship.domain
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-col  gap-4">
                    <div className="flex flex-col">
                        <p className="mb-1">Inverse: </p>
                        <input 
                            type="text" 
                            className="border p-2 rounded-sm"
                            value={updatedRelationship.inverse}
                            placeholder='isGrownBy' 
                            onChange={(e) => setupdatedRelationship({...updatedRelationship, inverse: e.target.value})}
                        />
                    </div>

                    <div className="flex flex-col">
                        <p className="mb-1">Range*: </p>
                        <SearchSelect 
                            optionList={domainsList} 
                            reducerFunction={saveRange}
                            relationshipId={updatedRelationship.id}
                            selectedChoice={{
                                label: updatedRelationship.range,
                                value: updatedRelationship.range
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-col  gap-4">
                    <div className="flex flex-col">
                        <p className="mb-1">Equivalent name: </p>
                        <input 
                            type="text" 
                            className="border p-2 rounded-sm"
                            value={updatedRelationship.equivalentLabel}
                            placeholder='suitableFor' 
                            onChange={(e) => setupdatedRelationship({...updatedRelationship, equivalentLabel: e.target.value})}
                        />
                    </div>

                    <div className="flex flex-col">
                        <p className="mb-1">Type* </p>
                        <SearchSelect 
                            optionList={relationshipTypes} 
                            isMultiSelect={true} 
                            reducerFunction={saveRelationshipTypes} 
                            selectedChoice={savedRelationshipTypes}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center mt-4 w-full">
                <button 
                    className="secondary_btn_comp"
                    onClick={handleUpdateRelationship}
                >
                    Save updates
                </button>

                <button 
                    className="primary_btn_comp"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </div>
        </Modal>
    )
}

export default UpdateRelationshipModal