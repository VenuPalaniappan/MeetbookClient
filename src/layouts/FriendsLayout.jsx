import Navbar from "../components/navbar/NavBar";
import { Outlet } from "react-router-dom";

const FriendsLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default FriendsLayout;