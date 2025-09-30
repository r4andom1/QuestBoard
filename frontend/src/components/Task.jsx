import { useEffect, useState } from "react";
import supabase from "../../services/supabase-client";
import "../css/Task.css";
import { UserAuth } from "../context/Authentication";
import { Trash2, Check, Undo, SquarePen } from "lucide-react";
import { awardUser } from "../utils/progression.js";
import { calculateTimeLeft, formatTime, timeLeft } from "../utils/timeBasedTask.js";

function Task() {
  const [newTaskName, setNewTaskName] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState("one-time");
  const [newExpirationTime, setExpirationTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showActiveTasks, setShowActiveTasks] = useState(true)
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)
  const [showExpiredTasks, setShowExpiredTasks] = useState(false)
  const [showDeletedTasks, setShowDeletedTasks] = useState(false)
  

  const currentUserData = UserAuth().session.user; // gets current user session, use it to get ID
  const currentUserID = currentUserData.id;

  useEffect(() => {
    const intervalID = setInterval(() => {
      setCurrentTime(new Date()); // triggers the refresh
    }, 1000); // every second

    return () => clearInterval(intervalID); // cleanup to prevent memory leaking
  }, []);

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
      expiration_time: newExpirationTime,
    };
    const { data, error } = await supabase.from(`task`).insert([newTaskData]).select();

    if (error) {
      console.log("Error adding new task: ", error);
    } else {
      setTaskList((prev) => [...prev, ...data]);
      setNewTaskName("");
      setNewDescription("");
      await setCountdown(data[0].id, newType);
    }
  };

  const setCountdown = async (taskID, taskType) => {
    // sets expiration time in the tasks expiration time column so we can calculate how much time is left
    let expirationTime;

    if (taskType === "daily") {
      expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // ISOString so that its the correct type for database timestampz
    } else if (taskType === "weekly") {
      expirationTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else {
      expirationTime = null;
    }

    const { data, error } = await supabase
      .from("task")
      .update({ expiration_time: expirationTime })
      .eq("id", taskID)
      .select();

    if (error) {
      console.log("error updating expiration time", error);
    } else {
      setTaskList((prev) =>
        prev.map((task) =>
          task.id === taskID ? { ...task, expiration_time: expirationTime } : task
        )
      );
    }
  };

  const handleExpired = (taskID) => {
    // update state when task becomes expired
    setTaskList((prev) =>
      prev.map((task) => (task.id === taskID ? { ...task, has_expired: true } : task))
    );
  };

  const toggleTask = async (taskID, is_completed) => {
    // Can be toggled many times, but completed and get rewards from once.
    const { data, error } = await supabase
      .from(`task`)
      .update({ is_completed: !is_completed })
      .eq("id", taskID)
      .select();

    if (error) {
      console.log("Error toggling compelete task: ", error);
    } else {
      await awardUser(currentUserID, taskID);

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

  const deleteTask = async (taskID, is_deleted) => {
    const { data, error } = await supabase
    .from("task")
    .update({is_deleted : !is_deleted})
    .eq("id", taskID)
    .single();

    if (error) {
      console.log("Error deleting task: ", error);
    } else {
      const updatedTaskList = taskList.map((task) => {
        if (task.id === taskID) {
          return {...task, is_deleted: !is_deleted}
        } else {
          return task;
        }
      })
      setTaskList(updatedTaskList)
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

  // implement so that taskCard can either be viewed in edit mode or as view mode
  function taskCard(task) {
    return (
      <li
        className={`task-card${task.is_completed ? "-completed" : ""}`} // if task is completed, change look in css
        key={task.id}>
        <h2>{task.name}</h2>
        <p>{task.description}</p>
        <p className="card-task-type">{task.type}</p>
        <div>
          {task.expiration_time ? (
            <div className="time-left">
              time left: {timeLeft(task.expiration_time, currentTime, task.id, handleExpired)}
            </div>
          ) : null}
        </div>
        <div className="task-card-buttons">
          <button onClick={() => toggleTask(task.id, task.is_completed)}>
            {" "}
            {task.is_completed ? (
              <Undo size={25} strokeWidth={3} />
            ) : (
              <Check size={25} strokeWidth={3} />
            )}
          </button>
          <button onClick={() => deleteTask(task.id, task.is_deleted)}>
            <Trash2 size={25} strokeWidth={2} />
          </button>
          <button>
            <SquarePen />
          </button>
        </div>
      </li>
    );
  }

  function listTaskCards() {
    // Iterates through every task in database and displays them
    return (
      <ul className="tasks">
        {<h2>All</h2>}
        {taskList.map((task) => taskCard(task))}
        </ul>
    );
  }

  function listActiveTasks() {
        return (
      <ul className="tasks-active">
        <li className="task-section-heading"><button onClick={() => setShowActiveTasks((prev) => !prev)}>Active Quests</button></li>
        {showActiveTasks && taskList.filter((task) => task.is_active === true && !task.is_completed && !task.is_deleted && !task.has_awarded).map((task) => taskCard(task))}
      </ul>
    );
  }

  function listCompletedTasks() {
    return (
      <ul className="tasks-completed">
        <li className="task-section-heading"><button onClick={() => setShowCompletedTasks((prev) => !prev)}>Completed Quests</button></li>
        {showCompletedTasks && taskList.filter((task) => task.has_awarded === true && !task.is_deleted && !task.is_expired).map((task) => taskCard(task))}
      </ul>
    );
  }

  function listExpiredTasks() {
    return (
      <ul className="tasks-expired">
        <li className="task-section-heading"><button onClick={() => setShowExpiredTasks((prev) => !prev)}>Expired Quests</button></li>
        {showExpiredTasks && taskList.filter((task) => task.is_expired === true).map((task) => taskCard(task))}
      </ul>
    );
  }

  function listDeletedTasks() {
        return (
      <ul className="tasks-deleted">
        <li className="task-section-heading"><button onClick={() => setShowDeletedTasks((prev) => !prev)}>Deleted Quests</button></li>
        {showDeletedTasks && taskList.filter((task) => task.is_deleted === true).map((task) => taskCard(task))}
      </ul>
    );
  }

  function chooseTaskType() {
    return (
      <>
        <label>Choose type</label>
        <select
          className="task-type"
          value={newType}
          onChange={(event) => setNewType(event.target.value)}>
          <option value={"one-time"}>One-time</option>
          <option value={"daily"}>Daily</option>
          <option value={"weekly"}>Weekly</option>
        </select>
      </>
    );
  }

  function editTask() {}

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

  function listAllTasks() {
    return (
      <>
        {listActiveTasks()}
        {listCompletedTasks()}
        {listExpiredTasks()}
        {listDeletedTasks()}
      </>
    )
  }

  return (
    <div className="task-content">
      {createTask()}
      <div className="all-tasks">
        {listAllTasks()}
      </div>
    </div>
  );
}

export default Task;
