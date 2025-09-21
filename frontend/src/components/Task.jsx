import { useEffect, useState } from "react";
import supabase from "../../services/supabase-client";
import "../css/Task.css";
import { UserAuth } from "../context/Authentication";

// const { data: { user }  } = await supabase.auth.getUser() // does not get local session

function Task() {
  const [newTaskName, setNewTaskName] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState("one-time");

  const currentUserData = UserAuth().session.user;

  // console.log(currentUserData)

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from(`task`).select(`*`);
    // .eq('user_id', user.id)
    // console.log(data)
    if (error) {
      console.log("Error fetching tasks: ", error);
    } else {
      setTaskList(data);
    }
  };

  const addTask = async () => {
    const newTaskData = {
      name: newTaskName,
      is_completed: false,
      description: newDescription,
      type: newType,
    };
    const { data, error } = await supabase.from(`task`).insert([newTaskData]).select();

    if (error) {
      console.log("Error adding new task: ", error);
    } else {
      setTaskList((prev) => [...prev, ...data]);
      setNewTaskName("");
      setNewDescription("");
    }
  };

  const toggleTask = async (taskId, is_completed) => {
    const { error } = await supabase
      .from(`task`)
      .update({ is_completed: !is_completed })
      .eq("id", taskId);

    if (error) {
      console.log("Error toggling compelete task: ", error);
    } else {
      const toggledTaskList = taskList.map((task) => {
        if (task.id === taskId) {
          return { ...task, is_completed: !is_completed };
        } else {
          return task;
        }
      });
      setTaskList(toggledTaskList);
    }
  };

  const deleteTask = async (taskId) => {
    const { data, error } = await supabase.from(`task`).delete().eq("id", taskId);

    if (error) {
      console.log("Error deleting task: ", error);
    } else {
      setTaskList((prev) => prev.filter((task) => task.id !== taskId));
    }
  };

  return (
    <div className="task-content">
      <div className="create-task">
        <h2>Create new quest</h2>
        <div className="input-fields">
          <input
            type="text"
            placeholder="Enter name..."
            value={newTaskName}
            onChange={(event) => setNewTaskName(event.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter description..."
            value={newDescription}
            onChange={(event) => setNewDescription(event.target.value)}
          />
          <label>Choose type</label>
          <select
            id="task-type"
            value={newType}
            onChange={(event) => setNewType(event.target.value)}>
            <option value={"one-time"}>One-time</option>
            <option value={"daily"}>Daily</option>
            <option value={"weekly"}>Weekly</option>
          </select>
        </div>
        <button onClick={addTask} disabled={!newTaskName}>
          Add quest
        </button>
      </div>
      <ul className="tasks">
        {taskList.map((task) => (
          <li
            className={`task-card${task.is_completed ? "-completed" : ""}`} // if task is completed, change look in css
            key={task.id}>
            <h2>{task.name}</h2>
            <p>{task.description}</p>
            <p>{task.type}</p>
            <button onClick={() => toggleTask(task.id, task.is_completed)}>
              {" "}
              {task.is_completed ? "↺" : "✓"}
            </button>
            <button onClick={() => deleteTask(task.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Task;
