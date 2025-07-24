import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Post from "../../components/post/Post"; 

const PostPage = () => {
  const { postId } = useParams();

  const { isLoading, error, data: post } = useQuery({
    queryKey: ["singlePost", postId],
    queryFn: () =>
      makeRequest.get(`/posts/single/${postId}`).then((res) => res.data),
  });

  if (isLoading) return <p>Loading post...</p>;
  if (error) return <p>Error loading post</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Post post={post} />
    </div>
  );
};

export default PostPage;
