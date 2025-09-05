import { useState, useRef, useEffect } from 'react';
import { IoIosSend } from "react-icons/io";
import axios from 'axios';

function App() {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const backendURL = "http://127.0.0.1:8000";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userMessage.trim() || isLoading) return;

    try {
      // Add user message to chat
      const newUserMessage = { sender: "user", text: userMessage };
      setMessages(prev => [...prev, newUserMessage]);
      setUserMessage("");
      setIsLoading(true);

      // Send message to backend
      const response = await axios.post(`${backendURL}/chat`, {
        message: userMessage
      });
      
      // Add bot response to chat
      const botResponse = { sender: "bot", text: response.data };
      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.error("Error sending message:", err);
      // Add error message to chat
      const errorMessage = { sender: "bot", text: "⚠️ Something went wrong, please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <h2 className="text-2xl font-bold mb-2">Welcome to ChatBot</h2>
            <p>Start a conversation by typing a message below</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                    msg.sender === "user" 
                      ? "bg-blue-500 text-white rounded-br-none" 
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="p-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <textarea
              className="flex-1 bg-transparent border-none outline-none resize-none py-2 px-2 max-h-32"
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              value={userMessage}
              placeholder="How can I help you?"
              rows="1"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !userMessage.trim()}
              className={`p-2 rounded-full ${
                isLoading || !userMessage.trim()
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-500 hover:bg-blue-100"
              }`}
            >
              <IoIosSend className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;