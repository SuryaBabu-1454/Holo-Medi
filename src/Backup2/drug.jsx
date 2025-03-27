// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { FaBookmark, FaFilePdf } from 'react-icons/fa';
// import jsPDF from 'jspdf';
// import Title from '../components/Title';
// import ProgressBar from '../components/ProgressBar';
// import backgroundImage from '../assets/background/d4.jpg';

// const API_BASE = 'http://192.168.1.155:5000';

// const DrugDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [drugName, setDrugName] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [drugInfo, setDrugInfo] = useState(null);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [isDetecting, setIsDetecting] = useState(false);


//   const [bookmarks, setBookmarks] = useState(() => {
//     return JSON.parse(localStorage.getItem('bookmarks')) || [];
//   });
  
//   // 1. Fetch bookmarks from backend
//   useEffect(() => {
//     const fetchBookmarks = async () => {
//       try {
//         const response = await fetch(`${API_BASE}/bookmarks`);
//         if (response.ok) {
//           const data = await response.json();
//           setBookmarks(data);
//         }
//       } catch (err) {
//         console.error("Failed to fetch bookmarks:", err);
//         // Fallback to localStorage
//         const localBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
//         setBookmarks(localBookmarks);
//       }
//     };

//     fetchBookmarks();

//     if (location.state?.fromBookmarks) {
//       const lastSearched = JSON.parse(localStorage.getItem('lastSearchedDrug'));
//       if (lastSearched) {
//         setDrugName(lastSearched.name);
//         setDrugInfo(lastSearched);
//       }
//     }
//   }, [location]);

//   // 2. Handle drug search (POST request)
//   const handleDetect = async () => {
//     if (!drugName.trim()) {
//       setError('Please enter a drug name.');
//       return;
//     }

//     setIsDetecting(true);
//     setError('');

//     try {
//       const formData = new FormData();
//       formData.append('drug_name', drugName);

