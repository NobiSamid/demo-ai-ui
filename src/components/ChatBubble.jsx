export function ChatBubble({ role = "ai", text }) {
  return <div className={`msg ${role}`}>{text}</div>;
}
