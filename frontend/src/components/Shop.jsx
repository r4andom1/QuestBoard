import "../css/Shop.css";
import { useState, useEffect } from "react";
import supabase from "../../services/supabase-client";
import { getCurrentUserData } from "../utils/getCurrentUser.js";
import { Coins } from "lucide-react";
import { useUser } from "../context/UserContext.jsx";

function Shop() {
  const [ownedItemsList, setOwnedItemsList] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const { currentUserID, currentUserData } = getCurrentUserData();
  const { userStats, updateUserStats } = useUser();

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  useEffect(() => {
    if (userStats.id) {
      fetchOwnedItems();
    }
  }, [userStats.id]);

  useEffect(() => {
    fetchShopItems();
  }, []);

  async function fetchShopItems() {
    const { data, error } = await supabase.from("item").select("id, name, path_name, price");
    if (error) {
      console.log("Error fetching all items from item table", error);
    }
    setShopItems(data);
  }

  async function fetchOwnedItems() {
    const { data, error } = await supabase
      .from("user_inventory")
      .select(`item (id, name, path_name, price)`)
      .eq("profile_id", userStats.id);

    if (error) {
      console.log("Error fetching users owned items", error);
    } else {
      // console.log(data);
      setOwnedItemsList(data);
    }
  }

  const subtractCoinsFromUser = async (cost) => {
    // subtracts users coins from the database.
    const newCoins = userStats.coins - cost;

    const { error } = await supabase
      .from("user_stats")
      .update({ coins: newCoins })
      .eq("id", userStats.id);

    if (error) {
      console.log("error subtracting coins from user", error);
      return false;
    }
    updateUserStats({ coins: newCoins }); // immediately update and displays users coins
    return true; // the user had enough coins
  };

  const buyItem = async (item) => {
    // should only be able to buy item if money is in the account
    // cant buy item if its already in the users inventory
    if (isOwned(item.id)) {
      return;
    }
    const currentCoins = userStats.coins;
    if (currentCoins < item.price) {
      // checks their current coins first so coins never reach negative values
      alert("Not enough money to buy item!");
      return;
    }

    const coinsWasSubtracted = await subtractCoinsFromUser(item.price);
    if (coinsWasSubtracted) {
      await addItemToUser(item.id);
    }
    await fetchOwnedItems();
  };

  const addItemToUser = async (itemID) => {
    const { error } = await supabase
      .from("user_inventory")
      .insert([{ profile_id: userStats.id, item_id: itemID }]);

    if (error) {
      console.log("error inserting item into user_inventory", error);
    }
  };

  function isOwned(itemID) {
    // checks if an item from the item table is in the users inventory
    // console.log(shopItems);
    // console.log(ownedItemsList);
    return ownedItemsList.some((Items) => {
      return Items.item.id === itemID;
    });
  }

  function inventoryDisplay() {
    return (
      <div className="inventory-display">
        <h2>Check out my current inventory</h2>
        <div className="items">
          {shopItems.map((item) => {
            const owned = isOwned(item.id);
            const enoughMoney = userStats.coins >= item.price;

            return (
              <div key={item.id} className={`avatar${owned ? "-owned" : ""}`}>
                <div className="item-and-price">
                  <img
                    src={`/images/profile-pictures/${item.path_name}`}
                    alt={item.name}
                    className={`profile-picture-option${owned ? "-owned" : ""}`}
                    onClick={() => buyItem(item)}
                  />
                  {!owned ? (
                    <div className="item-price">
                      <span style={{ color: enoughMoney ? "" : "red" }}>
                        {item.price} <Coins size={17} strokeWidth={3} />
                      </span>
                    </div>
                  ) : (
                    <p className="item-owned">Owned</p>
                  )}
                </div>
              </div>
            );
          })}

          {/* <div className="guy-avatars">
            <div className="item-and-price">
              <img
                src="/images/profile-pictures/adventurer-guy-1.png"
                alt="Adventurer-guy-1"
                className="profile-picture-option"
              />
              <div className="item-price">
                0 <Coins size={15} />
              </div>
            </div>
            <div className="item-and-price">
              <img
                src="/images/profile-pictures/adventurer-guy-2.png"
                alt="Adventurer-guy-1"
                className="profile-picture-option"
                onClick={() => buyItem(userStats, 15)}
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
          </div> */}

          {/* <div className="girl-avatars">
            <div className="item-and-price">
              <img
                src="/images/profile-pictures/adventurer-girl-1.png"
                alt="Adventurer-girl-1"
                className="profile-picture-option"
              />
              <div className="item-price">
                0 <Coins size={15} />
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
          </div> */}
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
            <Coins size={25} /> {userStats.coins}
          </p>
        </div>
      </div>
    );
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
