import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import  backgroundImage from '../assets/background/x4.jpg'

const XRayDetection = ({ name }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsAnalyzing(true);
      setTimeout(() => {
        setAnalysisResult({
          diagnosis: "No abnormalities detected",
          confidence: "98%",
        });
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setIsAnalyzing(true);
      setTimeout(() => {
        setAnalysisResult({
          diagnosis: "No abnormalities detected",
          confidence: "98%",
        });
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setIsAnalyzing(false);
    setAnalysisResult(null);
  };

  const handleKnowMoreButton = () => {
    navigate('/chatbot', { state: { diseaseName: analysisResult?.diagnosis } });
  };

  return (
    <div
      className="relative py-3 px-5 bg-cover bg-center w-full min-h-screen"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{backgroundImage:`url(${backgroundImage})`}}
    >
      <Title name={'XRay Detection'} />
      <div className="relative flex justify-center items-center h-full mt-10">
        {!selectedFile ? (
          <label className="flex flex-col items-center cursor-pointer w-11/12 sm:w-8/12 md:w-8/12 lg:w-8/12 h-40 justify-center border-2 border-dashed p-5 text-center bg-cyan-50/60 text-gray-500 rounded-lg">
            <IoCloudUploadOutline size={60} className="text-gray-500 mb-2" />
            <p className="text-sm sm:text-base">Drag and drop an image here, or click to <b>browse a file</b></p>
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
                <p className="text-sm sm:text-base">Diagnosis: {analysisResult?.diagnosis}</p>
                <p className="text-sm sm:text-base">Confidence: {analysisResult?.confidence}</p>
                <button onClick={handleKnowMoreButton} className="border border-black mt-2 py-2 px-5 bg-cyan-600 text-white hover:bg-transparent hover:text-black hover:border-black">
                  Know more
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default XRayDetection;
