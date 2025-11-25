import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import PermissionDenied from "../Denied/PermissionDenied";

function Layout() {
  const authState = useSelector((state) => state.auth);

  if (authState?.isLoggedIn) {
    return <Outlet />;
  } else {
    return <PermissionDenied />;
  }
}

export default Layout;