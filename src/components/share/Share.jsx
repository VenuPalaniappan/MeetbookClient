import "./share.scss";
import LocationIcon from "../../assets/map.png";
import PhotoVideoIcon from "../../assets/img.png";
import TagIcon from "../../assets/friend.png";
import { useContext, useState,useEffect,useMemo,useRef} from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

function useGoogleMapsPlaces() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hasPlaces =
      typeof window !== "undefined" &&
      window.google &&
      window.google.maps &&
      window.google.maps.places;

    if (hasPlaces) {
      setReady(true);
      return;
    }

    const id = "gmaps-js";
    const existing = document.getElementById(id);

    const onLoaded = () => {
      const ok =
        window.google && window.google.maps && window.google.maps.places;
      if (!ok) {
        console.error(
          "Google Maps JS loaded but Places not available. Enable Places API and check key restrictions."
        );
        return;
      }
      setReady(true);
    };

    if (existing) {
      if (existing.getAttribute("data-loaded") === "true") {
        onLoaded();
      } else {
        existing.addEventListener("load", onLoaded, { once: true });
      }
      return;
    }

    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      console.warn("VITE_GOOGLE_MAPS_API_KEY is missing in .env (Vite).");
      return;
    }

    const s = document.createElement("script");
    s.id = id;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      key
    )}&libraries=places&v=weekly`;
    s.async = true;
    s.defer = true;
    s.setAttribute("data-loaded", "false");
    s.addEventListener(
      "load",
      () => {
        s.setAttribute("data-loaded", "true");
        onLoaded();
      },
      { once: true }
    );
    s.addEventListener("error", () =>
      console.error("Failed to load Google Maps JavaScript API script")
    );
    document.head.appendChild(s);
  }, []);

  return ready;
}

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const [placeInput, setPlaceInput] = useState("");
  const [placeChosenText, setPlaceChosenText] = useState("");
  const [placeId, setPlaceId] = useState(null);
  const [placeLatLng, setPlaceLatLng] = useState(null);
  const [placePredictions, setPlacePredictions] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  
  const [friendInput, setFriendInput] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);
  const [showFriendsInput, setShowFriendsInput] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [showAiChat, setShowAiChat] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);


  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    data: friendsData = [],
    isLoading: friendsLoading,
    isError: friendsError,
  } = useQuery({
    queryKey: ["friendsForTag"],
    queryFn: () => makeRequest.get("/friends/all").then((res) => res.data),
    enabled: showFriendsInput, // fetch lazily on open
    staleTime: 1000 * 60 * 5,
  });

 
  const placesReady = useGoogleMapsPlaces();
  const sessionTokenRef = useRef(null);


  useEffect(() => {
    if (!placesReady) return;

    sessionTokenRef.current =
      new window.google.maps.places.AutocompleteSessionToken();
   
  }, [placesReady]);

 
  const sgCenter = useMemo(
    () => ({ lat: 1.3521, lng: 103.8198 }),
    []
  );

  
  useEffect(() => {
    if (!placesReady || !showPlaceDropdown) return;
    if (!placeInput || placeInput.trim().length < 2) {
      setPlacePredictions([]);
      return;
    }

    setIsPredicting(true);
   const t = setTimeout(async () => {
    const req = {
      input: placeInput,
      // Use restriction/bias (not legacy location/radius)
      locationRestriction: {
        west: 103.55, south: 1.15, east: 104.15, north: 1.50, // SG box; adjust if desired
      },
      origin: { lat: 1.3521, lng: 103.8198 },
      region: "sg",
      language: "en",
      sessionToken: sessionTokenRef.current,
    };

    try {
      const { suggestions } =
        await window.google.maps.places.AutocompleteSuggestion
          .fetchAutocompleteSuggestions(req);

      setPlacePredictions(Array.isArray(suggestions) ? suggestions : []);
    } catch (e) {
      console.error("Autocomplete error:", e);
      setPlacePredictions([]);
    } finally {
      setIsPredicting(false);
    }
  }, 250);

      return () => clearTimeout(t);
      }, [placeInput, placesReady, showPlaceDropdown]);

  const handlePickPrediction = async (suggestion) => {
  const pred = suggestion.placePrediction;

  setShowPlaceDropdown(false);

  try {
    const place = pred.toPlace();
    await place.fetchFields({
      fields: ["id", "displayName", "formattedAddress", "location"],
    });

    const label =
      place.formattedAddress ||
      (place.displayName && place.displayName.text) ||
      (pred.text && pred.text.toString && pred.text.toString()) ||
      "";

    setPlaceId(place.id || null);
    setPlaceChosenText(label);
    setPlaceInput(label);

    const loc = place.location;
    setPlaceLatLng(loc ? { lat: loc.lat(), lng: loc.lng() } : null);
  } catch (e) {
    console.error("Place details error:", e);
  }
};

  const clearPickedPlace = () => {
    setPlaceId(null);
    setPlaceLatLng(null);
    setPlaceChosenText("");
    setPlaceInput("");
  };



  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation({
    mutationFn: (newPost) => makeRequest.post("/posts", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    if (!desc.trim()) {
    alert("Post description cannot be empty.");
    return;
  }
    let imgUrl = "";
    if (file) imgUrl = await upload();

    mutation.mutate({
      desc,
      img: imgUrl,
      place: placeChosenText || null,
      placeId: placeId || null,
      placeLat: placeLatLng?.lat ?? null,
      placeLng: placeLatLng?.lng ?? null,
      friends: selectedFriends.join(", ") || null,
    });

    setDesc("");
    setFile(null);
    clearPickedPlace();
    setFriendInput("");
    setSelectedFriends([]);
    setShowPlaceDropdown(false);
    setShowFriendsInput(false);
  };

  const handleSelectFriend = (friendName) => {
    if (!selectedFriends.includes(friendName)) {
      setSelectedFriends([...selectedFriends, friendName]);
    }
    setFriendInput("");
  };

  

    const handleAIChatSubmit = async () => {
      if (!chatInput.trim()) return;

      const userMsg = { sender: "user", text: chatInput };
      setChatMessages((prev) => [...prev, userMsg]);
      setLoadingAI(true);
      setChatInput("");

      try {
        const res = await makeRequest.post("/ai/generate-post", {
          prompt: chatInput,
        });

        const aiMsg = { sender: "ai", text: res.data.text || "No response" };
        setChatMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error("AI Error:", err);
        const errorMsg = { sender: "ai", text: "❌ Failed to get AI response." };
        setChatMessages((prev) => [...prev, errorMsg]);
      } finally {
        setLoadingAI(false);
      }
    };

    const filteredFriends = (friendsData || []).filter((f) =>
    (f.name || "")
      .toString()
      .toLowerCase()
      .includes(friendInput.trim().toLowerCase())
  );

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={"/upload/" + currentUser.profilePic} alt="" />
          <input
            type="text"
            placeholder={`What's on your mind, ${currentUser.name}?`}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button
              type="button"
                className="ai-btn"
                onClick={() => setShowAiChat(true)}
              >
                💬 Gemini Chat
            </button>
        </div>

        {showAiPopup && (
          <div className="ai-suggestion-popup">
            <div className="popup-header">
              <strong>💡 AI Suggestion</strong>
              <span className="close-btn" onClick={() => setShowAiPopup(false)}>✖</span>
            </div>
            <pre className="suggestion-text">{aiSuggestion}</pre>
            <div className="popup-actions">
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(aiSuggestion);
                  alert("Copied to clipboard!");
                }}
              >
                📋 Copy
              </button>
              <button
                className="use-btn"
                onClick={() => {
                  setDesc(aiSuggestion);
                  setShowAiPopup(false);
                }}
              >
                ✅ Use this suggestion
              </button>
            </div>
          </div>  
          )}
        
           {showAiChat && (
          <div className="ai-chat-popup">
            <div className="chat-header">
              <span>💡 Gemini AI</span>
              <span className="close-btn" onClick={() => setShowAiChat(false)}>✖</span>
            </div>
            <div className="chat-body">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`msg ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              {loadingAI && <div className="msg ai">Thinking...</div>}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Ask something..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAIChatSubmit()}
              />
              <button onClick={handleAIChatSubmit}>Send</button>
            </div>
          </div>
        )}

        {file && (
          <img className="preview-img" src={URL.createObjectURL(file)} alt="preview" />
        )}

       
        {placeChosenText && (
           <div className="location-preview">
             📍 {placeChosenText}
            <span className="clear-btn" onClick={clearPickedPlace}>❌</span>
           </div>
         )}

      
        {selectedFriends.length > 0 && (
          <div className="location-preview">
            👥 {selectedFriends.join(", ")}
            <span className="clear-btn" onClick={() => setSelectedFriends([])}>
              ❌
            </span>
          </div>
        )}

        <hr />

        <div className="bottom">
          <div className="actions">
            <div
              className="item"
              onClick={() => setShowPlaceDropdown((prev) => !prev)}
              role="button"
              tabIndex={0}
            >
              <img src={LocationIcon} alt="Location" />
              <span style={{ color: "#f3425f" }}>Location</span>
            </div>

            <label htmlFor="file" className="item">
              <img src={PhotoVideoIcon} alt="Media" />
              <span style={{ color: "#45bd62" }}>Photo/video</span>
            </label>

            <div
              className="item"
              onClick={() => setShowFriendsInput((prev) => !prev)}
              role="button"
              tabIndex={0}
            >
              <img src={TagIcon} alt="Tag" />
              <span style={{ color: "#f7b928" }}>Tag Friend</span>
            </div>

            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {showPlaceDropdown && (
            <div className="location-modal open">
              {!placesReady && (
              <div className="suggestion-item">Loading Google Places…</div>
            )}

              <input
                type="text"
                className="location-input"
                placeholder="Search a place or address"
                value={placeInput}
                onChange={(e) => setPlaceInput(e.target.value)}
                disabled={!placesReady}
              />

                <div className="location-suggestions">
                  {placesReady && isPredicting && (
                    <div className="suggestion-item">Searching…</div>
                  )}

            {placesReady && !isPredicting && placePredictions.map((sug, i) => {
            // New API object shape
            const pred = sug.placePrediction;
            const main =
              pred?.text?.toString?.() ||
              pred?.structuredFormat?.mainText?.text ||
              "";
            const secondary = pred?.structuredFormat?.secondaryText?.text || "";

                return (
                  <div
                    key={pred?.id || i}
                    className="suggestion-item"
                    onClick={() => handlePickPrediction(sug)}
                  >
                    📍 <strong>{main}</strong>
                    {secondary ? ` — ${secondary}` : ""}
                  </div>
                );
              })}

              {placesReady &&
                !isPredicting &&
                placeInput.length >= 2 &&
                placePredictions.length === 0 && (
                  <div className="suggestion-item">No results</div>
              )}
                  </div> 
              </div>   
            )}

          {showFriendsInput && (
            <div className="friends-modal">
              <input
                type="text"
                className="extra-input"
                placeholder="Search and tag a friend"
                value={friendInput}
                onChange={(e) => setFriendInput(e.target.value)}
              />
              <div className="friend-suggestions">
                {friendsLoading && (
                  <div className="suggestion-item">Loading friends…</div>
                )}
                {friendsError && (
                  <div className="suggestion-item">
                    Failed to load friends. Try again.
                  </div>
                )}
                {!friendsLoading &&
                  !friendsError &&
                  (filteredFriends.length ? (
                    filteredFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="suggestion-item"
                        onClick={() => handleSelectFriend(friend.name)}
                      >
                        {friend.profilePic ? (
                          <img
                            src={`/upload/${friend.profilePic}`}
                            alt={friend.name}
                            className="friend-avatar"
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              marginRight: 8,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span style={{ marginRight: 8 }}>👤</span>
                        )}
                        {friend.name}
                      </div>
                    ))
                  ) : (
                    <div className="suggestion-item">No matches</div>
                  ))}
              </div>
            </div>
          )}

          <button onClick={handleClick}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default Share;
