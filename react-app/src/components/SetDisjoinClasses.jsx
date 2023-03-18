import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BiPlus } from 'react-icons/bi'
import { TbAlertTriangle } from 'react-icons/tb'
import { VscCircleFilled } from 'react-icons/vsc'

import { saveDisjointClasses } from '../features/taxonomies/taxonomySlice'
import { DisjointClsList, Modal } from '../components'

const SetDisjoinClasses = ({selectedTaxonomy}) => {
    
    const taxonomies = useSelector(store => store.taxonomies)
    // const selectedTaxonomy = useSelector(store => store.selectedTaxonomy)

    const [isModalVisible, setisModalVisible] = useState(false)
    const [subclassesSet, setsubclassesSet] = useState(selectedTaxonomy.subclasses)
    const [finalDisjointSet, setfinalDisjointSet] = useState(selectedTaxonomy.disjoint)
    const [overlapClasses, setoverlapClasses] = useState(selectedTaxonomy.overlapList)
    const [newDisjointSet, setnewDisjointSet] = useState([])
    const [isDisjointSaved, setisDisjointSaved] = useState(false)
    const [isAlertVisible, setisAlertVisible] = useState(false)
    const [alertMsg, setalertMsg] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {
        setfinalDisjointSet(selectedTaxonomy.disjoint)
        const fetchSubclasses = (taxonomyObj) => {
            if (taxonomyObj.id === selectedTaxonomy.id) {
                let taxonomySubClasses = []
                let taxonomyOverlapCls = []
                let taxonomyDisjointCls = []
                if (taxonomyObj.subclasses?.length > 1) {
                    taxonomyObj.subclasses.forEach((item) => {
                        taxonomySubClasses.push(item)
                    })
                    setsubclassesSet(taxonomySubClasses)
                }
                if (taxonomyObj.overlap?.length > 1) {
                    taxonomyObj.overlap.forEach((clsSet) => {
                        taxonomyOverlapCls.push(clsSet)
                    })
                    setoverlapClasses(taxonomyOverlapCls)
                }
                if (taxonomyObj.disjoint?.length > 1) {
                    taxonomyObj.disjoint.forEach((clsSet) => {
                        taxonomyDisjointCls.push(clsSet)
                    })
                    setfinalDisjointSet(taxonomyDisjointCls)
                }
            } else {
                if (taxonomyObj.hasOwnProperty('subclasses')) {
                    taxonomyObj.subclasses?.map(subCls => fetchSubclasses(subCls))
                }
            }
        }
        fetchSubclasses(taxonomies)
    }, [taxonomies, selectedTaxonomy, isModalVisible])

    const handleModalOpening = () => {
        setnewDisjointSet([])
        setisModalVisible(true)
    }

    const handleClassClick = (clickedCls) => {
        const classAvailable = newDisjointSet.filter(disjointCls => disjointCls === clickedCls)

        if (classAvailable.length !== 0) {
            setnewDisjointSet(newDisjointSet.filter(disjointCls => disjointCls !== clickedCls))
        } else {
            const newDijointClsSet = [...newDisjointSet, clickedCls]
            setnewDisjointSet(newDijointClsSet)
        }
    }

    const handleAddDisjointSet = () => {
        if (newDisjointSet.length < 2) {
            setalertMsg('Please add at least two disjoint classes.')
            setisAlertVisible(true)

            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else {
            const numOfDisjointClasses = newDisjointSet.length
            let classAllowed = true

            overlapClasses.forEach((ocs) => {
                if (ocs.length === numOfDisjointClasses) {
                    if (newDisjointSet.every(element => ocs.includes(element))) {
                        classAllowed = false

                        setalertMsg('You have already declared this set as an overlapping set.')
                        setisAlertVisible(true)
            
                        setTimeout(() => {
                            setisAlertVisible(false)
                        }, 3000);
                    }
                }
            })
            
            finalDisjointSet.forEach((fds) => {
                if (fds.length === numOfDisjointClasses) {
                    if (newDisjointSet.every(element => fds.includes(element))) {
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
                setfinalDisjointSet([...finalDisjointSet, newDisjointSet])
            }
        }
    }

    const handleSaveDisjointClasses = () => {
        if (finalDisjointSet.length === 0) {
            setalertMsg('You have not added any classes to save.')
            setisAlertVisible(true)

            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else {
            dispatch(saveDisjointClasses({
                taxonomyId: selectedTaxonomy.id, 
                disjointList: finalDisjointSet
            }))
            setisModalVisible(false)
            setisDisjointSaved(true)
        }
    }

    return (
        <div>
            <div className="text-fontcolor">
                <div className="flex">
                    <p className="mr-2 font-semibold tracking-wide">Disjoint classes</p>
                    { !taxonomies.submitted && <BiPlus className='cursor-pointer mt-1' onClick={handleModalOpening} /> }
                </div>

                <ul className='w-full flex flex-col items-start justify-start text-sm'>
                    <DisjointClsList 
                        // selectedTaxonomy={selectedTaxonomy} 
                        isDisjointSaved={isDisjointSaved}
                    />
                </ul>
            </div>

            <Modal open={isModalVisible} onClose={() => setisModalVisible(false)}>
                <div className="flex items-center justify-between w-full mb-2">
                    <p className="modal_title">
                        Save the disjoint subclasses of <span className="font-bold text-secondary">{selectedTaxonomy.name}</span>
                    </p>
                    <AiOutlineCloseCircle 
                        onClick={() => setisModalVisible(false)} 
                        className='modal_close_icon' 
                    />
                </div>

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
                        onClick={handleAddDisjointSet}
                    >
                        Add Disjoint set
                    </button>
                </div>

                <div className="flex w-full">
                    <p className="font-semibold">Disjoint class sets of {selectedTaxonomy.name}</p>
                </div>

                <ul className='w-full flex flex-col items-start justify-start text-sm'>
                    { finalDisjointSet.length > 0 && finalDisjointSet?.map((fds, index) => 
                        <div className='flex' key={index}>
                            <VscCircleFilled className='mt-1 mx-2 text-secondary' />
                            <li className='flex gap-2'>
                                { fds?.map((item, i) => 
                                    <p key={i}>{item}, </p>
                                )}
                            </li>
                        </div>
                    )}
                    {/* <DisjointClsList /> */}
                </ul>

                <div className="flex items-center justify-center mt-4 w-full">
                    <button 
                        className="primary_btn_comp h-10 mt-5" 
                        onClick={handleSaveDisjointClasses}
                    >
                        Save all
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default SetDisjoinClasses