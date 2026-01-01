import { useEffect, useRef, useState } from "react"
import Chatboticon from "./components/Chatboticon"
import Chatform from "./components/Chatform"
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./components/companyinfo";

const App = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [chatHistory, setChatHistory] = useState([{
    hideInChat: true,
    role: "model",
    text: companyInfo
  }]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {

    // *helper function to update chat history...
    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "💭🤔Thinking..."), { role: "model", text, isError }]);
    }

    // * format chathistory for api requests...
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history })
    }


    try {
      // ! Make the api call to get bot response...
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      if (!response) throw new Error(data.error.message || "Something went wrong!");
      // console.log(data);
      // clean and update chat history with bot response...
      const apiresponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiresponseText);
    } catch (error) {
      updateHistory(error.message, true)
    }
  };

  useEffect(() => {
    // auto scroll when chat updates...
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behaviour: "smooth" });
  }, [chatHistory]);

  return (
    <>
    <div className="heading">
      <h1 className="main-header1">Aroma Coffee Chatbot</h1>
    </div>
      <div className={`container ${showChatbot ? 'show-chatbot' : ""}`}>

        <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
          <span className="material-symbols-rounded">mode_comment</span>
          <span className="material-symbols-rounded">close</span>
        </button>

        <div className="chatbot-popup">
          {/* chatbot header */}
          <div className="chat-header">
            <div className="header-info">
              <Chatboticon />
              <h2 className="logo-text">
                Chatbot
              </h2>
            </div>
            <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
              keyboard_arrow_down
            </button>
          </div>
          {/* Chatbot body */}
          <div ref={chatBodyRef} className="chat-body">
            <div className="message bot-message">
              <Chatboticon />
              <p className="message-text">
                Hey there 🖐️ <br />How can I help you ?
              </p>
            </div>
            {/* Render the chat history dynamically */}
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}


          </div>
          {/* Chat footer  */}
          <div className="chat-footer">
            <Chatform chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App