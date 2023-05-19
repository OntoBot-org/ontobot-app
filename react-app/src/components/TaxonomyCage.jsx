import axios from "axios";
import "driver.js/dist/driver.min.css";
import { saveAs } from "file-saver";
import React, { useState } from "react";
import { MdLiveHelp } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Modal, SaveTaxomony, TaxonomyTree } from "../components";
import { setSubmittedState } from "../features/taxonomies/taxonomySlice";
import { takeTaxonomyTour } from "../tour/mainTours";

const TaxonomyCage = () => {
	const taxonomies = useSelector((store) => store.taxonomies);
	const dispatch = useDispatch();

	const [isModalOpen, setisModalOpen] = useState(false);
	const [taxonomyStatus, setTaxonomyStatus] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [owlDownloading, setOwlDownloading] = useState(false);
	const [errMeta, setErrMeta] = useState([]);
	const [errTopic, setErrTopic] = useState("");
	const [errConcepts, setErrConcepts] = useState([]);
	const [errContent, setErrContent] = useState([]);
	const [consistencyCheck, setConsistencyCheck] = useState("UNDEFINED");

	const sendTaxonomies = async (data) => {
		const config = {
			method: "post",
			url: `${process.env.REACT_APP_BACKEND_URL}/flask/checkpoint_1/taxowl_validate`,
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		console.log("taxo", data);

		try {
			setTaxonomyStatus("LOADING");
			const response = await axios(config);
			if (response.data.type === "success") {
				setTaxonomyStatus("SUCCESS");
			} else {
				console.log("Error:", response.data);
				setErrConcepts(response.data.msg.concepts);
				setErrContent(response.data.msg.content);
				setErrTopic(response.data.topic);
				setErrMeta(response.data.meta);
				setTaxonomyStatus("ERROR");
			}
		} catch (error) {
			console.error(error);
			setTaxonomyStatus("ERROR");
		}
	};

	const handleDownloadOWL = async () => {
		setOwlDownloading(true);
		const data = JSON.stringify(taxonomies);

		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: `${process.env.REACT_APP_BACKEND_URL}/flask/checkpoint_1/taxowl_generate`,
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};
		axios
			.request(config)
			.then((response) => {
				const contentDispositionHeader =
					response.headers["content-disposition"];
				const fileName = contentDispositionHeader
					? contentDispositionHeader.split(";")[1].split("filename=")[1].trim()
					: "file.owl";
				saveAs(new Blob([response.data]), fileName);
				setOwlDownloading(false);
			})
			.catch((error) => {
				console.log(error);
				setOwlDownloading(false);
			});
	};

	const handleCheckTaxo = () => {
		setisModalOpen(true);
		setConsistencyCheck("UNDEFINED");

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
		setSubmitted(true);
	};

	const handleCheckConsistency = async () => {
		setConsistencyCheck("LOADING");

		const data = JSON.stringify(taxonomies);
		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: `${process.env.REACT_APP_BACKEND_URL}/flask/checkpoint_1/taxowl_generate/consistency`,
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		axios
			.request(config)
			.then((response) => {
				if (response.data.type === "success") {
					setConsistencyCheck("CONSISTENT");
				} else {
					setConsistencyCheck("NOT_CONSISTENT");
				}
			})
			.catch((error) => {
				setConsistencyCheck("CONSISTENT_ERR");
				console.log(error);
			});
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
				{!submitted ? (
					<div className="w-full mt-4 flex justify-center items-center font-bold">
						<button
							className="primary_btn w-auto px-5"
							onClick={handleCheckTaxo}
							id="submit_taxonomies"
						>
							{taxonomyStatus === "LOADING" ? "Loading..." : "Check taxonomies"}
						</button>
					</div>
				) : (
					<p className="w-full mt-4 flex justify-center items-center font-bold">
						Already Submitted
					</p>
				)}

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
						<p className="modal_title text-center">Loading . . . </p>
					)}

					{taxonomyStatus === "SUCCESS" && (
						<>
							<p className="modal_title text-center mb-2">
								Are you sure you want to submit all the taxonomies?
							</p>
							<p className="text-primary text-center">
								After submitting you will NOT be able to add, update, or remove
								taxonomies or taxonomy details. Therefore, please make sure that
								you have added properties, disjoint, and overlapping classes to
								necessary taxonomies.
							</p>
							<p>Your session id: {taxonomies.sessionId}</p>
							{consistencyCheck === "CONSISTENT" && (
								<p>Consistency: OWL is consistent</p>
							)}

							{consistencyCheck === "NOT_CONSISTENT" && (
								<p>Consistency: OWL is NOT consistent</p>
							)}

							{consistencyCheck === "UNDEFINED" && (
								<p>Consistency: Not checked yet</p>
							)}

							{consistencyCheck === "LOADING" && (
								<p>Consistency: Checking...</p>
							)}

							<div className="flex w-full items-center justify-center mt-4">
								<button
									className="primary_btn_comp h-10"
									onClick={handleSubmit}
								>
									Submit !
								</button>

								<button
									className={`primary_btn_comp h-10 ${
										owlDownloading ? "disabled_btn" : ""
									}`}
									onClick={handleDownloadOWL}
									disabled={owlDownloading}
								>
									{owlDownloading ? "Downloading..." : "Download OWL"}
								</button>

								<button
									className={`primary_btn_comp h-10 ${
										consistencyCheck === "LOADING" ? "disabled_btn" : ""
									}`}
									disabled={consistencyCheck === "LOADING"}
									onClick={handleCheckConsistency}
								>
									Consistency
								</button>

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
							<p className="modal_title text-center mb-2">{errTopic}</p>

							<p className="text-primary font-bold ">
								These concepts doesn't belong to any pattern:
							</p>
							<div className="overflow-y-auto h-30">
								{errConcepts.map((item, index) => (
									<p className=" mb-1 text-sm" key={index}>
										{index + 1}. {item}
									</p>
								))}
							</div>

							<p className="text-primary font-bold mt-2">Issues found:</p>
							<div className="overflow-y-auto h-60">
								<ul>
									{errMeta.map((item, index) => (
										<li className=" mb-2" key={index}>
											{index + 1}. Concept: {item.name} | Stereotype:{" "}
											{item.stereotype}
											<ul className="list-disc	">
												{errMeta.map((item, index) => (
													<li className="text-sm ml-5 mb-1" key={index}>
														{item.suggestion}
													</li>
												))}
											</ul>
										</li>
									))}
								</ul>
							</div>

							<p className="text-primary font-bold mt-2">
								Ontobot's suggestions:
							</p>
							<div className="overflow-y-auto h-30">
								{errContent.map((item, index) => (
									<p className=" mb-1" key={index}>
										{index + 1}. {item}
									</p>
								))}
							</div>

							<div className="flex w-full items-center justify-center mt-4">
								<button
									className="secondary_btn_comp h-10"
									onClick={() => setisModalOpen(false)}
								>
									Try again
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
