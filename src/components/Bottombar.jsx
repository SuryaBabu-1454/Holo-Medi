import React from "react";
import { NavLink } from "react-router-dom";
import { FaStethoscope, FaXRay, FaPills, FaCalculator, FaHome, FaRegLightbulb } from "react-icons/fa";
import { TbEyeSearch, TbMessageChatbotFilled } from "react-icons/tb";
import { Tooltip } from "react-tooltip";

const Bottombar = () => {
  return (
    <div className="bg-cyan-700 text-white flex justify-around items-center p-3 w-full fixed bottom-0 h-16 md:hidden">
      
      {/* Bottom Navigation with Styled Tooltips */}
      <NavLink to="/" className="flex flex-col items-center" data-tooltip-id="home-tooltip">
        <FaHome size={28} />
        <Tooltip id="home-tooltip" place="top" content="Home" />
      </NavLink>

      <NavLink to="/medi-talk" className="flex flex-col items-center" data-tooltip-id="medi-talk-tooltip">
        <TbMessageChatbotFilled size={28} />
        <Tooltip id="medi-talk-tooltip" place="top" content="MediTalk" />
      </NavLink>

      <NavLink to="/skin-sense" className="flex flex-col items-center" data-tooltip-id="skin-tooltip">
        <FaStethoscope size={28} />
        <Tooltip id="skin-tooltip" place="top" content="SkinSense" />
      </NavLink>

      <NavLink to="/vision-check" className="flex flex-col items-center" data-tooltip-id="vision-tooltip">
        <TbEyeSearch size={28} />
        <Tooltip id="vision-tooltip" place="top" content="VisionCheck" />
      </NavLink>

      <NavLink to="/xray-insight" className="flex flex-col items-center" data-tooltip-id="xray-tooltip">
        <FaXRay size={28} />
        <Tooltip id="xray-tooltip" place="top" content="X-Ray Insight" />
      </NavLink>

      <NavLink to="/drugInfo-hub" className="flex flex-col items-center" data-tooltip-id="drug-tooltip">
        <FaPills size={28} />
        <Tooltip id="drug-tooltip" place="top" content="DrugInfo Hub" />
      </NavLink>

      <NavLink to="/medi-finder" className="flex flex-col items-center" data-tooltip-id="finder-tooltip">
        <FaRegLightbulb size={28} />
        <Tooltip id="finder-tooltip" place="top" content="Medi-Finder" />
      </NavLink>

      <NavLink to="/health-index" className="flex flex-col items-center" data-tooltip-id="health-tooltip">
        <FaCalculator size={28} />
        <Tooltip id="health-tooltip" place="top" content="Health Index" />
      </NavLink>

    </div>
  );
};

export default Bottombar;
