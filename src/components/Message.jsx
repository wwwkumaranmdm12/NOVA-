function Message({ text, sender }) {
  return (
    <div className={sender === "user" ? "user-message" : "bot-message"}>
      {text}
    </div>
  );
}

export default Message;