"use client";

import React, { useEffect, useRef, useState } from "react";
import AskButton from "./AskButton";
import { ChatBubble } from "./ChatBubble";
import {
  PRESET_ANSWERS,
  SUGGESTED_PROMPTS,
  WELCOME_MESSAGE,
} from "@/data/data";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { role: "ai", text: WELCOME_MESSAGE },
  ]);
  const [disabledPromptIds, setDisabledPromptIds] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const onPromptClick = (prompt) => {
    setMessages((prev) => [...prev, { role: "user", text: prompt.text }]);
    setDisabledPromptIds((prev) => [...prev, prompt.id]);

    setTimeout(() => {
      const reply =
        PRESET_ANSWERS[prompt.id] || "I’ll have more to share soon!";
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    }, 700);
  };

  const onRestart = () => {
    setMessages([{ role: "ai", text: WELCOME_MESSAGE }]);
    setDisabledPromptIds([]);
  };

  const availablePrompts = SUGGESTED_PROMPTS.filter(
    (p) => !disabledPromptIds.includes(p.id)
  );

  return (
    <div className="banner">
      <div className="panel" role="region" aria-label="AI chat banner">
        <div className="title">AI Assistant</div>
        <div className="chat" ref={chatRef} aria-live="polite">
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} />
          ))}
        </div>

        <div>
          <AskButton prompts={availablePrompts} onClick={onPromptClick} />
          <div>
            <button onClick={onRestart}>
              Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
