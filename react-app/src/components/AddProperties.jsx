import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BiPlus } from "react-icons/bi";
import { TbAlertTriangle } from "react-icons/tb";
import { v4 } from "uuid";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { MdLiveHelp } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import "driver.js/dist/driver.min.css";

import { Modal, PropertiesList } from '../components'
import { saveProperties } from "../features/taxonomies/taxonomySlice";
import { saveDataProperties } from "../features/taxonomies/dataPropertySlice";
import { datatypes } from '../data/datatypes'
import { propertyRestrictions } from '../data/propertyRestrictions'
import { takeAddPropertiesTour } from "../tour/taxonomyTour";

const AddProperties = ({ selectedTaxonomy }) => {
	const taxonomies = useSelector((store) => store.taxonomies);
	const totalDatapProperties = useSelector((store) => store.totalDatapProperties);

	const [isModalVisible, setisModalVisible] = useState(false);
	const [propertiesList, setpropertiesList] = useState([]);
	const [enabled, setEnabled] = useState(true);
	const [selectedDatatype, setselectedDatatype] = useState(datatypes[0]);
	const [selectedRestriction, setselectedRestriction] = useState(propertyRestrictions[0]);
	const [isAlertVisible, setisAlertVisible] = useState(false);
	const [alertMsg, setalertMsg] = useState("");
	const [isPropertiesSaved, setisPropertiesSaved] = useState(false);
	const [newProperty, setnewProperty] = useState({
		id: "",
		name: "",
		datatype: datatypes[0].label,
		restrictions: propertyRestrictions[0].label,
		functional: "no",
	});
	const [dataPropertyList, setdataPropertyList] = useState([])

	const dispatch = useDispatch();

	useEffect(() => {
		const getAvailablePropertiesList = (taxonomyObj) => {
			if (taxonomyObj.id === selectedTaxonomy.id) {
				if (taxonomyObj.hasOwnProperty("propertiesList")) {
					setpropertiesList(taxonomyObj.propertiesList);
				}
			} else {
				if (taxonomyObj.hasOwnProperty("subclasses")) {
					taxonomyObj.subclasses?.map((subCls) =>
						getAvailablePropertiesList(subCls)
					);
				}
			}
		};

		getAvailablePropertiesList(taxonomies);
	}, [selectedTaxonomy, isPropertiesSaved, taxonomies]);

	const handleModalOpening = () => {
		if (
			selectedTaxonomy.name === "" ||
			selectedTaxonomy.name === "taxonomies"
		) {
			setalertMsg(
				"Please select a taxonomy from the taxonomy tree."
			);
			setisAlertVisible(true);
			setTimeout(() => {
				setisAlertVisible(false);
			}, 3000);
		} else {
			setisModalVisible(!isModalVisible);
		}
	};

	const handleKeyDown = (event) => {
        if (event) {
            if (event.key === 'Enter') {
                handleAddProperty()
            }
        } else {
			setalertMsg(
				"No event is passed"
			);
			setisAlertVisible(true);
			setTimeout(() => {
				setisAlertVisible(false);
			}, 3000);
        }
    }

	const handleDatatypeSelect = (data) => {
		setselectedDatatype(data)
		setnewProperty({ ...newProperty, datatype: data.label })
		// console.log('newProperty datatype: ', newProperty)
	}

	const handleRestrictionSelect = (data) => {
		setselectedRestriction(data)
		setnewProperty({ ...newProperty, restrictions: data.label })
		// console.log('newProperty restriction: ', newProperty)
	}

	

	const handleAddProperty = (event) => {
		// event.preventDefault();

		if (newProperty.name === "") {
			setalertMsg(
				"Please note that Porperty name is required."
			);
			setisAlertVisible(true);

			setTimeout(() => {
				setisAlertVisible(false);
			}, 3000);
		} 
		else if (newProperty.name.includes('(') || newProperty.name.includes(')')) {
			setalertMsg(
				"Please note that you cannot enter parenthesis in the property name."
			);
			setisAlertVisible(true);

			setTimeout(() => {
				setisAlertVisible(false);
			}, 3000);
		}
		else if (!newProperty.datatype) {
			setalertMsg(
				"Please note that Data type is required."
			);
			setisAlertVisible(true);

			setTimeout(() => {
				setisAlertVisible(false);
			}, 3000);
		} 
		else {
			let availableDataProperty = ''
			let propertyDatatType = ''
			totalDatapProperties.forEach((dataprop) => {
				if(dataprop.dpName===newProperty.name) {
					availableDataProperty = dataprop
				}
			})
			if(availableDataProperty!=='') {
				propertyDatatType = availableDataProperty.dpDatatype
				setalertMsg(
					`Please note that this property is already an attribute of ${availableDataProperty.belongingClass} and its datatype should be ${availableDataProperty.dpDatatype}.`
				);
				setisAlertVisible(true);
	
				setTimeout(() => {
					setisAlertVisible(false);
				}, 4000);
			} else {
				propertyDatatType = newProperty.datatype
				setdataPropertyList([...dataPropertyList, {
					dpName: newProperty.name,
					dpDatatype: newProperty.datatype,
					belongingClass: selectedTaxonomy.name
				}])
				// console.log('totalDatapProperties: ', totalDatapProperties)
			}
			
			const newPropertyObj = {
				id: v4(),
				name: newProperty.name,
				datatype: propertyDatatType,
				restrictions: newProperty.restrictions,
				functional: newProperty.functional,
			};

			const updatedPropertyList = [...propertiesList, newPropertyObj];
			setpropertiesList(updatedPropertyList);

			setnewProperty({
				id: "",
				name: "",
				datatype: datatypes[0].label,
				restrictions: propertyRestrictions[0].label,
				functional: "no",
			});

			setEnabled(true);
			setselectedDatatype(datatypes[0])
		}
	};

	const handleSaveProperties = () => {
		if (propertiesList?.length === 0) {
			setalertMsg("Please add at least one property.");
			setisAlertVisible(true);

			setTimeout(() => {
				setisAlertVisible(false);
			}, 3000);
		} 
		else {
			dispatch(
				saveProperties({
					taxonomyId: selectedTaxonomy.id,
					propertiesList: propertiesList,
				})
			);
			setisModalVisible(false);
			setisPropertiesSaved(true);
			setpropertiesList([]);

			dispatch(saveDataProperties({
				newDataPropertyArray: dataPropertyList
			}))
			// console.log('taxonomies: ', taxonomies)
		}
	};

	const handleDelete = (index) => {
		const updatedList = [...propertiesList];
		updatedList.splice(index, 1);
		setpropertiesList(updatedList);
	  }

	return (
		<div>
			<div className="grid grid-cols-3 gap-x-3 gap-y-6 text-fontcolor mb-6">
				<div className="flex">
					<p className="mr-2 font-semibold tracking-wide">Properties</p>
					{!taxonomies.submitted && (
						<BiPlus
							className="cursor-pointer mt-1 bg-secondary text-white hover:bg-primary hover:text-white transition rounded-full  text-lg"
							onClick={handleModalOpening}
						/>
					)}
				</div>

				<div className="col-span-2 text-sm">
					<PropertiesList isPropertiesSaved={isPropertiesSaved} />
				</div>
			</div>

			<Modal
				open={isModalVisible}
				onClose={() => setisModalVisible(false)}
				fromLeft="left-[10%]"
				fromTop="top-[15%]"
			>
				<div className="flex items-center justify-between w-full mb-2">
					<div className="flex items-center justify-center gap-4">
						<p className="modal_title">
							Add properties of{" "}
							<span className="font-bold text-secondary">
								{selectedTaxonomy.name}
							</span>{" "}
							class.
						</p>
							
						<MdLiveHelp className="tour_icon" onClick={takeAddPropertiesTour} />
					</div>
					<AiOutlineCloseCircle 
						onClick={() => setisModalVisible(false)} 
						className='modal_close_icon' 
					/>
                </div>

				{isAlertVisible && (
					<div className="alert_style">
						<TbAlertTriangle className="mr-2" />
						<p>{alertMsg}</p>
					</div>
				)}
				
				<div className="flex justify-between gap-6 items-center text-fontcolor" onKeyDown={handleKeyDown}>
					<div className="flex flex-col gap-2" id='property_name'>
						<p>Property Name*</p>
						<input
							type="text"
							className="p-2 border border-gray-300 rounded-md outline-secondary"
							placeholder="crop_name"
							value={newProperty.name}
							onChange={(e) =>
								setnewProperty({ ...newProperty, name: e.target.value })
							}
						/>
					</div>

					<div className="flex flex-col gap-2" id='property_datatype'>
						<p>Data type*</p>
						<Select
							options={datatypes}
							placeholder="Select"
							value={selectedDatatype}
							onChange={handleDatatypeSelect}
						/>
					</div>

					<div className="flex flex-col gap-2" id='property_restrictions'>
						<p>Restrictions</p>
						<Select
							options={propertyRestrictions}
							placeholder="Select"
							value={selectedRestriction}
							onChange={handleRestrictionSelect}
						/>
					</div>

					<div className="flex flex-col gap-2" id='property_functional'>
						<p>Functional</p>
						<label className="label_style">
							<input
								type="checkbox"
								className="sr-only peer"
								checked={!enabled}
								onClick={() =>
									newProperty.functional === "yes"
										? setnewProperty({ ...newProperty, functional: "no" })
										: setnewProperty({ ...newProperty, functional: "yes" })
								}
								onChange={() => setEnabled(!enabled)}
							/>
							<div className="w-11 h-6 bg-lightgray rounded-full peer  peer-focus:ring-secondary  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-lightgray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
							<span className="ml-2 text-sm font-medium text-fontcolor">
								Yes
							</span>
						</label>
					</div>

					<button
						className="secondary_btn_comp h-10 mr-0 "
						onClick={handleAddProperty}
						id='add_property'
					>
						Add Property
					</button>
				</div>

				<div className="w-full border-b-2 mt-6 border-lightgray" id='view_property'></div>
				{/* <div className=" overflow-y-auto w-full h-32"> */}
				<table className="mt-1 w-full text-fontcolor table-auto">
					<thead className="flex w-full text-left">
						<tr className="tracking-normal flex w-full ">
							<th className="w-2/5">Property Name</th>
							<th className="w-1/5">Data type</th>
							<th className="w-1/5">Restrictions</th>
							<th className="w-1/5">Functional</th>
						</tr>
					</thead>
					<tbody className="text-sm h-32 flex flex-col items-center overflow-y-auto w-full">
						{propertiesList?.map((property, index) => (
							<tr
								className="flex even:bg-gray-100 w-full justify-between"
								key={index}
							>
								<td className="pl-2 py-2 w-2/5">{property.name}</td>
								<td className="pl-2 py-2 w-1/5">{property.datatype}</td>
								<td className="pl-2 py-2 w-1/5">{property.restrictions}</td>
								<td className="pl-2 py-2 w-1/5 flex justify-between">{property.functional}
								<MdDeleteOutline className=' text-primary text-sm cursor-pointer' onClick={() => handleDelete(index)}/>
								</td>
								
							</tr>
						))}
					</tbody>
				</table>
				{/* </div> */}
				<div className="flex items-center justify-center mt-4 w-full">
					<button
						className="primary_btn_comp h-10 mt-5"
						onClick={handleSaveProperties}
						id='submit_properties'
					>
						Save all
					</button>
				</div>
			</Modal>
		</div>
	);
};

export default AddProperties;