"use client";

import React, { useEffect, useRef, useState } from "react";
import AskButton from "./AskButton";
import { ChatBubble } from "./ChatBubble";
import {
  PRESET_ANSWERS,
  SUGGESTED_PROMPTS,
  WELCOME_MESSAGE,
} from "@/data/data";
import { TypingIndicator } from "./TypingIndicator";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { role: "ai", text: WELCOME_MESSAGE },
  ]);
  const [typing, setTyping] = useState(false);
  const [disabledPromptIds, setDisabledPromptIds] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const onPromptClick = (prompt) => {
    setMessages((prev) => [...prev, { role: "user", text: prompt.text }]);
    setDisabledPromptIds((prev) => [...prev, prompt.id]);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const reply =
        PRESET_ANSWERS[prompt.id] || "I’ll have more to share soon!";
      setMessages((prev) => [...prev, { role: "ai", text: "" }]);
      typeReply(reply, setMessages)
    }, 700);
  };

  const onRestart = () => {
    setTyping(false);
    setMessages([{ role: "ai", text: WELCOME_MESSAGE }]);
    setDisabledPromptIds([]);
  };

  const availablePrompts = SUGGESTED_PROMPTS.filter(
    (p) => !disabledPromptIds.includes(p.id)
  );

  const typeReply = (reply, setMessages) =>{
    const words = reply.split(" ");
    let currentText = '';

    words.forEach((word, index) =>{
      setTimeout(() => {
        currentText += (index === 0 ? "" : " ") + word;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {role: "ai", text: currentText};
          return newMessages;
        });
      }, index * 200)
    })
  }

  return (
    <div className="banner">
      <div className="panel" role="region" aria-label="AI chat banner">
        <div className="title">AI Assistant</div>
        <div className="chat" ref={chatRef} aria-live="polite">
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} />
          ))}
          {typing && <TypingIndicator />} 
        </div>

        <div>
          <AskButton prompts={availablePrompts} onClick={onPromptClick} />
          <div>
            <button className="restart" onClick={onRestart}>
              Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
