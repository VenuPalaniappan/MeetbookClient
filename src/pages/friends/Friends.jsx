import "./friends.scss";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";

const Friends = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const tabs = [
     { id: "suggestions", label: "Suggestions", icon: "fluent:person-call-20-filled" },
    { id: "requests", label: "Friend Requests", icon: "fluent:person-add-20-filled" },
    { id: "allFriends", label: "All friends", icon: "mdi:account-multiple-outline" },
   
  ];

  useEffect(() => {
    const fetchSuggestions  = async () => {
      try {
        const res = await makeRequest.get("/friends/suggestions");
        setSuggestedFriends(res.data);
      } catch (err) {
        console.error("Failed to load friends", err);
      }
    };
        if (activeTab === "suggestions") {
            fetchSuggestions();
            }
        }, [activeTab]);

 useEffect(() => {
    const fetchAllFriends  = async () => {
      try {
        const res = await makeRequest.get("/friends/all");
        setAllFriends(res.data);
      } catch (err) {
        console.error("Failed to load friends", err);
      }
    };
        if (activeTab === "allFriends") {
            fetchAllFriends();
            }
        }, [activeTab]);

      const addFriend = async (friendId) => {
      try {
        await makeRequest.post("/friends/add", { friendId });
        setSuggestedFriends((prev) => prev.filter((f) => f.id !== friendId));
      } catch (err) {
        console.error("Error adding friend:", err);
      }
    };
    const handleUnfriend = async (friendId) => {
      try {
        await makeRequest.post("/friends/unfriend", { friendId });
        setAllFriends((prev) => prev.filter((f) => f.id !== friendId));
      } catch (err) {
        console.error("Error unfriending user:", err);
      }
    };

    const sendRequest = async (receiverId) => {
  try {
    await makeRequest.post("/friends/sendRequest", { receiverId });
  } catch (err) {
    console.error("Error sending friend request:", err.response?.data || err.message);
  }
};

useEffect(() => {
  const fetchRequests = async () => {
    try {
      const res = await makeRequest.get("/friends/requests");
      setFriendRequests(res.data);
    } catch (err) {
      console.error("Error loading friend requests", err);
    }
  };
  if (activeTab === "requests") {
    fetchRequests();
  }
}, [activeTab]);

const accept = async (senderId) => {
  await makeRequest.post("/friends/acceptRequest", { senderId });
  setFriendRequests(prev => prev.filter(r => r.id !== senderId));
};

const reject = async (senderId) => {
  await makeRequest.post("/friends/rejectRequest", { senderId });
  setFriendRequests(prev => prev.filter(r => r.id !== senderId));
};

  return (
    <div className="friends-page">
      <div className="sidebar">
        <div className="friends-header">
          <h2>Friends</h2>
          <Icon icon="mdi:cog" width="24" className="settings-icon" />
        </div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon icon={tab.icon} width="24" />
            <span>{tab.label}</span>
          </div>
        ))}
      </div>
      <div className="content">
        <h3>
            {(activeTab === "suggestions"|| activeTab === "home")
                ? ""
                : activeTab === "allFriends"
                ? ""
                : ""}
        </h3>

      <div className="card-list">
      {(activeTab === "suggestions" || activeTab === "home") &&
      suggestedFriends.map((friend) => (
      <div className="friend-card" key={friend.id}>
        <img src={`/upload/${friend.profilePic}`} alt={friend.name} />
        <Link to={`/profile/${friend.id}`} className="friend-name-link">
        <h4>{friend.name}</h4>
        </Link>
       
        <button className="remove" onClick={() => sendRequest(friend.id)}>Send Request</button>
      </div>
  ))}

    {activeTab === "requests" &&
      friendRequests.map((request) => (
        <div className="friend-card" key={request.id}>
        <img src={`/upload/${request.profilePic}`} alt={request.name} />
        <h4>{request.name}</h4>
        <button className="add" onClick={() => accept(request.id)}>Accept</button>
        <button className="remove" onClick={() => reject(request.id)}>Reject</button>
      </div>
  ))}

    {activeTab === "allFriends" &&
    allFriends.map((friend) => (
      <div className="friend-card" key={friend.id}>
        <img src={`/upload/${friend.profilePic}`} alt={friend.name} />
         <Link to={`/profile/${friend.id}`} className="friend-name-link">
        <h4>{friend.name}</h4>
        </Link>
        <button className="remove" onClick={() => handleUnfriend(friend.id)}>Unfriend</button>
      </div>
    ))}
    </div>

    </div>
 </div>
  );
};

export default Friends;
