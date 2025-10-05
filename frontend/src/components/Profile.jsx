import "../css/Profile.css";
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

  const customizeCharacter = () => {
    return (
      <div className="customize-character">
        <h2>Customize your character!</h2>
        <h3>Choose a profile picture:</h3>
        <div className="character-pictures">
          <img
            src="/images/profile-pictures/adventurer-guy-1.png"
            alt="Adventurer-guy-1"
            className="profile-picture-option"
            onClick={() => console.log("clicked")}
          />
          {/* <img
            src="/images/profile-pictures/adventurer-guy-2.png"
            alt="Adventurer-guy-1"
            className="profile-picture-option"
          />
          <img
            src="/images/profile-pictures/adventurer-guy-3.png"
            alt="Adventurer-guy-1"
            className="profile-picture-option"
          /> */}
          <img
            src="/images/profile-pictures/adventurer-girl-1.png"
            alt="Adventurer-girl-1"
            className="profile-picture-option"
          />
          {/* <img
            src="/images/profile-pictures/adventurer-girl-2.png"
            alt="Adventurer-guy-1"
            className="profile-picture-option"
          />
          <img
            src="/images/profile-pictures/adventurer-girl-3.png"
            alt="Adventurer-guy-1"
            className="profile-picture-option"
          /> */}
        </div>
      </div>
    );
  };

  function userDetails(user) {
    return (
      <div className="user-container">
        <h1 className="main-heading">User details</h1>
        <div className="info-and-picture-container">
          <div className="user-stats-container">
            <p>Lv | {user.level}</p>
            <p>XP | {user.current_xp}/20</p>
            <p>
              <Coins size={20} /> | {user.coins}
            </p>
            <p>
              <SquareCheckBig size={20} /> | {user.quests_completed}
            </p>
          </div>
          <img
            src="/images/profile-pictures/adventurer-guy-1.png"
            alt="Adventurer-guy-1"
            className="image-adventurer"
          />
        </div>
        <div className="progression-container">
          <div className="streaks">
            <h2>Streaks</h2>
            <p>Current Login streak:</p>
            <p>Longest login streak: </p>
            <p>Quests completed for X nr of days</p>
          </div>
          <div className="quest-data">
            <h2>Quests</h2>
            <p>Quests created: {user.quests_created}</p>{" "}
            <p> quests completed: {user.quests_completed}</p>
          </div>
          <div className="badges">
            <h2>Badges</h2>
            <p>7-day streak badge</p>
            <p>Completing 10 quests</p>
            <p>Finish a weekly quest</p>
          </div>
        </div>
        {customizeCharacter()}
      </div>
    );
  }

  return userDetails(userStats);
}
