import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/authContext";
import Navbar from "./components/navbar/NavBar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Friends from "./pages/friends/Friends";
import FriendsLayout from "./layouts/FriendsLayout";
import Gallery from "./pages/gallery/Gallery";
import GalleryLayout from "./layouts/GalleryLayout";
import PostPage from "./pages/post/PostPages";
import Message from "./pages/message/Message";
import MessageLayout from "./layouts/MessageLayout";
import Setting from "./pages/setting/Setting";
import AudienceSettings from "./pages/settings/AudienceSettings";

import "./app.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const { currentUser } = useContext(AuthContext);



  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
            <div style={{ flex: 1 }}></div>
          </div>
          <RightBar />
        </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:userId",
          element: <Profile />,
        },
        {
        path: "/post/:postId",
        element: <PostPage />,
      },
       { path: "/setting", 
        element: <Setting /> 
      },

      { path: "/settings/audience", 
        element: <AudienceSettings/> 
      },
      ],
    },
    {
    path: "/friends",
    element: (
      <ProtectedRoute>
        <FriendsLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/friends",
        element: <Friends />,
      },
    ],
  },
  {
    path: "/gallery",
    element: (
      <ProtectedRoute>
        <GalleryLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Gallery />,
      },
    ],
  },
   {
    path: "/messages",
    element: (
      <ProtectedRoute>
        <MessageLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Message />,
      },
    ],
  },

    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]); 

  
 

  return <RouterProvider router={router} />;
  }

export default App;
