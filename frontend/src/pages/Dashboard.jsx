import Task from "../components/Task"
import { UserAuth } from "../context/Authentication"
import "../css/Dashboard.css"

function Dashboard() {
    const currentUserData = UserAuth().session.user
    console.log(currentUserData)
    
    return (
        <div className="main-content">
            <Task/>

        </div>
    )

}

export default Dashboard