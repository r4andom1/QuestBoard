import { Link } from "react-router-dom"
import Dashboard from "./Dashboard"
import Navbar from "../components/Navbar"
import "../css/ErrorPage.css"

function ErrorPage() {
    return (
        <>
            <Navbar></Navbar>
            <div className="error-page">
                <h1>404 Page not found</h1>
                <button><Link to="/">Go back</Link></button>
            </div>
        </>
    )
}

export default ErrorPage