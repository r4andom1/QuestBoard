import { useState } from "react"
import "../css/SignIn.css"
import { Link, useNavigate } from "react-router-dom"
import { UserAuth } from "../context/Authentication"

function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState("") // to avoid multiple submits

    const { session, signInUser } = UserAuth()
    const navigate = useNavigate()
    // console.log(session) // debug

    const handleSignIn = async (event) => {
        event.preventDefault()
        setLoading(true)
        try {
            const result = await signInUser(email, password)
            
            if (result.success) {
                navigate("/")
            }
        } catch (error) {
            setError("Error signing in")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="sign-in">
            <form onSubmit={handleSignIn} className="sign-in-form">
                <h2>Login!</h2>
                <p>Not signed up? <Link to="/sign-up" >Click here to sign up!</Link></p>
                <div className="sign-in-inputs">
                    <input onChange={(event) => setEmail(event.target.value)} type="email" name="email" placeholder="Email"/>
                    <input onChange={(event) => setPassword(event.target.value)} type="password" name="password" placeholder="Password"/>
                    <button type="submit" disabled={loading}>Sign In</button>
                    {error ? <p className="error">{error}</p> : <p></p>}
                </div>
            </form>
        </div>
    )
}

export default SignIn