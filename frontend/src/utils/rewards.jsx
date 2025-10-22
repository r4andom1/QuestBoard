// Functions for calculating and setting up streaks and badges, reset logic etc
import supabase from "../../services/supabase-client.js";

async function incrementQuestStreak(user, type) {
  //
  const streakToIncrement = checkTypeForStreak(user, type);
  // console.log(streakToIncrement);
  // console.log("userID: ", user.id);

  const { error } = await supabase
    .from("user_stats")
    .update(streakToIncrement)
    .eq("id", user.id);
  if (error) {
    console.log(
      "Error updating quest streak for quest type: ",
      type,
      "With error: ",
      error
    );
  }

  const updatedUser = { ...user, ...streakToIncrement }; // to solve stale data issue
  checkAndAwardBadge(updatedUser, type);
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

function eligibleForBadge(user) {
  const totalQuestsReq = 10;
  const oneTimeReq = 5;
  const dailyReq = 5;
  const weeklyReq = 3;

  let isEligible = false;

  if (user.total_quest_streak >= totalQuestsReq) {
    isEligible = true;
  } else if (user.one_time_quest_streak >= oneTimeReq) {
    isEligible = true;
  } else if (user.daily_quest_streak >= dailyReq) {
    isEligible = true;
  } else if (user.weekly_quest_streak >= weeklyReq) {
    isEligible = true;
  }
  return isEligible;
}

async function checkAndAwardBadge(user, type) {
  //

  if (!eligibleForBadge(user)) {
    // console.log("Need higher streak to award badge");
    return;
  }

  if (checkBadgeAlreadyAwarded(user, type)) {
    // console.log("Badge already awarded for type: ", type);
  } else {
    const typeBadge = findBadgeToAward(type);
    const { data, error } = await supabase
      .from("user_stats")
      .update(typeBadge)
      .eq("id", user.id);
    if (error) {
      console.log(
        "error setting the correct badge to true based on type: ",
        type,
        " With error: ",
        error
      );
    }
  }

  if (user.total_quest_streak >= 10 && !user.total_quests_badge) {
    const { error } = await supabase
      .from("user_stats")
      .update({ total_quests_badge: true })
      .eq("id", user.id);
    if (error) {
      console.log("Error awarding total_quests_badge", error);
    } else {
      // console.log("Total quests badge already awarded");
    }
  }
}

function checkBadgeAlreadyAwarded(user, type) {
  //
  // console.log(user.one_time_quests_badge);
  // console.log(user.daily_quests_badge);
  // console.log(user.weekly_quests_badge);
  // console.log(type);

  let badgeAlreadyAwarded = false;
  if (type === "one-time" && user.one_time_quests_badge === true) {
    badgeAlreadyAwarded = true;
  } else if (type === "daily" && user.daily_quests_badge === true) {
    badgeAlreadyAwarded = true;
  } else if (type === "weekly" && user.weekly_quests_badge === true) {
    badgeAlreadyAwarded = true;
  } else if (user.total_quests_badge === true) {
    badgeAlreadyAwarded = true;
  }

  return badgeAlreadyAwarded;
}

function findBadgeToAward(type) {
  // Check that the badge isnt awarded yet first, then find the correct badge
  let badgeToAward;

  if (type === "one-time") {
    badgeToAward = { one_time_quests_badge: true };
  } else if (type === "daily") {
    badgeToAward = { daily_quests_badge: true };
  } else if (type === "weekly") {
    badgeToAward = { weekly_quests_badge: true };
  } else {
    badgeToAward = { total_quests_badge: true };
  }
  return badgeToAward;
}

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
