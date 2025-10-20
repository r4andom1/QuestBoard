import "../css/HeroSection.css";
import supabase from "../../services/supabase-client";
import { getCurrentUserData } from "../utils/getCurrentUser.js";
import { Coins, SquareCheckBig, Trophy, Flame } from "lucide-react";
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
        <div className="info-pic-achivements">
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
          <div className="streaks-and-badges">
            <div className="streaks">
              <p className="total-quests">
                <Flame size={20} />
                Quests: {user.total_quest_streak}
              </p>
              <div className="streaks-type">
                <p>
                  <Flame size={20} />
                  One-times: {user.one_time_quest_streak}
                </p>
                <p>
                  <Flame size={20} />
                  Dailies: {user.daily_quest_streak}
                </p>
                <p>
                  <Flame size={20} />
                  Weeklies: {user.weekly_quest_streak}
                </p>
              </div>
            </div>
            <div className="badges-dashboard">
              {user.total_quests_badge && (
                <p>
                  <Trophy size={20} />
                  Quest Completer
                </p>
              )}
              {user.one_time_quests_badge && (
                <p>
                  <Trophy size={20} />
                  One-time Completer
                </p>
              )}
              {user.daily_quests_badge && (
                <p>
                  <Trophy size={20} />
                  Daily Completer
                </p>
              )}
              {user.weekly_quests_badge && (
                <p>
                  <Trophy size={20} />
                  Weekly Completer
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return userDetails(userStats);
}
