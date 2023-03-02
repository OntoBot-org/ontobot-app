import React, { useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import Select from "react-select";

import { Modal, OPList } from '../components'
import { relationshipTypes } from '../data/relationshipTypes'

const SimpleOP = () => {

    const [isDetailedModalVsible, setisDetailedModalVsible] = useState(false)
    const [isShortcutModalVsible, setisShortcutModalVsible] = useState(false)

    // "domain": "crop",
    //         "equivalentLabel": "",
    //         "id": "537fbf3c-61a4-415c-a20f-187fd67b5245",
    //         "inverse": "",
    //         "ranges": ["soil"],
    //         "relationshipLabel": "grows",
    //         "quantifier":{
    //             "some": true,
    //             "only": false
    //         },
            // constraint : {
            //     "min" : 1,
            //     "max": 10,
            //     "exactly" : -1
            //     }

    return (
        <div className='w-full h-full'>
            
            <p className="taxonomy-heading ">Add Simple Object Properties Via,</p>
            
            <div className="flex items-center justify-center gap-8 my-4 ont-semibold">
                <div className="flex">
                    <p className="">Detailed Modal</p>
                    <BiPlus 
                        className="biplus_modal"
                        onClick={() => setisDetailedModalVsible(true)}
                    />
                </div>

                <div className="flex">
                    <p className="">Shortcut Modal</p>
                    <BiPlus 
                        className="biplus_modal"
                        onClick={() => setisShortcutModalVsible(true)}
                    />
                </div>
            </div>

            <OPList />

            <Modal open={isDetailedModalVsible} onClose={() => setisDetailedModalVsible(false)} fromTop="top-[15%]" fromLeft='left-[25%]'>
                <p className="modal_title mb-2">Simple Object Property</p>

                <div className="flex flex-col gap-4">
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

                        <div className="flex flex-col" id='inverse_op'>
                            <p className="mb-1">Inverse </p>
                            <input 
                                type="text" 
                                className="border p-2 rounded-sm"
                                // value={newRelationship.inverse}
                                placeholder='notGrowsIn' 
                                // onChange={(e) => setnewRelationship({...newRelationship, inverse: e.target.value})}
                            />
                        </div>

                        <div className="flex flex-col" id='op_equivalentname'>
                            <p className="mb-1">Equivalent name </p>
                            <input 
                                type="text" 
                                className="border p-2 rounded-sm"
                                // value={newRelationship.equivalentName}
                                placeholder='suitableFor' 
                                // onChange={(e) => setnewRelationship({...newRelationship, equivalentName: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col col-span-1" id='relationship_domain'>
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

                        <div className="flex flex-col col-span-2" id='relationship_ranges'>
                            <p className="mb-1">Range(s)* </p>
                            {/* <SearchSelect 
                                optionList={domainsList} 
                                reducerFunction={saveRanges}
                                isMultiSelect={true} 
                            /> */}
                            <Select
                                options={relationshipTypes}
                                placeholder="Select"
                                // value={selectedDatatype}
                                // onChange={handleDatatypeSelect}
                                isMulti={true}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col" id='relationship_types'>
                            <p className="mb-1">Relationship Type(s)* </p>
                            {/* <SearchSelect 
                                optionList={relationshipTypes} 
                                isMultiSelect={true} 
                                reducerFunction={saveRelationshipTypes} 
                            /> */}
                            <Select
                                options={relationshipTypes}
                                placeholder="Select"
                                // value={selectedDatatype}
                                // onChange={handleDatatypeSelect}
                                isMulti={true}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex w-full items-center justify-start gap-4" id='op_quantifiers'>
                            <p className="mb-1">Add quantifiers </p>

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
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex w-full items-center justify-between" id='op_quantifiers'>
                            <p className="mb-1">Add constraints </p>

                            {/* <div className="flex my-3"> */}
                            <p className="mb-1">Min </p>
                            <input 
                                type="text" 
                                className="border p-2 rounded-sm w-16"
                                // value={newRelationship.equivalentName}
                                // placeholder='suitableFor' 
                                // onChange={(e) => setnewRelationship({...newRelationship, equivalentName: e.target.value})}
                            />

                            <p className="mb-1">Max </p>
                            <input 
                                type="text" 
                                className="border p-2 rounded-sm w-16"
                                // value={newRelationship.equivalentName}
                                // placeholder='suitableFor' 
                                // onChange={(e) => setnewRelationship({...newRelationship, equivalentName: e.target.value})}
                            />

                            <p className="mb-1">Exactly </p>
                            <input 
                                type="text" 
                                className="border p-2 rounded-sm w-16"
                                // value={newRelationship.equivalentName}
                                // placeholder='suitableFor' 
                                // onChange={(e) => setnewRelationship({...newRelationship, equivalentName: e.target.value})}
                            />
                            {/* </div> */}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center mt-4 w-full">
                    <button 
                        className="secondary_btn_comp w-fit h-8 p-0 px-2"
                        // onClick={handleSaveRelationship}
                        id='save_relationshipdetails'
                    >
                        Add Object Property
                    </button>

                    <button 
                        className="primary_btn_comp h-8 p-0"
                        onClick={() => setisDetailedModalVsible(false)}
                    >
                        Cancel
                    </button>
                </div>
            </Modal>

            <Modal open={isShortcutModalVsible} onClose={() => setisShortcutModalVsible(false)} fromTop="top-[15%]" fromLeft='left-[25%]'>
                <p className="modal_title mb-2">Simple Object Property</p>

                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col" id='op_label'>
                        <p className="mb-1">Label* </p>
                        <Select
                            options={relationshipTypes}
                            placeholder="Select"
                            // value={selectedDatatype}
                            // onChange={handleDatatypeSelect}
                        />
                    </div>

                    <div className="flex flex-col" id='inverse_op'>
                        <p className="mb-1">Domain </p>
                        <Select
                            options={relationshipTypes}
                            placeholder="Select"
                            // value={selectedDatatype}
                            // onChange={handleDatatypeSelect}
                        />
                    </div>

                    <div className="flex flex-col" id='op_equivalentname'>
                        <p className="mb-1">Range(s)* </p>
                        <Select
                            options={relationshipTypes}
                            placeholder="Select"
                            // value={selectedDatatype}
                            // onChange={handleDatatypeSelect}
                            isMulti={true}
                        />
                    </div>
                </div>

                <div className="flex justify-center items-center mt-4 w-full">
                    <button 
                        className="secondary_btn_comp w-fit h-8 p-0 px-2"
                        // onClick={handleSaveRelationship}
                        id='save_relationshipdetails'
                    >
                        Add Object Property
                    </button>

                    <button 
                        className="primary_btn_comp h-8 p-0"
                        onClick={() => setisShortcutModalVsible(false)}
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default SimpleOP