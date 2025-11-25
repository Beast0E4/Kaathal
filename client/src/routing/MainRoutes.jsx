import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Layout from "../pages/Layout/Layout";
import Dashboard from "../pages/Dashboard";
import Preview from "../pages/Preview";
import Editor from "../pages/Editor";
import Login from "../pages/Login/Login";
import SignUp from "../pages/Signup/Signup";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";

function MainRoutes () {
  return (
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        {/* These are NOT wrapped in Layout, so anyone can see them */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/blog/:slug" element={<Preview />} />

        {/* --- PROTECTED ROUTES --- */}
        {/* These ARE wrapped in Layout. */}
        {/* If user is NOT logged in, Layout shows PermissionDenied instead of these pages */}
        <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/editor/:blog_slug" element={<Editor />} />
            
            {/* Note: Based on your request, Login/Signup are here. 
                Non-logged-in users visiting /login will see Permission Denied. */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* --- 404 CATCH-ALL ROUTE --- */}
        {/* The '*' matches anything that wasn't matched above */}
        <Route path="*" element={<NotFound />} />

      </Routes>
  );
}


export default MainRoutes;
