import { useEffect, useState } from "react"
import supabase from "../../database/supabase-client"
import "../css/Task.css"

function Task() {
    const [newTask, setNewTask] = useState("")
    const [taskList, setTaskList] = useState([])

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        const {data, error } = await supabase
            .from(`task`)
            .select(`*`)
        if (error) {
            console.log("Error fetching tasks: ", error)
        } else {
            setTaskList(data)
        }
    }

    
    const addTask = async () => {
        const newTaskData = {
            name: newTask,
            isCompleted: false
        }
        const { data, error } = await supabase
            .from(`task`)
            .insert([newTaskData])
            .select()

            if (error) {
                console.log("Error adding new task: ", error)
            } else {
                setTaskList((prev) => [...prev, ...data])
            setNewTask("")
    }


}

    return (
        <div className="task-content">
            <h2>Create new quest</h2>
            <div className="create-task">
                <input
                    type="text"
                    placeholder="New quest..."
                    value={newTask}
                    onChange={(event) => setNewTask(event.target.value)}
                />
                <button onClick={addTask}>Submit</button>
            </div>
                <ul className="tasks">
                    {taskList.map((task) => (
                        <li className="task-card" key={task.id}>
                        <h2>{ task.name }</h2>
                        <p>Description: </p>
                        <button>Complete</button>
                        <button>Delete</button>

                    </li>
                    ))}
                </ul>
            
        </div>
    )
}

export default Task
