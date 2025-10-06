import supabase from "../../services/supabase-client";

async function awardUser(userID, task) {
  const eligibleForReward = checkIfEligibleForReward(task);
  if (!eligibleForReward) {
    return { success: false, error: "User already awarded from this task" };
  }

  let { newNrOfCoins, awardedXP } = decideAwards(task);

  await awardCoins(userID, newNrOfCoins);
  await checkForLevelUp(userID, awardedXP);
  await setHasAwardedToTrue(task.id);
  return { success: true };
}

function checkIfEligibleForReward(task) {
  // Checks if the task is expired or deleted, if they are the user should not be rewarded
  if (task.has_awarded || task.has_expired || task.is_deleted) {
    return false;
  }
  return true;
}

async function awardCoins(userID, newNrOfCoins) {
  const { data: coinData, error: coinError } = await supabase
    .from("user_stats")
    .select("coins")
    .eq("user_id", userID)
    .single();

  const { data: updatedData, error: updateError } = await supabase
    .from("user_stats")
    .update({ coins: coinData.coins + newNrOfCoins })
    .eq("user_id", userID);
}

async function setHasAwardedToTrue(taskID) {
  const { error } = await supabase.from("task").update({ has_awarded: true }).eq("id", taskID);

  if (error) {
    console.log("Error setting has_awarded: ", error);
  }
}

function decideAwards(task) {
  let newNrOfCoins;
  let awardedXP;
  if (task.type === "daily") {
    newNrOfCoins = 2;
    awardedXP = 2;
  } else if (task.type === "weekly") {
    newNrOfCoins = 4;
    awardedXP = 4;
  } else if (task.type === "one-time") {
    newNrOfCoins = 1;
    awardedXP = 1;
  }
  return { newNrOfCoins, awardedXP };
}

async function checkForLevelUp(userID, awardedXP) {
  // Checks if the level up threshhold is met, if it is, level up.
  const xpRequiredForLevel = 20;

  const { data: userData } = await supabase
    .from("user_stats")
    .select("total_xp, level, current_xp")
    .eq("user_id", userID)
    .single();

  const newTotalXP = userData.total_xp + awardedXP;
  const newCurrentXP = newTotalXP % xpRequiredForLevel;
  const newLevel = Math.floor(newTotalXP / xpRequiredForLevel) + 1;

  await supabase
    .from("user_stats")
    .update({ total_xp: newTotalXP, level: newLevel, current_xp: newCurrentXP })
    .eq("user_id", userID);
}

export { awardUser, setHasAwardedToTrue };
