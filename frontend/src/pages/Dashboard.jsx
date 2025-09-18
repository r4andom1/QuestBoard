import Task from "../components/Task"
import { UserAuth } from "../context/Authentication"
import "../css/Dashboard.css"

function Dashboard() {
    const { session } = UserAuth()
    
    return (
        <div className="main-content">
            <Task/>

        </div>
    )

}

export default Dashboard