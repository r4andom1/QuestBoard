import { useEffect, useState, useRef } from "react";
import supabase from "../../services/supabase-client";
import "../css/Task.css";
import { UserAuth } from "../context/Authentication";
import { Trash2, Check, Undo, SquarePen, SquareCheckBig, PenBox, Save, Ban } from "lucide-react";
import { awardUser, setHasAwardedToTrue } from "../utils/progression.js";
import {
  calculateTimeLeft,
  formatTime,
  timeLeft,
  removeExpirationTime,
  updateToExpired,
} from "../utils/timeBasedTask.js";
import HeroSection from "./HeroSection.jsx";
import { useUser } from "../context/UserContext.jsx";
import dayjs from "dayjs";

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
  const [showUpcomingTasks, setShowUpcomingTasks] = useState(true);
  const { fetchUserData, userStats } = useUser();

  // for editing task
  const [openEditWindow, setOpenEditWindow] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("");
  const [editExpirationTime, setEditExpirationTime] = useState(null);

  const processingTasksRef = useRef(new Set());

  const currentUserData = UserAuth().session.user; // gets current user session, use it to get ID
  const currentUserID = currentUserData.id;

  const createExpirationTime = (customTime, taskType) => {
    // Calculates the correct expiration time depending on task type
    let expirationTime = customTime;
    let currentDay = dayjs();

    // console.log(customTime);

    if (taskType === "one-time" && customTime) {
      expirationTime = dayjs(customTime).toISOString();
      return expirationTime;
    } else if (taskType === "daily") {
      // set expiration time to expire the custom time and extract the HH:SS so that we can format it back to a datetime and then calculate the correct expirationTime
      const [hours, minutes] = customTime.split(":");
      let tomorrow = dayjs().hour(hours).minute(minutes).second(0); // for correct HH:SS format
      if (tomorrow.isBefore(currentDay)) {
        tomorrow = tomorrow.add(1, "day");
      }
      return tomorrow.toISOString();
    } else if (taskType === "weekly") {
      // set expiration time to expire the custom time and date, this should be formatted with toISOString

      let weeklyDate = dayjs(customTime);
      if (weeklyDate.isBefore(currentDay)) {
        weeklyDate = weeklyDate.add(7, "day");
      }
      // first check the day difference, cause if customTime was yesterday it should be set up to 7 days from that day.
      return weeklyDate.toISOString();
    }
  };

  // console.log(taskList); // test
  // console.log(userStats);

  useEffect(() => {
    if (openEditWindow) {
      // pause timer to prevent the timer to constantly refresh the dev tools in browser
      return;
    }

    const intervalID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // every second

    return () => clearInterval(intervalID); // cleanup timer to prevent memory leaking
  }, [openEditWindow]);

  const handleExpired = async (taskID) => {
    if (processingTasksRef.current.has(taskID)) {
      // if task is being processed, do not process it again basically
      return;
    }
    processingTasksRef.current.add(taskID); // else add it to currently processing set

    try {
      // always remove task from processing so it doesnt get stuck if an error occurs in this func
      const oldTask = taskList.find((t) => t.id === taskID);
      if (!oldTask) {
        processingTasksRef.current.delete(taskID);
        return;
      }

      if (oldTask.status === "upcoming") {
        const nextExpirationTime = CalculateNewTaskExpirationTime(
          oldTask.type,
          oldTask.expiration_time
        );
        await supabase
          .from("task")
          .update({ status: null, expiration_time: nextExpirationTime })
          .eq("id", taskID);
      } else {
        await updateToExpired(taskID);
        await setHasAwardedToTrue(taskID);
        if (!oldTask.is_deleted && (oldTask.type === "daily" || oldTask.type === "weekly")) {
          await recreateTask(oldTask);
        }
      }
      await fetchTasks();
    } catch (error) {
      console.log("Error processing expired task", error);
    } finally {
      processingTasksRef.current.delete(taskID); // processing is complete
    }
  };

  useEffect(() => {
    taskList.forEach((task) => {
      if (task.expiration_time && !task.is_completed && !task.has_expired && !task.is_deleted) {
        const secondsRemaining = calculateTimeLeft(task.expiration_time, currentTime);
        if (secondsRemaining <= 0) {
          handleExpired(task.id);
        }
      }
    });
  }, [currentTime, taskList, handleExpired]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from("task").select("*");
    // console.log(data)
    if (error) {
      console.log("Error fetching tasks: ", error);
    } else {
      setTaskList(data);
    }
  };

  const addTask = async () => {
    if (newExpirationTime === null) {
      alert("Please enter an expiration time");
      return;
    }

    const calculatedExpirationTime = createExpirationTime(newExpirationTime, newType);

    const newTaskData = {
      name: newTaskName,
      is_completed: false,
      description: newDescription,
      type: newType,
      expiration_time: calculatedExpirationTime,
    };
    const { data, error } = await supabase.from("task").insert([newTaskData]).select();

    if (error) {
      console.log("Error adding new task: ", error);
    } else {
      setNewTaskName("");
      setNewDescription("");
      setExpirationTime(null);
      await incrementQuestsCreated(currentUserID);
      await fetchTasks();
      // await setCountdown(data[0].id, newType, newExpirationTime);
      // setExpirationTime(null);
    }
  };

  // const setCountdown = async (taskID, taskType, customExpirationTime) => {
  //   // sets expiration time in the tasks expiration time column so we can calculate how much time is left
  //   const expirationTime = createExpirationTime(customExpirationTime, taskType);

  //   const { data, error } = await supabase
  //     .from("task")
  //     .update({ expiration_time: expirationTime })
  //     .eq("id", taskID)
  //     .select();

  //   if (error) {
  //     console.log("error updating expiration time", error);
  //   } else {
  //     await fetchTasks();
  //   }
  // };

  function CalculateNewTaskExpirationTime(taskType, oldTime) {
    // takes the old task time and refreshes it depending on type for reocurring quests
    let refreshedTime = dayjs(oldTime);
    if (taskType === "daily") {
      refreshedTime = refreshedTime.add(1, "day");
    } else if (taskType === "weekly") {
      refreshedTime = refreshedTime.add(7, "day");
    }

    return refreshedTime.toISOString();
  }

  const recreateTask = async (oldTask) => {
    // const refreshedExpirationTime = CalculateNewTaskExpirationTime(
    //   oldTask.type,
    //   oldTask.expiration_time
    // );

    const newTaskData = {
      name: oldTask.name,
      is_completed: false,
      description: oldTask.description,
      type: oldTask.type,
      expiration_time: oldTask.expiration_time,
      has_awarded: false,
      status: "upcoming",
    };
    const { data, error } = await supabase.from("task").insert([newTaskData]).select();
    if (error) {
      console.log("Error adding new task: ", error);
    } else {
      await incrementQuestsCreated(currentUserID);
    }
  };

  const toggleTask = async (task) => {
    const { id: taskID, type } = task;
    const { data, error } = await supabase
      .from("task")
      .update({ is_completed: true, has_awarded: true })
      .eq("id", taskID)
      .select();

    if (error) {
      console.log("Error toggling compelete task: ", error);
    } else {
      await Promise.all([
        awardUser(currentUserID, task),
        !task.has_expired ? incrementQuestsCompleted(currentUserID) : "",
      ]);
      if (type === "daily" || type === "weekly") {
        await recreateTask(task);
      }
      await Promise.all([fetchUserData(), fetchTasks()]);
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
        <div className="task-time">
          <div className="refresh-text">
            {task.status === "upcoming" && !task.is_deleted ? <p>refreshes in: </p> : ""}
            {!task.is_completed && task.status !== "upcoming" && !task.has_expired ? (
              <p>expires in:</p>
            ) : (
              ""
            )}
            {/* {task.has_expired ? <p>expired</p> : ""} */}
          </div>
          {task.expiration_time ? (
            <div className="time-left">
              {task.is_deleted || task.has_expired || task.is_completed ? (
                ""
              ) : (
                <p>{timeLeft(task.expiration_time, currentTime)}</p>
              )}
            </div>
          ) : null}
        </div>
        <div className="task-card-buttons">
          {!task.is_completed && !task.has_expired && task.status !== "upcoming" && (
            <button onClick={() => toggleTask(task)}>
              <SquareCheckBig size={25} strokeWidth={2} />
            </button>
          )}{" "}
          {!task.has_expired && !task.is_deleted && !task.is_completed && (
            <button onClick={() => openEditModal(task)}>
              <SquarePen size={25} strokeWidth={2} />
            </button>
          )}
          {!task.is_deleted && (
            <button onClick={() => deleteTask(task.id, task.is_deleted)}>
              <Trash2 size={25} strokeWidth={2} />
            </button>
          )}
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
            Current Quests
          </button>
        </li>
        {showActiveTasks &&
          taskList
            .filter(
              (task) =>
                !task.is_completed &&
                !task.is_deleted &&
                !task.has_expired &&
                task.status !== "upcoming"
            )
            .sort((a, b) => a.id - b.id)
            .map((task) => taskCard(task))}
      </ul>
    );
  }

  function listUpcomingTasks() {
    return (
      <ul className="tasks-upcoming">
        <li className="task-section-heading">
          <button className="show-button" onClick={() => setShowUpcomingTasks((prev) => !prev)}>
            Upcoming Quests
          </button>
        </li>
        {showUpcomingTasks &&
          taskList
            .filter((task) => task.status === "upcoming" && !task.is_deleted)
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
            .filter((task) => task.is_completed && !task.is_deleted && !task.has_expired)
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
            .filter((task) => task.has_expired && !task.is_deleted && !task.is_completed)
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
    const today = dayjs(); // to calculate min and max values so user cant choose a date other than current week
    const monday = today.startOf("week").add(1, "day");
    const sunday = today.endOf("week").subtract(-1, "day");
    // console.log(monday);

    return (
      <>
        <div className="radio-buttons">
          <label>
            <input
              type="radio"
              value="daily"
              checked={newType === "daily"}
              onChange={(event) => {
                setNewType(event.target.value);
                setExpirationTime(null);
              }}
            />
            Daily
          </label>
          <label>
            <input
              type="radio"
              value="one-time"
              checked={newType === "one-time"}
              onChange={(event) => {
                setNewType(event.target.value);
                setExpirationTime(null);
              }}
            />
            One-time
          </label>
          <label>
            <input
              type="radio"
              value="weekly"
              checked={newType === "weekly"}
              onChange={(event) => {
                setNewType(event.target.value);
                setExpirationTime(null);
              }}
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
              required
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
              min={monday.format("YYYY-MM-DDTHH:mm")}
              max={sunday.format("YYYY-MM-DDTHH:mm")}
              required
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
              required
            />
          </div>
        )}
      </>
    );
  }

  const openEditModal = (task) => {
    // Opens the edit window and fills in current task data
    setEditingTask(task);
    setEditName(task.name);
    setEditDescription(task.description);
    setEditType(task.type);
    setEditExpirationTime(task.expiration_time);
    setOpenEditWindow(true);
  };

  const closeEditModal = () => {
    // closes window and resets edit variables
    setOpenEditWindow(false);
    setEditingTask(null);
    setEditName("");
    setEditDescription("");
    setEditType("");
    setEditExpirationTime(null);
  };

  const saveTaskEdits = async (event) => {
    // Updates database, updates taskLists state and closes edit window
    event.preventDefault();
    const taskID = editingTask.id;

    if (editExpirationTime === null) {
      alert("Please enter an expiration time");
      return;
    }
    const editedExpirationTime = createExpirationTime(editExpirationTime, editType);

    const editedData = {
      name: editName,
      description: editDescription,
      type: editType,
      expiration_time: editedExpirationTime,
    };

    const { data, error } = await supabase
      .from("task")
      .update([editedData])
      .eq("id", taskID)
      .select();

    if (error) {
      console.log("Error saving edited task", error);
      return;
    }
    await fetchTasks();
    closeEditModal();
  };

  function chooseEditedTaskType() {
    const today = dayjs();
    const monday = today.startOf("week").add(1, "day");
    const sunday = today.endOf("week").subtract(-1, "day");

    return (
      <>
        <div className="radio-buttons">
          <label>
            <input
              type="radio"
              value="daily"
              checked={editType === "daily"}
              onChange={(e) => {
                setEditType(e.target.value);
                setEditExpirationTime(null);
              }}
            />
            Daily
          </label>
          <label>
            <input
              type="radio"
              value="one-time"
              checked={editType === "one-time"}
              onChange={(e) => {
                setEditType(e.target.value);
                setEditExpirationTime(null);
              }}
            />
            One-time
          </label>
          <label>
            <input
              type="radio"
              value="weekly"
              checked={editType === "weekly"}
              onChange={(e) => {
                setEditType(e.target.value);
                setEditExpirationTime(null);
              }}
            />
            Weekly
          </label>
        </div>
        {editType === "one-time" && (
          <div className="custom-expiration">
            <label htmlFor="expiration-datetime">Set expiration date & time</label>
            <input
              id="expiration-datetime"
              type="datetime-local"
              value={editExpirationTime || ""}
              onChange={(e) => setEditExpirationTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)} // adds a min so user cant pick a date before today and use slice to format for html
              required
            />
          </div>
        )}
        {editType === "weekly" && (
          <div className="custom-expiration">
            <label htmlFor="expiration-datetime">Set expiration day & time</label>
            <input
              id="expiration-datetime"
              type="datetime-local"
              value={editExpirationTime || ""}
              onChange={(e) => setEditExpirationTime(e.target.value)}
              min={monday.format("YYYY-MM-DDTHH:mm")}
              max={sunday.format("YYYY-MM-DDTHH:mm")}
              required
            />
          </div>
        )}
        {editType === "daily" && (
          <div className="custom-expiration">
            <label htmlFor="expiration-time">Set expiration time</label>
            <input
              id="expiration-time"
              type="time"
              value={editExpirationTime || ""}
              onChange={(e) => setEditExpirationTime(e.target.value)}
              required
            />
          </div>
        )}
      </>
    );
  }

  function EditTask() {
    const handleContentClick = (event) => {
      // so the user can click inside the window and not affect stuff outside
      event.stopPropagation();
    };

    return (
      <div className="modal-background" onClick={closeEditModal}>
        <div className="modal-window" onClick={handleContentClick}>
          <h3>Edit task: {editName}</h3>

          <form onSubmit={saveTaskEdits} className="edit-form">
            {/* <label>Name</label> */}
            <input
              type="text"
              placeholder="Enter name..."
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />

            {/* <label>Description</label> */}
            <input
              type="text"
              placeholder="Enter description..."
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            {chooseEditedTaskType()}
            <div className="modal-buttons">
              <button type="button" onClick={closeEditModal}>
                <Ban width={15} strokeWidth={3} />
              </button>
              <button>
                <Save width={15} strokeWidth={3} />
              </button>
            </div>
          </form>
        </div>
      </div>
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
        {listUpcomingTasks()}
        {listCompletedTasks()}
        {listExpiredTasks()}
        {listDeletedTasks()}
      </>
    );
  }

  const incrementQuestsCreated = async (userID) => {
    const currentQuestsCreated = userStats.quests_created;

    const { data, error } = await supabase
      .from("user_stats")
      .update({ quests_created: currentQuestsCreated + 1 })
      .eq("user_id", userID);
    if (error) {
      console.log("error incrementing quests created", error);
    } else {
      // console.log("quest created");
    }
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
    } else {
      // console.log("quest completed");
    }
  };

  return (
    <div className="task-content">
      {createTask()}
      {openEditWindow && editingTask && <EditTask />}
      {/* <HeroSection /> */}
      <div className="all-tasks">{listAllTasks()}</div>
    </div>
  );
}

export default Task;
