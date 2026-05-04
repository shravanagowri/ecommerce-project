import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

// Images
import kurtiImg from "./images/kurti.jpg";
import tshirtImg from "./images/tshirt.jpg";
import phoneImg from "./images/phone.jpg";
import laptopImg from "./images/laptop.jpg";
import headphoneImg from "./images/Headphone.jpg";
import shoesImg from "./images/Shoes.jpg";

function App() {
  const navigate = useNavigate();
  const products = [
    { id: 1, name: "Kurti", price: 799, image: kurtiImg, category: "clothes", options: ["S","M","L","XL"] },
    { id: 2, name: "T-Shirt", price: 499, image: tshirtImg, category: "clothes", options: ["S","M","L","XL"] },
    { id: 3, name: "Phone", price: 30000, image: phoneImg, category: "electronics", options: ["Black","Blue","Silver"] },
    { id: 4, name: "Laptop", price: 45000, image: laptopImg, category: "electronics", options: ["Gray","Black"] },
    { id: 5, name: "Headphones", price: 1999, image: headphoneImg, category: "electronics", options: ["Black","White"] },
    { id: 6, name: "Shoes", price: 1499, image: shoesImg, category: "footwear", options: [6,7,8,9,10] }
  ];

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredProducts = products.filter((p) =>
    (category === "all" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // CART
  const addToCart = (product, option, qty) => {
    const exist = cart.find(
      (item) => item.id === product.id && item.option === option
    );

    if (exist) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.option === option
            ? { ...item, qty: item.qty + qty }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, option, qty }]);
    }
  };

  const removeItem = (i) => setCart(cart.filter((_, index) => index !== i));

  const updateQty = (i, change) => {
    const updated = [...cart];
    updated[i].qty += change;
    if (updated[i].qty <= 0) updated.splice(i, 1);
    setCart(updated);
  };

  // WISHLIST
  const addToWishlist = (product) => {
    if (!wishlist.find((w) => w.id === product.id)) {
      setWishlist([...wishlist, product]);
    }
  };

  const removeWishlist = (i) => {
    setWishlist(wishlist.filter((_, index) => index !== i));
  };

  const moveToCart = (item, i) => {
    addToCart(item, item.options[0], 1);
    removeWishlist(i);
  };

  // ORDER ACTIONS
  const cancelOrder = (id) => {
    setOrders(orders.map(o =>
      o.id === id ? { ...o, status: "Cancelled" } : o
    ));
  };
  const refundOrder = (id) => {
    setOrders(orders.map(o =>
      o.id === id ? { ...o, status: "Refunded" } : o
    ));
  };

  // 🔁 REAL REPLACEMENT (creates NEW order)
  const replaceOrder = (id) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    // 1) mark old as replaced
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: "Replaced" } : o
    );

    // 2) create new order (same items)
    const newOrder = {
      ...order,
      id: Date.now(),
      status: "Placed"
    };

    // 3) add new order on top
    setOrders([newOrder, ...updated]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div style={{ padding: "20px", background: "#f5f6fa" }}>
      <h1 style={{ textAlign: "center" }}>🛒 ShopEase</h1>

      <nav style={{ textAlign: "center", marginBottom: "20px" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/wishlist">Wishlist ({wishlist.length})</Link> |{" "}
        <Link to="/orders">Orders</Link>
      </nav>

      <Routes>

        {/* HOME */}
        <Route path="/" element={
          <div>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "10px", width: "60%", display: "block", margin: "auto" }}
            />

            <div style={{ textAlign: "center", margin: "10px" }}>
              <button onClick={() => setCategory("all")}>All</button>
              <button onClick={() => setCategory("clothes")}>Clothes</button>
              <button onClick={() => setCategory("electronics")}>Electronics</button>
              <button onClick={() => setCategory("footwear")}>Footwear</button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
              gap: "20px"
            }}>
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  addToCart={addToCart}
                  addToWishlist={addToWishlist}
                />
              ))}
            </div>
          </div>
        } />

        {/* WISHLIST */}
        <Route path="/wishlist" element={
          <div>
            <h2>❤️ Wishlist</h2>
            {wishlist.length === 0 ? <p>Empty</p> :
              wishlist.map((item, i) => (
                <div key={i}>
                  {item.name}
                  <button onClick={() => moveToCart(item, i)}>Move to Cart</button>
                  <button onClick={() => removeWishlist(i)}>Remove</button>
                </div>
              ))
            }
          </div>
        } />

        {/* CHECKOUT */}
        <Route path="/checkout" element={
          <Checkout cart={cart} setCart={setCart} setOrders={setOrders} orders={orders} />
        } />

        {/* ORDERS */}
        <Route path="/orders" element={
          <Orders
            orders={orders}
            cancelOrder={cancelOrder}
            replaceOrder={replaceOrder}
            refundOrder={refundOrder}
          />
        } />

      </Routes>

      {/* CART */}
      <h2>🛒 Cart</h2>
      {cart.length === 0 ? <p>Empty</p> :
        cart.map((item, i) => (
          <div key={i}>
            {item.name} ({item.option}) ₹{item.price}
            <br />
            <button onClick={() => updateQty(i, -1)}>-</button>
            {item.qty}
            <button onClick={() => updateQty(i, 1)}>+</button>
            <br />
            <button onClick={() => removeItem(i)}>Remove</button>
          </div>
        ))
      }

      <h3>Total: ₹{total}</h3>
      <button onClick={() => navigate("/checkout")}>Checkout</button>
    </div>
  );
}

