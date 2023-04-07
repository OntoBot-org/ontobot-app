import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { IoCheckmarkCircle, IoWarning } from 'react-icons/io5'

import Modal from './Modal'

const ResponseModal = ({ onOpen, onClose, responseType, responseTitle, reponseMsg }) => {

    return (
        <Modal open={onOpen} onClose={onClose}>
            <div className="w-full flex items-center justify-end">
                <AiOutlineCloseCircle 
                    onClick={onClose} 
                    className='modal_close_icon' 
                />
            </div>

            <div className="w-full text-center">
                <div className="flex items-center justify-center gap-2">
                    {
                        responseType==='success' ? 
                            <IoCheckmarkCircle className='text-lg text-secondary' /> 
                            : <IoWarning className='text-lg text-primary' />
                    }
                    <p className={`font-semibold text-lg ${responseType==='success' ? 'text-secondary' : 'text-primary'} `}>
                        {responseTitle}
                    </p>
                </div>
                <p className="mt-4">{reponseMsg}</p>

                <button 
                    className={`${responseType==='success' ? 'secondary_btn' : 'primary_btn'} h-fit mt-4`}
                    onClick={onClose}
                >
                    Noted
                </button>
            </div>
        </Modal>
    )
}

export default ResponseModal