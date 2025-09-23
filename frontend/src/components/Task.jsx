import { useEffect, useState } from "react";
import supabase from "../../services/supabase-client";
import "../css/Task.css";
import { UserAuth } from "../context/Authentication";
import { Trash2, Check, Undo } from "lucide-react";
import { awardCoins } from "../utils/progression.js";

// const { data: { user }  } = await supabase.auth.getUser() // does not get local session

function Task() {
  const [newTaskName, setNewTaskName] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState("one-time");

  const currentUserData = UserAuth().session.user; // gets current user session, use it to get ID
  const currentUserID = currentUserData.id;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from(`task`).select(`*`);
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

  const toggleTask = async (taskID, is_completed) => {
    const { data, error } = await supabase
      .from(`task`)
      .update({ is_completed: !is_completed })
      .eq("id", taskID)
      .select();

    if (error) {
      console.log("Error toggling compelete task: ", error);
    } else {
      await awardCoins(currentUserID, 2, taskID);

      const toggledTaskList = taskList.map((task) => {
        if (task.id === taskID) {
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

  function taskInput(type, placeholder, value, onChangeFunc, require = false) {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChangeFunc(event.target.value)}
        required={require}
      />
    );
  }

  function taskCard(task) {
    return (
      <li
        className={`task-card${task.is_completed ? "-completed" : ""}`} // if task is completed, change look in css
        key={task.id}>
        <h2>{task.name}</h2>
        <p>{task.description}</p>
        <p>{task.type}</p>
        <button onClick={() => toggleTask(task.id, task.is_completed)}>
          {" "}
          {task.is_completed ? (
            <Undo size={15} strokeWidth={3} />
          ) : (
            <Check size={15} strokeWidth={3} />
          )}
        </button>
        <button onClick={() => deleteTask(task.id)}>
          <Trash2 size={15} strokeWidth={2} />
        </button>
      </li>
    );
  }

  function listTaskCards() {
    // Iterates through every task in database and displays them
    return <ul className="tasks">{taskList.map((task) => taskCard(task))}</ul>;
  }

  function chooseTaskType() {
    return (
      <>
        <label>Choose type</label>
        <select id="task-type" value={newType} onChange={(event) => setNewType(event.target.value)}>
          <option value={"one-time"}>One-time</option>
          <option value={"daily"}>Daily</option>
          <option value={"weekly"}>Weekly</option>
        </select>
      </>
    );
  }

  function createTask() {
    // Main function for creating a task
    return (
      <div className="create-task">
        <h2>Create new quest</h2>
        <div className="input-fields">
          {taskInput("text", "Enter name...", newTaskName, setNewTaskName, true)}
          {taskInput("text", "Enter description...", newDescription, setNewDescription)}
          {chooseTaskType()}
        </div>
        <button onClick={addTask} disabled={!newTaskName}>
          Add quest
        </button>
      </div>
    );
  }

  return (
    <div className="task-content">
      {createTask()}
      {listTaskCards()}
    </div>
  );
}

export default Task;
