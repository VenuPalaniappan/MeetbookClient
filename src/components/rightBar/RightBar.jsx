import "./rightBar.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import { Link } from "react-router-dom";

// Helper function to format activity text
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
      makeRequest.get("/users/suggestions").then((res) => res.data),
  });

  const { data: onlineFriends = [] } = useQuery({
    queryKey: ["onlineFriends"],
    queryFn: () =>
      makeRequest.get("/users/online").then((res) => res.data),
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: () =>
      makeRequest.get("/activities").then((res) => res.data),
  });

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
                <button>Follow</button>
                <button>Dismiss</button>
              </div>
            </div>
          ))}
        </div>

        {/* Latest Activities */}
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
                    {/* ✅ Clicking profile pic goes to user profile */}
                    <Link to={profileLink}>
                      <img src={"/upload/" + activity.profilePic} alt="" />
                    </Link>

            <p>
              {/* ✅ Clicking name goes to user profile */}
              <Link to={profileLink} style={{ textDecoration: "none", fontWeight: 500 }}>
                {activity.name}
              </Link>{" "}

              {/* ✅ Clicking text goes to the post if it's a post/comment */}
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

        {/* Online Friends */}
        <div className="item">
          <span>Online Friends</span>
          {onlineFriends.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={"/upload/" + user.profilePic} alt="" />
                <div className="online" />
                <span>{user.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
