import React from 'react'
import { IconContext } from "react-icons";
import { motion } from "framer-motion"

const IntroCard = ({ description, icon, title }) => {
    return (
        <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='border text-center col-span-4 hover:shadow-lg'
        >
            <div className="flex flex-col items-center justify-center my-4">
                <IconContext.Provider value={{ className: "w-8 h-8 text-secondary" }}>
                    {icon}
                </IconContext.Provider>

                <p className="font-semibold text-fontcolor text-lg my-2"> { title } </p>

                <p className="px-4 text-fontcolor"> { description } </p>
            </div>
        </motion.div>
    )
}

export default IntroCard