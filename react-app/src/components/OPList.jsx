import React from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { MdDeleteOutline } from "react-icons/md";
import { VscCircleFilled } from 'react-icons/vsc'

const objectProperties = [
  "Farmer cultivates Crop",
  "Crop hasDisease Disease",
  "Land has loomySoil, redSoil"
]

const OPList = () => {
  return (
    <div className='w-full h-3/4 overflow-y-scroll'>
      <p className="taxonomy-heading capitalize my-4 text-base">Added Simple Object Properties</p>

      <ul className="">
        {
          objectProperties.map((op, index) => (
            <div className="flex my-2" key={index}>
              <VscCircleFilled className='mt-1 mr-1 text-secondary text-sm' />
              <li className="text-fontcolor mr-1">{op}</li>
              <BiEditAlt className='mt-1 mr-1 text-secondary text-sm cursor-pointer' />
              <MdDeleteOutline className='mt-1 mr-1 text-primary text-sm cursor-pointer' />
            </div>
          ))
        }
      </ul>
    </div>
  )
}

export default OPList