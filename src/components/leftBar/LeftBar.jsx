import "./leftBar.scss";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img
              src={"/upload/" +currentUser.profilePic}
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>
          <Link to="/friends" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="item">
                <Icon icon="fluent:people-community-32-filled" color="#6a1b9a" width="24" />
                    <span>Friends</span>
              </div>
          </Link>

          <Link to="/gallery" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="item">
                 <Icon icon="mdi:image-multiple" color="#43a047" width="24" />
                    <span>Gallery</span>
              </div>
          </Link>

          <Link to="/message" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="item">
                 <Icon icon="material-symbols:mail-outline" color="#1976d2" width="24" />
                    <span>Message</span>
              </div>
          </Link>
        
         
        </div>
        <hr />
         </div>
      </div>
    
  );
};

export default LeftBar;