//       const response = await fetch(`${API_BASE}/search`, {
//         method: 'POST',
//         body: formData
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.error) {
//           setError(data.error);
//         } else {
//           const drugData = {
//             name: drugName,
//             description: data.description,
//             url: data.url
//           };
//           setDrugInfo(drugData);
//           localStorage.setItem('lastSearchedDrug', JSON.stringify(drugData));
//         }
//       } else {
//         throw new Error('Search failed');
//       }
//     } catch (err) {
//       setError('Failed to search for drug. Please try again.');
//       console.error(err);
//     } finally {
//       setIsDetecting(false);
//     }
//   };


//   const handleBookmark = () => {
//     if (!drugInfo) return;
    
//     const newBookmark = {
//       ...drugInfo,
//       timestamp: new Date().toLocaleString()
//     };
    
//     const isBookmarked = bookmarks.some(b => b.name === drugInfo.name);
    
//     if (isBookmarked) {
//       setMessage('This drug is already bookmarked!');
//     } else {
//       const updatedBookmarks = [...bookmarks, newBookmark];
//       setBookmarks(updatedBookmarks);
//       localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
//       setMessage('Bookmark added!');
//     }
    
//     setTimeout(() => setMessage(''), 3000);
//   };



//   const handleInputChange = (e) => {
//     setDrugName(e.target.value);
//     setSuggestions([]); //clear the suggestion
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleDetect();
//     }
//   };

//   const handleCancel = () => {
//     setDrugName('');
//     setDrugInfo(null);
//     setError('');
//     setSuggestions([]);
//     localStorage.removeItem('lastSearchedDrug');
//     setIsDetecting(false);
//   };

//   const handleExportPDF = () => {
//     if (!drugInfo) return;
    
//     const doc = new jsPDF();
    
//     // Page dimensions and settings
//     const pageWidth = doc.internal.pageSize.width;
//     const pageHeight = doc.internal.pageSize.height;
//     const margin = 20;
//     const contentWidth = pageWidth - (margin * 2);
  
//     // Add watermark
//     doc.setFontSize(60);
//     doc.setTextColor(230, 230, 230);
//     doc.setFont(undefined, 'bold');
//     doc.text('Holo-Medi', pageWidth / 2, pageHeight / 2, {
//       align: 'center',
//       angle: 45
//     });
//     doc.setTextColor(0, 0, 0);
  
//     // Add page border
//     doc.setDrawColor(150, 150, 150); // Light gray border
//     doc.setLineWidth(0.5);
//     doc.rect(margin - 5, margin - 5, pageWidth - (margin * 2) + 10, pageHeight - (margin * 2) + 10);
  
//     // Add title
//     doc.setFontSize(18);
//     doc.setFont(undefined, 'bold');
//     doc.text(formatDrugName(drugInfo.name), pageWidth / 2, margin + 20, { 
//       align: 'center' 
//     });
  
//     // Add description
//     doc.setFontSize(14);
//     doc.setFont(undefined, 'bold');
//     doc.text('Description:', margin, margin + 40);
  
//     doc.setFontSize(12);
//     doc.setFont(undefined, 'normal');
//     const splitDescription = doc.splitTextToSize(drugInfo.description, contentWidth);
//     doc.text(splitDescription, margin, margin + 50);
  
//     // Calculate dynamic positioning
//     const descHeight = splitDescription.length * 6;
//     let currentY = margin + 50 + descHeight;
  
//     // Add Thank You message
//     doc.setFontSize(14);
//     doc.setFont(undefined, 'italic');
//     doc.text('Thank you for using our service.', pageWidth / 2, currentY + 20, {
//       align: 'center'
//     });
  
//     // Add Author name (right aligned after Thank You)
//     doc.setFontSize(12);
//     doc.setFont(undefined, 'normal');
//     doc.text('Author: MedFinder Team', pageWidth - margin, currentY + 40, {
//       align: 'right'
//     });
  
//     // Save the PDF
//     doc.save(`${formatDrugName(drugInfo.name)}_Report.pdf`);
//   };
//   const handleViewBookmarks = () => {
//     navigate('/bookmarks', { state: { fromBookmarks: true } });
//   };
//   const formatDrugName = (name) => {
//     if (!name) return '';
//     return name.toLowerCase().split(' ').map(word => 
//       word.charAt(0).toUpperCase() + word.slice(1)
//     ).join(' ');
//   };


//   const handleKnowMore = () => {
//     if (drugInfo?.url) {
//       // Open URL in a new tab
//       window.open(drugInfo.url, '_blank');
//     } else {
//       setMessage('No additional information available');
//       setTimeout(() => setMessage(''), 2000);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-cover bg-center w-full px-4 py-3 flex flex-col items-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
//       <Title name={'Drug Details'} />
//       <div className="flex flex-col mt-10 sm:flex-row items-center w-full max-w-xl space-y-4 sm:space-y-0 sm:space-x-4">
//         <div className="relative w-full sm:w-[450px]">
//           <input
//             type="search"
//             value={drugName}
//             onChange={handleInputChange}
//             onKeyDown={handleKeyPress}
//             placeholder="Detect your drug..."
//             className="p-4 w-full focus:outline-none border rounded-md"
//             aria-label="Search for a drug"
//           />
//           {suggestions.length > 0 && (
//             <ul className="absolute w-full bg-white border mt-1 max-h-40 overflow-y-auto z-10">
//               {suggestions.map((drug, index) => (
//                 <li
//                   key={index}
//                   className="p-2 cursor-pointer hover:bg-cyan-100"
//                   onClick={() => handleSelectDrug(drug)}
//                 >
//                   {drug}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         {/* Conditionally render buttons based on isDetecting state */}
//         {isDetecting || drugInfo ? (
//           <button
//             onClick={handleCancel}
//             className="w-[150px] border text-white rounded-md  px-3 py-4  hover:border hover:rounded-md hover:bg-black hover:text-white"
//             aria-label="Cancel detection"
//           >
//             Cancel
//           </button>
//         ) : (
//           <button
//             onClick={handleDetect}
//             className="bg-black text-white px-3 py-4 rounded-md w-[150px]"
//             aria-label="Start detection"
//           >
//             Start Detect
//           </button>
//         )}
//       </div>

//       {isDetecting && (
//         <div className="w-full max-w-xl mt-4">
//           <div className='text-black'><ProgressBar /></div>
//         </div>
//       )}

//       {error && <p className=" p-3 bg-red-100/70 text-center border-l-4 border-red-500 text-red-700 rounded w-3/4 mt-3 mx-auto">{error}</p>}
//       {message && <p className="p-3 bg-green-100/70 text-center border-l-4 border-green-500 text-green-700 rounded w-3/4 mt-3 mx-auto">{message}</p>}

//       {!isDetecting && drugInfo && (
//         <div className="w-full max-w-3xl px-4 text-center text-white mt-8">
//           <h2 className="text-xl font-bold text-cyan-400 mb-2 ">{formatDrugName(drugInfo.name)}</h2>
//           <p className="text-xl md:text-base text-start leading-relaxed mb-10">{drugInfo.description}</p>
//           <a onClick={handleViewBookmarks} href="" className='text-blue-400  underline'>View all bookmarks</a>
//           <div className="flex justify-center sm:justify-end mt-5 gap-2">
//             <button onClick={handleBookmark} className="w-32 h-10 text-white border rounded-md hover:border hover:rounded-md hover:bg-black hover:text-white flex items-center justify-center gap-2" aria-label="Bookmark drug">
//               <FaBookmark /> Bookmark
//             </button>
//             <button onClick={handleExportPDF} className="w-32 h-10 text-white rounded-md bg-black hover:bg-transparent hover:border  flex items-center justify-center gap-2" aria-label="Export to PDF">
//               <FaFilePdf /> Export PDF
//             </button>
//             <button  onClick={handleKnowMore}  className="text-white w-32 h-10 rounded-md bg-black hover:bg-transparent hover:border " aria-label="Know more about drug">Know More</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DrugDetails;



