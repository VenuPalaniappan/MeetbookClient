import { useContext,useRef,useState} from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery,useQueryClient} from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
const { currentUser } = useContext(AuthContext);
const fileInputRef = useRef();
const queryClient = useQueryClient();
const [isViewerOpen, setIsViewerOpen] = useState(false);
const [currentIndex, setCurrentIndex] = useState(0);

  const { isLoading, error, data } = useQuery({
    queryKey: ["stories"],
    queryFn: () =>
      makeRequest.get("/stories").then((res) => {
        return res.data;
      }),
  });

   const handleAddStory = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // 1. Upload the image
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await makeRequest.post("/upload", formData);
      const imageUrl = uploadRes.data; // assuming backend returns image path

      // 2. Create the story
      await makeRequest.post("/stories", { img: imageUrl });

      // 3. Refresh story list
      queryClient.invalidateQueries(["stories"]);
    } catch (err) {
      console.error("Failed to add story:", err);
    }
  };

   const openViewer = (index) => {
    setCurrentIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
  };

  const handleNext = () => {
    if (data && currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (data && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };


  if (error) return <div>Something went wrong</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!Array.isArray(data)) return <div>No stories found</div>;

  return (
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button onClick={() => fileInputRef.current.click()}>+</button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleAddStory}
        />
      </div>
      {data.map((story,index) => (
        <div className="story" key={story.id} onClick={() => openViewer(index)}>
          <img src={"/upload/" + story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
       {isViewerOpen && (
        <div className="story-viewer">
          <div className="story-content">
            <button className="close-btn" onClick={closeViewer}>×</button>
            <img src={"/upload/" + data[currentIndex].img} alt=""
            onContextMenu={(e) => {
              if (data[currentIndex].userId !== currentUser.id) {
                e.preventDefault();
              }
            }} />
            <div className="viewer-footer">
              <span>{data[currentIndex].name}</span>
              <div className="controls">
                <button onClick={handleBack} disabled={currentIndex === 0}>
                  ◀ Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === data.length - 1}
                >
                  Next ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
