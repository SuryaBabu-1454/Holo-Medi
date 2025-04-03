import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chatHistory")) || [];
    } catch (error) {
      console.error("Error loading chat history:", error);
      return [];
    }
  });

  const [modal, setModal] = useState({ open: false, type: "", index: null });
  const [editTitle, setEditTitle] = useState("");

  const handleDelete = () => {
    const updatedHistory = history.filter((_, i) => i !== modal.index);
    setHistory(updatedHistory);
    localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    setModal({ open: false, type: "", index: null });
  };

  const handleEdit = () => {
    const updatedHistory = [...history];
    updatedHistory[modal.index].title = editTitle;
    setHistory(updatedHistory);
    localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    setModal({ open: false, type: "", index: null });
  };

  const handleSelectChat = (chatId) => {
    navigate("/medi-talk", { state: { chatId, continueSession: true } });
  };

  const handleNewChat = () => {
    navigate("/medi-talk", { state: { newChat: true } });
  };

  return (
    <div className="min-h-screen p-5 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Chat History</h1>
      <div className="flex mb-4 gap-2">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
        <button
          onClick={handleNewChat}
          className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-1 hover:bg-green-700"
        >
          <FaPlus /> New Chat
        </button>
      </div>
      <div className="space-y-3">
        {history.length === 0 ? (
          <p>No chat history available.</p>
        ) : (
          history.map((item, index) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-3 bg-white shadow-md rounded-md cursor-pointer"
              onClick={() => handleSelectChat(item.id)}
            >
              <div>
                <p className="font-semibold">
                  {item.messages?.[1]?.text || "Untitled Chat"}
                </p>
                <small className="text-gray-500">{item.date}</small>
              </div>
              <div className="flex gap-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditTitle(item.title || "");
                    setModal({ open: true, type: "edit", index });
                  }}
                  className="flex gap-2 items-center bg-blue-300 px-3 py-1 rounded-sm  hover:bg-blue-200"
                >
                  Edit
                  <FaEdit className="text-blue-700 cursor-pointer" />
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal({ open: true, type: "delete", index });
                  }}
                  className="flex gap-2 items-center   bg-red-300 px-3 py-1 rounded-sm  hover:bg-red-200"
                >
                  Delete
                  <FaTrash className="text-red-700 cursor-pointer" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
            {modal.type === "edit" ? (
              <>
                <h2 className="text-lg font-semibold mb-2">Edit Chat Title</h2>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() =>
                      setModal({ open: false, type: "", index: null })
                    }
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 "
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  Are you sure you want to delete this chat?
                </h2>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() =>
                      setModal({ open: false, type: "", index: null })
                    }
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
