import { useState } from "react";
import axios from "axios";
import { IoMdCloseCircle } from "react-icons/io";
import Title from '../components/Title';
import EyeLoader from "../components/loader/EyeLoader";
import backgroundImage from '../assets/background/e5.jpg'
import { IoCloudUploadOutline } from "react-icons/io5";

const EyeDetection = () => {
  const [image, setImage] = useState(null);
  const [disease, setDisease] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      analyzeDisease(file);
    }
  };

  const analyzeDisease = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://192.168.0.75:5000/eye", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10000,
      });

      const { prediction, confidence } = response.data;
      setDisease(prediction);
      setConfidence(confidence);
      setShowResult(true);
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("Failed to analyze the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetImage = () => {
    setImage(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen  p-5 flex bg-center bg-cover flex-col items-center relative" style={{backgroundImage:`url(${backgroundImage})`}}>
      <Title name={'AI-Powered Eye Detection'} />
      <p className="text-xl text-white mb-5">"Your eye health in focus — detect diseases and understand prediction accuracy in just a few clicks."</p>

      <div className={`rounded-lg  shadow-lg max-w-md w-full relative ${loading ? 'pointer-events-none' : ''}`}>
        {!image ? (
          <div className="bg-transparent border-2 mt-8 border-dashed  rounded-lg h-60 flex flex-col items-center justify-center cursor-pointer hover:bg-cyan-900/10 transition" onClick={() => document.getElementById('fileInput').click()}>
<IoCloudUploadOutline size={40} className="text-gray-300 " />            <span className="mt-2 text-gray-200 text-center text-xs">Drag & drop or click to <b>Browse a file</b></span>
            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        ) : (
          <div className="relative">
            <img src={image} alt="Uploaded" className="w-full h-60 object-cover rounded-lg" />
            <IoMdCloseCircle size={32} className="absolute top-1 right-1 text-red-500 cursor-pointer" onClick={resetImage} />
          </div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="w-1/2  rounded-full overflow-hidden">
        <EyeLoader />
          </div>

        </div>
      )}

      {showResult && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full relative">
            <IoMdCloseCircle size={32} className="absolute top-1 right-1 text-red-500 cursor-pointer" onClick={resetImage} />
            <h2 className="text-2xl text-cyan-400 text-center font-bold">{disease}</h2>
            <p className="mt-2 text-center text-black">Confidence: <span className="font-bold text-cyan-300">{confidence}%</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EyeDetection;
