import "./rightBar.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

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

        {/* Latest Activities (dummy for now) */}
        <div className="item">
          <span>Latest Activities</span>
          <div className="user">
            <div className="userInfo">
              <img src={"/upload/" + currentUser.profilePic} alt="" />
              <p>
                <span>{currentUser.name}</span> updated their profile picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
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
