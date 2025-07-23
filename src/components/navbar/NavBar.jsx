import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useState } from "react";
import { Icon } from '@iconify/react';
import logo from "../../assets/logo.png"; 

import { AuthContext } from "../../context/authContext";

const Navbar = () => {
 
  const { currentUser } = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState(false);
   const handleMenuToggle = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
         <img src={logo} alt="Logo" className="logo" />
        </Link>
        
        
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <Link to="/" style={{ textDecoration: "none" }}>
         <Icon icon="fluent:home-32-filled" color="#6a1b9a" width="28" />
        </Link>
        <Icon icon="fluent:grid-28-filled" color="#388e3c" width="28" />
       <Icon icon="material-symbols:mail-outline" color="#ff7043" width="28" />
        <Icon icon="material-symbols:notifications-active-rounded" color="#0288d1" width="28" />

        <div className="profile-wrapper" onClick={() => setOpenMenu(!openMenu)}>

        <img src={"/upload/" + currentUser.profilePic} alt="" />

          {openMenu && (
            <div className="dropdown-menu">
              <div className="user-info">
                <img src={"/upload/" + currentUser.profilePic} alt="" />
                <div className="name">{currentUser.name}</div>
              </div>
              <Link to={`/profile/${currentUser.id}`} className="see-all">
              Update Profile
              </Link>
              <hr />
              <div className="menu-section">
              <Link to={`/setting/${currentUser.id}`} className="see-all">
              Setting & Privacy
              </Link>
              <hr />
              <Link to={`/help/${currentUser.id}`} className="see-all">
              Help & support
              </Link>
              <hr />
              <Link to={`/display/${currentUser.id}`} className="see-all">
              Display & accessibility
              </Link>
              <hr />
              <Link to={`/feedback/${currentUser.id}`} className="see-all">
              Give feedback
              </Link>
              <hr />
                
              </div>
              <hr />
              <div className="item logout">Log out</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;