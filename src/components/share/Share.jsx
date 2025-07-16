import "./share.scss";
import LocationIcon from "../../assets/map.png";
import PhotoVideoIcon from "../../assets/img.png";
import TagIcon from "../../assets/friend.png";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [place, setPlace] = useState("");
  const [friends, setFriends] = useState("");
  const [showPlaceInput, setShowPlaceInput] = useState(false);
  const [showFriendsInput, setShowFriendsInput] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation({
    mutationFn: (newPost) => makeRequest.post("/posts", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();

    mutation.mutate({
      desc,
      img: imgUrl,
      place: place.trim() || null,
      friends: friends.trim() || null,
    });

    setDesc("");
    setFile(null);
    setPlace("");
    setFriends("");
    setShowPlaceInput(false);
    setShowFriendsInput(false);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={"/upload/" + currentUser.profilePic} alt="" />
          <input
            type="text"
            placeholder={`What's on your mind, ${currentUser.name}?`}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {file && <img className="preview-img" src={URL.createObjectURL(file)} alt="preview" />}

        <hr />

        <div className="bottom">
          <div className="actions">
            <div
              className="item"
              onClick={() => setShowPlaceInput((prev) => !prev)}
              role="button"
              tabIndex={0}
            >
              <img src={LocationIcon} alt="Location" />
              <span style={{ color: "#f3425f" }}>Location</span>
            </div>

            <label htmlFor="file" className="item">
              <img src={PhotoVideoIcon} alt="Media" />
              <span style={{ color: "#45bd62" }}>Photo/video</span>
            </label>

            <div
              className="item"
              onClick={() => setShowFriendsInput((prev) => !prev)}
              role="button"
              tabIndex={0}
            >
              <img src={TagIcon} alt="Tag" />
              <span style={{ color: "#f7b928" }}>Tag Friend</span>
            </div>

            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {/* Conditional input fields */}
          {showPlaceInput && (
            <input
              type="text"
              className="extra-input"
              placeholder="Enter location"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          )}

          {showFriendsInput && (
            <input
              type="text"
              className="extra-input"
              placeholder="Tag friends (comma-separated)"
              value={friends}
              onChange={(e) => setFriends(e.target.value)}
            />
          )}

          <button onClick={handleClick}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default Share;
