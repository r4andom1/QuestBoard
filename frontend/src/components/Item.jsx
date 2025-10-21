// import React from "react";
// import supabase from "../../services/supabase-client";

function Item({ item, isEquipped, onEquip }) {
  const { id, name, path_name } = item;

  const handleClick = () => {
    if (onEquip) {
      onEquip(id);
    }
  };

  return (
    <div className={`item-container${isEquipped ? "-equipped" : ""}`}>
      <img
        src={`/images/profile-pictures/${path_name}`}
        alt={name}
        className="profile-picture-option"
        onClick={handleClick}
      />
      {isEquipped ? <p>Equipped</p> : ""}
    </div>
  );
}

export default Item;
