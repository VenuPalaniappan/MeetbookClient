import { Outlet } from "react-router-dom";

const MessageLayout = () => {
  return (
    <div className="message-layout">
      <Outlet />
    </div>
  );
};

export default MessageLayout;