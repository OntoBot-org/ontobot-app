import React from 'react'
import { useDispatch } from 'react-redux'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { TbAlertTriangle } from 'react-icons/tb'

import { removeTaxonomy } from '../features/taxonomies/taxonomySlice'
import Modal from './Modal'

const DeleteTaxonomyModal = ({ open, onClose, taxonomy }) => {

    const dispatch = useDispatch()

    const handleRemoveTaxonomy = () => {
        dispatch(removeTaxonomy({
            id: taxonomy.id
        }))
        onClose()
    }

    return (
        <Modal open={open} onClose={onClose} fromLeft='left-[25%]'>
            <div className="flex items-center justify-between w-full mb-2">
                <p className="modal_title text-primary">Are you sure that you want to remove  the class?</p>
                <AiOutlineCloseCircle 
                    onClick={onClose} 
                    className='modal_close_icon' 
                />
            </div>

            { taxonomy?.subclasses?.length > 0 && (
                <div className="alert_style">
                    <TbAlertTriangle className='mr-2' />
                    <p>All of the subclasses of {taxonomy.name} will be removed as well.</p>
                </div>
            )}

            <div className="flex w-full items-center justify-center mt-4">
                <button className='primary_btn_comp h-10' onClick={handleRemoveTaxonomy}>
                    Remove
                </button>

                <button className='secondary_btn_comp h-10' onClick={onClose}>
                    Cancel
                </button>
            </div>
        </Modal>
    )
}

export default DeleteTaxonomyModal