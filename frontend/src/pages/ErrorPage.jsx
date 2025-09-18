import { Link } from "react-router-dom"
import Dashboard from "./Dashboard"
import Navbar from "../components/Navbar"

function ErrorPage() {
    return (
        <div className="error-page">
            <Navbar></Navbar>
            
            <div className="error-page">
                <h1>404 Page not found</h1>
                <button><Link to="/">Go back</Link></button>
            </div>
        </div>
    )
}

export default ErrorPage