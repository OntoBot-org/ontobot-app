import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fileDownload from "js-file-download";
import { MdLiveHelp } from "react-icons/md";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";

import { Modal, SaveTaxomony, TaxonomyTree } from "../components";
import { setSubmittedState } from "../features/taxonomies/taxonomySlice";
import { tooltipDescriptions } from '../data/tooltipDescriptions'

const TaxonomyCage = () => {
	const taxonomies = useSelector((store) => store.taxonomies);
	const dispatch = useDispatch();
	// const element = document.getElementById('relationshipcage');

	const [isModalOpen, setisModalOpen] = useState(false);
	const [alertTitle, setalertTitle] = useState("");
	const [alertMsg, setalertMsg] = useState("");
	const [isValidTaxo, setIsValidTaxo] = useState(false);

	const takeAtour = () => {
		const driver = new Driver({
			animate: true,
			opacity: 0.50,
			allowClose: false,
			doneBtnText: "Finish",
		});
	  
		driver.defineSteps([
			{
				element: "#taxonomy_tree",
				popover: {
					title: "Step 1: Create Taxonomy Tree",
					description: tooltipDescriptions.taxonomy_tree,
					position: "right",
				},
			},
			{
				element: "#taxonomy_details",
				popover: {
					title: "Step 2: Save Taxonomy Details",
					description: tooltipDescriptions.taxonomy_details,
					position: "left",
				},
			},
			{
				element: "#submit_taxonomies",
				popover: {
					title: "Step 3: Submit Taxonomy Tree",
					description: tooltipDescriptions.submit_taxonomies,
					position: "top",
				},
			},
		])

		driver.start();
	}

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
			console.log(response);
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
		downloadOWL(JSON.stringify(taxonomies));
	};

	const handleBtnClick = () => {
		setisModalOpen(true);
		if (taxonomies.subclasses?.length > 0) {
			setalertTitle("Are you sure you want to submit all the taxonomies?");
			setalertMsg(
				"After submitting you will NOT be able to add, update, or remove taxonomies or taxonomy details. Therefore, please make sure that you have added properties, disjoint, and overlapping classes to necessary taxonomies."
			);
			sendTaxonomies(JSON.stringify(taxonomies));
		} else {
			setalertTitle("Please add taxonomies before submitting.");
		}
	};

	const handleSubmit = () => {
		console.log('taxonomies: ', taxonomies);
		dispatch(
			setSubmittedState({
				submittedState: true,
			})
		);
		setisModalOpen(false);
		// element.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<div className="w-full h-screen pt-20">
			<div className="flex w-full items-center justify-center gap-4 text-secondary text-2xl mb-4">
				<h1 className="tracking-widest">Add Taxonomies</h1>
				<MdLiveHelp className="cursor-pointer hover:text-primary" onClick={takeAtour} />
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
							Download OWL
						</button>
					)}
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
