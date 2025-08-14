import React from "react";
import Navbar from "./components/Navbar";
import RegisterForm from "./components/RegisterForm";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Unauthorised from "./pages/Unauthorised";
import AllUsers from "./pages/AllUsers";
import SelectLoan from "./pages/SelectLoan";
import SHGLoan from "./loans/SHG/SHGLoan";
import Preview from "./loans/SHG/Preview";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="/unauthorised" element={<Unauthorised />} />
          <Route path="/allusers" element={<AllUsers />} />
          <Route path="/selectloan" element={<SelectLoan />} />
          <Route path="/shgloan" element={<SHGLoan />} />
           <Route path="/preview" element={<Preview />} />

        </Route>
      </Routes>
    </div>
  );
};

export default App;
