import React from "react";
import HomeBack from "../assets/background/1.jpg";
import { useNavigate } from "react-router-dom";



const Home = () => {

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/skin-disease')
  }

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${HomeBack})` }}
    >
      {/* Background Overlay with Correct Opacity */}
      {/* <div className="absolute inset-0 bg-green-400/20"></div> */}

      {/* Content (Ensures it is on top of the overlay) */}
      <div className="relative flex flex-col justify-center items-start  h-screen w-full sm:w-5/6 md:w-5/6 lg:w-5/6 text-center px-4 sm:px-6 z-10">

        {/* Responsive Heading */}
        <h1 className="text-4xl xs:text-2xl  sm:text-6xl sm:mx-auto md:text-6xl lg:text-7xl font-anton leading-tight text-center md:text-start text-white">
          Welcome to Holo-Medi - Your AI Powered Medical Assistant!!
        </h1>

        {/* Responsive Paragraph */}
        <p className=" mt-4 text-md xs:text-start sm:text-lg md:text-xl lg:text-xl text-center md:text-start text-gray-300">
          Holo-Medi brings AI-powered medical analysis to your desktop. From detecting skin conditions and analyzing X-rays to evaluating eye health and calculating BMI — get instant insights with cutting-edge technology. Need help? Our intelligent ChatBot is here to guide you every step of the way.
          Let me know if you’d like more options or any changes
        </p>

        {/* Button */}
        <button onClick={handleNavigate} className="border mx-auto sm:mx-auto bg-cyan-600 text-white rounded-md text-center py-2 px-4 xs:mx-auto sm:py-3 sm:px-6 my-5  md:mx-0 hover:bg-transparent hover:border-white transition-all">
          Start Analysis
        </button>
      </div>
    </div>
  );
};

export default Home;
