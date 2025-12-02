import React from "react";

const AskButton = ({ prompts, onClick }) => {
  return (
    <div>
      {prompts.map((p) => (
        <button
          key={p.id}
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
