// Functions for calculating and setting up streaks and badges, reset logic etc
import supabase from "../../services/supabase-client.js";

async function incrementQuestStreak(user, type) {
  //
  const streakToIncrement = checkTypeForStreak(user, type);
  // console.log(streakToIncrement);
  // console.log("userID: ", user.id);

  const { error } = await supabase.from("user_stats").update(streakToIncrement).eq("id", user.id);
  if (error) {
    console.log("Error updating quest streak for quest type: ", type, "With error: ", error);
  }

  checkAndAwardBadge(user, type);
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

async function checkAndAwardBadge(user, type) {
  //
}

function findBadgeToAward(type) {}

function findStreakTypeToReset(type) {
  let streakType;
  if (type === "one-time") {
    streakType = { one_time_quest_streak: 0, total_quest_streak: 0 };
  } else if (type === "daily") {
    streakType = { daily_quest_streak: 0, total_quest_streak: 0 };
  } else {
    streakType = { weekly_quest_streak: 0, total_quest_streak: 0 };
  }
  return streakType;
}

async function resetQuestStreak(user, type) {
  //
  // console.log("Timer ran out, resetting streak");
  // console.log("type: ", type, "userStats.id", user.id);
  const streakTypeToReset = findStreakTypeToReset(type);
  const { data, error } = await supabase
    .from("user_stats")
    .update(streakTypeToReset)
    .eq("id", user.id);

  if (error) {
    console.log("Error resetting streak to 0", error);
  }
}

export { incrementQuestStreak, checkAndAwardBadge, resetQuestStreak };
