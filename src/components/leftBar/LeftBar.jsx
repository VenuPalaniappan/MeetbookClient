import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Icon } from '@iconify/react';

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
          <div className="item">
            <Icon icon="fluent:people-community-32-filled" color="#6a1b9a" width="24" />
            <span>Friends</span>
          </div>
          <div className="item">
            <Icon icon="mdi:account-group" color="#388e3c" width="24" />
            <span>Groups</span>
          </div>
          
          <div className="item">
            <Icon icon="mdi:play-box-multiple" color="#f57c00" width="24" />
            <span>Watch</span>
          </div>
          <div className="item">
           <Icon icon="material-symbols:history-edu-rounded" color="#0288d1" width="24" />
            <span>Memories</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
         
          
          <div className="item">
           <Icon icon="mdi:image-multiple" color="#43a047" width="24" />
            <span>Gallery</span>
          </div>
          <div className="item">
            <Icon icon="mdi:video-box" color="#7b1fa2" width="24" />
            <span>Videos</span>
          </div>
          <div className="item">
           <Icon icon="material-symbols:mail-outline" color="#1976d2" width="24" />
            <span>Messages</span>
          </div>
        </div>
        <hr />
        
      </div>
    </div>
  );
};

export default LeftBar;