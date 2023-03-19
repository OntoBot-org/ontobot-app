import React from 'react'
import { useDispatch } from 'react-redux'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { TbAlertTriangle } from 'react-icons/tb'

import Modal from './Modal'
import { removeRelationship } from '../features/relationships/relationshipSlice'

const DeleteRelationshipModal = ({ open, onClose, relationship }) => {

    const dispatch = useDispatch()

    const handleRemoveRelationship = () => {
        dispatch(removeRelationship({
            id: relationship.id
        }))
        onClose()
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-between w-full mb-2">
                <p className="modal_title text-primary">Are you sure that you want to remove the relationship?</p>
                <AiOutlineCloseCircle 
                    onClick={onClose} 
                    className='modal_close_icon' 
                />
            </div>

            { relationship?.subrelationships?.length > 0 && (
                <div className="alert_style">
                    <TbAlertTriangle className='mr-2' />
                    <p>All of the sub-relationships of {relationship.relationshipLabel} will be removed as well.</p>
                </div>
            )}

            <div className="flex w-full items-center justify-center mt-4">
                <button className='primary_btn_comp h-10' onClick={handleRemoveRelationship}>
                    Remove
                </button>

                <button className='secondary_btn_comp h-10' onClick={onClose}>
                    Cancel
                </button>
            </div>
        </Modal>
    )
}

export default DeleteRelationshipModal