import React from 'react'
import { useSelector } from 'react-redux'

import { RelationshipCage, TaxonomyCage } from '../components'

const TryOntoBot = () => {

    const taxonomies = useSelector(store => store.taxonomies)

    return (
        <div className='snap-y scroll-smooth'>
            <section id='taxonomycage' className="snap-start">
                <TaxonomyCage />
            </section>
{/* 
            {
                taxonomies.submitted && */}
                    <section id='relationshipcage' className="snap-start">
                        <RelationshipCage />
                    </section>
            {/* } */}
        </div>
    )
}

export default TryOntoBot