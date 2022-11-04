import { NavLink } from "react-router-dom";
import { useContext } from "react";

import AuthContext from "../store/authContext";
import logo from "../assets/dm-logo-white.svg";

// creating a component called header
const Header = () => {
  const authCtx = useContext(AuthContext);

  // function for adding style to a nav link if it is active
  const styleActiveLink = ({ isActive }) => {
    return {
      // if the link is active, then set the color to waht is outlined below
      color: isActive ? "#f57145" : "",
    };
  };
  // returnin the JSX with everything that is making up the header and adding the active link style functionality to the links
  return (
    <header className="header flex-row">
      <div className="flex-row">
        <img src={logo} alt="dm-logo" className="logo" />
        <h2>Social Mountain</h2>
      </div>
      <nav>
        {authCtx.token ? (
          <ul className="main-nav">
            <li>
              <NavLink style={styleActiveLink} to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink style={styleActiveLink} to="profile">
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink style={styleActiveLink} to="form">
                Add Post
              </NavLink>
            </li>
            <li>
              <button className="logout-btn" onClick={() => authCtx.logout()}>
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <ul className="main-nav">
            <li>
              <NavLink style={styleActiveLink} to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink style={styleActiveLink} to="/auth">
                Login or Sign Up
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
