
import React from "react";
import { NavLink } from "react-router-dom";
import { FaStethoscope, FaXRay, FaPills, FaCalculator, FaEllipsisV ,FaHome, FaRegLightbulb} from "react-icons/fa";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { TbEyeSearch } from "react-icons/tb";




const Sidebar = () => {
  return (
    <div className="bg-cyan-700 text-white hidden md:flex flex-col w-56 p-4 h-screen space-y-4 fixed">
      
      {/* Title Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Holo-Medi</h1>
        <FaEllipsisV size={22} className="cursor-pointer" />
      </div>

      {/* Sidebar Menu */}
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `flex items-center p-3 rounded-md transition duration-300 ${isActive ? 'bg-cyan-400' : 'hover:bg-cyan-400'}`
        }
      >
        <FaHome size={28} />
        <span className="ml-2">Home</span>
      </NavLink>
      <NavLink 
        to="/skin-disease" 
        className={({ isActive }) => 
          `flex items-center p-3 rounded-md transition duration-300 ${isActive ? 'bg-cyan-400' : 'hover:bg-cyan-400'}`
        }
      >
        <FaStethoscope size={28} />
        <span className="ml-2">Skin Disease</span>
      </NavLink>
      <NavLink 
        to="/eye-detection" 
        className={({ isActive }) => 
          `flex items-center p-3 rounded-md transition duration-300 ${isActive ? 'bg-cyan-400' : 'hover:bg-cyan-400'}`
        }
      >
        <TbEyeSearch size={28} />
        <span className="ml-2">Eye Detection</span>
      </NavLink>

      <NavLink 
        to="/xray-detection" 
        className={({ isActive }) => 
          `flex items-center p-3 rounded-md transition duration-300 ${isActive ? 'bg-cyan-400' : 'hover:bg-cyan-400'}`
        }
      >
        <FaXRay size={28} />
        <span className="ml-2">X-Ray Detection</span>
      </NavLink>

      <NavLink 
        to="/drug-details" 
        className={({ isActive }) => 
          `flex items-center p-3 rounded-md transition duration-300 ${isActive ? 'bg-cyan-400' : 'hover:bg-cyan-400'}`
        }
      >
        <FaPills size={28} />
        <span className="ml-2">Drug Details</span>
      </NavLink>

      <NavLink 
        to="/bmi-calculator" 
        className={({ isActive }) => 
          `flex items-center p-3 rounded-md transition duration-300 ${isActive ? 'bg-cyan-400' : 'hover:bg-cyan-400'}`
        }
      >
        <FaCalculator size={28} />
        <span className="ml-2">BMI Calculator</span>
      </NavLink>
      <NavLink 
        to="/chatbot" 
        className={({ isActive }) => 
          `flex items-center p-3 rounded-md transition duration-300 ${isActive ? 'bg-cyan-400' : 'hover:bg-cyan-400'}`
        }
      >
        <TbMessageChatbotFilled size={28} />
        <span className="ml-2">Chatbot</span>
      </NavLink>
      <NavLink 
        to="/medi-finder" 
        className={({ isActive }) => 
          `flex items-center p-3 rounded-md transition duration-300 ${isActive ? 'bg-cyan-400' : 'hover:bg-cyan-400'}`
        }
      >
        <FaRegLightbulb  size={28} />
        <span className="ml-2">Medi-Finder</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;

