import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import Title from "../components/Title";
import ProgressBar from "../components/ProgressBar";
import axios from "axios";
import backgroundImage from "../assets/background/x4.jpg";

const XRayDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Backend API URL (must be defined in .env file as VITE_XRAY_BACKEND_URL)
  const backendUrl = import.meta.env.VITE_XRAY_BACKEND;

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      // File type validation
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Invalid file type. Please upload an image.");
        return;
      }

      setSelectedFile(file);
      setIsAnalyzing(true);
      setErrorMessage("");

      const formData = new FormData();
      formData.append("image", file);
      formData.append("question", "Analyze this X-ray");
      formData.append("llm", "gpt-3.5-turbo");

      try {
        const response = await axios.post(`${backendUrl}/xray`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data && response.data.table) {
          setTableData(response.data.table);
        } else {
          setTableData("No analysis data received.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setTableData(null);
        setErrorMessage("Error analyzing X-ray. Please try again.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setIsAnalyzing(false);
    setTableData(null);
    setErrorMessage("");
  };

  return (
    <div
      className="relative py-3 px-5 bg-cover bg-center w-full min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Title name="X-Ray Insight" />
      <div className="relative flex justify-center items-center h-full mt-10">
        {!selectedFile ? (
          <label className="flex flex-col items-center cursor-pointer w-11/12 sm:w-8/12 md:w-8/12 lg:w-8/12 h-40 justify-center border-2 border-dashed p-5 text-center bg-cyan-50/60 text-gray-500 rounded-lg">
            <IoCloudUploadOutline size={60} className="text-gray-500 mb-2" />
            <p className="text-sm sm:text-base">
              Drag and drop an image here, or click to <b>browse a file</b>
            </p>
            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="w-11/12 sm:w-8/12 md:w-9/12 lg:w-8/12 text-center flex flex-col items-center relative bg-cyan-50/70 text-gray-800 p-5 rounded-lg">
            <button onClick={handleReset} className="absolute top-2 right-2 text-white bg-red-600 p-2 rounded-full">
              <FaTimes size={16} />
            </button>
            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-40 h-40 object-contain mx-auto mb-2" />
            {isAnalyzing ? (
              <ProgressBar />
            ) : (
              <div className="mt-4 text-center">
                <h1 className="text-xl sm:text-2xl mb-2 text-cyan-700 underline">X-Ray Information</h1>
                {errorMessage ? (
                  <p className="text-sm sm:text-base text-red-600">{errorMessage}</p>
                ) : tableData ? (
                  <p className="text-sm sm:text-base">{tableData}</p>
                ) : (
                  <p className="text-sm sm:text-base text-gray-600">Upload an X-ray to analyze.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default XRayDetection;
