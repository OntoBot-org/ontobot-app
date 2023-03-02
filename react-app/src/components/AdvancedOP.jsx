import React, { useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import Select from "react-select";

import { Modal, OPList } from '../components'
import { relationshipTypes } from '../data/relationshipTypes'
import { constraints } from '../data/constraints'

const AdvancedOP = () => {

    const [isOpModalVsible, setisOpModalVsible] = useState(false)
    const [isConstraintModalVsible, setisConstraintModalVsible] = useState(false)
    const [openTab, setopenTab] = useState(1)

  return (
    <div className='w-full h-full'>
        <div className="flex">
            <p className="taxonomy-heading">Add Advanced Object Properties</p>
            <BiPlus 
                className="biplus_modal"
                onClick={() => setisOpModalVsible(true)}
            />
        </div>

        <OPList />

        <Modal open={isOpModalVsible} onClose={() => setisOpModalVsible(false)} fromTop="top-[15%]" fromLeft='left-[15%]'>
            {/* <div className="flex w-full items-center justify-between">
                <p className="border p-2 cursor-pointer hover:border-b-2 hover:border-b-secondary">Usecase 01</p>
                <p className="border p-2 cursor-pointer hover:border-b-2 hover:border-b-secondary">Usecase 02</p>
            </div> */}
            <p className="modal_title mb-2">Advanced Object Property</p>

            <div className="flex flex-wrap">
                <div className="w-full">
                    <ul
                        className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                        role="tablist"
                    >
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                (openTab === 1
                                    ? "text-white bg-secondary"
                                    : "text-secondary bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setopenTab(1);
                                }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist"
                            >
                                Usecase 01
                            </a>
                        </li>

                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                (openTab === 2
                                    ? "text-white bg-secondary"
                                    : "text-secondary bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setopenTab(2);
                                }}
                                data-toggle="tab"
                                href="#link2"
                                role="tablist"
                            >
                                Usecase 02
                            </a>
                        </li>
                    </ul>

                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full rounded">
                        <div className="px-4 py-5 flex-auto">
                            <div className="tab-content tab-space">
                                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                    <div className="flex flex-col">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex flex-col" id='op_label'>
                                                <p className="mb-1">Label* </p>
                                                <input 
                                                    type="text" 
                                                    className="border p-2 rounded-sm"
                                                    // value={newRelationship.relationshipLabel}
                                                    placeholder='growsIn' 
                                                    // onChange={(e) => setnewRelationship({...newRelationship, relationshipLabel: e.target.value})}
                                                />
                                            </div>
                                        
                                            <div className="flex flex-col" id='relationship_domain'>
                                                <p className="mb-1">Domain* </p>
                                                {/* <SearchSelect 
                                                    optionList={domainsList} 
                                                    reducerFunction={saveDomain}
                                                    relationshipId={newRelationship.id}
                                                /> */}
                                                <Select
                                                    options={relationshipTypes}
                                                    placeholder="Select"
                                                    // value={selectedDatatype}
                                                    // onChange={handleDatatypeSelect}
                                                />
                                                
                                            </div>

                                            <div className="flex flex-col" id='relationship_ranges'>
                                                <p className="mb-1">Range(s)* </p>
                                                <Select
                                                    options={relationshipTypes}
                                                    placeholder="Select"
                                                    // value={selectedDatatype}
                                                    // onChange={handleDatatypeSelect}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col gap-4 mt-4">
                                            <div className="flex flex-col" id='relationship_types'>
                                                <p className="mb-1">Additional attributes(s) </p>
                                                <Select
                                                    options={relationshipTypes}
                                                    placeholder="Select"
                                                    // value={selectedDatatype}
                                                    // onChange={handleDatatypeSelect}
                                                    isMulti={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center w-full mt-6">
                                        <button 
                                            className="secondary_btn_comp w-fit h-8 p-0 px-2"
                                            // onClick={handleSaveRelationship}
                                            id='save_relationshipdetails'
                                        >
                                            Add Object Property
                                        </button>

                                        <button 
                                            className="primary_btn_comp h-8 p-0"
                                            onClick={() => setisConstraintModalVsible(true)}
                                        >
                                            Add Constraints
                                        </button>
                                    </div>
                                </div>

                                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                    <div className="flex flex-col">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex flex-col" id='op_label'>
                                                <p className="mb-1">Label* </p>
                                                <input 
                                                    type="text" 
                                                    className="border p-2 rounded-sm"
                                                    // value={newRelationship.relationshipLabel}
                                                    placeholder='growsIn' 
                                                    // onChange={(e) => setnewRelationship({...newRelationship, relationshipLabel: e.target.value})}
                                                />
                                            </div>

                                            <div className="flex flex-col col-span-2" id='relationship_types'>
                                                <p className="mb-1">Additional attributes(s) </p>
                                                <Select
                                                    options={relationshipTypes}
                                                    placeholder="Select"
                                                    // value={selectedDatatype}
                                                    // onChange={handleDatatypeSelect}
                                                    isMulti={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center w-full mt-6">
                                        <button 
                                            className="secondary_btn_comp w-fit h-8 p-0 px-2"
                                            // onClick={handleSaveRelationship}
                                            id='save_relationshipdetails'
                                        >
                                            Add Object Property
                                        </button>

                                        <button 
                                            className="primary_btn_comp h-8 p-0"
                                            onClick={() => setisConstraintModalVsible(true)}
                                        >
                                            Add Constraints
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </Modal>

        <Modal open={isConstraintModalVsible} onClose={() => setisConstraintModalVsible(false)} fromTop="top-[18%]" fromLeft='left-[18%]' className="h-screen overflow-y-scroll">
            <p className="modal_title mb-2">Add Constraints</p>

            {
                constraints.map((con, index) => (
                    <div className="grid grid-cols-6 my-2" key={index}>
                        <p className="w-1/6">{con}</p>

                        <label className="label_style">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                // checked={enabled}
                                // onClick={() =>
                                //     newProperty.functional === "yes"
                                //         ? setnewProperty({ ...newProperty, functional: "no" })
                                //         : setnewProperty({ ...newProperty, functional: "yes" })
                                // }
                                // onChange={() => setEnabled(!enabled)}
                            />
                            <div className="w-11 h-6 bg-lightgray rounded-full peer  peer-focus:ring-secondary  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-lightgray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
                            <span className="ml-2 text-sm font-medium text-fontcolor">
                                Some
                            </span>
                        </label>

                        <label className="label_style">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                // checked={enabled}
                                // onClick={() =>
                                //     newProperty.functional === "yes"
                                //         ? setnewProperty({ ...newProperty, functional: "no" })
                                //         : setnewProperty({ ...newProperty, functional: "yes" })
                                // }
                                // onChange={() => setEnabled(!enabled)}
                            />
                            <div className="w-11 h-6 bg-lightgray rounded-full peer  peer-focus:ring-secondary  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-lightgray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
                            <span className="ml-2 text-sm font-medium text-fontcolor">
                                Only
                            </span>
                        </label>

                        <div className='flex items-center justify-center gap-2'>
                            <p className="text-sm">Min </p>
                            <input 
                                type="text" 
                                className="border p-2 rounded-sm w-16 h-8"
                                // value={newRelationship.equivalentName}
                                // placeholder='suitableFor' 
                                // onChange={(e) => setnewRelationship({...newRelationship, equivalentName: e.target.value})}
                            />
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <p className="text-sm">Max </p>
                            <input 
                                type="text" 
                                className="border p-2 rounded-sm w-16 h-8"
                                // value={newRelationship.equivalentName}
                                // placeholder='suitableFor' 
                                // onChange={(e) => setnewRelationship({...newRelationship, equivalentName: e.target.value})}
                            />
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <p className="text-sm">Exactly </p>
                            <input 
                                type="text" 
                                className="border p-2 rounded-sm w-16 h-8"
                                // value={newRelationship.equivalentName}
                                // placeholder='suitableFor' 
                                // onChange={(e) => setnewRelationship({...newRelationship, equivalentName: e.target.value})}
                            />
                        </div>
                    </div>
                ))
            }

            <div className="flex justify-center items-center mt-4 w-full">
                <button 
                    className="secondary_btn_comp w-fit h-8 p-0 px-2"
                    // onClick={handleSaveRelationship}
                    id='save_relationshipdetails'
                >
                    Save constraints
                </button>

                <button 
                    className="primary_btn_comp h-8 p-0"
                    onClick={() => setisConstraintModalVsible(false)}
                >
                    Cancel
                </button>
            </div>
        </Modal>
    </div>
  )
}

export default AdvancedOP