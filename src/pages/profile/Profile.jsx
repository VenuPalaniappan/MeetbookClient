import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { userId: userIdParam } = useParams();
  const userId = parseInt(userIdParam);

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => makeRequest.get("/users/find/" + userId).then(res => res.data),
  });

  const { isLoading: rIsLoading, data: relationshipData } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then(res => res.data),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["relationship", userId]);
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData?.includes(currentUser?.id));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong!</div>;
  if (!data) return <div>No user data found.</div>;

  const defaultCover = "/upload/default-cover.png";
  const defaultProfile = "/upload/default-profile.png";

  return (
    <div className="profile">
      <div className="images">
        <img
          src={data.coverPic ? `/upload/${data.coverPic}` : defaultCover}
          alt="Cover"
          className="cover"
          onError={(e) => (e.target.src = defaultCover)}
        />
        <img
          src={data.profilePic ? `/upload/${data.profilePic}` : defaultProfile}
          alt="Profile"
          className="profilePic"
          onError={(e) => (e.target.src = defaultProfile)}
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city || "Unknown City"}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website || "No Website"}</span>
              </div>
            </div>
            {rIsLoading ? (
              "loading..."
            ) : userId === currentUser?.id ? (
              <button onClick={() => setOpenUpdate(true)}>Update</button>
            ) : (
              <button onClick={handleFollow}>
                {relationshipData?.includes(currentUser?.id) ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={userId} />
      </div>
      {openUpdate && (
        <div className="updateModal">
         <div className="modalContent">
         <Update setOpenUpdate={setOpenUpdate} user={data} />
    </div>
    </div>
    )}
   </div>
  );
};

export default Profile;