import { useEffect, useRef, useState } from "react";
import "./App.css";
import { sendMessage } from "./services/api";

function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("chatMessages");

      if (saved) {
        return JSON.parse(saved);
      }

      return [];
    } catch (error) {
      console.error("Unable to load chat history:", error);
      return [];
    }
  });

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Save messages
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // Send message
  const handleSendMessage = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const userText = prompt.trim();

    if (!userText || loading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: userText,
    };

    setMessages(function (previousMessages) {
      return [...previousMessages, userMessage];
    });

    setPrompt("");
    setLoading(true);

    try {
      const reply = await sendMessage(userText);

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: reply,
        error: false,
      };

      setMessages(function (previousMessages) {
        return [...previousMessages, botMessage];
      });
    } catch (error) {
      console.error("Chat API error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          "Sorry, I could not connect to the AI service. Please make sure the Spring Boot backend is running on port 8080.",
        error: true,
      };

      setMessages(function (previousMessages) {
        return [...previousMessages, errorMessage];
      });
    } finally {
      setLoading(false);
    }
  };

  // Enter = Send
  // Shift + Enter = New line
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(event);
    }
  };

  // Clear conversation
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  // New chat
  const newChat = () => {
    setMessages([]);
    setPrompt("");
    localStorage.removeItem("chatMessages");
  };

  // Suggestion click
  const useSuggestion = (text) => {
    setPrompt(text);
  };

  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            ✦
          </div>

          <div>
            <h2>Nova AI</h2>
            <span>AI Assistant</span>
          </div>

        </div>

        <button
          className="new-chat-btn"
          onClick={newChat}
        >
          <span>＋</span>
          New Chat
        </button>

        <div className="sidebar-section">

          <p className="section-title">
            Your Chat
          </p>

          {messages.length > 0 ? (

            <div className="chat-preview">

              <span>💬</span>

              <div>

                <strong>
                  Current Conversation
                </strong>

                <small>
                  {messages.length} messages
                </small>

              </div>

            </div>

          ) : (

            <div className="empty-history">

              <span>🗨</span>

              <p>
                No conversations yet
              </p>

            </div>

          )}

        </div>

        <div className="sidebar-bottom">

          <button
            className="side-action"
            onClick={clearChat}
          >
            🗑 <span>Clear conversation</span>
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="main">

        {/* TOP BAR */}

        <header className="topbar">

          <div className="mobile-brand">

            <div className="brand-icon">
              ✦
            </div>

            <strong>
              Nova AI
            </strong>

          </div>

          <div className="status">

            <span className="status-dot"></span>

            AI Online

          </div>

        </header>


        {/* ================= CHAT AREA ================= */}

        <section className="chat-area">

          {/* WELCOME SCREEN */}

          {messages.length === 0 ? (

            <div className="welcome">

              <div className="welcome-icon">
                ✦
              </div>

              <h1>
                How can I help you?
              </h1>

              <p>
                Ask me anything. I can help with coding,
                learning, explanations, ideas, writing and more.
              </p>


              {/* SUGGESTIONS */}

              <div className="suggestions">

                <button
                  onClick={() =>
                    useSuggestion(
                      "Explain Java Spring Boot"
                    )
                  }
                >

                  <span>
                    💻
                  </span>

                  <div>

                    <strong>
                      Learn coding
                    </strong>

                    <small>
                      Explain Java Spring Boot
                    </small>

                  </div>

                </button>


                <button
                  onClick={() =>
                    useSuggestion(
                      "How can I improve my resume?"
                    )
                  }
                >

                  <span>
                    📄
                  </span>

                  <div>

                    <strong>
                      Career help
                    </strong>

                    <small>
                      Improve my resume
                    </small>

                  </div>

                </button>


                <button
                  onClick={() =>
                    useSuggestion(
                      "Explain artificial intelligence simply"
                    )
                  }
                >

                  <span>
                    🧠
                  </span>

                  <div>

                    <strong>
                      Learn something
                    </strong>

                    <small>
                      Explain AI simply
                    </small>

                  </div>

                </button>


                <button
                  onClick={() =>
                    useSuggestion(
                      "Give me some project ideas"
                    )
                  }
                >

                  <span>
                    💡
                  </span>

                  <div>

                    <strong>
                      Get ideas
                    </strong>

                    <small>
                      Project ideas
                    </small>

                  </div>

                </button>

              </div>

            </div>

          ) : (

            /* ================= MESSAGES ================= */

            <div className="messages">

              {messages.map(function (message) {

                return (

                  <div
                    className={
                      "message-row " +
                      message.sender
                    }
                    key={message.id}
                  >

                    {/* AVATAR */}

                    <div className="avatar">

                      {message.sender === "user"
                        ? "You"
                        : "✦"}

                    </div>


                    {/* MESSAGE CONTENT */}

                    <div
                      className={
                        "message-content " +
                        (message.error
                          ? "error-message"
                          : "")
                      }
                    >

                      <div className="message-name">

                        {message.sender === "user"
                          ? "You"
                          : "Nova AI"}

                      </div>


                      <div className="message-text">

                        {message.text}

                      </div>

                    </div>

                  </div>

                );
              })}


              {/* TYPING INDICATOR */}

              {loading && (

                <div className="message-row bot">

                  <div className="avatar">
                    ✦
                  </div>

                  <div className="message-content">

                    <div className="message-name">
                      Nova AI
                    </div>

                    <div className="typing">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                  </div>

                </div>

              )}


              <div ref={chatEndRef}></div>

            </div>

          )}

        </section>


        {/* ================= INPUT ================= */}

        <div className="input-wrapper">

          <form
            className="input-box"
            onSubmit={handleSendMessage}
          >

            <textarea
              value={prompt}
              onChange={(event) =>
                setPrompt(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Message Nova AI..."
              rows="1"
              disabled={loading}
            />


            <button
              type="submit"
              className="send-btn"
              disabled={
                !prompt.trim() || loading
              }
              aria-label="Send message"
            >
              ➤
            </button>

          </form>


          <p className="input-note">
            Nova AI can make mistakes. Verify important information.
          </p>

        </div>

      </main>

    </div>
  );
}

export default App;