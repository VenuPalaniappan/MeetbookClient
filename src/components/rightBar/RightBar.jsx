import "./rightBar.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import { Link } from "react-router-dom";


const formatActivityText = (activity) => {
  switch (activity.type) {
    case "post":
      return "shared a new post";
    case "comment":
      return "commented on a post";
    case "profile_update":
      return "updated their profile";
    case "follow":
      return "followed someone";
    default:
      return "did something";
  }
};

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);

  const { data: suggestions = [] } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () =>
      makeRequest.get("/friends/suggestions").then((res) => res.data),
  });

  const { data: friends = [] } = useQuery({
    queryKey: ["friends", currentUser?.id],
    queryFn: () =>
      makeRequest
        .get(`/friends/list?userId=${currentUser.id}`)
        .then((r) => r.data),
    enabled: !!currentUser?.id,
  });

  const hasFriends = friends.length > 0;

  
  const { data: onlineUsers = [] } = useQuery({
    queryKey: ["onlineUsers"],
    queryFn: () => makeRequest.get("/users/online").then((r) => r.data),
    enabled: hasFriends,
  });

 
  const friendIdSet = new Set(friends.map((f) => f.id)); // adjust key if your API uses friendId/userId
  const onlineFriends = hasFriends
    ? onlineUsers.filter((u) => friendIdSet.has(u.id))
    : [];

 // const { data: onlineFriends = [] } = useQuery({
   // queryKey: ["onlineFriends"],
    //queryFn: () =>
    //  makeRequest.get("/users/online").then((res) => res.data),
  //});

  const { data: activities = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: () =>
      makeRequest.get("/activities").then((res) => res.data),
  });

 const handleFollow = async (userId) => {
  try {
    await makeRequest.post("/friends/follow", { followedUserId: userId });
    alert("Now following!");
    
  } catch (err) {
    console.error(err);
    alert(err.response?.data || "Failed to follow user");
  }
};

  return (
    <div className="rightBar">
      <div className="container">
        {/* Suggestions */}
        <div className="item">
          <span>Suggestions For You</span>
          {suggestions.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={"/upload/" + user.profilePic} alt="" />
                <span>{user.name}</span>
              </div>
              <div className="buttons">
                <button onClick={() => handleFollow(user.id)}>Follow</button>
                <button>Dismiss</button>
              </div>
            </div>
          ))}
        </div>

     
      <div className="item">
          <span>Latest Activities</span>
          {activities.length === 0 ? (
            <p>No recent activity</p>
          ) : (
            activities.map((activity) => {
              const isPostOrComment = activity.type === "post" || activity.type === "comment";
              const postLink = `/post/${activity.targetId}`;
              const profileLink = `/profile/${activity.userId}`;

              return (
                <div className="user" key={activity.id}>
                  <div className="userInfo">
                  
                    <Link to={profileLink}>
                      <img src={"/upload/" + activity.profilePic} alt="" />
                    </Link>

            <p>
            
              <Link to={profileLink} style={{ textDecoration: "none", fontWeight: 500 }}>
                {activity.name}
              </Link>{" "}

              {isPostOrComment ? (
                <Link
                  to={postLink}
                  style={{ textDecoration: "none", color: "#555" }}
                >
                  {formatActivityText(activity)}
                </Link>
              ) : (
                formatActivityText(activity)
              )}
            </p>
          </div>
          <span>{moment(activity.createdAt).fromNow()}</span>
        </div>
      );
    })
  )}
</div>

  
        {hasFriends && (
          <div className="item">
            <span>Online Friends</span>
            {onlineFriends.length === 0 ? (
              <p>No friends online</p>
            ) : (
              onlineFriends.map((user) => (
                <div className="user" key={user.id}>
                  <div className="userInfo">
                    <img src={"/upload/" + user.profilePic} alt="" />
                    <div className="online" />
                    <span>{user.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightBar;
