import { useState } from "react";
import { Home, User, MessageCircle, Camera, Settings } from "lucide-react";

const menuItems = [
  { name: "Home", icon: <Home />, id: 0 },
  { name: "User", icon: <User />, id: 1 },
  { name: "Chat", icon: <MessageCircle />, id: 2 },
  { name: "Camera", icon: <Camera />, id: 3 },
  { name: "Settings", icon: <Settings />, id: 4 },
];

const NavigationBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="relative flex items-center justify-between w-[400px] h-[80px] bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg px-5 shadow-lg">
        {/* Indicator Circle */}
        <div
          className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-pink-500 border-4 border-black rounded-full transition-all duration-300"
          style={{ transform: `translateX(${activeIndex * 80}px) translateY(-50%)` }}
        ></div>
        
        <ul className="relative flex justify-between w-full">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="relative flex flex-col items-center w-16 cursor-pointer"
              onClick={() => setActiveIndex(index)}
            >
              <span
                className={`text-2xl transition-all duration-300 relative z-10 ${
                  activeIndex === index ? "text-white translate-y-[-50%]" : "text-gray-300"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-sm transition-all duration-300 relative z-10 ${
                  activeIndex === index ? "text-white mt-2" : "opacity-0"
                }`}
              >
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavigationBar;
