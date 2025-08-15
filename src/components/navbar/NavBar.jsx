import "./navbar.scss";
import { Link } from "react-router-dom";
import { useContext,useEffect,useState } from "react";
import { Icon } from '@iconify/react';
import logo from "../../assets/logo.png"; 
import { AuthContext } from "../../context/authContext";
import Message from "../../pages/message/Message.jsx";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios";



const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.length >= 2) {
      try {
        const res = await makeRequest.get(`/users/search?query=${e.target.value}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for friends or users..."
        value={query}
        onChange={handleSearch}
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((user) => (
            <Link to={`/profile/${user.id}`} key={user.id} className="search-item" onClick={() => {setQuery("");setResults([]);}}>
              <li>
                <img src={`/upload/${user.profilePic}`} alt="" />
                <span>{user.name}</span> <small>({user.relation})</small>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};


const Navbar = () => {
 
  const { currentUser } = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const navigate = useNavigate();

   const handleMenuToggle = () => {
    setOpenMenu(!openMenu);
  };

   useEffect(() => {
    const checkMessages = async () => {
      try {
        const res = await fetch("http://localhost:8800/api/messages/unread/" + currentUser.id, {
          credentials: "include",
        });
        if (!res.ok) {
        throw new Error("Failed to fetch unread messages");
      }
        const data = await res.json();
        setHasNewMessages(data.length > 0);
      } catch (err) {
        console.error("Failed to fetch new messages:", err);
      }
    };

    checkMessages();

    const interval = setInterval(checkMessages, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, [currentUser.id]);

      const handleMessageIconClick = () => {
        setShowMessagePopup((prev) => !prev); // toggle popup
        setHasNewMessages(false); // clear red dot
  };


  return (
     <>
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
         <img src={logo} alt="Logo" className="logo" />
        </Link>
          <SearchBar /> 
      </div>


      <div className="right">
        <Link to="/" style={{ textDecoration: "none" }}>
         <Icon icon="fluent:home-32-filled" color="#6a1b9a" width="28" />
        </Link>

        <Icon icon="fluent:grid-28-filled" color="#388e3c" width="28" />

        <div className="message-icon-wrapper" onClick={handleMessageIconClick}>
            <Icon icon="material-symbols:mail-outline" color="#ff7043" width="28" />
            {hasNewMessages && <span className="red-dot" />}
        </div>

        <Icon icon="material-symbols:notifications-active-rounded" color="#0288d1" width="28" />

        <div className="profile-wrapper" onClick={handleMenuToggle}>
        <img src={"/upload/" + currentUser.profilePic} alt="" />
          {openMenu && (
            <div className="dropdown-menu">
              <div className="user-info">
                <img src={"/upload/" + currentUser.profilePic} alt="" />
                <div className="name">{currentUser.name}</div>
              </div>
              <Link to={`/profile/${currentUser.id}`} className="see-all">Update Profile</Link>
              <hr />
             
              <Link to="/setting" className="see-all">Setting & Privacy</Link>
              <hr />
              
          
           
            
              <div className="item logout">Log out</div>
            </div>
          )}
        </div>
      </div>
    </div>
          {showMessagePopup && (
          <Message
            onClose={() => setShowMessagePopup(false)}
            onStartChat={() => setShowMessagePopup(false)}
          />
        )}
  
    
       </>
  );
}

export default Navbar;