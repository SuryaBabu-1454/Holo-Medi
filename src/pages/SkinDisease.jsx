import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaCamera, FaTimes } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { PropagateLoader } from "react-spinners";
import { FaDisease } from "react-icons/fa";
import Title from "../components/Title";
import { useNavigate, useLocation } from "react-router-dom";
import backgroundImage from '../assets/background/s2.jpg'
import axios from "axios"

const SkinDisease = () => {
  const [image, setImage] = useState(null);
  const [diseaseName, setDiseaseName] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        analyzeDisease(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = async () => {
    setShowCamera(true);
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(mediaStream);
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const capturedImage = canvas.toDataURL("image/png");
      setImage(capturedImage);
      analyzeDisease(capturedImage);
      setShowCamera(false);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const analyzeDisease = async (imageUrl) => {
    setLoading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "image.png");

      const result = await axios.post("http://192.168.0.75:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10000,
      });

      if (result.status !== 200) {
        alert("Prediction failed");
        setLoading(false);
        return;
      }

      const data = result.data;
      console.log(data);

      setDiseaseName(data.predicted_class || "Unknown Disease");
      console.log(data.predicted_class || "Unknown Disease");

      setResultImage(imageUrl);
      setImage(null);
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("Error during prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKnowMoreButton = () => {

     // Generate an automatic question about the disease
  const autoQuestion = `Explain about ${diseaseName}`;
    navigate('/chatbot', { state: { diseaseName, autoQuestion } });
  };
  const resetUploadBox = () => {
    setImage(null);
    setShowCamera(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="w-full min-h-screen bg-center bg-cover px-5 py-3 relative pb-24"  style={{ backgroundImage: `url(${backgroundImage})` }} >
      {/* Header */}
      <Title name={'Skin Disease Detection'} />
      {/* Description */}
      <div className="px-4 md:px-24 text-center">
        <p className="text-lg text-white">
          This feature helps users detect skin diseases by analyzing uploaded images. Using AI-based detection, it provides a quick diagnosis and essential information about the condition.
        </p>
      </div>

      {/* Loader Banner */}
      {loading && (
        <div className="w-full text-center py-2 my-2 animate-pulse">
          <PropagateLoader color="black" />
        </div>
      )}

      {/* Upload & Result Section */}
      <div className="flex flex-col md:flex-row justify-center gap-8 mt-5">
        {/* Upload Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <h1 className="text-2xl text-center font-semibold text-cyan-400">Upload an Image</h1>
          <p className="mb-3 text-white text-center">Supports JPG, PNG, and more.</p>
          <div className="w-full max-w-md h-60 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-black/10 group relative overflow-hidden"
            onClick={() => document.getElementById("fileInput").click()}>
                {image && (
                            <button
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-800 transition z-10"
                              onClick={(e) => { e.stopPropagation(); resetUploadBox(); }}
                            >
                              <FaTimes size={16} />
                            </button>
                          )}
            {showCamera ? (
              <>
                <video ref={videoRef} className="w-full h-full object-cover" />
                <button onClick={takePhoto} className="absolute bottom-4 bg-red-600 text-white px-4 py-2 rounded-lg">Take Photo</button>
              </>
            ) : image ? (
              <img src={image} alt="Captured" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <>
                <IoCloudUploadOutline size={40} className="text-gray-300 mt-6" />
                <span className="mt-2 text-gray-200 text-center text-xs">Drag & drop or click to <b>Browse a file</b></span>
                <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <button className="mt-10 bg-cyan-800 hover:bg-cyan-700 transition text-white px-3 py-2 rounded-lg flex items-center text-sm gap-2"
                  onClick={(e) => { e.stopPropagation(); handleCapture(); }}>
                  <FaCamera /> Capture Image
                </button>
              </>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>

        {/* Result Section */}
        {resultImage && (
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h1 className="text-2xl text-cyan-400 font-semibold text-center">Disease Information</h1>
            <p className="mb-3 text-white text-center">Hover over the card to uncover more insights about this condition.</p>
            <div className="relative w-full max-w-md h-60 bg-gray-200 rounded-lg shadow-lg flex flex-col items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${resultImage})` }}></div>
              <h3 className="relative text-xl font-bold text-white p-2 mb-3 bg-black/50 w-full text-center flex justify-center gap-2">
                <FaDisease size={24} />{diseaseName}<FaDisease size={24} />
              </h3>
              {/* Hover Effect */}
               <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-700"></div>
              <div className="absolute  bottom-4 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center text-white px-4 text-center">
                <p className="text-xs mx-14 text-center">Click “Know more” for detailed symptoms, causes, and treatments.</p>
                <button onClick={handleKnowMoreButton} className="mt-2 border border-white text-white text-xs px-4 py-2 rounded-md hover:bg-black/40">Know More</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default SkinDisease;
