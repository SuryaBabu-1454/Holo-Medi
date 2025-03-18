import React from "react";
import HomeBack from "../assets/background/1.jpg";
import { useNavigate } from "react-router-dom";



const Home = () => {

  const navigate =  useNavigate();

  const handleNavigate = () =>{
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
      <div className="relative flex flex-col justify-center items-start h-screen w-full sm:w-4/6 md:w-5/6 lg:w-4/6 text-start px-4 sm:px-6 z-10">
        
        {/* Responsive Heading */}
        <h1 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-anton leading-tight text-center md:text-start text-white">
          Welcome to Holo-Medi - Your AI Powered Medical Assistant!!
        </h1>

        {/* Responsive Paragraph */}
        <p className="mt-4 text-sm xs:text-start sm:text-lg md:text-xl lg:text-xl text-center md:text-start text-gray-300">
          Holo-Medi helps you detect skin diseases, analyze X-rays, and calculate medical age effortlessly. Click on any feature below to begin.
        </p>

        {/* Button */}
        <button onClick={handleNavigate} className="border xs:ms-10 sm:ms-10 bg-cyan-600 text-white rounded-md text-center py-2 px-4 xs:mx-auto sm:py-3 sm:px-6 my-5 sm:mx-auto md:mx-0 hover:bg-transparent hover:border-white transition-all">
          Start Analysis
        </button>
      </div>
    </div>
  );
};

export default Home;
