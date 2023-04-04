import React, { useEffect, useState } from 'react'
// import { BiEditAlt } from 'react-icons/bi'
import { MdDeleteOutline } from "react-icons/md";
import { VscCircleFilled } from 'react-icons/vsc'

const OPList = ({ objectPropertyList, setobjectPropertyList }) => {

  const [opList, setopList] = useState([])

  const handleDelete = (index) => {
    const updatedList = [...objectPropertyList];
    updatedList.splice(index, 1);
    setobjectPropertyList(updatedList);
  }

  useEffect(() => {
    const finalOPlist = objectPropertyList.filter(
      (obj, index, self) => index === self.findIndex((t) => t.id === obj.id) );
      setopList(finalOPlist)
  }, [objectPropertyList])

  return (
    <div className='w-full h-3/4 overflow-y-scroll'>
      <p className="taxonomy-heading text-fontcolor capitalize my-4 text-base">Added Object Properties</p>

      {
        opList.length === 0 &&
        <div className="flex">
          <VscCircleFilled className='mt-1 ml-4 mr-1 text-secondary text-sm' />
          <p className="text-sm">Haven't add any object property yet.</p>
        </div>
      }

      <ul className="">
        {
          opList?.length>0 && opList?.map((op, index) => (
            <div className="flex my-2" key={index}>
              <VscCircleFilled className='mt-1 mr-1 text-secondary text-sm' />

              <li className="text-fontcolor mr-1 flex flex-row items-start justify-start gap-2 w-full">
                <span className='flex gap-2'>
                  {op.domain} {op.relationshipLabel.length > 0 ? op.relationshipLabel : 'has ranges '}
                  {
                    op.ranges?.length > 1 ?  
                      op.ranges?.map((range, i) => (
                        <span key={i}>{range.name} </span>
                      ))
                      :
                      <span>{op.ranges.name} </span>
                  }
                </span>
                {/* <BiEditAlt className='mt-1 mr-1 text-secondary text-sm cursor-pointer' /> */}
                <MdDeleteOutline className='mt-1 mr-1 text-primary text-sm cursor-pointer' onClick={() => handleDelete(index)} />
              </li>
            </div>
          ))
        }
      </ul>
    </div>
  )
}

export default OPList