import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBookmark, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import Title from "../components/Title";
import ProgressBar from "../components/ProgressBar";
import backgroundImage from "../assets/background/d4.jpg";

const DrugDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drugName, setDrugName] = useState("");
  const [drugInfo, setDrugInfo] = useState(null);
  const [error, setError] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [message, setMessage] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(savedBookmarks);
  }, []);

  const handleInputChange = (e) => {
    setDrugName(e.target.value);
  };

  const fetchDrugDetails = async () => {
    if (!drugName.trim()) {
      setError("Please enter a drug name.");
      return;
    }
    setIsDetecting(true);
    setError("");
    setDrugInfo(null);

    try {
      const response = await fetch("http://192.168.0.75:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ drug_name: drugName }),
      });

      if (!response.ok) {
        throw new Error("Drug not found");
      }

      const data = await response.json();
      setDrugInfo(data);
      localStorage.setItem("lastSearchedDrug", JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchDrugDetails();
    }
  };

  const openDrugInfo = () => {
    if (drugInfo && drugInfo.url) {
      window.open(drugInfo.url, "_blank");
    } else {
      alert("No valid URL found for this drug.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center w-full px-4 py-3 flex flex-col items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Title name={"Drug Details"} />
      <div className="flex flex-col mt-10 sm:flex-row items-center w-full max-w-xl space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="search"
          value={drugName}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Enter drug name..."
          className="p-4 w-full focus:outline-none border rounded-md"
          aria-label="Search for a drug"
        />
        <button
          onClick={fetchDrugDetails}
          className="bg-black text-white px-3 py-4 rounded-md w-[150px]"
          aria-label="Search drug"
        >
          Search
        </button>
      </div>

      {isDetecting && <ProgressBar />}
      {error && <p className="text-red-800 mt-4">{error}</p>}

      {drugInfo && (
        <div className="w-full max-w-3xl px-4 text-center text-white mt-8">
          <h2 className="text-xl font-bold text-cyan-400 mb-2">{drugInfo.name}</h2>
          <p className="text-sm md:text-base text-start leading-relaxed mb-4">
            {drugInfo.description}
          </p>
          <button
            onClick={openDrugInfo}
            className="bg-cyan-900 hover:bg-cyan-300 text-white font-bold py-2 px-4 rounded-md mt-2"
          >
            Know More
          </button>
        </div>
      )}
    </div>
  );
};

export default DrugDetails;

