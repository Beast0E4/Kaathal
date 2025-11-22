import { Outlet, } from "react-router-dom";
import { useSelector } from "react-redux";

function Layout () {
    const authState = useSelector ((state) => state.auth);

    return (
        <div>
            {(authState?.isLoggedIn) && <Outlet />}
        </div>
    )
}

export default Layout;