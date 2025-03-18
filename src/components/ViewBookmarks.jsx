import React, { useState, useEffect } from 'react';

import {FaTrash } from 'react-icons/fa';
import Title from './Title';
;

const ViewBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(savedBookmarks);
  }, []);

  const handleDelete = (index) => {
    const updatedBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  return (
    <div className="min-h-screen bg-cover bg-center w-full px-4 py-3 flex flex-col items-center" style={{ backgroundImage: 'url(/assets/background/d2.jpg)' }}>
      <Title name={'Your Bookmarks'} />

      {/* Bookmarks Section */}
      <div className="w-full max-w-3xl px-4 text-center text-gray-500 mt-8">
     
        {bookmarks.length === 0 ? (
          <h2 className="text-3xl text-cyan-950">No bookmarks yet!</h2>
        ) : (
          bookmarks.map((drug, index) => (
            <div key={index} className="border p-4 rounded-md mb-4 flex justify-between items-center bg-white">
              <div className="text-left">
                <h2 className="text-xl font-bold text-cyan-950">{drug.name}</h2>
                <p className="text-sm md:text-base text-gray-500">{drug.description}</p>
                <p className="text-xs text-gray-400">{drug.timestamp}</p>
              </div>
              <button 
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash size={20} />
              </button> 
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewBookmarks;
