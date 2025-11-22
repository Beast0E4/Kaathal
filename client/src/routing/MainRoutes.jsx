import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "../pages/Home";
import Layout from "../pages/Layout/Layout";
import Dashboard from "../pages/Dashboard";
import Preview from "../pages/Preview";
import Editor from "../pages/Editor";
import Login from "../pages/Login/Login";
import SignUp from "../pages/Signup/Signup";

function MainRoutes() {
  const location = useLocation ();
  const state = location.state;

  const [width, setWidth] = useState (window.innerWidth);

  // 👇 Keeps track of the page we were on when navigating to /post/:id
  const backgroundLocation = state?.backgroundLocation || location;

    useEffect (() => {
        const handleResize = () => setWidth (window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <>
        <Routes path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/preview/:blog_id" element={<Preview />} />
            <Route path="/blog" element={<Editor />} />
        </Routes>
    </>
  );
}

export default MainRoutes;
