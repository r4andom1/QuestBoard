import "../css/HeroSection.css";
import { useState, useEffect } from "react";
import supabase from "../../services/supabase-client";
import { getCurrentUserData } from "../utils/getCurrentUser.js";
import { Coins, SquareCheckBig } from "lucide-react";

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
    }
  };

  function userDetails(user) {
    return (
      <div className="hero-container">
        <h1>Welcome back, user!</h1>
        <div className="info-and-picture-container">
          <div className="user-stats-container">
            <p>Lv | {user.level}</p>
            <p>XP | {user.current_xp}</p>
            <p>
              <Coins size={20} /> | {user.coins}
            </p>
            <p>
              <SquareCheckBig size={20} /> | {user.quests_completed}
            </p>
          </div>
          <img
            src="/images/adventurer-guy-1.png"
            alt="Adventurer-guy-1"
            className="image-adventurer"
          />
        </div>
      </div>
    );
  }

  return userDetails(userStats);
}
