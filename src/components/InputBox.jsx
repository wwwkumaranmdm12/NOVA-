import { useState } from "react";

function InputBox({ onSend }) {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message.trim() === "") return;

    onSend(message);
    setMessage("");
  };

  return (
    <div className="input-area">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default InputBox;