import React, { useState, useCallback } from 'react'
import {useDropzone} from 'react-dropzone'
// import { v4 } from 'uuid'
import { AiOutlineCloseCircle } from 'react-icons/ai'

import Modal from './Modal'

const ExcelDownloadUpload = ({ excelsheetId }) => {

    // const [isExcelDownloaded, setisExcelDownloaded] = useState(false)
    const [isDownloadModalVisible, setisDownloadModalVisible] = useState(false)
    const [fileName, setfileName] = useState('')

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach(file => {
            setfileName(file.name)
            console.log(`Uploaded file: ${file.name}`);
        }, []);
    })
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    const handleExcelsheetDownload = () => {
        const downloadUrl = `https://docs.google.com/spreadsheets/d/1b_CvS6WKkIWg74ODpKrzct6kSIJKx_l1ygnpuh9GgTw/export?format=xlsx&filename=${excelsheetId}`;

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${excelsheetId}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleExcelsheetUpload = () => {
        console.log("Uploaded the file: ", fileName)
        setisDownloadModalVisible(false)
    }

    return (
        <div>
            <button
                className="primary_btn w-auto px-5"
                onClick={() => setisDownloadModalVisible(true)}
            >
                Populate Ontology
            </button>

            <Modal open={isDownloadModalVisible} onClose={() => setisDownloadModalVisible(false)} fromTop="top-[15%]" fromLeft='left-[10%]'>
                <div className="flex items-center justify-between w-full mb-2">
					<div className="flex items-center justify-center gap-4">
						<p className="modal_title">Add instances and Populate Ontology</p>
							
						{/* <MdLiveHelp className="tour_icon" onClick={takeAtour} /> */}
					</div>
					<AiOutlineCloseCircle 
						onClick={() => setisDownloadModalVisible(false)} 
						className='modal_close_icon' 
					/>
                </div>

                <div className="">
                    <p className="font-normal">
                        Now that you have created your ontology, next step is <span className="font-semibold text-primary">Ontology Population</span>.
                        We have provided you with a <span className="font-semibold text-primary">downloadable excel sheet</span> which
                        includes all the taxonomies and data properties that you have entered. All you have to do is filling it and uploading it back.
                        You are given <span className="font-semibold text-primary">a unique id</span> incase you might take time to upload back.
                    </p>

                    <div className="mt-4 ml-4">
                        <p className="" >
                            Your Id is: <span className="font-semibold text-primary">{excelsheetId}</span>
                        </p>
                        <p className="mt-2 font-normal underline underline-offset-2 cursor-pointer hover:font-semibold w-fit text-secondary" onClick={handleExcelsheetDownload}>
                            Click here to download the Excel Sheet
                        </p>
                    </div>

                    <div className="">
                        <p className="mt-8 mb-2 modal_title flex items-start">Has filled the excel sheet already?</p>

                        <div {...getRootProps()} className="bg-gray-100 p-4 rounded-md border-dashed border-2 border-gray-400 text-center cursor-pointer">
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p>Drop the Excel file here</p>
                            ) : (
                                <>
                                    <p>Drag and drop an Excel file here, or click to select a file</p>
                                    <p>Only .xlsx and .xls files are allowed</p>
                                    <p className="font-normal text-secondary mt-2">{fileName}</p>
                                </>
                            )}
                        </div>

                        <div className="flex justify-center items-center w-full mt-6">
                            <button 
                                className="secondary_btn_comp h-8 p-0 px-2"
                                onClick={handleExcelsheetUpload}
                                // id='save_relationshipdetails'
                                // disabled={addConstraints}
                            >
                                Submit
                            </button>

                            <button 
                                className="primary_btn_comp h-8 p-0"
                                onClick={() => setisDownloadModalVisible(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ExcelDownloadUpload