import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import CommentModal from "../commentmodal/CommentModal";
import ShareModal from "../shareModal/shareModal";

const Post = ({ post }) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () => makeRequest.get("/likes?postId=" + post.id).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (liked) => {
      return liked
        ? makeRequest.delete("/likes?postId=" + post.id)
        : makeRequest.post("/likes", { postId: post.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", post.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => makeRequest.delete("/posts/" + post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

   const handleShare = () => {
    const postUrl= `${window.location.origin}/post/${post.id}`;
   
    };

  const handleLike = () => {
    if (!data) return;
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

 

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.profilePic} alt="" />
            <div className="details">
              <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                <span className="name">{post.userName || currentUser.name} </span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>

        <div className="content">
          <div className="image-wrapper">
            {post.desc && <p className="image-description">{post.desc}</p>}
            {post.img && <img src={"/upload/" + post.img} alt="" />}
          </div>

          {post.place && (
            <iframe
              title="map"
              width="100%"
              height="250"
              style={{ borderRadius: "10px", marginTop: "15px", border: "0" }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAWSbf4zi5KI7t5FhcvtvN6XZ_zC-Snu3A&q=${encodeURIComponent(post.place)}`}
            ></iframe>
          )}
        </div>
       
        {post.friends && (
            <div className="friends-tagged" style={{ marginTop: "10px", fontWeight: 500 }}>
              👥 Tagged:{" "}
              {post.friends
                .split(",")
                .map((friend, i) => (
                  <span key={i} style={{ marginRight: "8px", color: "#4267B2" }}>
                    {friend.trim()}
                  </span>
                ))}
            </div>
          )}

        <div className="info">
          <div className="item">
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                {data?.includes(currentUser.id) ? (
                  <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
                ) : (
                  <FavoriteBorderOutlinedIcon onClick={handleLike} />
                )}
                {data?.length} Likes
              </>
            )}
          </div>
          <div className="item" onClick={() => setIsCommentModalOpen(true)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="item" onClick={() => setIsShareModalOpen(true)}> 
                <ShareOutlinedIcon />
                Share
                {isShareModalOpen && (
                  <ShareModal post={post} onClose={() => setIsShareModalOpen(false)} />
                )}
              </div>
        </div>
      </div>

     
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        post={post}
      >
        <Comments postId={post.id} />
      </CommentModal>
    </div>
  );

};

export default Post;
