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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editDesc, setEditDesc] = useState(post.desc || "");
  const [editFile, setEditFile] = useState(null);
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

  const updateMutation = useMutation({
    mutationFn: (payload) => makeRequest.put(`/posts/${post.id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsEditOpen(false);
      setMenuOpen(false);
    },
  });

  const upload = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await makeRequest.post("/upload", fd);
    return data; 
  };


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

  const handleSaveEdit = async () => {
    try {
      let newImg = null;
      if (editFile) {
        newImg = await upload(editFile);
      }
      await updateMutation.mutateAsync({
        desc: editDesc,
        ...(newImg ? { img: newImg } : {}), 
      });
    } catch (e) {
      console.error(e);
      alert("Failed to update post");
    }
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
            <div className="menu">
              <button
                onClick={() => {
                  setEditDesc(post.desc || "");
                  setEditFile(null);
                  setIsEditOpen(true);   // <-- open the modal you already built
                  setMenuOpen(false);
                }}
              >
                Edit
              </button>
              <button className="danger" onClick={handleDelete}>Delete</button>
            </div>
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
        <CommentModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} post={post}>
        <div style={{ padding: 8, minWidth: 320 }}>
          <h3 style={{ marginTop: 0 }}>Edit Post</h3>
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Update your text…"
            style={{ width: "100%", minHeight: 80, marginBottom: 8 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditFile(e.target.files?.[0] || null)}
            style={{ marginBottom: 12 }}
          />
          {editFile && (
            <div style={{ marginBottom: 12 }}>
              <img
                src={URL.createObjectURL(editFile)}
                alt="preview"
                style={{ maxWidth: "100%", borderRadius: 8 }}
              />
            </div>
          )}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setIsEditOpen(false)}>Cancel</button>
            <button onClick={handleSaveEdit}>Save</button>
          </div>
        </div>
      </CommentModal>
    </div>
  );
};

export default Post;
