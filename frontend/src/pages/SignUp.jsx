import { useState } from "react"
import "../css/SignUp.css"
import { Link, useNavigate } from "react-router-dom"
import { UserAuth } from "../context/Authentication"


function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState("")

    const { session, signUpUser } = UserAuth()
    const navigate = useNavigate()
    console.log(session) // debug

    const handleSignUp = async (event) => {
        event.preventDefault()
        setLoading(true)
        try {
            const result = await signUpUser(email, password)
            
            if (result.success) {
                Navigate("/")
            }
        } catch (error) {
            setError("Error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="sign-up">
            <form className="sign-up-form">
                <h2>Start Questing Today!</h2>
                <p>Already signed up?</p>
                <Link to="/sign-in">Sign in!</Link>
                <div className="sign-up-inputs">
                    <input type="email" name="email" placeholder="Email"/>
                    <input type="password" name="password" placeholder="Password"/>
                    <button type="submit" disabled={loading}>Sign Up</button>
                </div>
            </form>
        </div>
    )
}

export default SignUp