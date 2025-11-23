import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function Layout() {
  const authState = useSelector((state) => state.auth);

  return (
    <div>
      {authState?.isLoggedIn && <Outlet />}
    </div>
  );
}

export default Layout;
