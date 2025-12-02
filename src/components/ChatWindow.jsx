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

  const [position, setPosition] = useState({ x: 50, y: 50 });
  const bannerRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

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
      typeReply(reply, setMessages);
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

  const handleMouseDown = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const typeReply = (reply, setMessages) => {
    const words = reply.split(" ");
    let currentText = "";

    words.forEach((word, index) => {
      setTimeout(() => {
        currentText += (index === 0 ? "" : " ") + word;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "ai",
            text: currentText,
          };
          return newMessages;
        });
      }, index * 200);
    });
  };

  return (
    <div
      className="banner"
      style={{ position: "absolute", left: position.x, top: position.y }}
    >
      <div className="drag-handle" onMouseDown={handleMouseDown}>
        ⇲
      </div>
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
