import "./chatWindow.scss";
import { useState, useEffect, useRef } from "react";
import { makeRequest } from "../../axios";
import CloseIcon from "@mui/icons-material/Close";

const ChatWindow = ({ friend, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const scrollRef = useRef();

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await makeRequest.get(`/messages/${friend.conversationId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };
    fetchMessages();
  }, [friend.conversationId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const msg = {
      conversationId: friend.conversationId,
      senderId: friend.currentUserId,
      receiverId: friend.id,
      text: newMsg,
    };

    try {
      const res = await makeRequest.post("/messages", msg);
      setMessages([...messages, res.data]);
      setNewMsg("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img src={`/upload/${friend.profilePic}`} alt="" />
        <span>{friend.name}</span>
        <CloseIcon className="close-btn" onClick={onClose} />
      </div>

      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.senderId === friend.currentUserId ? "own" : ""}`}
          >
            {msg.text}
            <div ref={scrollRef}></div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
