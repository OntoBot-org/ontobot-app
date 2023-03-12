import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiPlus } from 'react-icons/bi'
import { VscCircleFilled } from 'react-icons/vsc'
import { TbAlertTriangle } from 'react-icons/tb'

import { saveOverlapClasses } from '../features/taxonomies/taxonomySlice'
import { OverlappingClsList, Modal } from '../components'
import { MdDeleteOutline } from 'react-icons/md'

const SetOverlapClasses = ({selectedTaxonomy}) => {
    
    // const selectedTaxonomy = useSelector(store => store.selectedTaxonomy)
    const taxonomies = useSelector(store => store.taxonomies)

    const [isModalVisible, setisModalVisible] = useState(false)
    const [subclassesSet, setsubclassesSet] = useState(selectedTaxonomy.subclasses)
    const [disjointClasses, setdisjointClasses] = useState(selectedTaxonomy.disjoint)
    const [finalOverlapSet, setfinalOverlapSet] = useState(selectedTaxonomy.overlapList)
    const [newOverlapSet, setnewOverlapSet] = useState([])
    // const [isOverlapSaved, setisOverlapSaved] = useState(false)
    const [isAlertVisible, setisAlertVisible] = useState(false)
    const [alertMsg, setalertMsg] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {
        const fetchSubclasses = (taxonomyObj) => {
            if (taxonomyObj.id === selectedTaxonomy.id) {
                let taxonomySubClasses = []
                let taxonomyDisjointCls = []
                let taxonomyOverlapCls = []
                if (taxonomyObj.subclasses?.length > 1) {
                    taxonomyObj.subclasses.forEach((item) => {
                        taxonomySubClasses.push(item)
                    })
                    setsubclassesSet(taxonomySubClasses)
                }
                if (taxonomyObj.disjoint?.length > 1) {
                    taxonomyObj.disjoint.forEach((clsSet) => {
                        taxonomyDisjointCls.push(clsSet)
                    })
                    setdisjointClasses(taxonomyDisjointCls)
                }
                if (taxonomyObj.overlap?.length > 1) {
                    taxonomyObj.overlap.forEach((clsSet) => {
                        taxonomyOverlapCls.push(clsSet)
                    })
                    setfinalOverlapSet(taxonomyOverlapCls)
                }
            } else {
                if (taxonomyObj.hasOwnProperty('subclasses')) {
                    taxonomyObj.subclasses?.map(subCls => fetchSubclasses(subCls))
                }
            }
        }
        setfinalOverlapSet(selectedTaxonomy.overlap)
        fetchSubclasses(taxonomies)
    }, [taxonomies, selectedTaxonomy])
    

    const handleModalOpening = () => {
        setnewOverlapSet([])
        setisModalVisible(true)
    }

    const handleClassClick = (clickedCls) => {
        const classAvailable = newOverlapSet.filter(OverlapCls => OverlapCls === clickedCls)

        if (classAvailable.length !== 0) {
            setnewOverlapSet(newOverlapSet.filter(OverlapCls => OverlapCls !== clickedCls))
        } else {
            const newOverlapclsSet = [...newOverlapSet, clickedCls]
            setnewOverlapSet(newOverlapclsSet)
        }
    }

    const handleRemoveDisjointSet = (indexToRemove) => {
        const updateOverlapSet = finalOverlapSet.filter((item, index) => index !== indexToRemove);
        setfinalOverlapSet(updateOverlapSet);
    }

    const handleAddOverlapSet = () => {
        if (newOverlapSet.length < 2) {
            setalertMsg('Please add at least two overlapping classes')
            setisAlertVisible(true)

            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else {
            const numOfOverlapClasses = newOverlapSet.length
            let classAllowed = true
            
            disjointClasses.forEach((dcs) => {
                if (dcs.length === numOfOverlapClasses) {
                    if (newOverlapSet.every(element => dcs.includes(element))) {
                        classAllowed = false

                        setalertMsg('You have already declared this set as a disjoint set.')
                        setisAlertVisible(true)
            
                        setTimeout(() => {
                            setisAlertVisible(false)
                        }, 3000);
                    }
                }
            })
            
            finalOverlapSet.forEach((fos) => {
                if (fos.length === numOfOverlapClasses) {
                    if (newOverlapSet.every(element => fos.includes(element))) {
                        classAllowed = false

                        setalertMsg('No duplications are allowed.')
                        setisAlertVisible(true)
            
                        setTimeout(() => {
                            setisAlertVisible(false)
                        }, 3000);
                    }
                }
            })

            if (classAllowed) {
                setfinalOverlapSet([...finalOverlapSet, newOverlapSet])
            }
        }
    }

    const handleSaveOverlapClasses = () => {
        if (finalOverlapSet.length === 0) {
            setalertMsg('You have not added any classes to save.')
            setisAlertVisible(true)

            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else {
            dispatch(saveOverlapClasses({
                taxonomyId: selectedTaxonomy.id, 
                overlapList: finalOverlapSet
            }))
            setisModalVisible(false)
            // setisOverlapSaved(true)
        }
    }

    return (
        <div>
            <div className="text-fontcolor">
                <div className="flex">
                    <p className="mr-2 font-semibold tracking-wide">Overlapping classes</p>
                    { !taxonomies.submitted && <BiPlus className='cursor-pointer mt-1' onClick={handleModalOpening} />}
                </div>
                
                <ul className='w-full flex flex-col items-start justify-start text-sm'>
                    <OverlappingClsList 
                        // selectedTaxonomy={selectedTaxonomy}
                    />
                </ul>

                <Modal open={isModalVisible} onClose={() => setisModalVisible(false)}>
                    <p className="modal_title">
                        Save the overlap subclasses of <span className="font-bold text-secondary">{selectedTaxonomy.name}</span>.
                    </p>

                    { isAlertVisible && (
                        <div className="alert_style">
                            <TbAlertTriangle className='mr-2' />
                            <p>{alertMsg}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-4 mb-4 gap-6">
                        {
                            subclassesSet.length > 0 && subclassesSet?.map((subCls, index) => (
                                <div className="flex" key={index}>
                                    <input 
                                        id="default-checkbox" 
                                        type="checkbox" 
                                        value="" 
                                        className="mt-2 w-3 h-3 text-secondary bg-gray-100 rounded border-gray-300" 
                                        onClick={() => handleClassClick(subCls.name)}
                                    />
                                    <p className="ml-2" key={index}>{subCls.name}</p>
                                </div>
                            ))
                        }
                        <button 
                            className="secondary_btn_comp h-10 mr-0"
                            onClick={handleAddOverlapSet}
                        >
                            Add Overlap set
                        </button>
                    </div>

                    <div className="flex w-full">
                        <p className="font-semibold">Overlap class sets</p>
                    </div>

                    <ul className='w-full flex flex-col items-start justify-start text-sm'>
                        {/* { finalOverlapSet.length === 0 && <OverlappingClsList /> } */}
                        { finalOverlapSet.length > 0 && finalOverlapSet?.map((fds, index) => 
                            <div className='flex' key={index}>
                                <VscCircleFilled className='mt-1 mx-2 text-secondary' />
                                <li className='flex gap-2'>
                                    { fds?.map((item, i) => 
                                        <p key={i}>{item}, </p>
                                    )}
                                    <MdDeleteOutline 
                                    className="ml-2 cursor-pointer text-primary mt-1"
                                    onClick={()=>handleRemoveDisjointSet(index)}
                                    />
                                </li>
                            </div>
                        )}
                    </ul>

                    <div className="flex items-center justify-center mt-4 w-full">
                        <button 
                            className="primary_btn_comp h-10 mt-5" 
                            onClick={handleSaveOverlapClasses}
                        >
                            Save all
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default SetOverlapClasses