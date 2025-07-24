import Navbar from "../components/navbar/NavBar";
import { Outlet } from "react-router-dom";

const GalleryLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default GalleryLayout;