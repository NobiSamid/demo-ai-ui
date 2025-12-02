import React from "react";

const AskButton = ({ prompts, onClick }) => {
  return (
    <div className="prompts">
      {prompts.map((p) => (
        <button
          key={p.id}
          className="prompt-btn"
          onClick={() => onClick(p)}
          aria-label={`Ask: ${p.text}`}
        >
          {p.text}
        </button>
      ))}
    </div>
  );
};

export default AskButton;
