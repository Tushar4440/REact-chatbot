import { useRef } from "react";

const Chatform = ({ chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef();
    const handleformsubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";

        //^ Update chat history with user message...
        setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

        //^ Add a thinking... text before bot response...
        setTimeout(() => {
            setChatHistory((history) => [...history, { role: "model", text: "💭🤔Thinking..." }]);
            //* Call the function to generate response by the bot ...
            generateBotResponse([...chatHistory, { role: "user", text: `Using the details provided above, please address the query : ${userMessage}` }]);
        }, 500);

    }
    return (
        <form action="#" className="chat-form" onSubmit={handleformsubmit}>
            <input ref={inputRef} type="text" placeholder="Message ..." className="message-input" required />
            <button className="material-symbols-rounded">
                arrow_upward
            </button>
        </form>
    )
}

export default Chatform