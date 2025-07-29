import "./navbar.scss";
import { Link } from "react-router-dom";
import { useContext,useEffect,useState } from "react";
import { Icon } from '@iconify/react';
import logo from "../../assets/logo.png"; 
import { AuthContext } from "../../context/authContext";
import Message from "../../pages/message/Message.jsx";
import { useNavigate } from "react-router-dom";

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
        
        
        <div className="search">
          <Icon icon="ic:baseline-search" className="icon" />
          <input type="text" placeholder="Search..." />
        </div>
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
             
              <Link to={`/setting/${currentUser.id}`} className="see-all">Setting & Privacy</Link>
              <hr />

              <Link to={`/help/${currentUser.id}`} className="see-all">Help & support</Link>
              <hr />

              <Link to={`/display/${currentUser.id}`} className="see-all">Display & accessibility</Link>
              <hr />

              <Link to={`/feedback/${currentUser.id}`} className="see-all">Give feedback</Link>
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