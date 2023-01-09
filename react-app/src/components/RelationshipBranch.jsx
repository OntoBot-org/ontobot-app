import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import { BiPlus } from 'react-icons/bi'
// import { BiPlus, BiEditAlt } from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md'
import { TbAlertTriangle } from 'react-icons/tb'

import { DeleteRelationshipModal, Modal, SearchSelect, UpdateRelationshipModal } from '../components'
import { resetRelationshipDetails, saveDomain, saveRanges, saveRelationshipTypes } from '../features/relationships/relationshipDetailsSlice'
import { saveSubrelationships } from '../features/relationships/relationshipSlice'

import { relationshipTypes } from '../data/relationshipTypes'

const RelationshipBranch = ({ relationship, titleStyle='taxonomy-name' }) => {

    const taxonomies = useSelector(store => store.taxonomies)
    const relationshipDetails = useSelector(store => store.relationshipDetails)
    const relationships = useSelector(store => store.relationships)
    
    const [branchVisiblity, setbranchVisiblity] = useState(true)
    const [isModalVisible, setisModalVisible] = useState(false)
    const [isAlertVisible, setisAlertVisible] = useState(false)
    const [isUpdateModalVisible, setisUpdateModalVisible] = useState(false)
    const [isDeleteModalVisible, setisDeleteModalVisible] = useState(false)
    const [alertMsg, setalertMsg] = useState('')
    const [domainsList, setdomainsList] = useState([])
    const [availableSubrelationships, setavailableSubrelationships] = useState([])
    const [newRelationship, setnewRelationship] = useState({
        id: v4(),
        relationshipLabel: '',
        inverse: '',
        equivalentName: '',
    })

    const dispatch = useDispatch()

    let fetchedDomains = []

    useEffect(() => {
        setavailableSubrelationships([])

        const getAvailableSubrelationships = (relationshipObj) => {
            if (relationshipObj.id === relationship.id) {
                if (relationshipObj.hasOwnProperty('subrelationships')) {
                    setavailableSubrelationships(relationshipObj.subrelationships)
                }
            } else {
                if (relationshipObj.hasOwnProperty('subrelationships')) {
                    relationshipObj.subrelationships?.map(subrelationship => getAvailableSubrelationships(subrelationship))
                }
            }
        }

        getAvailableSubrelationships(relationships)
    }, [relationships, relationship])
    
    const getAvailableDomains = (taxonomyObj) => {
        if (taxonomyObj.subclasses?.length > 0) {
            taxonomyObj.subclasses.forEach((subCls) => {
                console.log('typeof(subCls.name): ', typeof(subCls.name))
                fetchedDomains.push({
                    id: subCls.id,
                    label: subCls.name,
                    value: subCls.name
                })
                setdomainsList(fetchedDomains)
                getAvailableDomains(subCls)
            })
        }
    }

    const handleBranchVisibility = () => {
        setbranchVisiblity(!branchVisiblity)
    }

    const handleAddRelationship = () => {
        handleCancel()
        fetchedDomains = []
        getAvailableDomains(taxonomies)
        setisModalVisible(true)
        setbranchVisiblity(true)
    }

    // const handleUpdateRelationship = () => {
    //     fetchedDomains = []
    //     getAvailableDomains(taxonomies)
    //     handleCancel()
    //     setisUpdateModalVisible(true)
    // }

	const handleKeyDown = (event) => {
		if (event) {
            if (event.key === 'Enter') {
                handleSaveRelationship()
            }
        } else {
            console.log('No event is passed')
        }
    }

    const handleSaveRelationship = () => {
        if (newRelationship.relationshipLabel === '') {
            setisAlertVisible(true)
            setalertMsg('Please note that Relationship Label field is required.')
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else if (relationshipDetails.domain === '') {
            setisAlertVisible(true)
            setalertMsg('Please select a domain.')
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else if (relationshipDetails.ranges.length === 0) {
            setisAlertVisible(true)
            setalertMsg('Please select a range.')
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else if (relationshipDetails.relationshipTypes.length === 0) {
            setisAlertVisible(true)
            setalertMsg('Please select at leaset one relationship type.')
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else {
            let nameDuplication = availableSubrelationships.filter(subRelation => subRelation.relationshipLabel === newRelationship.relationshipLabel)

            if (nameDuplication.length > 0) {
                setisAlertVisible(true)
                setalertMsg('Relationship label cannot be duplicated.')
                setTimeout(() => {
                    setisAlertVisible(false)
                }, 3000);
            }
            else {
                let finalRanges = []
                let finalTypes = []
                
                relationshipDetails.ranges.forEach((range) => {
                    if (!finalRanges.includes(range)) {
                        finalRanges.push(range)
                    }
                })
                relationshipDetails.relationshipTypes.forEach((type) => {
                    if (!finalTypes.includes(type)) {
                        finalTypes.push(type)
                    }
                })

                dispatch(saveSubrelationships({
                    id: newRelationship.id, 
                    relationshipLabel: newRelationship.relationshipLabel, 
                    inverse: newRelationship.inverse, 
                    equivalentLabel: newRelationship.equivalentName, 
                    domain: relationshipDetails.domain, 
                    // range: relationshipDetails.range, 
                    ranges: finalRanges, 
                    type: finalTypes,
                    parentId: relationship.id
                }))
                console.log('relationships: ', relationships)
                setnewRelationship({
                    id: v4(),
                    relationshipLabel: '',
                    inverse: '',
                    equivalentName: '',
                })
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

    const onClose = () => {
        handleCancel()
        setnewRelationship({
            id: v4(),
            relationshipLabel: '',
            inverse: '',
            equivalentName: '',
        })
        setisModalVisible(false)
    }

    return (
        <div key={relationship.id} className="text-fontcolor">
            <div className="flex mt-1 text-fontcolor tracking-wider">
                <span className="w-4 h-4 border-l-2 border-b-2 mr-1" onClick={() => setbranchVisiblity(!branchVisiblity)}></span>
                <p 
                    className={titleStyle} 
                    onClick={handleBranchVisibility}
                >
                    {relationship.relationshipLabel}
                </p>
                {
                    relationship.relationshipLabel !== 'relationships' && <>
                        {/* <BiEditAlt 
                            className='ml-2 cursor-pointer' 
                            onClick={handleUpdateRelationship}
                        /> */}
                        <MdDeleteOutline 
                            className='ml-2 cursor-pointer text-primary' 
                            onClick={() => {
                                handleCancel()
                                setisDeleteModalVisible(true)
                            }}
                        />
                    </>
                }
                <BiPlus 
                    className='ml-2 cursor-pointer' 
                    onClick={handleAddRelationship}
                />
            </div>

            { branchVisiblity && relationship?.subrelationships?.map((child) => (
                <div className="pl-4" key={child.id}>
                    <RelationshipBranch relationship={child} />
                </div>
            ))}

            <Modal open={isModalVisible} onClose={onClose} fromTop="top-[15%]" fromLeft='left-[35%]'>
                <p className="modal_title">
                    Add sub-relationships to <span className="font-bold text-secondary">{relationship.relationshipLabel}</span>.
                </p>

                { isAlertVisible && (
                    <div className="alert_style">
                        <TbAlertTriangle className='mr-2' />
                        <p>{alertMsg}</p>
                    </div>
                )}

                <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <p className="mb-1">Relationship label* </p>
                            <input 
                                type="text" 
                                className="border p-2 rounded-sm"
                                value={newRelationship.relationshipLabel}
                                placeholder='growsIn' 
                                onChange={(e) => setnewRelationship({...newRelationship, relationshipLabel: e.target.value})}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="flex flex-col">
                            <p className="mb-1">Inverse </p>
                            <input 
                                type="text" 
                                className="border p-2 rounded-sm"
                                value={newRelationship.inverse}
                                placeholder='notGrowsIn' 
                                onChange={(e) => setnewRelationship({...newRelationship, inverse: e.target.value})}
                            />
                        </div>

                        <div className="flex flex-col">
                            <p className="mb-1">Equivalent name </p>
                            <input 
                                type="text" 
                                className="border p-2 rounded-sm"
                                value={newRelationship.equivalentName}
                                placeholder='suitableFor' 
                                onChange={(e) => setnewRelationship({...newRelationship, equivalentName: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col col-span-1">
                            <p className="mb-1">Domain* </p>
                            <SearchSelect 
                                optionList={domainsList} 
                                reducerFunction={saveDomain}
                                relationshipId={newRelationship.id}
                            />
                        </div>

                        <div className="flex flex-col col-span-2">
                            <p className="mb-1">Range(s)* </p>
                            <SearchSelect 
                                optionList={domainsList} 
                                reducerFunction={saveRanges}
                                isMultiSelect={true} 
                            />
                            {/* <SearchSelect 
                                optionList={domainsList} 
                                reducerFunction={saveRange}
                                relationshipId={newRelationship.id}
                            /> */}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <p className="mb-1">Relationship Type(s)* </p>
                            <SearchSelect 
                                optionList={relationshipTypes} 
                                isMultiSelect={true} 
                                reducerFunction={saveRelationshipTypes} 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center mt-4 w-full">
                    <button 
                        className="secondary_btn_comp"
                        onClick={handleSaveRelationship}
                    >
                        Save relationship
                    </button>

                    <button 
                        className="primary_btn_comp"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </Modal>

            {
                isDeleteModalVisible &&
                <DeleteRelationshipModal 
                    open={isDeleteModalVisible} 
                    onClose={() => setisDeleteModalVisible(false)} 
                    relationship={relationship} 
                />
            }

            {
                isUpdateModalVisible &&
                <UpdateRelationshipModal 
                    open={isUpdateModalVisible} 
                    onClose={() => {
                        setisUpdateModalVisible(false)
                        handleCancel()
                    }} 
                    relationship={relationship} 
                    domainsList={domainsList}
                />
            }
        </div>
    )
}

export default RelationshipBranch