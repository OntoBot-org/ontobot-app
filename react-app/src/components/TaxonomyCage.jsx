import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fileDownload from "js-file-download";
import { MdLiveHelp } from "react-icons/md";
import "driver.js/dist/driver.min.css";
import { saveAs } from "file-saver";

import {
	ExcelDownloadUpload,
	Modal,
	SaveTaxomony,
	TaxonomyTree,
} from "../components";
import { setSubmittedState } from "../features/taxonomies/taxonomySlice";
import { takeTaxonomyTour } from "../tour/mainTours";

const TaxonomyCage = () => {
	const taxonomies = useSelector((store) => store.taxonomies);
	const dispatch = useDispatch();

	const [alertTitle, setalertTitle] = useState("");
	const [alertMsg, setalertMsg] = useState("");
	const [isModalOpen, setisModalOpen] = useState(false);
	const [isValidTaxo, setIsValidTaxo] = useState(false);

	const [taxonomyStatus, setTaxonomyStatus] = useState("");
	const [cancelBtnOnly, setCancelBtnOnly] = useState(false);
	const [hotResponse, setHotResponse] = useState("");
	const [loading, setLoading] = useState(false);

	const sendTaxonomies = async (data) => {
		const config = {
			method: "post",
			url: "http://localhost:5000/flask/checkpoint_1/taxowl_validate",
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		try {
			setTaxonomyStatus("LOADING");
			const response = await axios(config);
			// console.log(response);
			setHotResponse(response.data.type);
			setLoading(false);
			if (response.data.type === "success") {
				setTaxonomyStatus("SUCCESS");
			} else {
				setTaxonomyStatus("ERROR");
			}
		} catch (error) {
			console.error(error);
			setTaxonomyStatus("ERROR");
		}
	};

	const handleDownloadOWL = async () => {
		const data = JSON.stringify(taxonomies);
		console.log(data);
		axios
			.post("http://localhost:5000/flask/checkpoint_1/taxowl_generate", data, {
				responseType: "blob", // set the response type to blob
			})
			.then((response) => {
				const contentDispositionHeader =
					response.headers["content-disposition"];
				const fileName = contentDispositionHeader
					? contentDispositionHeader.split(";")[1].split("filename=")[1].trim()
					: "file.owl";
				saveAs(new Blob([response.data]), fileName);
			})
			.catch((error) => {
				console.error(error);
			});
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

	const handleSubmitAllTaxo = () => {
		setisModalOpen(true);
		if (taxonomies.subclasses?.length > 0) {
			const noProperties = [];
			taxonomies.subclasses?.forEach((taxonomy) => {
				if (taxonomy.propertiesList?.length === 0) {
					noProperties.push(taxonomy);
				}
			});
			if (noProperties.length > 0) {
				setTaxonomyStatus("NO_PROPS");
			} else {
				sendTaxonomies(JSON.stringify(taxonomies));
			}
		} else {
			setTaxonomyStatus("NO_TAXO");
		}
	};

	const handleSubmit = () => {
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
				<MdLiveHelp
					className="cursor-pointer hover:text-primary"
					onClick={takeTaxonomyTour}
				/>
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
					<button
						className="primary_btn w-auto px-5"
						onClick={handleSubmitAllTaxo}
						id="submit_taxonomies"
					>
						{loading ? "Loading..." : "Check taxonomies"}
					</button>
				</div>
				<div className="bg-yellow-300">
					Response: {loading ? "Loading" : hotResponse}
				</div>

				<Modal
					open={isModalOpen}
					onClose={() => setisModalOpen(false)}
					fromLeft="left-[10%]"
				>
					{taxonomyStatus === "NO_TAXO" && (
						<p className="modal_title text-center">
							Please add taxonomies before submitting.
						</p>
					)}

					{taxonomyStatus === "LOADING" && (
						<p className="modal_title text-center">loading</p>
					)}

					{taxonomyStatus === "SUCCESS" && (
						<>
							<p className="modal_title text-center">
								Are you sure you want to submit all the taxonomies?
							</p>

							<p className="text-primary text-center">
								After submitting you will NOT be able to add, update, or remove
								taxonomies or taxonomy details. Therefore, please make sure that
								you have added properties, disjoint, and overlapping classes to
								necessary taxonomies.
							</p>

							<div className="flex w-full items-center justify-center mt-4">
								<button
									className="primary_btn_comp h-10"
									onClick={handleSubmit}
								>
									Submit !
								</button>

								<button
									className="primary_btn_comp h-10"
									onClick={handleDownloadOWL}
								>
									Download OWL
								</button>

								{/* <button className="primary_btn_comp h-10" onClick={() => null}>
									Check Consistency
								</button> */}

								<button
									className="secondary_btn_comp h-10"
									onClick={() => setisModalOpen(false)}
								>
									Cancel
								</button>
							</div>
						</>
					)}
					{taxonomyStatus === "NO_PROPS" && (
						<>
							<p className="modal_title text-center">
								There are taxonomies with no properties added.
							</p>

							<p className="text-primary text-center">
								Please make sure all the child taxonomies that extend from root
								taxonomy has at least one property.
							</p>
							<div className="flex w-full items-center justify-center mt-4">
								<button
									className="secondary_btn_comp h-10"
									onClick={() => setisModalOpen(false)}
								>
									Cancel
								</button>
							</div>
						</>
					)}

					{taxonomyStatus === "ERROR" && (
						<>
							<p className="modal_title text-center">Some error</p>

							<p className="text-primary text-center">err</p>
							<div className="flex w-full items-center justify-center mt-4">
								<button
									className="secondary_btn_comp h-10"
									onClick={() => setisModalOpen(false)}
								>
									Cancel
								</button>
							</div>
						</>
					)}
				</Modal>
			</div>
		</div>
	);
};

export default TaxonomyCage;
