import "../css/HeroSection.css";
import supabase from "../../services/supabase-client";
import { getCurrentUserData } from "../utils/getCurrentUser.js";
import { Coins, SquareCheckBig } from "lucide-react";
import { useUser } from "../context/UserContext.jsx";

export default function HeroSection() {
  const { currentUserID, currentUserData } = getCurrentUserData();
  const { userStats, profilePicture } = useUser();

  if (!userStats) {
    return <div>Welcome user! Your questing journey starts now</div>;
  }

  function userDetails(user) {
    return (
      <div className="hero-container">
        <h1>Welcome back, {user.username}!</h1>
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
            src={`/images/profile-pictures/${user.profile_picture}.png`}
            alt="Adventurer-guy-1"
            className="image-adventurer"
          />
        </div>
      </div>
    );
  }

  return userDetails(userStats);
}
