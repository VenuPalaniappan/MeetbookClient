import "./share.scss";
import LocationIcon from "../../assets/map.png";
import PhotoVideoIcon from "../../assets/img.png";
import TagIcon from "../../assets/friend.png";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const dummyLocations = [
  "Singapore, Singapore",
  "Suntec Singapore Convention & Exhibition Centre",
  "Sentosa Island, Singapore",
  "Broth & Beyond Hot Pot",
  "Esplanade MRT Station",
  "PARKROYAL COLLECTION Marina Bay, Singapore",
];

const dummyFriends = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Mike Johnson" },
  { id: 4, name: "Amanda Tan" },
  { id: 5, name: "Satiah Kumar" },
];

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [place, setPlace] = useState("");
  const [friendInput, setFriendInput] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);
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
      friends: selectedFriends.join(", ") || null,
    });

    setDesc("");
    setFile(null);
    setPlace("");
    setFriendInput("");
    setSelectedFriends([]);
    setShowPlaceDropdown(false);
    setShowFriendsInput(false);
  };

  const handleSelectFriend = (friendName) => {
    if (!selectedFriends.includes(friendName)) {
      setSelectedFriends([...selectedFriends, friendName]);
    }
    setFriendInput("");
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

        {file && (
          <img className="preview-img" src={URL.createObjectURL(file)} alt="preview" />
        )}

        {/* Location Preview */}
        {place && (
          <div className="location-preview">
            📍 {place}
            <span className="clear-btn" onClick={() => setPlace("")}>
              ❌
            </span>
          </div>
        )}

      
        {selectedFriends.length > 0 && (
          <div className="location-preview">
            👥 {selectedFriends.join(", ")}
            <span className="clear-btn" onClick={() => setSelectedFriends([])}>
              ❌
            </span>
          </div>
        )}

        <hr />

        <div className="bottom">
          <div className="actions">
            <div
              className="item"
              onClick={() => setShowPlaceDropdown((prev) => !prev)}
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

      
          {showPlaceDropdown && (
            <div className="location-modal open">
              <input
                type="text"
                className="location-input"
                placeholder="Search location"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
              <div className="location-suggestions">
                {dummyLocations
                  .filter((loc) => loc.toLowerCase().includes(place.toLowerCase()))
                  .map((loc) => (
                    <div
                      key={loc}
                      className="suggestion-item"
                      onClick={() => {
                        setPlace(loc);
                        setShowPlaceDropdown(false);
                      }}
                    >
                      📍 {loc}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {showFriendsInput && (
            <div className="friends-modal">
              <input
                type="text"
                className="extra-input"
                placeholder="Search and tag a friend"
                value={friendInput}
                onChange={(e) => setFriendInput(e.target.value)}
              />
              <div className="friend-suggestions">
                {dummyFriends
                  .filter((f) =>
                    f.name.toLowerCase().includes(friendInput.toLowerCase())
                  )
                  .map((friend) => (
                    <div
                      key={friend.id + "-" + friend.name}
                      className="suggestion-item"
                      onClick={() => handleSelectFriend(friend.name)}
                    >
                      👤 {friend.name}
                    </div>
                  ))}
              </div>
            </div>
          )}

          <button onClick={handleClick}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default Share;
