import "./friends.scss";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { makeRequest } from "../../axios";

const Friends = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [allFriends, setAllFriends] = useState([]);

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
        const res = await makeRequest.get("/friends/allFriends");
        setAllFriends(res.data);
      } catch (err) {
        console.error("Failed to load friends", err);
      }
    };
        if (activeTab === "allFriends") {
            fetchAllFriends();
            }
        }, [activeTab]);

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
                ? "People you may know"
                : activeTab === "allFriends"
                ? "Your Friends"
                : ""}
        </h3>

       <div className="card-list">
        {(activeTab === "suggestions"|| activeTab === "home") &&
        suggestedFriends.map((friend) => (
        <div className="friend-card" key={friend.id}>
        <img src={`/upload/${friend.profilePic}`} alt={friend.name} />
        <h4>{friend.name}</h4>
        <button className="add">Add friend</button>
        <button className="remove">Remove</button>
      </div>
    ))}

    {activeTab === "allFriends" &&
    allFriends.map((friend) => (
      <div className="friend-card" key={friend.id}>
        <img src={`/upload/${friend.profilePic}`} alt={friend.name} />
        <h4>{friend.name}</h4>
        <button className="remove">Unfriend</button>
      </div>
    ))}
    </div>

    </div>
 </div>
  );
};

export default Friends;
