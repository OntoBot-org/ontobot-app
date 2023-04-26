import React, { useState } from "react";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

import { SimpleOP, AdvancedOP } from "../components";

const AddObjectProperties = () => {
	const objectProperties = useSelector((store) => store.objectProperties);
	const [singleOPobject, setsingleOPobject] = useState({
		id: v4(),
		relationshipLabel: "relationships",
		sessionID: v4(),
		subrelationships: [],
	});

	const [isSOPsubmitted, setisSOPsubmitted] = useState(false);
	const [isAOPsubmitted, setisAOPsubmitted] = useState(false);

	const handleSubmitOPList = () => {
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

		const finalJSON = {
			...singleOPobject,
			subrelationships: updatedSubrelationships,
		};

		const updatedJsonData = { ...finalJSON };

		updatedJsonData.sessionId = updatedJsonData.sessionID;
		delete updatedJsonData.sessionID;

		console.log("objectProperties: ", JSON.stringify(updatedJsonData));
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
					className="primary_btn w-auto"
					onClick={handleSubmitOPList}
					id="submit_all_op"
				>
					Submit all the Relationships
				</button>
			</div>
		</div>
	);
};

export default AddObjectProperties;
