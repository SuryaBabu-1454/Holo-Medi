// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { FaBookmark, FaFilePdf } from 'react-icons/fa';
// import jsPDF from 'jspdf';
// import Title from '../components/Title';
// import ProgressBar from '../components/ProgressBar';
// import backgroundImage from '../assets/background/d4.jpg';

// const dummyDrugs = [
//   'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Aspirin', 'Metformin', 'Omeprazole'
// ];

// const DrugDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [drugName, setDrugName] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [drugInfo, setDrugInfo] = useState(null);
//   const [error, setError] = useState('');
//   const [bookmarks, setBookmarks] = useState([]);
//   const [message, setMessage] = useState('');
//   const [isDetecting, setIsDetecting] = useState(false);

//   // Load bookmarks and last searched drug from localStorage on component mount
//   useEffect(() => {
//     const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
//     setBookmarks(savedBookmarks);

//     if (location.state?.fromBookmarks) {
//       const lastSearched = JSON.parse(localStorage.getItem('lastSearchedDrug'));
//       if (lastSearched) {
//         setDrugName(lastSearched.name);
//         setDrugInfo(lastSearched);
//       }
//     } else {
//       localStorage.removeItem('lastSearchedDrug');
//     }
//   }, [location]);

//   // Handle input change and show suggestions
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setDrugName(value);
//     if (value) {
//       const filtered = dummyDrugs.filter(drug => 
//         drug.toLowerCase().includes(value.toLowerCase())
//       );
//       setSuggestions(filtered);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   // Handle drug selection from suggestions
//   const handleSelectDrug = (drug) => {
//     const selectedDrug = {
//       name: drug,
//       description: `This is some dummy information about ${drug}. It helps with various conditions.`
//     };
//     setDrugName(drug);
//     setSuggestions([]);
//     setDrugInfo(selectedDrug);
//     setError('');
//     localStorage.setItem('lastSearchedDrug', JSON.stringify(selectedDrug));
//     setIsDetecting(true);

//     setTimeout(() => {
//       setIsDetecting(false);
//     }, 2000); // Simulate detection time
//   };

//   // Handle drug detection
//   const handleDetect = () => {
//     if (!drugName.trim()) {
//       setError('Please enter a drug name.');
//       return;
//     }
//     setIsDetecting(true);
//     setDrugInfo(null); // Clear previous drug info
//     setError(''); // Clear previous error
//     const foundDrug = dummyDrugs.find(drug => drug.toLowerCase() === drugName.toLowerCase());
//     setTimeout(() => {
//       if (foundDrug) {
//         handleSelectDrug(foundDrug);
//       } else {
//         setError('Drug not found. Please enter a valid drug name.');
//         setDrugInfo(null);
//       }
//       setIsDetecting(false);
//     }, 2000); // Simulate detection time
//   };

//   // Handle Enter key press
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleDetect();
//     }
//   };

//   // Handle cancel action
//   const handleCancel = () => {
//     setDrugName('');
//     setDrugInfo(null);
//     setError('');
//     setSuggestions([]);
//     localStorage.removeItem('lastSearchedDrug');
//     setIsDetecting(false);
//   };

//   // Handle bookmark action
//   const handleBookmark = () => {
//     if (!drugInfo) return;
//     const isAlreadyBookmarked = bookmarks.some(b => b.name === drugInfo.name);
//     if (isAlreadyBookmarked) {
//       setMessage('This drug is already bookmarked.');
//     } else {
//       const updatedBookmarks = [...bookmarks, drugInfo];
//       setBookmarks(updatedBookmarks);
//       localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
//       setMessage('Bookmark added successfully!');
//     }
//     setTimeout(() => setMessage(''), 3000);
//   };

//   // Handle export to PDF
//   const handleExportPDF = () => {
//     if (!drugInfo) return;
//     const doc = new jsPDF();
//     const margin = 10;
//     let y = margin;
//     doc.setFontSize(16);
//     doc.text(`Drug Name: ${drugInfo.name}`, margin, y);
//     y += 10;
//     doc.setFontSize(12);
//     const splitDescription = doc.splitTextToSize(`Description: ${drugInfo.description}`, 180);
//     doc.text(splitDescription, margin, y);
//     doc.save(`${drugInfo.name}.pdf`);
//   };

//   // Handle view bookmarks
//   const handleViewBookmarks = () => {
//     navigate('/bookmarks', { state: { fromBookmarks: true } });
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

//       {error && <p className="text-red-800 mt-4">{error}</p>}
//       {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}

//       {!isDetecting && drugInfo && (
//         <div className="w-full max-w-3xl px-4 text-center text-white mt-8">
//           <h2 className="text-xl font-bold text-cyan-400 mb-2">{drugInfo.name}</h2>
//           <p className="text-sm md:text-base text-start leading-relaxed mb-10">{drugInfo.description}</p>
//           <a onClick={handleViewBookmarks} href="" className='text-blue-400  underline'>view all bookmarks</a>
//           <div className="flex justify-center sm:justify-end mt-5 gap-2">
//             <button onClick={handleBookmark} className="w-32 h-10 text-white border rounded-md hover:border hover:rounded-md hover:bg-black hover:text-white flex items-center justify-center gap-2" aria-label="Bookmark drug">
//               <FaBookmark /> Bookmark
//             </button>
//             <button onClick={handleExportPDF} className="w-32 h-10 text-white rounded-md bg-black hover:bg-transparent hover:border  flex items-center justify-center gap-2" aria-label="Export to PDF">
//               <FaFilePdf /> Export PDF
//             </button>
//             <button className="text-white w-32 h-10 rounded-md bg-black hover:bg-transparent hover:border " aria-label="Know more about drug">Know More</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DrugDetails;