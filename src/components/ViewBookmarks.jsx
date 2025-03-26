import React, { useState, useEffect } from 'react';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Title from './Title';

const ViewBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null); // Track which card is expanded

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(savedBookmarks);
  }, []);

  const handleDelete = (index, e) => {
    e.stopPropagation(); // Prevent triggering card expansion when deleting
    const updatedBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    
    // Reset expanded card if the deleted card was expanded
    if (expandedCard === index) {
      setExpandedCard(null);
    }
  };

  const toggleExpand = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
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
            <div 
              key={index} 
              className="border p-4 rounded-md mb-4 bg-white cursor-pointer transition-all duration-200"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h2 className="text-xl font-bold text-cyan-950">{drug.name}</h2>
                  {drug.timestamp && (
                    <p className="text-xs text-gray-400">{drug.timestamp}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleDelete(index, e)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <FaTrash size={16} />
                  </button>
                  {expandedCard === index ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </div>
              </div>
              
              {/* Collapsible description */}
              {expandedCard === index && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm md:text-base text-gray-600 text-left">
                    {drug.description || 'No description available'}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewBookmarks;