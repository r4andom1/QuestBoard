import "../css/Shop.css";
import { useState, useEffect } from "react";
import supabase from "../../services/supabase-client";
import { getCurrentUserData } from "../utils/getCurrentUser.js";
import { Coins } from "lucide-react";
import { useUser } from "../context/UserContext.jsx";

function Shop() {
  const { currentUserID, currentUserData } = getCurrentUserData();
  const { userStats, updateUserStats } = useUser();

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
      updateUserStats(data);
    }
  };

  const subtractCoinsFromUser = () => {
    // subtracts users coins from the database.
    // checks their current coins first so coins never reach negative values
  };

  function inventoryDisplay() {
    return (
      <div className="inventory-display">
        <h2>Check out my current inventory</h2>
        <div className="items">
          <div className="guy-avatars">
            <div className="item-and-price">
              <img
                src="/images/profile-pictures/adventurer-guy-1.png"
                alt="Adventurer-guy-1"
                className="profile-picture-option"
                // onClick={() => updateProfilePicture("adventurer-guy-1")}
              />
              <div className="item-price">
                10 <Coins size={15} />
              </div>
            </div>
            <div className="item-and-price">
              <img
                src="/images/profile-pictures/adventurer-guy-2.png"
                alt="Adventurer-guy-1"
                className="profile-picture-option"
                // onClick={() => updateProfilePicture("adventurer-guy-2")}
              />
              <div className="item-price">
                15 <Coins size={15} />
              </div>
            </div>
            <div className="item-and-price">
              <img
                src="/images/profile-pictures/adventurer-guy-3.png"
                alt="Adventurer-guy-1"
                className="profile-picture-option"
                // onClick={() => updateProfilePicture("adventurer-guy-3")}
              />
              <div className="item-price">
                20 <Coins size={15} />
              </div>
            </div>
          </div>
          <div className="girl-avatars">
            <div className="item-and-price">
              <img
                src="/images/profile-pictures/adventurer-girl-1.png"
                alt="Adventurer-girl-1"
                className="profile-picture-option"
                // onClick={() => updateProfilePicture("adventurer-girl-1")}
              />
              <div className="item-price">
                10 <Coins size={15} />
              </div>
            </div>
            <div className="item-and-price">
              <img
                src="/images/profile-pictures/adventurer-girl-2.png"
                alt="Adventurer-guy-1"
                className="profile-picture-option"
                // onClick={() => updateProfilePicture("adventurer-girl-2")}
              />
              <div className="item-price">
                15 <Coins size={15} />
              </div>
            </div>
            <div className="item-and-price">
              <img
                src="/images/profile-pictures/adventurer-girl-3.png"
                alt="Adventurer-guy-1"
                className="profile-picture-option"
                // onClick={() => updateProfilePicture("adventurer-girl-3")}
              />
              <div className="item-price">
                20 <Coins size={15} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const displayUserDetails = (user) => {
    return (
      <div className="user-details">
        <h2>{user.username}</h2>
        <div className="user-currency">
          <p>
            <Coins size={20} /> {userStats.coins}
          </p>
        </div>
      </div>
    );
  };

  const buyItem = () => {
    // should only be able to buy item if money is in the account
  };

  function displayShopKeeper() {
    return <img src="/images/shop/shopkeeper.png" alt="shopkeeper" className="shop-keeper" />;
  }

  return (
    <div className="shop-content">
      <h1 className="main-heading">Welcome to the shop, adventurer!</h1>
      {displayShopKeeper()}
      {displayUserDetails(userStats)}
      {inventoryDisplay()}
    </div>
  );
}

export default Shop;
