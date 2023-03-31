import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fileDownload from "js-file-download";
import { MdLiveHelp } from "react-icons/md";
import "driver.js/dist/driver.min.css";

import { ExcelDownloadUpload, Modal, SaveTaxomony, TaxonomyTree } from "../components";
import { setSubmittedState } from "../features/taxonomies/taxonomySlice";
import { takeTaxonomyTour } from "../tour/mainTours";

const TaxonomyCage = () => {
	const taxonomies = useSelector((store) => store.taxonomies);
	const dispatch = useDispatch();
	// const element = document.getElementById('relationshipcage');

	const [alertTitle, setalertTitle] = useState("");
	const [alertMsg, setalertMsg] = useState("");
	const [isModalOpen, setisModalOpen] = useState(false);
	const [isValidTaxo, setIsValidTaxo] = useState(false);

	const sendTaxonomies = async (data) => {
		const config = {
			method: "post",
			url: "/onto/checkpoint_1/validate",
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		try {
			const response = await axios(config);
			// console.log(response);
			if (response.status === 200) {
				setIsValidTaxo(true);
			} else {
				setIsValidTaxo(false);
			}
		} catch (error) {
			console.error(error);
			setIsValidTaxo(false);
		}
	};

	const downloadOWL = async (data) => {
		const config = {
			method: "post",
			url: "/onto/checkpoint_1/generate",
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		try {
			const response = await axios(config);
			console.log(response);
			if (response.status === "200") {
			}
		} catch (error) {
			console.error(error);
			setIsValidTaxo(false);
		}
		getFile();
	};

	const getFile = () => {
		axios
			.get("/onto/checkpoint_1/download", {
				responseType: "blob",
			})
			.then((res) => {
				fileDownload(res.data, "filename.owl");
			});
	};

	const handleDownloadBtnClick = () => {
		console.log("pressed")
		downloadOWL(JSON.stringify(taxonomies));
	};

	const handleBtnClick = () => {
		setisModalOpen(true);
		if (taxonomies.subclasses?.length > 0) {
			const noProperties = []
			taxonomies.subclasses?.forEach((taxonomy) => {
				if (taxonomy.propertiesList?.length === 0) {
					noProperties.push(taxonomy)
				}
			})
			if (noProperties.length>0) {
				setalertTitle("There are taxonomies with no properties added.");
				setalertMsg(
					"Please make sure all the child taxonomies that extend from root taxonomy has at least one property."
				);
				sendTaxonomies(JSON.stringify(taxonomies));
			}
			else {
				setalertTitle("Are you sure you want to submit all the taxonomies?");
				setalertMsg(
					"After submitting you will NOT be able to add, update, or remove taxonomies or taxonomy details. Therefore, please make sure that you have added properties, disjoint, and overlapping classes to necessary taxonomies."
				);
				sendTaxonomies(JSON.stringify(taxonomies));
				console.log("taxonomies: ", taxonomies)
			}
		} else {
			setalertTitle("Please add taxonomies before submitting.");
		}
	};

	const handleSubmit = () => {
		// console.log('taxonomies: ', taxonomies);
		dispatch(
			setSubmittedState({
				submittedState: true,
			})
		);
		setisModalOpen(false);
		// element.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<div className="w-full h-screen mt-24">
			<div className="flex w-full items-center justify-center gap-4 text-secondary text-2xl mb-4">
				<h1 className="tracking-widest">Add Taxonomies</h1>
				<MdLiveHelp className="cursor-pointer hover:text-primary" onClick={takeTaxonomyTour} />
			</div>
			<div className="h-full">
				<div className="flex h-3/4">
					<div className="w-1/2 border p-3" id="taxonomy_tree">
						<TaxonomyTree />
					</div>
					<div className="w-1/2 border p-3" id="taxonomy_details">
						<SaveTaxomony />
					</div>
				</div>
				<div className="w-full mt-4 flex justify-center items-center font-bold">
					<button className="primary_btn w-auto px-5" onClick={handleBtnClick} id="submit_taxonomies">
						Submit all the taxonomies
					</button>
					{isValidTaxo && (
						<button
							className="primary_btn w-auto px-5"
							onClick={handleDownloadBtnClick}
						>
							Download OWL File
						</button>
					)}

					{
						isValidTaxo && 
						<ExcelDownloadUpload excelsheetId={taxonomies.id} />
					}
				</div>

				<Modal
					open={isModalOpen}
					onClose={() => setisModalOpen(false)}
					fromLeft="left-[10%]"
				>
					<p className="modal_title text-center">{alertTitle}</p>

					<p className="text-primary text-center">{alertMsg}</p>

					{alertMsg !== "" && (
						<div className="flex w-full items-center justify-center mt-4">
							<button className="primary_btn_comp h-10" onClick={handleSubmit}>
								Submit
							</button>

							<button
								className="secondary_btn_comp h-10"
								onClick={() => setisModalOpen(false)}
							>
								Cancel
							</button>
						</div>
					)}
				</Modal>
			</div>
		</div>
	);
};

export default TaxonomyCage;