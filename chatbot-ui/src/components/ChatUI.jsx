import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function ChatUI() {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("fitness-chat-sessions");

    if (!saved) {
      const id = generateId();
      return {
        currentId: id,
        sessions: {
          [id]: { title: "Chat 1", messages: [] },
        },
      };
    }

    return JSON.parse(saved);
  });

  const [currentId, setCurrentId] = useState(sessions.currentId);

  const [messages, setMessages] = useState(
    sessions.sessions[sessions.currentId]?.messages || []
  );

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // sync messages
  useEffect(() => {
    setMessages(
      sessions.sessions[currentId]?.messages || []
    );
  }, [currentId, sessions.sessions]);

  // persist
  useEffect(() => {
    localStorage.setItem(
      "fitness-chat-sessions",
      JSON.stringify({
        ...sessions,
        currentId,
      })
    );
  }, [sessions, currentId]);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const updateMessages = (newMsgs) => {
    setSessions((prev) => ({
      ...prev,
      currentId,
      sessions: {
        ...prev.sessions,
        [currentId]: {
          ...prev.sessions[currentId],
          messages: newMsgs,
        },
      },
    }));
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;

    const userMessage = { role: "user", text: userText };

    const newMsgs = [...messages, userMessage];

    updateMessages(newMsgs);

    // auto rename if first message
    if (messages.length === 0) {
      autoRenameChat(userText);
    }

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      let botText = "No response";

      if (typeof data.reply === "string") botText = data.reply;
      else if (Array.isArray(data.plan))
        botText = data.plan.join("\n");

      updateMessages([
        ...newMsgs,
        { role: "bot", text: botText },
      ]);
    } catch {
      updateMessages([
        ...newMsgs,
        {
          role: "bot",
          text: "⚠ Backend not reachable.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // AUTO TITLE FROM FIRST MESSAGE
  const autoRenameChat = (text) => {
    const short = text.slice(0, 28);

    setSessions((prev) => ({
      ...prev,
      sessions: {
        ...prev.sessions,
        [currentId]: {
          ...prev.sessions[currentId],
          title: short,
        },
      },
    }));
  };

  // NEW CHAT
  const newChat = () => {
    const id = generateId();

    const count = Object.keys(sessions.sessions).length + 1;

    setSessions((prev) => ({
      currentId: id,
      sessions: {
        ...prev.sessions,
        [id]: {
          title: `Chat ${count}`,
          messages: [],
        },
      },
    }));

    setCurrentId(id);
  };

  // CLEAR CURRENT CHAT
  const clearChat = () => {
    setSessions((prev) => ({
      ...prev,
      sessions: {
        ...prev.sessions,
        [currentId]: {
          ...prev.sessions[currentId],
          messages: [],
        },
      },
    }));
  };

  // DELETE CHAT
  const deleteChat = (id) => {
    setSessions((prev) => {
      const updated = { ...prev.sessions };
      delete updated[id];

      let newCurrent = prev.currentId;

      if (id === prev.currentId) {
        const remaining = Object.keys(updated);

        if (remaining.length === 0) {
          const newId = generateId();
          updated[newId] = {
            title: "Chat 1",
            messages: [],
          };
          newCurrent = newId;
        } else {
          newCurrent = remaining[0];
        }
      }

      setCurrentId(newCurrent);

      return {
        currentId: newCurrent,
        sessions: updated,
      };
    });
  };

  // MANUAL RENAME
  const startEdit = (id, title) => {
    setEditingId(id);
    setEditValue(title);
  };

  const saveEdit = (id) => {
    setSessions((prev) => ({
      ...prev,
      sessions: {
        ...prev.sessions,
        [id]: {
          ...prev.sessions[id],
          title: editValue || prev.sessions[id].title,
        },
      },
    }));

    setEditingId(null);
  };

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} className="sidebar-logo" />
          <span>Fitness AI</span>
        </div>

        <button className="new-chat-btn" onClick={newChat}>
          + New Chat
        </button>

        <div className="chat-list">
          {Object.entries(sessions.sessions).map(
            ([id, chat]) => (
              <div
                key={id}
                className={`chat-session ${
                  id === currentId ? "active" : ""
                }`}
              >
                {editingId === id ? (
                  <input
                    className="rename-input"
                    value={editValue}
                    autoFocus
                    onChange={(e) =>
                      setEditValue(e.target.value)
                    }
                    onBlur={() => saveEdit(id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && saveEdit(id)
                    }
                  />
                ) : (
                  <span
                    onDoubleClick={() =>
                      startEdit(id, chat.title)
                    }
                    onClick={() => setCurrentId(id)}
                  >
                    {chat.title}
                  </span>
                )}

                <button
                  className="delete-chat-btn"
                  onClick={() => deleteChat(id)}
                >
                  ✕
                </button>
              </div>
            )
          )}
        </div>
      </aside>

      {/* MAIN */}
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-left">
            <img src={logo} className="chat-logo" />
            <span className="chat-title">
              {sessions.sessions[currentId]?.title}
            </span>
          </div>

          <button onClick={clearChat} className="clear-btn">
            Clear
          </button>
        </div>

        <div className="chat-body">
          {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.role}`}>
              {m.text.split("\n").map((l, idx) => (
                <div key={idx}>{l}</div>
              ))}
            </div>
          ))}

          {loading && (
            <div className="chat-message bot typing">
              AI is thinking…
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about diet, recovery, injury..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
