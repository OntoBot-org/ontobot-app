import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Modal, SaveTaxomony, TaxonomyTree } from "../components";

import { setSubmittedState } from "../features/taxonomies/taxonomySlice";

const TaxonomyCage = () => {
	const taxonomies = useSelector((store) => store.taxonomies);
	const dispatch = useDispatch();

	const [isModalOpen, setisModalOpen] = useState(false);
	const [alertTitle, setalertTitle] = useState("");
	const [alertMsg, setalertMsg] = useState("");
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

		// try {
		// 	const response = await axios(config);
		// 	console.log(response);
		// 	if (response.status === "200") {
		// 		console.log("ok");
		// 		let url = window.URL.createObjectURL(response.data);
		// 		let a = document.createElement("a");
		// 		a.href = url;
		// 		a.download = "employees.json";
		// 		a.click();
		// 	}
		// 	window.location.href = response.data;
		// } catch (error) {
		// 	console.error(error);
		// 	setIsValidTaxo(false);
		// }

		try {
			const response = await axios(config);
			console.log(response);
			if (response.status === "200") {
				// create file link in browser's memory
				const href = URL.createObjectURL(response.data);

				// create "a" HTML element with href to file & click
				const link = document.createElement("a");
				link.href = href;
				link.setAttribute("download", "file.owl"); //or any other extension
				document.body.appendChild(link);
				link.click();

				// clean up "a" element & remove ObjectURL
				document.body.removeChild(link);
				URL.revokeObjectURL(href);
			}
		} catch (error) {
			console.error(error);
			setIsValidTaxo(false);
		}
	};

	const handleDownloadBtnClick = () => {
		downloadOWL(JSON.stringify(taxonomies));
	};

	const handleBtnClick = () => {
		setisModalOpen(true);
		if (taxonomies.subclasses?.length > 0) {
			setalertTitle("Are you sure you want to submit all the taxonomies?");
			setalertMsg(
				"After submitting you will NOT be able to add, update, or remove taxonomies or taxonomy details."
			);
			sendTaxonomies(JSON.stringify(taxonomies));
		} else {
			setalertTitle("Please add taxonomies before submitting.");
		}
	};

	const handleSubmit = () => {
		dispatch(
			setSubmittedState({
				submittedState: true,
			})
		);
		setisModalOpen(false);
	};

	return (
		<div className="w-full h-screen pt-20">
			<div className="h-full">
				<div className="flex h-3/4">
					<div className="w-1/2 border p-3">
						<TaxonomyTree />
					</div>
					<div className="w-1/2 border p-3">
						<SaveTaxomony />
					</div>
				</div>
				<div className="w-full h-1/4 flex justify-center items-center font-bold">
					<button className="primary_btn w-auto px-5" onClick={handleBtnClick}>
						Subtmit all the taxonomies
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
					fromLeft="left-[20%]"
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
