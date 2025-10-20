// Functions for calculating and setting up streaks and badges, reset logic etc
import supabase from "../../services/supabase-client.js";
// import { useUser } from "../context/UserContext.jsx";
// const { fetchUserData, userStats } = useUser();

async function incrementQuestStreak(user, type) {
  //
  const streakToIncrement = checkTypeForStreak(user, type);
  // console.log(streakToIncrement);
  // console.log("userID: ", user.id);

  const { error } = await supabase.from("user_stats").update(streakToIncrement).eq("id", user.id);
  if (error) {
    console.log("Error updating quest streak for quest type: ", type, "With error: ", error);
  }
}

function checkTypeForStreak(user, type) {
  // Takes task type and returns the correct task column to update
  let streakToIncrement;
  let currentStreak;
  const newCurrentTotal = user.total_quest_streak + 1;

  if (type === "one-time") {
    currentStreak = user.one_time_quest_streak;
    streakToIncrement = {
      one_time_quest_streak: currentStreak + 1,
      total_quest_streak: newCurrentTotal,
    };
  } else if (type === "daily") {
    currentStreak = user.daily_quest_streak;
    streakToIncrement = {
      daily_quest_streak: currentStreak + 1,
      total_quest_streak: newCurrentTotal,
    };
  } else {
    currentStreak = user.weekly_quest_streak;
    streakToIncrement = {
      weekly_quest_streak: currentStreak + 1,
      total_quest_streak: newCurrentTotal,
    };
  }
  return streakToIncrement;
}

async function checkAndAwardBadge(userID, type, streakValue) {
  //
}

async function resetQuestStreak(userID, type) {
  //
}

export { incrementQuestStreak, checkAndAwardBadge, resetQuestStreak };
