import "./leftBar.scss";
import { AuthContext } from "../../context/authContext";
import { useContext,useState } from "react";
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";
import Message from "../../pages/message/Message.jsx";
import ChatWindow from "../../pages/chatWindow/ChatWindow.jsx";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);

  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const handleStartChat = (friend) => {
  const conversationId = currentUser.id < friend.id
    ? `conv-${currentUser.id}-${friend.id}`
    : `conv-${friend.id}-${currentUser.id}`;

  const chatData = {
    ...friend,
    currentUserId: currentUser.id,
    conversationId,
  };
  setActiveChat(chatData);
  setShowMessagePopup(false);
};

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img
              src={"/upload/" +currentUser.profilePic} alt=""/>
            <span>{currentUser.name}</span>
          </div>

          <Link to="/friends" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="item">
                <Icon icon="fluent:people-community-32-filled" color="#6a1b9a" width="24" />
              <span>Friends</span>
            </div>
          </Link>

          <Link to="/gallery" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="item">
                 <Icon icon="mdi:image-multiple" color="#43a047" width="24" />
              <span>Gallery</span>
            </div>
          </Link>

          
          <div className="item"
            style={{ cursor: "pointer" }}
            onClick={() => setShowMessagePopup(true)}>
            <Icon icon="material-symbols:mail-outline" color="#1976d2" width="24" />
            <span>Message</span>
          </div>
        </div>

        <hr />
      </div>
        {showMessagePopup && (
        <div className="message-popup-wrapper">
          <div className="overlay" onClick={() => setShowMessagePopup(false)} />
          <Message
            onClose={() => setShowMessagePopup(false)}
            onStartChat={handleStartChat}
          />
           </div>
        )}

        {/* Show Chat window */}
        {activeChat && (
          <ChatWindow
            friend={activeChat}
            onClose={() => setActiveChat(null)}
          />
        )}
      </div>
    
  );
};

export default LeftBar;