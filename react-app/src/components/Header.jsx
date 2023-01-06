import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion"

import BannerImg from '../images/ontobotBanner.png'

const Header = () => {
    return (
        <div className='grid grid-cols-12'>
            <div className="col-span-5 py-5 pr-10">
                <img 
                    src={BannerImg}
                    alt="OntoBot Banner" 
                />
            </div>

            <div className="col-span-7 text-left mt-16">
                <p className="text-6xl text-primary font-bold">
                    Let the Bot <span className='text-secondary'>Create the Ontology</span>.
                </p>

                <p className="text-4xl text-fontcolor mt-8">
                    Just submit your data, and wait for the result.
                </p>

                <div className="mt-10">
                    <Link to='/try-ontobot'>
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='primary_btn'
                        >
                            Try OntoBot
                        </motion.button>
                    </Link>
                    
                    <Link to='/documents'>
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='primary_btn_comp'
                        >
                            Learn More
                        </motion.button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Header