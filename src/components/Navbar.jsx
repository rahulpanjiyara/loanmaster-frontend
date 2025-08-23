import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { Menu } from "lucide-react"; // stylish mobile menu icon

const Navbar = () => {
  
  const { user, logout } = useContext(UserContext);

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      {/* Left: Brand + Mobile Menu */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl font-bold">
          Loan Master
        </Link>
      </div>

      {/* Mobile menu */}
      <div className="dropdown dropdown-end md:hidden">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <Menu size={20} />
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/selectloan">Loans</Link>
          </li>
          <li>
            <Link to="/allusers">Users</Link>
          </li>
          {user?.userType === "admin" && (
            <li>
              <Link to="/admin">Admin Dashboard</Link>
            </li>
          )}
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <a onClick={logout}>Logout</a>
          </li>
        </ul>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex gap-2 items-center">
        <Link to="/" className="btn btn-ghost">
          Home
        </Link>
        <Link to="/selectloan" className="btn btn-ghost">
          Loans
        </Link>
        <Link to="/allusers" className="btn btn-ghost">
          Users
        </Link>
        {user?.userType === "admin" && (
          <Link to="/admin" className="btn btn-ghost">
            Admin Dashboard
          </Link>
        )}
        <p className="text-primary font-medium">{user?.name}</p>

        {/* Avatar */}
        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="avatar">
              <div className="w-8 rounded-full">
                <img
                  src={`https://ui-avatars.com/api/?name=${
                    user.name || "User"
                  }&background=random`}
                  alt="Profile"
                />
              </div>
            </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
