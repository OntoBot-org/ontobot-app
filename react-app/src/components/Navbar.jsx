import React from 'react'
import { Link } from 'react-router-dom'

import Logo from '../images/ontobotLogo.png'

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow-lg z-50 flex items-center">
            <div className="container flex justify-between mx-10">
            
                <a href="/" className="">
                    <img src={Logo} className="mr-3 h-6 sm:h-9" alt="OntoBot Logo" />
                </a>

                <div className="flex mt-1">
                    <div className="" id="navbar-sticky">
                        <ul className="flex space-x-5">
                            <li>
                                <Link to='/vocabulary' className="nav_li" aria-current="page">Vocabulary</Link>
                            </li>
                            <li>
                                <Link to='/about' className="nav_li">About</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar