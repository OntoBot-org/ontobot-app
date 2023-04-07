import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { v4 } from "uuid";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BiPlus } from 'react-icons/bi'
import { MdLiveHelp } from 'react-icons/md'
import { TbAlertTriangle } from 'react-icons/tb'

import { Modal, OPList } from '../components'
import { saveObjectProperties } from '../features/objectProperties/objectPropertySlice'
import { takeAOPmainTour, takeAOPusecase01Tour, takeAOPusecase02Tour, takeAOPaddConstraintsTour } from '../tour/advancedOPtour'

const AdvancedOP = ({ isSOPsubmitted, isAOPsubmitted, setisAOPsubmitted }) => {

	const taxonomies = useSelector((store) => store.taxonomies);
	const savedObjectProperties = useSelector((store) => store.objectProperties);

    const dispatch = useDispatch()

    const [isOpModalVsible, setisOpModalVsible] = useState(false)
    const [isConstraintModalVsible, setisConstraintModalVsible] = useState(false)
    const [isAlertVisible, setisAlertVisible] = useState(false)
    const [isMainAlertVisible, setisMainAlertVisible] = useState(false)
    const [addConstraints, setaddConstraints] = useState(false)
    const [openTab, setopenTab] = useState(1)
    const [alertMsg, setalertMsg] = useState('')
    const [mainAlertMsg, setmainAlertMsg] = useState('')
    const [selectedDomain, setselectedDomain] = useState('')
    const [selectedRange, setselectedRange] = useState({})
    const [selectedAdditionalAttributes, setselectedAdditionalAttributes] = useState([])
    const [simpleOPList, setsimpleOPList] = useState([])
    const [newOP, setnewOP] = useState({
        id: v4(),
        relationshipLabel: '',
        inverse: '',
        equivalentLabel: '',
        domain: '',
        ranges: [],
        isSimpleOP: false,
    })
    const [availableTaxonomies, setavailableTaxonomies] = useState([])
    const [objectPropertyList, setobjectPropertyList] = useState([])

    useEffect(() => {
        const taxonomyArray = []
        const getTaxonomies = (subclasses) => {
            subclasses.forEach((subcls) => {
                taxonomyArray.push(subcls)
                if (subcls.subclasses.length>0) {
                    getTaxonomies(subcls.subclasses)
                }
            })
        }
        getTaxonomies(taxonomies?.subclasses)
        setavailableTaxonomies(taxonomyArray)
        // console.log("availableTaxonomies: ", availableTaxonomies)
    }, [taxonomies.submitted])

    useEffect(() => {
        const advancedOP = savedObjectProperties.filter(obj => !obj.isSimpleOP);
        setobjectPropertyList(advancedOP);
        const simpleOP = savedObjectProperties.filter(obj => obj.isSimpleOP);
        setsimpleOPList(simpleOP)
        // console.log("simpleOPList.length in AOP: ", simpleOPList.length)
    }, [savedObjectProperties]);
    

	const handleDomainSelect = (data) => {
		setselectedDomain(data)
		setnewOP({ ...newOP, domain: data.label })
	}

	const handleRangeSelect = (data) => {
		setselectedRange(data)
        
		setnewOP({ ...newOP, ranges: [{
            name: data.label,
            some: false,
            only: false,
            min: 0,
            max: 'inf',
            exactly: -1,
            relationshipTypes: [],
        }] })
	}

	const handleAdditionalAttributesSelect = (data) => {
        setselectedAdditionalAttributes(data)
	}

    const handleSetOPtoInit = () => {
        setnewOP({
            id: v4(),
            relationshipLabel: '',
            inverse: '',
            equivalentLabel: '',
            domain: '',
            ranges: [],
            isSimpleOP: false,
        })
        setselectedRange([])
        setselectedDomain('')
        setselectedAdditionalAttributes([])
    }

    const handleSaveConstraints = () => {
        setobjectPropertyList([...objectPropertyList, newOP])
        // console.log("objectPropertyList: ", objectPropertyList)
        handleCancel()
    }

    const handleCancel = () => {
        setaddConstraints(false)
        setisConstraintModalVsible(false)
        handleSetOPtoInit()
    }

    const handleAddConstraintsCancel = () => {
        const rangesWithDefaults = [] 
        newOP.ranges.forEach((range) => {
            rangesWithDefaults.push({
                name: range.name,
                some: false,
                only: false,
                min: 0,
                max: 'inf',
                exactly: -1,
                relationshipTypes: [],
            })
        })
        setnewOP({...newOP, ranges: rangesWithDefaults})
        setisConstraintModalVsible(false)
    }

    const handleAddObjectProperty = () => {
        if (openTab === 1 && newOP.relationshipLabel === '') {
            setisAlertVisible(true)
            setalertMsg('Please note that the Label field is required.')
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else if (newOP.relationshipLabel === 'has' || newOP.relationshipLabel === 'have') {
            setisAlertVisible(true)
            setalertMsg('Please note that the Label value cannot be has or have.')
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else if (newOP.domain === '') {
            setisAlertVisible(true)
            setalertMsg('Please give a domain.')
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else if (openTab === 1 && newOP.ranges.length === 0) {
            setalertMsg('Please select a range.')
            setisAlertVisible(true)
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else if (openTab === 1 && selectedAdditionalAttributes.length === 0) {
            setisAlertVisible(true)
            setalertMsg('Please note that additional attributes are mandetory.')
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        }
        else if (openTab === 2 && selectedAdditionalAttributes.length < 2) {
            setisAlertVisible(true)
            setalertMsg('Please select at least two additional attributes.')
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        } else if(selectedAdditionalAttributes.some((attr) => attr.name === newOP.domain)) {
            setisAlertVisible(true)
            setalertMsg('Please note that you cannot add Domain as an additional attribute.')
            setTimeout(() => {
                setisAlertVisible(false)
            }, 3000);
        } 
        // else if(selectedAdditionalAttributes.some((attr) => attr.name === newOP.ranges[0].name)) {
        //     setisAlertVisible(true)
        //     setalertMsg('Please note that you cannot add Range as an additional attribute.')
        //     setTimeout(() => {
        //         setisAlertVisible(false)
        //     }, 3000);
        // }
        else {
            let additionalAttributes = []
            if(openTab===1) {
                additionalAttributes.push(newOP.ranges[0])
            }
            selectedAdditionalAttributes.forEach((attribute) => {
                // console.log("attribute.label: ", attribute.label)
                additionalAttributes.push({
                    name: attribute.label,
                    some: false,
                    only: false,
                    min: 0,
                    max: 'inf',
                    exactly: -1,
                    relationshipTypes: [],
                })
            })
            setnewOP({ ...newOP, ranges: additionalAttributes })
            setaddConstraints(true)
            // console.log("newOP: ", newOP)
        }
    }

    const handleSubmitAllAOP = () => {
        if(objectPropertyList.length===0 || !objectPropertyList.some((object) => !object.isSimpleOP)) {
            setisMainAlertVisible(true)
            setmainAlertMsg('Please at at least one object property.')
            setTimeout(() => {
                setisMainAlertVisible(false)
            }, 3000);
            // console.log('add at least one SOP')
        } else {
            const finalOPlist = objectPropertyList.filter(
                (obj, index, self) => index === self.findIndex((t) => t.id === obj.id)
            );
            setobjectPropertyList(finalOPlist)
            dispatch(saveObjectProperties({
                newOPList: finalOPlist,
                prevOPList: simpleOPList
            }))
            setisAOPsubmitted(true)
            console.log("finalOPlist AOP: ", finalOPlist)
            // console.log("savedObjectProperties AOD: ", savedObjectProperties)
        }
    }

    const handleOnClose = () => {
        handleSetOPtoInit()
        setisOpModalVsible(false)
    }

    return (
        <div className='w-full h-full'>
            <div className="flex items-center justify-between mb-2">
                <div className="flex">
                    <p className="taxonomy-heading mt-1">Add Advanced Object Properties</p>
                    
                    <button className='border-0'
                        onClick={() => {
                            setisOpModalVsible(true)
                            setisAOPsubmitted(false)
                        }}
                        disabled={!isSOPsubmitted}
                    >
                        <BiPlus className={`biplus_modal ${!isSOPsubmitted ? 'cursor-not-allowed' : ''}`} id='add_advancedOP_icon' />
                    </button>
                </div>
                <MdLiveHelp 
                    className="text-secondary text-xl cursor-pointer hover:text-primary" 
                    onClick={takeAOPmainTour} 
                />
            </div>

            {
                isMainAlertVisible && 
                <div className="flex w-fit mx-4 py-1 px-2 bg-primary text-white font-semibold rounded-md mt-4">
                    <TbAlertTriangle className='mr-2 mt-1' />
                    <p>{mainAlertMsg}</p>
                </div>
            }

            <div id='advancedOP_list' className='w-full h-3/4 overflow-y-scroll'>
                <OPList objectPropertyList={objectPropertyList} setobjectPropertyList={setobjectPropertyList} />
            </div>

            <div className="flex w-full items-center justify-center">
                <button 
                    className={`primary_btn_comp w-auto px-5 h-fit mt-4 ${!isSOPsubmitted || isAOPsubmitted ? 'disabled_btn' : ''}`} 
                    disabled={!isSOPsubmitted || isAOPsubmitted}
                    onClick={handleSubmitAllAOP} 
                    id='submitAll_AOP'
                >
                    Submit All
                </button>
                <button 
                    className={`secondary_btn_comp w-auto px-5 h-fit mt-4 ${!isSOPsubmitted|| isAOPsubmitted ? 'disabled_btn' : ''}`} 
                    disabled={!isSOPsubmitted || isAOPsubmitted}
                    onClick={() => console.log("check consistency")} 
                    id='check_AOP_consistency'
                >
                    Check Consistency
                </button>
            </div>

            <Modal open={isOpModalVsible} onClose={handleOnClose} fromTop="top-[15%]" fromLeft='left-[15%]'>
                <div className="flex items-center justify-between w-full mb-2">
                    <p className="modal_title">Advanced Object Property</p>
                    <AiOutlineCloseCircle 
                        onClick={() => setisOpModalVsible(false)} 
                        className='modal_close_icon' 
                    />
                </div>

                { isAlertVisible && (
                    <div className="alert_style">
                        <TbAlertTriangle className='mr-2' />
                        <p>{alertMsg}</p>
                    </div>
                )}

                <div className="flex flex-wrap">
                    <div className="w-full">
                        <ul
                            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                            role="tablist"
                        >
                            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                                <a
                                    className={
                                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded flex justify-between leading-normal " +
                                    (openTab === 1
                                        ? "text-white bg-secondary"
                                        : "text-secondary bg-white")
                                    }
                                    data-toggle="tab"
                                    href="#link1"
                                    role="tablist"
                                >
                                    <p 
                                        className='w-fit' 
                                        onClick={e => {
                                            e.preventDefault();
                                            setopenTab(1);
                                        }}
                                    >
                                        Usecase 01
                                    </p>
                                    <MdLiveHelp 
                                        className="text-xl cursor-pointer ml-2 hover:text-primary" 
                                        onClick={takeAOPusecase01Tour} 
                                    />
                                </a>
                            </li>

                            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                                <a
                                    className={
                                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded flex justify-between leading-normal " +
                                    (openTab === 2
                                        ? "text-white bg-secondary"
                                        : "text-secondary bg-white")
                                    }
                                    data-toggle="tab"
                                    href="#link2"
                                    role="tablist"
                                >
                                    <p 
                                        className='w-fit' 
                                        onClick={e => {
                                            e.preventDefault();
                                            setopenTab(2);
                                        }}
                                    >
                                        Usecase 02
                                    </p>
                                    <MdLiveHelp 
                                        className="text-xl cursor-pointer ml-2 hover:text-primary" 
                                        onClick={takeAOPusecase02Tour} 
                                    />
                                </a>
                            </li>
                        </ul>

                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full rounded">
                            <div className="px-4 py-5 flex-auto">
                                <div className="tab-content tab-space">
                                    <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                        <div className="flex flex-col">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="flex flex-col" id='aop_label'>
                                                    <p className="mb-1">Label* </p>
                                                    <input 
                                                        type="text" 
                                                        className="border p-2 rounded-sm"
                                                        value={newOP.relationshipLabel}
                                                        placeholder='growsIn' 
                                                        onChange={(e) => setnewOP({...newOP, relationshipLabel: e.target.value})}
                                                    />
                                                </div>
                                            
                                                <div className="flex flex-col" id='aop_domain'>
                                                    <p className="mb-1">Domain* </p>
                                                    <Select
                                                        options={availableTaxonomies}
                                                        placeholder="Select"
                                                        value={selectedDomain}
                                                        onChange={handleDomainSelect}
                                                    />
                                                </div>

                                                <div className="flex flex-col" id='aop_range'>
                                                    <p className="mb-1">Range* </p>
                                                    <Select
                                                        options={availableTaxonomies}
                                                        placeholder="Select"
                                                        value={selectedRange}
                                                        onChange={handleRangeSelect}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-4 mt-4">
                                                <div className="flex flex-col" id='aop_additionalAttrubutes'>
                                                    <p className="mb-1">Additional attribute(s)* </p>
                                                    <Select
                                                        options={availableTaxonomies}
                                                        placeholder="Select"
                                                        value={selectedAdditionalAttributes}
                                                        onChange={handleAdditionalAttributesSelect}
                                                        isMulti={true}
                                                        getOptionValue={(option) => option.label}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                        <div className="flex flex-col">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="flex flex-col" id='aop__domain'>
                                                    <p className="mb-1">Domain* </p>
                                                    <input 
                                                        type="text" 
                                                        className="border p-2 rounded-sm"
                                                        value={newOP.domain}
                                                        placeholder='growsIn' 
                                                        onChange={(e) => setnewOP({...newOP, domain: e.target.value})}
                                                    />
                                                </div>

                                                <div className="flex flex-col col-span-2" id='aop__additionalAttrubutes'>
                                                    <p className="mb-1">Additional attribute(s)* </p>
                                                    <Select
                                                        options={availableTaxonomies}
                                                        placeholder="Select"
                                                        value={selectedAdditionalAttributes}
                                                        onChange={handleAdditionalAttributesSelect}
                                                        isMulti={true}
                                                        getOptionValue={(option) => option.label}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="flex justify-center items-center w-full mt-6">
                    <button 
                        className={`secondary_btn_comp w-fit h-8 p-0 px-2 ${addConstraints ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleAddObjectProperty}
                        id='add_aop'
                        disabled={addConstraints}
                    >
                        Add Object Property
                    </button>

                    <button 
                        className={`primary_btn_comp h-8 p-0 ${!addConstraints ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => setisConstraintModalVsible(true)}
                        disabled={!addConstraints}
                        id='aop_addConstraints'
                    >
                        Add Constraints
                    </button>
                </div>
            </Modal>

            <Modal 
                open={isConstraintModalVsible} 
                onClose={handleAddConstraintsCancel} 
                fromTop="top-[18%]" 
                fromLeft='left-[18%]'
            >
                <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex">
                        <p className="modal_title">Add Constraints <span className="text-primary">{newOP.domain} {newOP.relationshipLabel}</span></p>
                        <MdLiveHelp 
                            className="text-xl text-secondary mt-1 cursor-pointer ml-2 hover:text-primary" 
                            onClick={takeAOPaddConstraintsTour} 
                        />
                    </div>
                    <AiOutlineCloseCircle 
                        onClick={() => setisConstraintModalVsible(false)} 
                        className='modal_close_icon' 
                    />
                </div>
                <p className="w-full flex items-center justify-center font-semibold text-fontcolor mb-2">{newOP.domain} {newOP.relationshipLabel}</p>

                {
                    newOP?.ranges?.length>0 && newOP?.ranges?.map((range, index) => (
                        <div className="grid grid-cols-7 my-2 w-full gap-2" key={index}>
                            <p className="col-span-2 textri" id='range_name'>{range?.name}</p>

                            <label className="label_style" id='some_quantifier'>
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={range?.some}
                                    onClick={() => {
                                        const updatedRanges = [...newOP.ranges];
                                        updatedRanges[index].some = !range.some;
                                        setnewOP({...newOP, ranges: updatedRanges});
                                    }}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setnewOP((prev) => {
                                            const updatedRanges = [...prev.ranges];
                                            updatedRanges[index] = {
                                                ...range,
                                                some: checked,
                                            };
                                            return {
                                                ...prev,
                                                ranges: updatedRanges,
                                            };
                                        });
                                    }}
                                />
                                <div className="w-11 h-6 bg-lightgray rounded-full peer  peer-focus:ring-secondary  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-lightgray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
                                <span className="ml-2 text-sm font-medium text-fontcolor">
                                    Some
                                </span>
                            </label>

                            <label className="label_style" id='only_quantifier'>
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={range?.only}
                                    onClick={() => {
                                        const updatedRanges = [...newOP.ranges];
                                        updatedRanges[index].only = !range.only;
                                        setnewOP({...newOP, ranges: updatedRanges});
                                    }}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setnewOP((prev) => {
                                            const updatedRanges = [...prev.ranges];
                                            updatedRanges[index] = {
                                                ...range,
                                                only: checked,
                                            };
                                            return {
                                                ...prev,
                                                ranges: updatedRanges,
                                            };
                                        });
                                    }}
                                />
                                <div className="w-11 h-6 bg-lightgray rounded-full peer  peer-focus:ring-secondary  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-lightgray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
                                <span className="ml-2 text-sm font-medium text-fontcolor">
                                    Only
                                </span>
                            </label>

                            <div className='flex gap-2' id='min_constraint'>
                                <p className="text-sm">Min* </p>
                                <input 
                                    type="text" 
                                    className="border p-2 rounded-sm w-16 h-6"
                                    value={range?.min}
                                    placeholder='min value' 
                                    onChange={(event) => {
                                        const updatedRanges = [...newOP.ranges];
                                        updatedRanges[index].min = event.target.value;
                                        setnewOP({...newOP, ranges: updatedRanges});
                                    }}
                                />
                            </div>

                            <div className='flex items-center justify-center gap-2' id='max_constraint'>
                                <p className="text-sm">Max* </p>
                                <input 
                                    type="text" 
                                    className="border p-2 rounded-sm w-16 h-6"
                                    value={range?.max}
                                    placeholder='max value' 
                                    onChange={(event) => {
                                        const updatedRanges = [...newOP.ranges];
                                        updatedRanges[index].max = event.target.value;
                                        setnewOP({...newOP, ranges: updatedRanges});
                                    }}
                                />
                            </div>

                            <div className='flex items-center justify-center gap-2' id='exactly_constraint'>
                                <p className="text-sm">Exactly </p>
                                <input 
                                    type="text" 
                                    className="border p-2 rounded-sm w-16 h-6"
                                    value={range?.exactly}
                                    placeholder='exact value' 
                                    onChange={(event) => {
                                        const updatedRanges = [...newOP.ranges];
                                        updatedRanges[index].exactly = event.target.value;
                                        setnewOP({...newOP, ranges: updatedRanges});
                                    }}
                                />
                            </div>
                        </div>
                    ))
                }

                <div className="flex justify-center items-center mt-4 w-full">
                    <button 
                        className="secondary_btn_comp w-fit h-8 p-0 px-2"
                        onClick={handleSaveConstraints}
                        id='save_constraint'
                    >
                        Save constraints
                    </button>

                    <button 
                        className="primary_btn_comp h-8 p-0"
                        onClick={handleAddConstraintsCancel}
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default AdvancedOP