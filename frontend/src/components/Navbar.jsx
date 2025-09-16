import { Link } from "react-router-dom"

import "../css/Navbar.css"
import Dashboard from "../pages/Dashboard"


function Navbar() {

    return (
        <header className="header">

            <nav className="navbar">
                <Link to="/">Dashboard</Link>
                <Link to="/Profile">Profile</Link>
                <Link to="/Shop">Shop</Link>
                <Link to="/About">About</Link>
            </nav>
        </header>
    )
}

export default Navbar