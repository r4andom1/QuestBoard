import { Link } from "react-router-dom"
import SignOut from "./SignOut"
import "../css/Navbar.css"

function Navbar() {

    return (
        <header className="header">

            <nav className="navbar">
                <Link to="/">Dashboard</Link>
                <Link to="/Profile">Profile</Link>
                <Link to="/Shop">Shop</Link>
                <Link to="/About">About</Link>
                <SignOut/>
            </nav>
        </header>
    )
}

export default Navbar