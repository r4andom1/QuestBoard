import "../css/HeroSection.css";
import { useState, useEffect } from "react";
import supabase from "../../services/supabase-client";
import { getCurrentUserData } from "../utils/getCurrentUser.js";
import { Coins } from "lucide-react";

export default function HeroSection() {
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
      //   console.log(data);
    }
  };

  function userDetails(user) {
    return (
      <section className="hero-section">
        <div>
          <h1>Welcome back, user!</h1>
          <p>Here is some text about the user</p>
          <p>Level {user.level}</p>
          <p>XP: {user.current_xp}</p>
          <p>
            <Coins /> {user.coins}
          </p>
          <img></img>
        </div>
      </section>
    );
  }

  return userDetails(userStats);
}
