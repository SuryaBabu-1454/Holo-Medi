  import React, { useState, useEffect, useRef } from "react";
  import { FaUser, FaRobot } from "react-icons/fa";
  import { VscSend } from "react-icons/vsc";
  import { RiChatNewLine, RiMicLine } from "react-icons/ri";
  import { BeatLoader } from "react-spinners";
  import { useLocation, useNavigate } from "react-router-dom";
  import { MdHistory } from "react-icons/md";
  import Title from "../components/Title";
  import backgroundImage from '../assets/background/c4.jpg'

  const Chatbox = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const diseaseName = location.state?.diseaseName || "something Medical";
    const chatId = location.state?.chatId; // Unique ID for the chat session
    const continueSession = location.state?.continueSession; // Flag to continue old chat

    const [messages, setMessages] = useState([{ sender: "bot", text: "Hi! How can I assist you today?" }]);
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const [sessionId, setSessionId] = useState(chatId || Date.now().toString()); // Unique ID for the current session
    const [chatTitle, setChatTitle] = useState(""); // Dynamic title for the chat session

    // Load old chat if continuing a session
    useEffect(() => {
      if (continueSession && chatId) {
        const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        const selectedChat = chatHistory.find((chat) => chat.id === chatId);
        if (selectedChat) {
          setMessages(selectedChat.messages);
          setSessionId(selectedChat.id); // Use the existing session ID
          setChatTitle(selectedChat.title); // Set the existing title
        }
      }
    }, [chatId, continueSession]);

    // Scroll to bottom when messages change
    useEffect(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, [messages]);

    // Save current chat to localStorage
    useEffect(() => {
      localStorage.setItem("currentChat", JSON.stringify(messages));
    }, [messages]);

    // Extract the main topic from the user's query
  const extractTopic = (query) => {
    const keywords = ["symptoms", "treatment", "causes", "prevention", "diagnosis"];
    for (const keyword of keywords) {
      if (query.toLowerCase().includes(keyword)) {
        return `${keyword} of ${diseaseName}`; // Example: "Treatment for Fever"
      }
    }
    return `Chat about ${diseaseName}`; // Default title
  };
    // Handle sending a message
    const handleSendMessage = () => {
      if (!input.trim()) {
        setError("Type something related medical queries...");
        return;
      }
      setError("");
      const userMessage = { sender: "user", text: input };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      // Set the chat title based on the first user query
      if (messages.length === 1) { // First user message
        const topic = extractTopic(input);
        setChatTitle(topic); // Set only the topic (no date)
      }

      setTimeout(() => {
        setLoading(false);
        const botResponse = {
          sender: "bot",
          text: `You asked about: ${userMessage.text}. More info coming soon!`,
        };
        const finalMessages = [...updatedMessages, botResponse];
        setMessages(finalMessages);

        // Save to history (update existing session)
        saveChatHistory(finalMessages);
      }, 1000);
    };
  // Save chat history
  const saveChatHistory = (messages) => {
    try {
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
      const timestamp = new Date().toLocaleString();

      // Check if the session already exists in history
      const existingChatIndex = chatHistory.findIndex((chat) => chat.id === sessionId);

      if (existingChatIndex > -1) {
        // Update existing chat
        chatHistory[existingChatIndex].messages = messages;
        chatHistory[existingChatIndex].date = timestamp; // Update timestamp
      } else {
        // Create new chat
        const newChat = {
          id: sessionId, // Use the current session ID
          title: chatTitle, // Use the dynamic title
          messages,
          date: timestamp,
        };
        chatHistory.unshift(newChat);
      }

      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    } catch (error) {
      console.error("Error saving chat history:", error);
      setError("Failed to save chat history. Please try again.");
    }
  };
    // Handle new chat
    const handleNewChat = () => {
      try {
        // Save current session to history before resetting
        saveChatHistory(messages);

        // Reset chatbox
        localStorage.removeItem("currentChat");
        setMessages([{ sender: "bot", text: "Hi! How can I assist you today?" }]);
        setSessionId(Date.now().toString()); // Generate a new session ID
        setChatTitle(""); // Reset the title
        navigate("/chatbot", { state: { newChat: true } });
      } catch (error) {
        console.error("Error starting new chat:", error);
        setError("Failed to start a new chat. Please try again.");
      }
    };

    // Handle history navigation
    const handleHistory = () => {
      try {
        // Save current session to history before navigating
        saveChatHistory(messages);
        navigate("/history");
      } catch (error) {
        console.error("Error navigating to history:", error);
        setError("Failed to navigate to history. Please try again.");
      }
    };

    return (
      <div className="w-full min-h-screen bg-cover bg-center  px-5 py-3 bg-gray-100 relative pb-24" style={{backgroundImage:`url(${backgroundImage})`}} >
        <Title name={'Chatbot'} />
        {/* Chat Window */}
        <div className="flex flex-col mt-4 flex-grow bg-white w-full h-[450px] max-w-[450px] mx-auto p-3 rounded-md shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="mb-1 ms-2 text-start text-lg font-semibold">
              Chat about {diseaseName}
            </h3>
            <div className="flex gap-3">
              <p
                onClick={handleNewChat}
                className="text-lg rounded-full cursor-pointer hover:scale-110"
              >
                <RiChatNewLine />
              </p>
              <p
                onClick={handleHistory}
                className="text-xl rounded-full cursor-pointer hover:scale-110"
              >
                <MdHistory />
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="relative flex-grow overflow-auto bg-gray-50 rounded-md p-3"
          >
            <div className="relative z-10 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-2 ${
                    msg.sender === "user" ? "justify-end" : ""
                  }`}
                >
                  {msg.sender === "bot" && (
                    <FaRobot className="text-white bg-black rounded-full p-1" size={24} />
                  )}
                  <p
                    className={`p-2 rounded-md max-w-[70%] text-white ${
                      msg.sender === "user" ? "bg-cyan-800/80" : "bg-gray-700/70"
                    }`}
                  >
                    {msg.text}
                  </p>
                  {msg.sender === "user" && (
                    <FaUser className="text-white bg-black rounded-full p-1" size={24} />
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-start space-x-2">
                  <FaRobot className="text-white bg-black rounded-full p-1" size={24} />
                  <p className="rounded-md max-w-[70%] text-black">
                    <BeatLoader size={8} />
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Input Box */}
          <div className="flex flex-col">
            <div className="flex items-center border px-3 py-2 bg-white rounded-md mt-2">
              <input
                type="text"
                placeholder={error ? error : "Ask about something medical..."}
                className={`border-none p-2 bg-white focus:outline-none focus:ring-0 w-full ${
                  error ? "placeholder-red-500" : ""
                }`}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (error) setError("");
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <div className="flex items-center gap-3">
                <VscSend
                  size={25}
                  className="hover:text-blue-500 transition-colors cursor-pointer"
                  onClick={handleSendMessage}
                />
                <RiMicLine
                  size={25}
                  className="hover:text-blue-500 transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Chatbox;