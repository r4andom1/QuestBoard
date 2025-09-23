/* This runs everytime a user signs up, so that the auth.user table gets linked with the user_stats table */
import supabase from "../../services/supabase-client";

async function createUserProfile(userID) {
  const user_stats_data = {
    user_id: userID,
  };

  const { data, error } = await supabase.from("user_stats").insert(user_stats_data).select();

  if (error) {
    console.log("Error creating user profile: ", error);
    return { success: false, error };
  }
  return { success: true, data };
}

export { createUserProfile };
