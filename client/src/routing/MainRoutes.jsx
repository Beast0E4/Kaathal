import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "../pages/Home";
import Layout from "../pages/Layout/Layout";
import Dashboard from "../pages/Dashboard";
import Preview from "../pages/Preview";
import Editor from "../pages/Editor";
import Login from "../pages/Login/Login";
import SignUp from "../pages/Signup/Signup";
import Profile from "../pages/Profile/Profile";
import ProtectedRoute from "./ProtectedRoute";

function MainRoutes() {
  return (
    <>
        <Routes
            path="/"
            element={
            <ProtectedRoute>
                <Layout />   {/* now Layout stays clean */}
            </ProtectedRoute>
            }
        >
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blog/:slug" element={<Preview />} />
            <Route path="/blog/edit/:blog_slug" element={<Editor />} />
            <Route path="/blog/edit" element={<Editor />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    </>
  );
}

export default MainRoutes;
