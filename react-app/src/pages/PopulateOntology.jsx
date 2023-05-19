import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { TbAlertTriangle } from "react-icons/tb";
import { saveAs } from "file-saver";
import axios from "axios";

const PopulateOntology = () => {
	const [isGenerate, setisGenerate] = useState(false);
	const [isUpload, setisUpload] = useState(false);
	const [isAlertVisible, setisAlertVisible] = useState(false);
	const [alertMsg, setalertMsg] = useState("");
	const [fileName, setfileName] = useState("");
	const [excelsheetId, setexcelsheetId] = useState("");
	const [xlDownloading, setXLDownloading] = useState(false);

	const handleDownloadXL = async () => {
		setXLDownloading(true);
		const data = JSON.stringify({ sessionID: excelsheetId });

		let config = {
			method: "post",
			responseType: "blob",
			maxBodyLength: Infinity,
			url: `${process.env.REACT_APP_BACKEND_URL}/op/checkpoint_1/populate`,
			headers: {
				"Content-Type":
					"application/json",
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
					: `${excelsheetId}.xlsx`;
				saveAs(new Blob([response.data]), fileName);
				setXLDownloading(false);
			})
			.catch((error) => {
				console.log(error);
				setXLDownloading(false);
			});
	};

	const onDrop = useCallback((acceptedFiles) => {
		acceptedFiles.forEach((file) => {
			setfileName(file.name);
			console.log(`Uploaded file: ${file.name}`);
		}, []);
	});
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const handleExcelsheetDownload = () => {
		const downloadUrl = `https://docs.google.com/spreadsheets/d/1b_CvS6WKkIWg74ODpKrzct6kSIJKx_l1ygnpuh9GgTw/export?format=xlsx&filename=${excelsheetId}`;

		const link = document.createElement("a");
		link.href = downloadUrl;
		link.download = `${excelsheetId}.xlsx`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleExcelsheetUpload = () => {
		console.log("Uploaded the file: ", fileName);
	};

	const handleExcelsheetClear = () => {
		setfileName("");
	};

	const checkOntologyIdValidity = () => {
		if (excelsheetId === "") {
			setalertMsg("Please enter the ontology ID.");
			setisAlertVisible(true);
			setTimeout(() => {
				setisAlertVisible(false);
			}, 3000);
			return false;
		} else {
			return true;
		}
	};

	const handleGenerateClick = () => {
		const idValid = checkOntologyIdValidity();
		if (idValid) {
			// check whether the id is matching to available ontologies in the DB
			setisGenerate(true);
			setisUpload(false);
		}
	};

	const handleUploadClick = () => {
		const idValid = checkOntologyIdValidity();
		if (idValid) {
			// check whether the id is matching to available ontologies in the DB
			setisGenerate(false);
			setisUpload(true);
		}
	};

	return (
		<div className="w-full mt-24 text-fontcolor">
			<div className="flex w-full items-center justify-center gap-4 text-secondary text-2xl mb-4">
				<h1 className="tracking-widest">Populate Ontology</h1>
				{/* <MdLiveHelp className="cursor-pointer hover:text-primary" onClick={takeTaxonomyTour} /> */}
			</div>

			<p className="font-semibold text-primary text-center my-2">
				Please note that OntoBot populates ONLY the ontologies that are created
				using OntoBot.
			</p>
			<p className="font-normal">
				As you created the ontology and dowloaded the OWL file, OntoBot gave you
				a <span className="font-semibold text-secondary">unique id</span> for
				your ontology. We even adviced you to copy it as it is required for the
				population. First, enter the{" "}
				<span className="font-semibold text-secondary">ontology id</span>.
				<br></br>
				If you want to generate the{" "}
				<span className="font-semibold text-secondary">excel sheet </span>{" "}
				related to your ontology, click{" "}
				<span className="font-semibold text-secondary">
					Generate Excel Sheet
				</span>
				.<br></br>
				If you already have{" "}
				<span className="font-semibold text-secondary">completed</span> your
				excel sheet, click{" "}
				<span className="font-semibold text-secondary">Upload Excel Sheet</span>
				.
			</p>

			<div className="mt-4 w-full">
				{isAlertVisible && (
					<div className="alert_style">
						<TbAlertTriangle className="mr-2" />
						<p>{alertMsg}</p>
					</div>
				)}

				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-4">
						<p>Enter ontology Id*</p>
						<input
							type="text"
							className="p-2 border border-gray-300 rounded-md outline-secondary w-[400px]"
							placeholder="Ontology ID"
							value={excelsheetId}
							onChange={(e) => setexcelsheetId(e.target.value)}
						/>
					</div>

					<div className="flex items-center">
						<button
							className="primary_btn_comp w-fit"
							onClick={handleDownloadXL}
						>
							{xlDownloading ? "Generating..." : "Generate Excel Sheet"}
						</button>
						<button
							className="secondary_btn_comp w-fit"
							onClick={handleUploadClick}
						>
							Upload Excel Sheet
						</button>
					</div>
				</div>
			</div>

			{/* {
                isGenerate && <>
                    <p className="mt-4 font-normal underline underline-offset-2 cursor-pointer hover:font-semibold w-fit text-secondary" onClick={handleExcelsheetDownload}>
                        Click here to download the Excel Sheet
                    </p>
                    <p className="text-primary"> Please note that you should <span className='font-semibold'>Not</span> change names of the columns and rows in the excel sheet.</p>
                </>
            } */}

			{isUpload && (
				<div>
					<p className="mt-8 mb-2 modal_title flex items-start">
						The excel sheet is already filled?
					</p>

					<div
						{...getRootProps()}
						className="bg-gray-100 p-4 rounded-md border-dashed border-2 border-gray-400 text-center cursor-pointer"
					>
						<input {...getInputProps()} />
						{isDragActive ? (
							<p>Drop the Excel file here</p>
						) : (
							<>
								<p>
									Drag and drop an Excel file here, or click to select a file
								</p>
								<p>Only .xlsx and .xls files are allowed</p>
								<p className="font-normal text-secondary mt-2">{fileName}</p>
							</>
						)}
					</div>

					<div className="flex justify-center items-center w-full mt-6">
						<button
							className="secondary_btn_comp h-fit"
							onClick={handleExcelsheetUpload}
						>
							Submit
						</button>

						<button
							className="primary_btn_comp h-fit"
							onClick={handleExcelsheetClear}
						>
							Clear
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default PopulateOntology;
