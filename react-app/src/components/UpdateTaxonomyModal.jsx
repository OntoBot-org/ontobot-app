import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiChevronDown } from 'react-icons/bi'
import { TbAlertTriangle } from 'react-icons/tb'

import Modal from './Modal'
import { stereotypes } from '../data/stereotypes'
import { updateTaxonomy } from '../features/taxonomies/taxonomySlice'

const UpdateTaxonomyModal = ({ open, onClose, taxonomy }) => {

    const taxonomies = useSelector(store => store.taxonomies)

    const [isDropdownVisible, setisDropdownVisible] = useState(false)
    const [isAlertVisible, setisAlertVisible] = useState(false)
    const [alertMsg, setalertMsg] = useState('')
    const [selectedStereotype, setselectedStereotype] = useState(taxonomy.stereotype)
    const [availableSubclasses, setavailableSubclasses] = useState([])
    const [updatingTaxonomy, setupdatingTaxonomy] = useState({
        name: taxonomy.name,
        stereotype: taxonomy.stereotype,
        equivalentClass: taxonomy.equivalentClass,
    })

    const dispatch = useDispatch()

    useEffect(() => {
        const findTaxonomy = (taxonomyObj) => {
            if (taxonomy.id === taxonomyObj.id) {
                return
            } else {
                if (taxonomyObj.subclasses.length > 0) {
                    setavailableSubclasses(taxonomyObj.subclasses)
                    taxonomyObj.subclasses?.map(subCls => findTaxonomy(subCls))
                }
            }
        }

        findTaxonomy(taxonomies)
    }, [taxonomy, taxonomies])

    const handleUpdateTaxonomy = () => {
        if (updatingTaxonomy.name?.length === 0) {
            setisAlertVisible(true)
            setalertMsg('Please note that Class name field is required.')

            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else {
            let nameDuplication = availableSubclasses.filter(subCls => 
                subCls.name === updatingTaxonomy.name && subCls.id !== taxonomy.id
            )
            
            if (nameDuplication.length > 0) {
                setisAlertVisible(true)
                setalertMsg('Class name already exists.')

                setTimeout(() => {
                    setisAlertVisible(false)
                }, 3000);
            }
            else {
                dispatch(updateTaxonomy({
                    id: taxonomy.id,
                    name: updatingTaxonomy.name,
                    stereotype: updatingTaxonomy.stereotype,
                    equivalentClass: updatingTaxonomy.equivalentClass,
                }))
                onClose()
            }
        }
    }

    return (
        <Modal open={open} onClose={onClose} fromLeft='left-[25%]'>
            <p className="modal_title">
                Update the class <span className="font-bold text-primary">{taxonomy.name}</span>.
            </p>

            { isAlertVisible && (
                <div className="alert_style">
                    <TbAlertTriangle className='mr-2' />
                    <p>{alertMsg}</p>
                </div>
            )}

            <div className="flex flex-col">
                <div className="flex gap-6 items-end">
                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col gap-2">
                            <p>Class name*:</p>
                            <input 
                                type="text" 
                                className="p-2 border border-gray-300 rounded-md outline-secondary"  
                                placeholder='Crop'
                                value={updatingTaxonomy.name}
                                onChange={(e) => setupdatingTaxonomy({...updatingTaxonomy, name: e.target.value})} 
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <p>Stereotype*:</p>
                            <div className="custom-dropdown relative w-28">
                                <div 
                                    className="custom-dropdown-selection bg-white rounded-md cursor-pointer p-2 border w-full outline-secondary"
                                    onClick={() => {
                                        setisDropdownVisible(!isDropdownVisible)
                                    }}
                                >
                                    {
                                        selectedStereotype !== '' && (
                                            <p className='flex items-center justify-between'> 
                                                {selectedStereotype} 
                                                <BiChevronDown />
                                            </p>
                                        )
                                    }
                                </div>

                                <div className="items-holder rounded-md bg-white absolute top-[100%] mt-2 border w-full">
                                    {
                                        isDropdownVisible && stereotypes.map((item) =>(
                                            <div 
                                                className="dropdown-item p-2 cursor-pointer hover:bg-slate-200" 
                                                key={item.id}
                                                onClick={() => {
                                                    setselectedStereotype(item.name)
                                                    setisDropdownVisible(false)
                                                    setupdatingTaxonomy({...updatingTaxonomy, stereotype: item.name})
                                                }}
                                            >
                                                {
                                                    item.name !== selectedStereotype && <p>{item.name}</p>
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p>Equivalent Class:</p>
                            <input 
                                type="text" 
                                className="p-2 border border-gray-300 rounded-md outline-secondary" 
                                placeholder='Plant'
                                value={updatingTaxonomy.equivalentClass}
                                onChange={(e) => setupdatingTaxonomy({...updatingTaxonomy, equivalentClass: e.target.value})} 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex w-full items-center justify-center mt-4">
                    <button className='primary_btn_comp h-10' onClick={handleUpdateTaxonomy}>
                        Update
                    </button>

                    <button className='secondary_btn_comp h-10' onClick={onclose}>
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default UpdateTaxonomyModal