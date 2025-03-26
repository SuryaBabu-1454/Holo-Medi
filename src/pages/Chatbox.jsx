import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaRobot } from "react-icons/fa";
import { VscSend } from "react-icons/vsc";
import { RiChatNewLine, RiMicLine } from "react-icons/ri";
import { BeatLoader } from "react-spinners";
import { useLocation, useNavigate } from "react-router-dom";
import { MdHistory } from "react-icons/md";
import Title from "../components/Title";
import backgroundImage from '../assets/background/c4.jpg'
import axios from "axios";


const Chatbox = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const diseaseName = location.state?.diseaseName || "something Medical";
  const chatId = location.state?.chatId;
  const continueSession = location.state?.continueSession;
  const autoQuestion = location.state?.autoQuestion;

  const [messages, setMessages] = useState([{ sender: "bot", text: "Hi! How can I assist you today?" }]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [sessionId, setSessionId] = useState(chatId || Date.now().toString());
  const [chatTitle, setChatTitle] = useState("");
  const autoQuestionProcessed = useRef(false);

  // Handle auto-question when component mounts
  useEffect(() => {
    if (autoQuestion && !autoQuestionProcessed.current && messages.length === 1) {
      autoQuestionProcessed.current = true;
      const userMessage = { sender: "user", text: autoQuestion };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      handleAutoResponse(autoQuestion, updatedMessages);
    }
  }, [autoQuestion]);

  // Handle auto-response
  const handleAutoResponse = async (question, messageHistory) => {
    setLoading(true);
    try {
      const response = await axios.post("http://192.168.0.75:5000/ask", {
        query: question,
      }, {
       
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data?.response) {
        throw new Error("Empty response from server");
      }

      const botResponse = { 
        sender: "bot", 
        text: response.data.response || "I couldn't generate a response. Please try again." 
      };
      const newMessages = [...messageHistory, botResponse];
      setMessages(newMessages);
      saveChatHistory(newMessages);
    } catch (error) {
      console.error("Error fetching auto-response:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I encountered an error processing your request. Please try asking again."
      };
      setMessages([...messageHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Load old chat if continuing a session
  useEffect(() => {
    if (continueSession && chatId) {
      try {
        const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        const selectedChat = chatHistory.find((chat) => chat.id === chatId);
        if (selectedChat) {
          setMessages(selectedChat.messages);
          setSessionId(selectedChat.id);
          setChatTitle(selectedChat.title);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
        setError("Failed to load chat history");
      }
    }
  }, [chatId, continueSession]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) {
      setError("Type something related to medical queries...");
      return;
    }
    
    setError("");
    const userMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://192.168.0.75:5000/ask", {
        query: input,
      }, {
  
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data?.response) {
        throw new Error("Empty response from server");
      }

      const botResponse = { 
        sender: "bot", 
        text: response.data.response 
      };
      const newMessages = [...updatedMessages, botResponse];
      setMessages(newMessages);
      saveChatHistory(newMessages);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I couldn't get a response. Please check your connection and try again."
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Save chat history
  const saveChatHistory = (messages) => {
    try {
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
      const timestamp = new Date().toLocaleString();
      const title = chatTitle || messages.find(m => m.sender === "user")?.text || "New Chat";

      const existingChatIndex = chatHistory.findIndex((chat) => chat.id === sessionId);

      if (existingChatIndex > -1) {
        chatHistory[existingChatIndex] = {
          id: sessionId,
          title,
          messages,
          date: timestamp
        };
      } else {
        chatHistory.unshift({
          id: sessionId,
          title,
          messages,
          date: timestamp
        });
      }

      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  // Handle new chat
  const handleNewChat = () => {
    try {
      saveChatHistory(messages);
      localStorage.removeItem("currentChat");
      setMessages([{ sender: "bot", text: "Hi! How can I assist you today?" }]);
      setSessionId(Date.now().toString());
      setChatTitle("");
      autoQuestionProcessed.current = false;
      navigate("/chatbot", { state: { newChat: true } });
    } catch (error) {
      console.error("Error starting new chat:", error);
      setError("Failed to start a new chat");
    }
  };

  // Handle history navigation
  const handleHistory = () => {
    try {
      saveChatHistory(messages);
      navigate("/history");
    } catch (error) {
      console.error("Error navigating to history:", error);
      setError("Failed to navigate to history");
    }
  };

  return (
    <div className="w-full min-h-screen bg-cover bg-center px-5 py-3 bg-gray-100 relative pb-24" style={{backgroundImage:`url(${backgroundImage})`}}>
      <Title name={'Chatbot'} />
      <div className="flex flex-col mt-4 flex-grow bg-white w-full h-[450px] max-w-[450px] mx-auto p-3 rounded-md shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="mb-1 ms-2 text-start text-lg font-semibold">
            Chat about {diseaseName}
          </h3>
          <div className="flex gap-3">
            <button
              onClick={handleNewChat}
              className="text-lg rounded-full cursor-pointer hover:scale-110"
              aria-label="New chat"
            >
              <RiChatNewLine />
            </button>
            <button
              onClick={handleHistory}
              className="text-xl rounded-full cursor-pointer hover:scale-110"
              aria-label="Chat history"
            >
              <MdHistory />
            </button>
          </div>
        </div>

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
                <div className="rounded-md max-w-[70%] text-black">
                  <BeatLoader size={8} color="#3b82f6" />
                </div>
              </div>
            )}
          </div>
        </div>

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
              disabled={loading}
              aria-label="Type your message"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="hover:text-blue-500 transition-colors cursor-pointer"
                aria-label="Send message"
              >
                <VscSend size={25} />
              </button>
              <button
                className="hover:text-blue-500 transition-colors cursor-pointer"
                aria-label="Use microphone"
              >
                <RiMicLine size={25} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;


