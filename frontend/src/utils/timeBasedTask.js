import supabase from "../../services/supabase-client";

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
  }
  return `${hours}h ${minutes}m`;
};

const timeLeft = (expirationTime, currentTime, taskID, onExpired) => {
  const seconds = calculateTimeLeft(expirationTime, currentTime);
  if (seconds === 0) {
    updateToExpired(taskID);
    onExpired(taskID);
  }

  if (seconds === null) {
    // if not time-based
    return null;
  } else {
    return formatTime(seconds);
  }
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

export { calculateTimeLeft, formatTime, timeLeft };
