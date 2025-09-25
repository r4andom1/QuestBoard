import { UserAuth } from "../context/Authentication";
import { useState, useEffect } from "react";
import supabase from "../../services/supabase-client";
import { getCurrentUserData } from "../utils/getCurrentUser.js";
import "../css/Profile.css";

function Profile() {
  const [userStats, setUserStats] = useState({});
  const { currentUserID, currentUserData } = getCurrentUserData();
  // const authContext = UserAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", currentUserID)
      .single();
    if (error) {
      console.log("Error fetching user", error);
    } else {
      setUserStats(data);
      console.log(data);
    }
  };

  function listUserStats(userStats) {
    return (
      <div className="user-stats">
        <h1>User Stats</h1>
        {/* <h2>ID: {userStats.user_id}</h2> */}
        <p>Level: {userStats.level}</p>
        <p>XP: {userStats.xp}</p>
        <p>Coins: {userStats.coins}</p>
      </div>
    );
  }

  return <div className="profile-component">{listUserStats(userStats)}</div>;
}

export default Profile;
