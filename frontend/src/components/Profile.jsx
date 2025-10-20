import "../css/Profile.css";
import { useState, useEffect } from "react";
import supabase from "../../services/supabase-client";
import { getCurrentUserData } from "../utils/getCurrentUser.js";
import { Coins, SquareCheckBig, Trophy, Flame } from "lucide-react";
import { useUser } from "../context/UserContext.jsx";
import Item from "./Item.jsx";

export default function HeroSection() {
  const [itemList, setItemList] = useState([]);
  const { currentUserID, currentUserData } = getCurrentUserData();
  // const authContext = UserAuth();
  const {
    userStats,
    updateUserStats,
    profilePicture,
    updateProfilePicture,
    userStatsID,
    fetchUserData,
  } = useUser();

  // console.log(userStats.id);

  // useEffect(() => {
  //   if (currentUserID) {
  //     fetchUserData();
  //   }
  // }, [currentUserID]);

  useEffect(() => {
    if (userStats.id) {
      fetchUserItems();
    }
  }, [userStats.id]);

  async function fetchUserItems() {
    const { data, error } = await supabase
      .from("user_inventory")
      .select(`item (id, name, path_name, price)`)
      .eq("profile_id", userStats.id);

    if (error) {
      console.log("Error fetching users owned items", error);
    } else {
      // console.log(data);
      setItemList(data);
    }
  }

  const customizeCharacter = () => {
    return (
      <div className="customize-character">
        <h2>Customize your character!</h2>
        <h3>Choose a profile picture:</h3>
        <div className="character-pictures">
          {itemList
            .sort((a, b) => a.item.price - b.item.price)
            .map((item) => {
              const itemData = item.item;
              const isEquipped = profilePicture === itemData.name;

              return (
                <Item
                  key={itemData.id}
                  item={itemData}
                  isEquipped={isEquipped}
                  onEquip={() => updateProfilePicture(itemData.name)}
                />
              );
            })}
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
            src={`/images/profile-pictures/${user.profile_picture}.png`}
            alt="Adventurer-guy-1"
            className="image-adventurer"
          />
        </div>
        <div className="progression-container">
          <div className="streaks">
            <h2>Streaks</h2>
            <p>
              <Flame size={20} />
              Total Quest Streak: {user.total_quest_streak}
            </p>
            <p>
              <Flame size={20} />
              One-time Quest Streak: {user.one_time_quest_streak}
            </p>
            <p>
              <Flame size={20} />
              Daily Quest Streak: {user.daily_quest_streak}
            </p>
            <p>
              <Flame size={20} />
              Weekly Quest Streak: {user.weekly_quest_streak}
            </p>
          </div>
          <div className="quest-data">
            <h2>Quests</h2>
            <p>Quests Created: {user.quests_created}</p>{" "}
            <p>Quests Completed: {user.quests_completed}</p>
          </div>
          <div className="badges">
            <h2>Badges</h2>
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
        {customizeCharacter()}
      </div>
    );
  }

  return userDetails(userStats);
}
