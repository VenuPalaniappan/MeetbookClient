import "./commentModal.scss";
import moment from "moment";

const CommentModal = ({ isOpen, onClose, post, children }) => {
  if (!isOpen || !post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>

        <div className="modalPostContent">
          {/* ✅ Show post details + image ONCE at top */}
          <div className="modalHeader">
            <div className="userInfo">
              <img src={"/upload/" + post.profilePic} alt="" />
              <div className="details">
                <span className="name">{post.name}</span>
                <span className="date">{moment(post.createdAt).format("LLL")}</span>
              </div>
            </div>
            {post.desc && <p className="desc">{post.desc}</p>}
            {post.img && <img className="modalImage" src={"/upload/" + post.img} alt="" />}
          </div>

          {/* ✅ Comments go here */}
          <div className="modalComments">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
