import React from 'react'

import { Header, IntroCard } from '../components'

import { introCardDetails } from '../data/introcardDetails'

const Home = () => {
    return (
        <div className='text-justify mt-20'>
            <Header />

            <div className="grid grid-cols-12 gap-5 mt-0 mb-10" >
                {
                    introCardDetails.map((card, index) => (
                        <IntroCard 
                            key = {index} 
                            title = {card.title}
                            description = {card.description}
                            icon = {card.icon}
                            directionTop = {card.directionTop}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Home