import { UserAuth } from "../context/Authentication"
import { useNavigate } from "react-router-dom"
    
function SignOut() {
    const { session, signOutUser } = UserAuth()
    const navigate = useNavigate()

    const handleSignOut = async (event) => {
        event.preventDefault()
        try {
            await signOutUser()
            navigate("/sign-in")
        } catch (error) {
            console.log("Error signing out: ", error)
        }
    }

    return (
        <div>
            <button onClick={handleSignOut}>
                Sign Out
            </button>
        </div>
    )
}

export default SignOut