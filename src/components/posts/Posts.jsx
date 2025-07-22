import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", userId],
    queryFn: () =>
      makeRequest.get("/posts?userId=" + userId).then((res) => res.data),
  });

  return (
    <div className="posts">
      {error? ( "Something went wrong!")
      : isLoading ? (
        "Loading..."
      ) : Array.isArray(data) ? (
        data.map((post) => (
          <Post post={post} key={`${post.id}-${post.createdAt}`} />
        ))
      ) : (
        "No posts found"
      )}
    </div>
  );
};

export default Posts;