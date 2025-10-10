import supabase from "../../services/supabase-client";
import { setHasAwardedToTrue } from "./progression";

const calculateTimeLeft = (expirationTime, currentTime) => {
  if (!expirationTime) {
    return null;
  }

  const expiration = new Date(expirationTime);
  const secondsRemaining = Math.floor((expiration - currentTime) / 1000);

  return Math.max(0, secondsRemaining);
};

const formatTime = (seconds) => {
  if (seconds <= 0) {
    return "Expired";
  }
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) {
    return `${days} days`;
  } else if (days <= 0 && hours <= 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${hours}h ${minutes}m`;
};

const timeLeft = (expirationTime, currentTime) => {
  const seconds = calculateTimeLeft(expirationTime, currentTime);
  return formatTime(seconds);
};

async function updateToExpired(taskID) {
  const { data, error } = await supabase
    .from("task")
    .update({ has_expired: true })
    .eq("id", taskID)
    .single();

  if (error) {
    console.log("Error updating the tasks has_expired", error);
  }
  return data;
}

const removeExpirationTime = async (taskID) => {
  // Sets the current expiration time to now (so that it is expired) when a task is completed
  // also updates the task to be expired (in column)
  const newExpirationTime = new Date().toISOString();
  // console.log(newExpirationTime);
  const { data, error } = await supabase
    .from("task")
    .update({ expiration_time: newExpirationTime })
    .eq("id", taskID)
    .single();

  if (error) {
    console.log("Error updating the expiration time to current time", error);
  }
  await setHasAwardedToTrue(taskID);
  // else {
  //   updateToExpired(taskID);
  // }
};

export { calculateTimeLeft, formatTime, timeLeft, removeExpirationTime, updateToExpired };
