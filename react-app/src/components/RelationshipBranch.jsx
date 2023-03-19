import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BiPlus } from 'react-icons/bi'
// import { BiPlus, BiEditAlt } from 'react-icons/bi'
import { TbAlertTriangle } from 'react-icons/tb'
import { MdDeleteOutline, MdLiveHelp } from 'react-icons/md' 
import Driver from "driver.js"; 
import "driver.js/dist/driver.min.css"; 

import { DeleteRelationshipModal, Modal, SearchSelect, UpdateRelationshipModal } from '../components'
import { resetRelationshipDetails, saveDomain, saveRanges, saveRelationshipTypes } from '../features/relationships/relationshipDetailsSlice'
import { saveSubrelationships } from '../features/relationships/relationshipSlice'
import { relationshipTypes } from '../data/relationshipTypes'
import { tooltipDescriptions } from '../data/tooltipDescriptions'

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
            setisAlertVisible(true)
            setalertMsg('No event is passed.')
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
    }

    const takeAtour = () => {
		const driver = new Driver({
			animate: true,
			opacity: 0.50,
			allowClose: false,
			doneBtnText: "Finish",
			stageBackground: 'rgba(255, 255, 255, 0)',
		});
	  
		driver.defineSteps([
			{
				element: "#relationship_label",
				popover: {
					title: "Step 1: Give relationship label",
					description: tooltipDescriptions.relationship_label,
					position: "top",
				},
			},
			{
				element: "#inverse_relationship",
				popover: {
					title: "Step 2: Give the inverse",
					description: tooltipDescriptions.inverse_relationship,
					position: "top",
				},
			},
			{
				element: "#relationship_equivalentname",
				popover: {
					title: "Step 3: Give an equivalent name",
					description: tooltipDescriptions.relationship_equivalentname,
					position: "top",
				},
			},
			{
				element: "#relationship_domain",
				popover: {
					title: "Step 4: Select domain of the relationship",
					description: tooltipDescriptions.relationship_domain,
					position: "top",
				},
			},
			{
				element: "#relationship_ranges",
				popover: {
					title: "Step 5: Select ranges of the relationship",
					description: tooltipDescriptions.relationship_ranges,
					position: "top",
				},
			},
			{
				element: "#relationship_types",
				popover: {
					title: "Step 6: Select types of the relationship",
					description: tooltipDescriptions.relationship_types,
					position: "top",
				},
			},
			{
				element: "#save_relationshipdetails",
				popover: {
					title: "Step 7: Submit relationship details",
					description: tooltipDescriptions.save_relationshipdetails,
					position: "top",
				},
			},
		])

		driver.start();
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
// check duplications is not working
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
                    ranges: finalRanges, 
                    type: finalTypes,
                    parentId: relationship.id
                }))
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
        setisModalVisible(false)
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
                    className="cursor-pointer ml-2 bg-secondary text-white hover:bg-primary hover:text-white transition rounded-full text-lg"
                    onClick={handleAddRelationship}
                />
            </div>

            { branchVisiblity && relationship?.subrelationships?.map((child) => (
                <div className="pl-4" key={child.id}>
                    <RelationshipBranch relationship={child} />
                </div>
            ))}

            <Modal open={isModalVisible} onClose={onClose} fromTop="top-[15%]" fromLeft='left-[25%]'>
            <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center justify-between w-full mb-2">
                        <p className="modal_title">Add sub-relationships to <span className="font-bold text-secondary">{relationship.relationshipLabel}</span>. </p>
                        <AiOutlineCloseCircle 
                            onClick={onClose} 
                            className='modal_close_icon' 
                        />
                    </div>
                    <MdLiveHelp 
                        className="tour_icon" 
                        onClick={takeAtour}
                    />
                </div>

                { isAlertVisible && (
                    <div className="alert_style">
                        <TbAlertTriangle className='mr-2' />
                        <p>{alertMsg}</p>
                    </div>
                )}

                <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col" id='relationship_label'>
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

                        <div className="flex flex-col" id='inverse_relationship'>
                            <p className="mb-1">Inverse </p>
                            <input 
                                type="text" 
                                className="border p-2 rounded-sm"
                                value={newRelationship.inverse}
                                placeholder='isGrownBy' 
                                onChange={(e) => setnewRelationship({...newRelationship, inverse: e.target.value})}
                            />
                        </div>

                        <div className="flex flex-col" id='relationship_equivalentname'>
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
                        <div className="flex flex-col col-span-1" id='relationship_domain'>
                            <p className="mb-1">Domain* </p>
                            <SearchSelect 
                                optionList={domainsList} 
                                reducerFunction={saveDomain}
                                relationshipId={newRelationship.id}
                            />
                        </div>

                        <div className="flex flex-col col-span-2" id='relationship_ranges'>
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
                        <div className="flex flex-col" id='relationship_types'>
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
                        id='save_relationshipdetails'
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