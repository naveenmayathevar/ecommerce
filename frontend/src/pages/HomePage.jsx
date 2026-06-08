import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

function HomePage() {
  const [products, setProducts] = useState([]);
  const { addToWishlist, removeFromWishlist, isWishlisted } =
    useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  

  return (
  <div className="container">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 18 }}>
      <div>
        <h1 className="h1">Featured Products</h1>
        <p className="p-muted">Browse our latest items and add them to your cart.</p>
      </div>
    </div>

    <div className="grid-products">
      {products.map((p) => (
        <div key={p._id} className="card" style={{ overflow: "hidden" }}>
          <div className="product-img">
            <img src={p.image} alt={p.name} />
          </div>

          <div className="card-pad">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <span className="badge">{p.category}</span>

              <span
                style={{ fontSize: 20, cursor: "pointer", userSelect: "none" }}
                onClick={() => (isWishlisted(p._id) ? removeFromWishlist(p._id) : addToWishlist(p))}
                title="Wishlist"
              >
                {isWishlisted(p._id) ? "❤️" : "🤍"}
              </span>
            </div>

            <div style={{ marginTop: 10, fontWeight: 800 }}>{p.name}</div>
            <div style={{ marginTop: 8, fontSize: 18, fontWeight: 900, color: "var(--primary-dark)" }}>${p.price}</div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => addToCart(p._id, 1)}>
                Add to Cart
              </button>

              <Link className="btn btn-outline" style={{ flex: 1, textDecoration: "none" }} to={`/product/${p._id}`}>
                Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}

export default HomePage;
