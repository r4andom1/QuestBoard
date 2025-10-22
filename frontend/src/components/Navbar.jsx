import { Link } from "react-router-dom";
import SignOut from "./SignOut";
import "../css/Navbar.css";

function Navbar() {
  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/">
          <h2>QuestBoard</h2>
        </Link>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/shop">Shop</Link>
          {/* <Link to="/about">About</Link> */}
        </div>
        <SignOut />
      </nav>
    </header>
  );
}

export default Navbar;
