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

   if (!isLoading && data) {
    const keys = data.map((p) => `${p.id}-${p.createdAt}`);
    const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i);
    if (duplicates.length > 0) {
      console.warn("Duplicate post keys found:", duplicates);
    }
  }

  const uniquePosts = Array.isArray(data)
    ? Array.from(
        new Map(
          data.map((post) => [`${post.id}-${post.createdAt}`, post])
        ).values()
      )
    : [];

  return (
    <div className="posts">
      {error? ( "Something went wrong!")
      : isLoading ? (
        "Loading..."
      ) : Array.isArray(data) ? (
        [...new Map(data.map((post) => [post.id, post])).values()].map((post) => (
           <Post key={`${post.id}-${post.createdAt}`} post={post} />
        ))
      ) : (
        "No posts found"
      )}
    </div>
  );
};

export default Posts;