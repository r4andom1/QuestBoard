/* This runs everytime a user signs up so that the user gets an inventory linked to them */
import supabase from "../../services/supabase-client";

async function createUserInventory(userID) {
  const default_items = [
    { profile_id: userID, item_id: 1 },
    { profile_id: userID, item_id: 4 },
  ];

  const { error } = await supabase.from("user_inventory").insert(default_items);
  if (error) {
    console.log("Error setting up user inventory and default items", error);
    return { success: false, error };
  }
  return { success: true };
}

export { createUserInventory };
