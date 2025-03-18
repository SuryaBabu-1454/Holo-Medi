// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

// const HistoryPage = () => {
//   const navigate = useNavigate();

//   // Load chat history from localStorage
//   const [history, setHistory] = React.useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("chatHistory")) || [];
//     } catch (error) {
//       console.error("Error loading chat history:", error);
//       return [];
//     }
//   });

//   // Handle deleting a chat
//   const handleDelete = (index) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
//     if (confirmDelete) {
//       try {
//         const updatedHistory = history.filter((_, i) => i !== index);
//         setHistory(updatedHistory);
//         localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
//       } catch (error) {
//         console.error("Error deleting chat:", error);
//         alert("Failed to delete chat. Please try again.");
//       }
//     }
//   };

//   // Handle editing a chat title
//   const handleEdit = (index) => {
//     const editedMessage = prompt("Edit the chat title:", history[index].title);
//     if (editedMessage !== null) {
//       try {
//         const updatedHistory = [...history];
//         updatedHistory[index].title = editedMessage;
//         setHistory(updatedHistory);
//         localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
//       } catch (error) {
//         console.error("Error editing chat title:", error);
//         alert("Failed to edit chat title. Please try again.");
//       }
//     }
//   };

//   // Handle selecting a chat to continue
//   const handleSelectChat = (chatId) => {
//     navigate("/chatbot", { state: { chatId, continueSession: true } });
//   };

//   // Handle starting a new chat
//   const handleNewChat = () => {
//     navigate("/chatbot", { state: { newChat: true } });
//   };

//   return (
//     <div className="min-h-screen p-5 bg-gray-100">
//       <h1 className="text-2xl font-bold mb-4">Chat History</h1>
//       <div className="flex mb-4 gap-2">
//         <button
//           onClick={() => navigate(-1)}
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Go Back
//         </button>
//         <button
//           onClick={handleNewChat}
//           className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-1"
//         >
//           <FaPlus /> New Chat
//         </button>
//       </div>
//       <div className="space-y-3">
//         {history.length === 0 ? (
//           <p>No chat history available.</p>
//         ) : (
//           history.map((item, index) => (
//             <div
//               key={item.id}
//               className="flex justify-between items-center p-3 bg-white shadow-md rounded-md cursor-pointer"
//               onClick={() => handleSelectChat(item.id)}
//             >
//               <div>
//                 <p className="font-semibold">{
//                   item.title ||
//                   (item.messages?.find((msg) => msg.sender === "user")?.text) ||
//                   "Untitled Chat"
//                 }</p>
//                 <small className="text-gray-500">{item.date}</small>
//               </div>
//               <div className="flex gap-2">
//                 <FaEdit
//                   className="text-blue-500 cursor-pointer"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleEdit(index);
//                   }}
//                 />
//                 <FaTrash
//                   className="text-red-500 cursor-pointer"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(index);
//                   }}
//                 />
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default HistoryPage;
