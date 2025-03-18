import React from "react";
import { NavLink } from "react-router-dom";
import { FaStethoscope, FaXRay, FaPills, FaCalculator, FaHome } from "react-icons/fa";
import { TbMessageChatbotFilled } from "react-icons/tb";

const Bottombar = () => {
  return (
<div className="bg-cyan-700 text-white flex justify-around items-center p-3 w-full fixed bottom-0 h-16 md:hidden">
      
      {/* Bottom Navigation Menu */}
      <NavLink to="/" className="flex flex-col items-center">
        <FaHome size={28} />
        <span className="text-xs">Home</span>
      </NavLink>

      <NavLink to="/skin-disease" className="flex flex-col items-center">
        <FaStethoscope size={28} />
        <span className="text-xs">Skin</span>
      </NavLink>

      <NavLink to="/xray-detection" className="flex flex-col items-center">
        <FaXRay size={28} />
        <span className="text-xs">X-Ray</span>
      </NavLink>

      <NavLink to="/drug-details" className="flex flex-col items-center">
        <FaPills size={28} />
        <span className="text-xs">Drugs</span>
      </NavLink>

      <NavLink to="/bmi-calculator" className="flex flex-col items-center">
        <FaCalculator size={28} />
        <span className="text-xs">BMI</span>
      </NavLink>
      <NavLink to="/chatbot" className="flex flex-col items-center">
        <TbMessageChatbotFilled size={28} />
        <span className="text-xs">Chatbot</span>
      </NavLink>

    </div>
  );
};

export default Bottombar;




