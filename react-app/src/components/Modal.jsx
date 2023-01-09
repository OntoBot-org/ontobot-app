import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

// function MyButton(props) {
//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       // the enter key was pressed, so trigger the button click event
//       event.currentTarget.click();
//     }
//   };

//   return (
//     <button onClick={props.onClick} onKeyDown={handleKeyDown}>
//       {props.children}
//     </button>
//   );
// }

const Modal = ({ children, open, onClose, fromTop='top-[25%]', fromLeft='left-[15%]' }) => {
    
    if(!open) return null
    
    return (
        <div className='w-full'>
            <div className='fixed top-0 left-0 bottom-0 right-0 bg-gray-500 opacity-50' onClick={onClose} />

            <div className={`border p-4 flex flex-col items-end fixed z-1000 bg-white text-fontcolor rounded-md max-h-[70%] ${fromLeft} ${fromTop}`}>
                <AiOutlineCloseCircle onClick={onClose} className='mt-1 cursor-pointer text-primary hover:text-white hover:bg-primary rounded-full hover:shadow-lg' />
                { children }
            </div>
        </div>
    )
}

export default Modal