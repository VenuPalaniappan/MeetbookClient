// Post.jsx
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

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () => makeRequest.get("/likes?postId=" + post.id).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) {
        return makeRequest.delete("/likes?postId=" + post.id);
      } else {
        return makeRequest.post("/likes", { postId: post.id });
      }
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
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">
                {post.friends && post.place ? (
                  <>
                    is with <Link to={`/profile/${post.friendId}`}>{post.friends}</Link> in
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.place)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.place}
                    </a>
                    · {moment(post.createdAt).fromNow()}
                  </>
                ) : post.friends ? (
                  <>
                    is with <Link to={`/profile/${post.friendId}`}>{post.friends}</Link> · {moment(post.createdAt).fromNow()}
                  </>
                ) : post.place ? (
                  <>
                    is in <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.place)}`} target="_blank" rel="noopener noreferrer">{post.place}</a> · {moment(post.createdAt).fromNow()}
                  </>
                ) : (
                  <>{moment(post.createdAt).fromNow()}</>
                )}
              </span>
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
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_API_KEY&q=${encodeURIComponent(
                post.place
              )}`}
            ></iframe>
          )}
        </div>

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
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>

        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
