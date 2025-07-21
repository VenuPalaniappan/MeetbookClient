import "./shareModal.scss";
import { useState, useContext } from "react";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const ShareModal = ({ post, onClose }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

const handleShare = async () => {
  try {
    console.log("📤 Sending share request with:", {
      originalPostId: post.id,
      userId: currentUser.id,
      desc,
    });

    await makeRequest.post("/posts/share", {
      originalPostId: post.id,
      userId: currentUser.id,
      desc,
    });

    alert("✅ Post shared to your feed!");
    onClose();
  } catch (err) {
    console.error("❌ Error sharing post:", err.response?.data || err.message);
    alert("❌ Failed to share post. See console for details.");
  }
};

  return (
    <div className="shareModal">
      <div className="modalContent">
        <h3>Share this post</h3>
        <textarea
          placeholder="Say something about this..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleShare}>Share</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ShareModal;