// PRODUCT CARD
function ProductCard({ product, addToCart, addToWishlist }) {
  const [option, setOption] = useState(product.options[0]);
  const [qty, setQty] = useState(1);

  return (
    <div style={{
      background: "#fff",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>
      <img src={product.image} style={{ width: "100%", height: "200px", objectFit: "cover" }} />

      <h3>{product.name}</h3>
      <p>₹{product.price}</p>

      <select onChange={(e) => setOption(e.target.value)}>
        {product.options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>

      <input type="number" value={qty} min="1" onChange={(e) => setQty(Number(e.target.value))} />

      <button onClick={() => addToCart(product, option, qty)}>Add to Cart</button>
      <button onClick={() => addToWishlist(product)}>❤️</button>
    </div>
  );
}

// CHECKOUT (AUTO ADDRESS)
function Checkout({ cart, setCart, setOrders, orders }) {
  const navigate = useNavigate();

  const [address, setAddress] = useState({ name:"", phone:"", city:"", pincode:"" });
  const [payment, setPayment] = useState("");

  const handle = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const autoDetectAddress = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();

      setAddress((prev) => ({
        ...prev,
        city: data.address.city || data.address.town || "",
        pincode: data.address.postcode || ""
      }));

      alert("Address detected ✅");
    });
  };

  const placeOrder = () => {
    if (!address.name || !address.phone || !address.city || !address.pincode) return alert("Fill address");
    if (!payment) return alert("Select payment");

    const newOrder = {
      id: Date.now(),
      items: cart,
      total,
      address,
      payment,
      status: "Placed"
    };

    setOrders([...orders, newOrder]);
    setCart([]);
    navigate("/orders");
  };

  return (
    <div>
      <h2>Checkout</h2>

      {cart.map((item, i) => (
        <div key={i}>
          {item.name} × {item.qty} = ₹{item.price * item.qty}
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <input name="name" placeholder="Name" onChange={handle} /><br />
      <input name="phone" placeholder="Phone" onChange={handle} /><br />

      <button onClick={autoDetectAddress}>📍 Auto Detect Address</button>

      <br /><br />

      <input name="city" value={address.city} placeholder="City" onChange={handle} /><br />
      <input name="pincode" value={address.pincode} placeholder="Pincode" onChange={handle} /><br />

      <select onChange={(e) => setPayment(e.target.value)}>
        <option value="">Payment</option>
        <option value="COD">Cash on Delivery</option>
        <option value="UPI">UPI</option>
      </select>

      <br /><br />

      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

// ORDERS
function Orders({ orders, cancelOrder, replaceOrder, refundOrder }) {
  if (orders.length === 0) return <h2>No Orders Yet</h2>;

  return (
    <div>
      <h2>📦 Orders</h2>

      {orders.map((o) => (
        <div key={o.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px" }}>
          <h3>Order ID: {o.id}</h3>

          {o.items.map((it, i) => (
            <div key={i}>
              {it.name} ({it.option}) - ₹{it.price} × {it.qty}
            </div>
          ))}

          <h4>Total: ₹{o.total}</h4>

          <p>{o.address?.name}</p>
          <p>{o.address?.phone}</p>
          <p>{o.address?.city} - {o.address?.pincode}</p>

          <p><b>Status:</b> {o.status}</p>

          {o.status === "Placed" && (
            <>
              <button onClick={() => cancelOrder(o.id)}>Cancel</button>
              <button onClick={() => replaceOrder(o.id)}>Replace</button>
            </>
          )}

          {o.status === "Cancelled" && (
            <button onClick={() => refundOrder(o.id)}>Refund</button>
          )}

          {o.status === "Refunded" && <p>💰 Refund Completed</p>}
          {o.status === "Replaced" && <p>🔄 Item Replaced</p>}
        </div>
      ))}
    </div>
  );
}

export default App;