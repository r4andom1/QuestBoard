import { Navigate } from "react-router-dom"
import { UserAuth } from "../context/Authentication"

// Wrap this around any routes that shouldn't be accessible to users not logged in

function RestrictedRoute({children}) {
    const {session} = UserAuth()

    if (session) {
        return <>{children}</>
    } else {
        return <Navigate to="/sign-in" />
    }
}

export default RestrictedRoute