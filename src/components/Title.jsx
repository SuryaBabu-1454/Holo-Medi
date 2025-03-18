import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Title = ({name}) => {
  const navigate = useNavigate();
  return (
      <div className="relative flex items-center bg-cyan-400 py-4 mb-10  px-5 rounded-lg w-full z-10">
        <button onClick={() => navigate(-1)} className="bg-cyan-950 text-white p-2 rounded-full">
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold  text-cyan-950 text-center flex-grow">
        {name}
        </h1>
      </div>
  )
}

export default Title;