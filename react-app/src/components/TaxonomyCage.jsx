import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Modal, SaveTaxomony, TaxonomyTree } from "../components";

import { setSubmittedState } from "../features/taxonomies/taxonomySlice";

const TaxonomyCage = () => {
	const taxonomies = useSelector((store) => store.taxonomies);
	const dispatch = useDispatch();
	const element = document.getElementById('relationshipcage');

	const [isModalOpen, setisModalOpen] = useState(false);
	const [alertTitle, setalertTitle] = useState("");
	const [alertMsg, setalertMsg] = useState("");

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
			console.log(JSON.stringify(response));
		} catch (error) {
			console.error(error);
		}
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
		// console.log('taxonomies: ', taxonomies);
		dispatch(
			setSubmittedState({
				submittedState: true,
			})
		);
		setisModalOpen(false);
		element.scrollIntoView({ behavior: 'smooth' });
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

				{ 	!taxonomies.submitted &&
					<div className="w-full h-1/4 flex justify-center items-center font-bold">
						<button className="primary_btn w-auto px-5" onClick={handleBtnClick}>
							Submit all the taxonomies
						</button>
					</div>
				}

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
