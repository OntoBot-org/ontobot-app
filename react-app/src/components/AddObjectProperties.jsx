import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { v4 } from "uuid";
import { AdvancedOP, Modal, SimpleOP } from "../components";

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

	const handleSubmitOPList = () => {
		setisModalOpen(true);

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

		sendOPs(modifiedJson);
	};

	const sendOPs = async (data) => {
		setOpStatus("LOADING");

		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "http://127.0.0.1:5000/flask/checkpoint_2/op_generate",
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		axios
			.request(config)
			.then((response) => {
				console.log(JSON.stringify(response.data));
				if (response.data.type === "success") {
					console.log("success");
					setOpStatus("SUCCESS");
				}
			})
			.catch((error) => {
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
					className="primary_btn w-auto font-bold"
					onClick={handleSubmitOPList}
					id="submit_all_op"
				>
					Submit all the Relationships
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
					<p className="modal_title text-center">loading</p>
				)}

				{opStatus === "SUCCESS" && (
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
							<button className="primary_btn_comp h-10" onClick={() => null}>
								Submit !
							</button>

							<button className="primary_btn_comp h-10" onClick={() => null}>
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
						{/* <p className="modal_title text-center mb-2">{errTopic}</p> */}

						<p className="text-primary font-bold ">
							These concepts doesn't belong to any pattern:
						</p>
						{/* <div className="overflow-y-auto h-30">
							{errConcepts.map((item, index) => (
								<p className=" mb-1 text-sm" key={index}>
									{index + 1}. {item}
								</p>
							))}
						</div> */}

						<p className="text-primary font-bold mt-2">Issues found:</p>
						{/* <div className="overflow-y-auto h-60">
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
						</div> */}

						<p className="text-primary font-bold mt-2">
							Ontobot's suggestions:
						</p>
						{/* <div className="overflow-y-auto h-30">
							{errContent.map((item, index) => (
								<p className=" mb-1" key={index}>
									{index + 1}. {item}
								</p>
							))}
						</div> */}

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
