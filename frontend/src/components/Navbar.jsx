import { Link } from "react-router-dom"
import SignOut from "./SignOut"
import "../css/Navbar.css"

function Navbar() {

    return (
        <header className="header">

            <nav className="navbar">
                <Link to="/">Dashboard</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/shop">Shop</Link>
                <Link to="/about">About</Link>
                <SignOut/>
            </nav>
        </header>
    )
}

export default Navbar