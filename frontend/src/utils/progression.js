import supabase from "../../services/supabase-client";

async function awardUser(userID, taskID) {
  const alreadyAwarded = await hasAwarded(taskID);
  if (alreadyAwarded) {
    return { success: false, error: "User already awarded from this task" };
  }

  let { newNrOfCoins, awardedXP } = await decideAwards(taskID);

  await awardCoins(userID, newNrOfCoins);
  await checkForLevelUp(userID, awardedXP);
  await setHasAwardedToTrue(taskID);
  return { success: true };
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

async function hasAwarded(taskID) {
  const { data, error } = await supabase
    .from("task")
    .select("has_awarded")
    .eq("id", taskID)
    .single();

  if (error) {
    console.log("Error fetching has_awarded column from task table", error);
    return false;
  }
  return data.has_awarded === true;
}

async function setHasAwardedToTrue(taskID) {
  const alreadyAwarded = await hasAwarded(taskID);
  if (!alreadyAwarded) {
    const { error } = await supabase.from("task").update({ has_awarded: true }).eq("id", taskID);

    if (error) {
      console.log("Error setting has_awarded: ", error);
    }
  }
}

async function getTaskType(taskID) {
  const { data, error } = await supabase.from("task").select("type").eq("id", taskID).single();
  if (error) {
    console.log("error fetching task type", error);
  }
  return data.type;
}

async function decideAwards(taskID) {
  const taskType = await getTaskType(taskID);
  // console.log(taskType);
  let newNrOfCoins;
  let awardedXP;
  if (taskType === "daily") {
    newNrOfCoins = 2;
    awardedXP = 2;
  } else if (taskType === "weekly") {
    newNrOfCoins = 4;
    awardedXP = 4;
  } else if (taskType === "one-time") {
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

export { awardUser };
