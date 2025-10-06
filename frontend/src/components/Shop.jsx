import "../css/Shop.css";

function inventoryDisplay() {
  return (
    <div className="inventory-display">
      <h2>Check out my current inventory</h2>
    </div>
  );
}

function displayShopKeeper() {
  return (
    <img
      src="/images/shop/shopkeeper.png"
      alt="shopkeeper"
      className="shop-keeper"
    />
  );
}

function Shop() {
  return (
    <div className="shop-content">
      <h1 className="main-heading">Welcome to the shop, adventurer!</h1>
      {displayShopKeeper()}
      {inventoryDisplay()}
    </div>
  );
}

export default Shop;
