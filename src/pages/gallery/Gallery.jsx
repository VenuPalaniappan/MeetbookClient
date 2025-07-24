import "./gallery.scss";
import { useState, useEffect } from "react";
import { makeRequest } from "../../axios";
import { Icon } from "@iconify/react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";


const Gallery = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const tabs = [
    { id: "home", label: "My Gallery", icon: "ic:baseline-photo-library" },
   
  ];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const res = await makeRequest.get("/gallery/allImages");
        setImages(res.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to load images:", err);
        setError("Failed to load images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Filter images based on the active tab
  const filteredImages = images.filter((img) =>
    activeTab === "profile"
      ? img.includes("profile")
      : activeTab === "cover"
      ? img.includes("cover")
      : true
  );

  return (
    <div className="gallery-page">
      <div className="sidebar">
        <div className="gallery-header">
          <h2>Gallery</h2>
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
          {activeTab === "home"
            ? "All Uploaded Photos"
            : activeTab === "profile"
            ? "Profile Picture"
            : "Cover Picture"}
        </h3>

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="gallery-grid">
            {filteredImages.length > 0 ? (
              filteredImages.map((img, index) => (
                <div className="gallery-item" key={index}>
                  <img
                    src={`/upload/${img}`}
                    alt={`User upload ${index}`}
                    onClick={() => {
                      setPhotoIndex(index);
                      setIsOpen(true);
                    }}
                  />
                </div>
              ))
            ) : (
              <div>No images found</div>
            )}
          </div>
        )}

        {isOpen && filteredImages.length > 0 && (
          <Lightbox
            open={isOpen}
            close={() => setIsOpen(false)}
            slides={filteredImages.map((img) => ({
              src: `/upload/${img}`,
            }))}
            index={photoIndex}
            on={{ view: ({ index }) => setPhotoIndex(index) }}
            plugins={[Zoom]}
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;
