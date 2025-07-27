import LeftBar from "../components/leftBar/LeftBar";
import Navbar from "../components/navbar/NavBar";
import { Outlet } from "react-router-dom";

const MessageLayout = () => {
  return (
    <>
      <Navbar />
     
      <Outlet />
    </>
  );
};

export default MessageLayout;