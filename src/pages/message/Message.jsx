import "./message.scss";
import { useState, useEffect,useContext } from "react";
import { makeRequest } from "../../axios";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const Message = ({ onClose, onStartChat }) => {
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await makeRequest.get("/friends/all");
        setFriends(res.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
    fetchFriends();
  }, []);

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    const handleStartChat = (friend) => {
    
    const conversationId =
      currentUser.id < friend.id
        ? `conv-${currentUser.id}-${friend.id}`
        : `conv-${friend.id}-${currentUser.id}`;

  
    navigate(`/message?conversationId=${conversationId}&receiverId=${friend.id}`);

   
    if (onClose) onClose();
  };
 

  return (
    <div className="message-popup">
      <div className="message-header">
        <h4>New Message</h4>
        <CloseIcon onClick={onClose} className="close-icon" />
      </div>
      <input
        type="text"
        placeholder="Search friends..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="friend-list">
        {filteredFriends.map((friend) => (
          <li key={friend.id} onClick={() => onStartChat(friend)}>
            <img src={`/upload/${friend.profilePic}`} alt={friend.name} />
            <span>{friend.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Message;
