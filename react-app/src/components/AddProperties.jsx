import React, { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { TbAlertTriangle } from "react-icons/tb";
import { v4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";

import Modal from "./Modal";
import { saveProperties } from "../features/taxonomies/taxonomySlice";
import PropertiesList from "./PropertiesList";

const AddProperties = ({ selectedTaxonomy }) => {
	const taxonomies = useSelector((store) => store.taxonomies);

	const [isModalVisible, setisModalVisible] = useState(false);
	const [propertiesList, setpropertiesList] = useState([]);
	const [enabled, setEnabled] = useState(true);
	const [isAlertVisible, setisAlertVisible] = useState(false);
	const [alertMsg, setalertMsg] = useState("");
	const [isPropertiesSaved, setisPropertiesSaved] = useState(false);
	const [newProperty, setnewProperty] = useState({
		id: "",
		name: "",
		datatype: "",
		restrictions: "",
		functional: "yes",
	});

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
			console.log("Please select a taxonomy from the taxonomy tree");
		} else {
			setisModalVisible(!isModalVisible);
		}
	};

	const handleAddProperty = (event) => {
		event.preventDefault();

		if (newProperty.name === "" || newProperty.datatype === "") {
			setalertMsg(
				"Please note that Porperty name and Data type are required fields."
			);
			setisAlertVisible(true);

			setTimeout(() => {
				setisAlertVisible(false);
			}, 3000);
		} else {
			const newPropertyObj = {
				id: v4(),
				name: newProperty.name,
				datatype: newProperty.datatype,
				restrictions: newProperty.restrictions,
				functional: newProperty.functional,
			};

			const updatedPropertyList = [...propertiesList, newPropertyObj];
			setpropertiesList(updatedPropertyList);

			setnewProperty({
				id: "",
				name: "",
				datatype: "",
				restrictions: "",
				functional: "yes",
			});

			setEnabled(true);
		}
	};

	const handleSaveProperties = () => {
		if (propertiesList?.length === 0) {
			setalertMsg("Please add at least one property.");
			setisAlertVisible(true);

			setTimeout(() => {
				setisAlertVisible(false);
			}, 3000);
		} else {
			dispatch(
				saveProperties({
					taxonomyId: selectedTaxonomy.id,
					propertiesList: propertiesList,
				})
			);
			setisModalVisible(false);
			setisPropertiesSaved(true);
			setpropertiesList([]);
			// console.log('taxonomies: ', taxonomies)
		}
	};

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
				// fromTop='top-[35%]'
				fromLeft="left-[10%]"
			>
				<p className="modal_title">
					Add properties of{" "}
					<span className="font-bold text-secondary">
						{selectedTaxonomy.name}
					</span>{" "}
					class.
				</p>

				{isAlertVisible && (
					<div className="alert_style">
						<TbAlertTriangle className="mr-2" />
						<p>{alertMsg}</p>
					</div>
				)}
				<div className="flex justify-between gap-6 items-center text-fontcolor">
					<div className="flex flex-col gap-2">
						<p className="">Property Name*:</p>
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

					<div className="flex flex-col gap-2">
						<p className="">Data type*:</p>
						<input
							type="text"
							className="p-2 border border-gray-300 rounded-md outline-secondary"
							placeholder="string"
							value={newProperty.datatype}
							onChange={(e) =>
								setnewProperty({ ...newProperty, datatype: e.target.value })
							}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<p className="">Restrictions:</p>
						<input
							type="text"
							className="p-2 border border-gray-300 rounded-md outline-secondary"
							placeholder="not null"
							value={newProperty.restrictions}
							onChange={(e) =>
								setnewProperty({ ...newProperty, restrictions: e.target.value })
							}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<p className="">Functional:</p>
						<label className="inline-flex relative items-center mr-5 cursor-pointer">
							<input
								type="checkbox"
								className="sr-only peer"
								checked={enabled}
								onClick={() =>
									newProperty.functional === "yes"
										? setnewProperty({ ...newProperty, functional: "no" })
										: setnewProperty({ ...newProperty, functional: "yes" })
								}
								onChange={() => setEnabled(!enabled)}
							/>
							<div className="w-11 h-6 bg-lightgray rounded-full peer  peer-focus:ring-secondary  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-lightgray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
							<span className="ml-2 text-sm font-medium text-gray-900">
								Yes
							</span>
						</label>
					</div>

					<button
						className="secondary_btn_comp h-10 mr-0"
						onClick={handleAddProperty}
					>
						Add Property
					</button>
				</div>

				<div className="w-full border-b-2 mt-6 border-lightgray"></div>
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
								<td className="pl-2 py-2 w-1/5">{property.functional}</td>
							</tr>
						))}
					</tbody>
				</table>
				{/* </div> */}
				<div className="flex items-center justify-center mt-4 w-full">
					<button
						className="primary_btn_comp h-10 mt-5"
						onClick={handleSaveProperties}
					>
						Save all
					</button>
				</div>
			</Modal>
		</div>
	);
};

export default AddProperties;
