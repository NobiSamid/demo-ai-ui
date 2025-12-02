export function ChatBubble({ role = "ai", text }) {
  return <div className={`${role}`}>{text}</div>;
}
