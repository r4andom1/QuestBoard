import { useEffect, useState } from "react";
import supabase from "../../services/supabase-client";
import "../css/Task.css";
import { UserAuth } from "../context/Authentication";
import { Trash2, Check, Undo, SquarePen, SquareCheckBig } from "lucide-react";
import { awardUser, setHasAwardedToTrue } from "../utils/progression.js";
import {
  calculateTimeLeft,
  formatTime,
  timeLeft,
  removeExpirationTime,
} from "../utils/timeBasedTask.js";
import HeroSection from "./HeroSection.jsx";
import { useUser } from "../context/UserContext.jsx";

function Task() {
  const [newTaskName, setNewTaskName] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState("one-time");
  const [newExpirationTime, setExpirationTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showActiveTasks, setShowActiveTasks] = useState(true);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showExpiredTasks, setShowExpiredTasks] = useState(false);
  const [showDeletedTasks, setShowDeletedTasks] = useState(false);
  const { fetchUserData, userStats } = useUser();

  const currentUserData = UserAuth().session.user; // gets current user session, use it to get ID
  const currentUserID = currentUserData.id;
  // console.log(taskList); // test
  // console.log(userStats);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // every second

    return () => clearInterval(intervalID); // cleanup timer to prevent memory leaking
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
      expiration_time: null,
    };
    const { data, error } = await supabase.from(`task`).insert([newTaskData]).select();

    if (error) {
      console.log("Error adding new task: ", error);
    } else {
      setTaskList((prev) => [...prev, ...data]);
      setNewTaskName("");
      setNewDescription("");
      await incrementQuestsCreated(currentUserID);
      await setCountdown(data[0].id, newType, newExpirationTime);
      setExpirationTime(null);
    }
  };

  const createExpirationTime = (customTime, taskType) => {
    // Creates/calculates the correct expiration time depending on task type
    let expirationTime = customTime;

    if (taskType === "one-time" && customTime) {
      expirationTime = new Date(customTime).toISOString();
      return expirationTime;
    } else if (taskType === "daily") {
      // set expiration time to expire the custom time and extract the HH:SS so that we can format it back to a datetime and then calculate the correct expirationTime
      let daysToAdd = 1;
    } else if (taskType === "weekly") {
      // set expiration time to expire the custom time and date, this should be formatted with toISOString
      let weeklyDate = new Date(customTime).toISOString();
      console.log(weeklyDate);
    }
  };

  const setCountdown = async (taskID, taskType, customExpirationTime) => {
    // sets expiration time in the tasks expiration time column so we can calculate how much time is left
    const expirationTime = createExpirationTime(customExpirationTime, taskType);

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

  const toggleTask = async (task) => {
    // Can be toggled many times, but completed and get rewards from once.
    const { id: taskID, is_completed } = task; // from refactoring

    const { data, error } = await supabase
      .from("task")
      .update({ is_completed: !is_completed })
      .eq("id", taskID)
      .select();

    if (error) {
      console.log("Error toggling compelete task: ", error);
    } else {
      await Promise.all([
        awardUser(currentUserID, task),
        removeExpirationTime(taskID),
        !task.has_expired ? incrementQuestsCompleted(currentUserID) : "",
      ]);

      await Promise.all([fetchUserData(), fetchTasks()]);

      // add back this if scaling is an issue
      //   const toggledTaskList = taskList.map((task) => {
      //     if (task.id === taskID) {
      //       return { ...task, is_completed: !is_completed };
      //     } else {
      //       return task;
      //     }
      //   });
      //   setTaskList(toggledTaskList);
    }
  };

  const deleteTask = async (taskID, is_deleted) => {
    const { data, error } = await supabase
      .from("task")
      .update({ is_deleted: !is_deleted })
      .eq("id", taskID)
      .single();

    if (error) {
      console.log("Error deleting task: ", error);
    } else {
      await setHasAwardedToTrue(taskID);
      const updatedTaskList = taskList.map((task) => {
        if (task.id === taskID) {
          return { ...task, is_deleted: !is_deleted };
        } else {
          return task;
        }
      });
      setTaskList(updatedTaskList);
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
        name="input"
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
              {task.is_deleted || task.has_expired || task.is_completed
                ? ""
                : timeLeft(task.expiration_time, currentTime, task.id, handleExpired)}
            </div>
          ) : null}
        </div>
        <div className="task-card-buttons">
          <button onClick={() => toggleTask(task)}>
            {" "}
            {task.is_completed ? (
              <Undo size={25} strokeWidth={3} />
            ) : (
              <SquareCheckBig size={25} strokeWidth={3} />
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
        <li className="task-section-heading">
          <button className="show-button" onClick={() => setShowActiveTasks((prev) => !prev)}>
            Active Quests
          </button>
        </li>
        {showActiveTasks &&
          taskList
            .filter(
              (task) =>
                task.is_active &&
                !task.is_completed &&
                !task.is_deleted &&
                !task.has_awarded &&
                !task.has_expired
            )
            .sort((a, b) => a.id - b.id)
            .map((task) => taskCard(task))}
      </ul>
    );
  }

  function listCompletedTasks() {
    return (
      <ul className="tasks-completed">
        <li className="task-section-heading">
          <button className="show-button" onClick={() => setShowCompletedTasks((prev) => !prev)}>
            Completed Quests
          </button>
        </li>
        {showCompletedTasks &&
          taskList
            .filter((task) => task.has_awarded === true && !task.is_deleted)
            .sort((a, b) => a.id - b.id)
            .map((task) => taskCard(task))}
      </ul>
    );
  }

  function listExpiredTasks() {
    return (
      <ul className="tasks-expired">
        <li className="task-section-heading">
          <button className="show-button" onClick={() => setShowExpiredTasks((prev) => !prev)}>
            Expired Quests
          </button>
        </li>
        {showExpiredTasks &&
          taskList
            .filter((task) => task.has_expired && !task.is_deleted && !task.has_awarded)
            .sort((a, b) => a.id - b.id)
            .map((task) => taskCard(task))}
      </ul>
    );
  }

  function listDeletedTasks() {
    return (
      <ul className="tasks-deleted">
        <li className="task-section-heading">
          <button className="show-button" onClick={() => setShowDeletedTasks((prev) => !prev)}>
            Deleted Quests
          </button>
        </li>
        {showDeletedTasks &&
          taskList
            .filter((task) => task.is_deleted === true)
            .sort((a, b) => a.id - b.id)
            .map((task) => taskCard(task))}
      </ul>
    );
  }

  function chooseTaskType() {
    const today = new Date(); // to calculate min and max values so user cant choose a date other than current week
    const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    const sunday = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Sunday

    return (
      <>
        <div className="radio-buttons">
          <label>
            <input
              type="radio"
              value="daily"
              checked={newType === "daily"}
              onChange={(event) => setNewType(event.target.value)}
            />
            Daily
          </label>
          <label>
            <input
              type="radio"
              value="one-time"
              checked={newType === "one-time"}
              onChange={(event) => setNewType(event.target.value)}
            />
            One-time
          </label>
          <label>
            <input
              type="radio"
              value="weekly"
              checked={newType === "weekly"}
              onChange={(event) => setNewType(event.target.value)}
            />
            Weekly
          </label>
        </div>
        {newType === "one-time" && (
          <div className="custom-expiration">
            <label htmlFor="expiration-datetime">Set expiration date & time</label>
            <input
              id="expiration-datetime"
              type="datetime-local"
              value={newExpirationTime || ""}
              onChange={(event) => setExpirationTime(event.target.value)}
              min={new Date().toISOString().slice(0, 16)} // adds a min so user cant pick a date before today and use slice to format for html
            />
          </div>
        )}
        {newType === "weekly" && (
          <div className="custom-expiration">
            <label htmlFor="expiration-datetime">Set expiration day & time</label>
            <input
              id="expiration-datetime"
              type="datetime-local"
              value={newExpirationTime || ""}
              onChange={(event) => setExpirationTime(event.target.value)}
              min={monday.toISOString().slice(0, 16)}
              max={sunday.toISOString().slice(0, 16)}
            />
          </div>
        )}
        {newType === "daily" && (
          <div className="custom-expiration">
            <label htmlFor="expiration-time">Set expiration time</label>
            <input
              id="expiration-time"
              type="time"
              value={newExpirationTime || ""}
              onChange={(event) => setExpirationTime(event.target.value)}
            />
          </div>
        )}
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
        <button className="add-quest-button" onClick={addTask} disabled={!newTaskName}>
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
    );
  }

  const incrementQuestsCreated = async (userID) => {
    const currentQuestsCreated = userStats.quests_created;

    await supabase
      .from("user_stats")
      .update({ quests_created: currentQuestsCreated + 1 })
      .eq("user_id", userID);
  };

  const incrementQuestsCompleted = async (userID) => {
    const currentQuestsCompleted = userStats.quests_completed;

    const { data, error } = await supabase
      .from("user_stats")
      .update({ quests_completed: currentQuestsCompleted + 1 })
      .eq("user_id", userID)
      .select();
    if (error) {
      console.log(error);
    }
  };

  return (
    <div className="task-content">
      {createTask()}
      {/* <HeroSection /> */}
      <div className="all-tasks">{listAllTasks()}</div>
    </div>
  );
}

export default Task;
