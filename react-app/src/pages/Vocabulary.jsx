import React from 'react'

import { stereotypes } from '../data/stereotypes'

const Vocabulary = () => {
  return (
    <div className='w-full text-justify mt-20 mb-8'>
        {
            <div className="w-full flex flex-col gap-3 text-fontcolor">
                {
                    stereotypes.map((item, index) => (
                        <div>
                            <p className="font-semibold capitalize text-lg" key={index}> 
                                {item.name}
                            </p>
                            <p className="text-base ml-4"> {item.explanation}</p>
                            {
                                item.examples.length > 0 && <p className="text-sm ml-8"> Ex: {item.examples}</p>
                            }
                        </div>
                    ))
                }
            </div>
        }
    </div>
  )
}

export default Vocabulary