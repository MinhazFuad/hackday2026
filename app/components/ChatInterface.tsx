"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "../utils/storage";

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    isBotTyping: boolean;
}

export default function ChatInterface({ messages, onSendMessage, isBotTyping }: ChatInterfaceProps) {
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isBotTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        onSendMessage(inputValue);
        setInputValue("");
    };

    return (
        <div className="chat-interface">
            <div className="messages-area">
                {messages.length === 0 && (
                    <div className="empty-state">
                        <h1>Welcome to MinuBot</h1>
                        <p>Start a conversation below!</p>
                    </div>
                )}
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.sender}`}>
                        <div className={`message-bubble ${msg.sender}`}>
                            {msg.text}
                            <span className="timestamp">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                {isBotTyping && (
                    <div className="message-row bot">
                        <div className="message-bubble bot typing-indicator">
                            <span>•</span><span>•</span><span>•</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="input-area" onSubmit={handleSend}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                    disabled={isBotTyping}
                />
                <button type="submit" className="send-button" disabled={!inputValue.trim() || isBotTyping} aria-label="Send Message">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M3.478 2.405a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </form>
        </div>
    );
}
