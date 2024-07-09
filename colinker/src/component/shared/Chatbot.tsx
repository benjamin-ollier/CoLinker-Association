import { Badge, Button } from "antd";
import { CommentOutlined } from '@ant-design/icons';
import React, { useState } from "react";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hey, what do you need?' },
    ]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleChoice = (choice: string) => {
        setMessages([...messages, { type: 'user', text: choice }]);
        
        switch (choice) {
            case 'I need help with my account.':
                setTimeout(() => {
                    setMessages([
                        ...messages,
                        { type: 'bot', text: 'Sure, what specifically do you need help with?' },
                    ]);
                }, 500);
                break;
            case 'I have a question about your service.':
                setTimeout(() => {
                    setMessages([
                        ...messages,
                        { type: 'bot', text: 'I\'m here to help. What is your question?' },
                    ]);
                }, 500);
                break;
            // Add more cases for additional choices
            default:
                break;
        }
    }

    return (
        <div className="absolute bottom-0 right-0 m-5 flex items-end">
            <div className={`w-80 h-80 mr-2 bg-white shadow rounded-lg ${isOpen ? "" : "hidden"}`}>
                <div className="bg-bermuda shadow text-white p-3 font-bold text-center rounded-t-lg">Chatbot</div>
                <div className="flex flex-col h-full overflow-y-auto p-3">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'} mb-2`}>
                            <p className="px-3 py-1 rounded-full bg-gray">
                                {msg.text}
                            </p>
                        </div>
                    ))}
                    {messages[messages.length - 1].type === 'bot' && (
                        <div className="flex justify-end">
                            <button
                                className="px-3 py-1 rounded-full border border-bermuda hover:bg-bermuda hover:text-white"
                                onClick={() => handleChoice('I need help with my account.')}>
                                I need help with my account.
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Badge dot={!isOpen} offset={[-6, 6]}>
                <Button
                    shape="circle"
                    icon={<CommentOutlined style={{fontSize: '26px'}} />}
                    style={{width: "46px", height: "46px"}}
                    onClick={toggleChat}
                />
            </Badge>
        </div>
    )
}

export default Chatbot;