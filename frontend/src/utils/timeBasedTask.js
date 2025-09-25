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
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours}h ${minutes}m ${secs}s`;
};

const timeLeft = (expirationTime, currentTime) => {
  const seconds = calculateTimeLeft(expirationTime, currentTime);

  if (seconds === null) {
    return null;
  } else {
    return formatTime(seconds);
  }
};

export { calculateTimeLeft, formatTime, timeLeft };
