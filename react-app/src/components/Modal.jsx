import React from 'react'
// import { AiOutlineCloseCircle } from 'react-icons/ai'

const Modal = ({ children, open, onClose, fromTop='top-[25%]', fromLeft='left-[15%]' }) => {
    
    if(!open) return null
    
    return (
        <div className='w-full h-full'>
            <div className='fixed top-0 left-0 bottom-0 right-0 bg-gray-500 opacity-50' onClick={onClose} />

            <div 
                className={
                    `border p-4 flex flex-col items-end fixed z-1000 bg-white text-fontcolor 
                    rounded-md max-h-[90%] min-w-[50%] max-w-[90%]  ${fromLeft} ${fromTop}`
                }
            >
                <div className="w-full h-full flex flex-col items-start justify-start bg-white">
                    { children }
                </div>
            </div>
        </div>
    )
}

export default Modal