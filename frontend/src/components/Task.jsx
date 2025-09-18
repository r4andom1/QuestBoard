import { useEffect, useState } from "react"
import supabase from "../../services/supabase-client"
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
            is_completed: false
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

    const toggleTask = async (taskId, is_completed) => {
        const { error } = await supabase
            .from(`task`)
            .update({is_completed : !is_completed})
            .eq('id', taskId)

            if (error) {
                console.log("Error toggling compelete task: ", error)
            } else {
                const toggledTaskList = taskList.map((task) => {
                    if (task.id === taskId) {
                        return {...task, is_completed : !is_completed}
                    } else {
                        return task;
                    }
                })
                setTaskList(toggledTaskList)
                
            }
    }

    return (
        <div className="task-content">
            <h2>Create new quest</h2>
            <div className="create-task">
                <input
                    type="text"
                    placeholder="Enter quest name..."
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
                        <button onClick={() => toggleTask(task.id, task.is_completed)}> {task.is_completed ? "↺" : "✓"}</button>
                        <button>🗑</button>

                    </li>
                    ))}
                </ul>
            
        </div>
    )
}

export default Task
