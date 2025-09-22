import supabase from "../../services/supabase-client";

async function awardCoins(userID, nrOfCoins, taskID) {
  // check if task already has awarded coins
  const alreadyAwarded = await hasAwarded(taskID);
  if (alreadyAwarded) {
    return { success: false, error: "User already awarded from this task" };
  }

  // fetch current nrOfCoins
  const { data: currentData, error: fetchError } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userID)
    .single();

  if (fetchError) {
    console.log("Error fetching coins from user_stats table: ", fetchError);
    return { success: false, error: fetchError };
  }

  // check if user exists
  if (!currentData) {
    console.log("User not found");
    return { success: false, error: "user not found" };
  }

  // then add the new coins to the current amount and update the column
  const newTotal = currentData.coins + nrOfCoins;
  const { error: updateError } = await supabase
    .from("user_stats")
    .update({ coins: newTotal })
    .eq("user_id", userID);

  if (updateError) {
    console.log("Error updating nrOfCoins to user_stats table: ", updateError);
    return { success: false, error: updateError };
  }
  await setHasAwardedToTrue(taskID);
  return { success: true };
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

export { awardCoins };
