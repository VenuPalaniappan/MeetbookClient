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
          {post.desc && <p className="description">{post.desc}</p>}

          {post.img && (
            <div className="image-wrapper">
              <img src={"/upload/" + post.img} alt="" />
            </div>
          )}
          </div>
          
         {(post.friends || post.place) && (
            <div className="meta-row">
              {post.friends && (
                <div className="meta-item friends">
                  👥 Tagged:&nbsp;
                  {post.friends.split(",").map((friend, i) => (
                    <span key={i} className="tag">{friend.trim()}</span>
                  ))}
                </div>
              )}
              {post.place && (
                <div className="meta-item location">
                  <span className="pin">📍</span>
                  <a
                    href={
                      post.placeLat != null && post.placeLng != null
                        ? `https://www.google.com/maps/search/?api=1&query=${post.placeLat},${post.placeLng}${
                            post.placeId ? `&query_place_id=${post.placeId}` : ""
                          }`
                        : post.placeId
                        ? `https://www.google.com/maps/search/?api=1&query_place_id=${post.placeId}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.place)}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    title="Open in Google Maps"
                  >
                    {post.place}
                  </a>
                </div>
              )}
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
