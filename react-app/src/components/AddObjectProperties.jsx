import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { v4 } from "uuid";
import { AdvancedOP, Modal, SimpleOP } from "../components";
import { saveAs } from "file-saver";

const AddObjectProperties = () => {
	const objectProperties = useSelector((store) => store.objectProperties);
	const taxonomies = useSelector((store) => store.taxonomies);

	const [singleOPobject, setsingleOPobject] = useState({
		id: v4(),
		relationshipLabel: "relationships",
		sessionId: taxonomies.sessionId,
		subrelationships: [],
	});

	const [isSOPsubmitted, setisSOPsubmitted] = useState(false);
	const [isAOPsubmitted, setisAOPsubmitted] = useState(false);
	const [opStatus, setOpStatus] = useState("");
	const [isModalOpen, setisModalOpen] = useState(false);
	const [owlDownloading, setOwlDownloading] = useState(false);
	const [modifiedOPObject, setModifiedOPObject] = useState({});
	const [errMeta, setErrMeta] = useState([]);
	const [errTopic, setErrTopic] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [consistencyCheck, setConsistencyCheck] = useState("UNDEFINED");

	const handleOPCheck = () => {
		setisModalOpen(true);
		setOpStatus("LOADING");

		setsingleOPobject({
			...singleOPobject,
			subrelationships: objectProperties,
		});

		const updatedSubrelationships = singleOPobject.subrelationships.map(
			(subrel) => {
				return {
					...subrel,
					ranges: [subrel.ranges],
				};
			}
		);

		const modifiedJson = {
			...singleOPobject,
			subrelationships: updatedSubrelationships,
		};

		console.log("objectProperties: ", JSON.stringify(modifiedJson));
		setModifiedOPObject(modifiedJson);
		checkOP();
	};

	const checkOP = async () => {
		setConsistencyCheck("UNDEFINED");
		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: `${process.env.REACT_APP_BACKEND_URL}/flask/checkpoint_2/op_generate`,
			headers: {
				"Content-Type": "application/json",
			},
			data: modifiedOPObject,
		};

		axios
			.request(config)
			.then((response) => {
				if (response.data.type === "success") {
					setOpStatus("SUCCESS");
				}
				if (response.data.type === "error") {
					console.log("OP err", response.data);
					setOpStatus("ERROR");
					setErrMeta(response.data.meta);
					setErrMsg(response.data.msg);
					setErrTopic(response.data.topic);
				}
			})
			.catch((error) => {
				console.log(error);
				setOpStatus("ERROR");
			});
	};

	const handleDownloadOWL = async () => {
		setOwlDownloading(true);

		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: `${process.env.REACT_APP_BACKEND_URL}/flask/checkpoint_2/op_generate/download`,
			headers: {
				"Content-Type": "application/json",
			},
			data: modifiedOPObject,
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

	const handleCheckConsistency = async () => {
		setConsistencyCheck("LOADING");
		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: `${process.env.REACT_APP_BACKEND_URL}/flask/checkpoint_2/op_generate/consistency`,
			headers: {
				"Content-Type": "application/json",
			},
			data: modifiedOPObject,
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
		<div className="h-full">
			<div className="flex h-3/4">
				<div className="w-1/2 border p-3" id="simpleOP_cage">
					<SimpleOP
						isSOPsubmitted={isSOPsubmitted}
						setisSOPsubmitted={setisSOPsubmitted}
						isAOPsubmitted={isAOPsubmitted}
					/>
				</div>
				<div className="w-1/2 border p-3" id="advancedOP_cage">
					<AdvancedOP
						isSOPsubmitted={isSOPsubmitted}
						isAOPsubmitted={isAOPsubmitted}
						setisAOPsubmitted={setisAOPsubmitted}
					/>
				</div>
			</div>
			<div className="w-full h-1/4 flex justify-center items-center">
				<button
					className={`primary_btn w-auto font-bold px-5`}
					onClick={handleOPCheck}
					id="submit_all_op"
				>
					Check OPs
				</button>
			</div>

			<Modal
				open={isModalOpen}
				onClose={() => setisModalOpen(false)}
				fromLeft="left-[10%]"
			>
				{opStatus === "NO_TAXO" && (
					<p className="modal_title text-center">
						Please add taxonomies before submitting.
					</p>
				)}

				{opStatus === "LOADING" && (
					<p className="modal_title text-center">Loading . . . </p>
				)}

				{opStatus === "SUCCESS" && (
					<>
						<p className="modal_title text-center mb-2">
							Are you sure you want to submit all the object properties?
						</p>

						<p className="text-primary text-center">
							After submitting you will NOT be able to add, update, or remove
							object properties. Therefore, please make sure that you have added
							required changes.
						</p>

						{consistencyCheck === "CONSISTENT" && (
							<p>Consistency: OWL is consistent</p>
						)}

						{consistencyCheck === "NOT_CONSISTENT" && (
							<p>Consistency: OWL is NOT consistent</p>
						)}

						{consistencyCheck === "UNDEFINED" && (
							<p>Consistency: Not checked yet</p>
						)}
						<p>Your session id: {modifiedOPObject.sessionId}</p>
						{consistencyCheck === "LOADING" && <p>Consistency: Checking...</p>}

						<div className="flex w-full items-center justify-center mt-4">
							<button
								className={`primary_btn_comp h-10 ${
									owlDownloading ? "disabled_btn" : ""
								}`}
								onClick={handleDownloadOWL}
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

				{opStatus === "NO_PROPS" && (
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

				{opStatus === "ERROR" && (
					<>
						<p className="modal_title text-center mb-2">{errTopic}</p>

						<p className="text-primary font-bold ">{errMsg}</p>

						<div className="overflow-y-auto h-32">
							<ul>
								{errMeta.map((item, index) => (
									<li className=" mb-2" key={index}>
										{index + 1}. Concept: {item}
									</li>
								))}
							</ul>
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
	);
};

export default AddObjectProperties;
