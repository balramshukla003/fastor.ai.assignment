import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, PhoneCall, WalletCards, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ImageWithFallback from "../../../components/ui/ImageWithFallback";
import { FoodCardSkeleton, ListSkeleton } from "../../../components/ui/Skeleton";
import { restaurantService } from "../../../services/restaurants/restaurantService";
import { mockMenu } from "../../../mocks/mockMenu";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantSource, setRestaurantSource] = useState("api");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const { user } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    let alive = true;
    restaurantService.getRestaurants().then((result) => {
      if (!alive) return;
      setRestaurants(result.items); setRestaurantSource(result.source);
      setSelectedRestaurant((current) => current || result.items[0]?.id || "");
    }).catch((e) => { if (alive) setError(e.message || "Unable to load restaurants."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const filteredMenu = useMemo(() => mockMenu.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const activeRestaurant = restaurants.find((item) => item.id === selectedRestaurant);
  const currency = (value) => `₹${Number(value).toFixed(2)}`;

  return <div className="home-content">
    <section className="location-row">
      <div><p className="micro-label">CURRENT LOCATION</p><button className="location-button"><MapPin size={14}/><span>{activeRestaurant?.address || "Model Town, New Delhi"}</span></button></div>
      {/* <div className="quick-actions"><button aria-label="Call support"><PhoneCall size={18}/></button><button aria-label="Wallet"><WalletCards size={18}/></button></div> */}
    </section>

    <section className="restaurant-strip">
      <div className="section-heading"><div><p className="eyebrow">GOOD FOOD, GOOD MOOD</p><h2>Choose your restaurant</h2></div></div>
      {loading ? <ListSkeleton /> : error ? <div className="inline-error"><p>{error}</p><button onClick={() => window.location.reload()}>Retry</button></div> :
        <div className="restaurant-list">{restaurants.map((restaurant) => <button key={restaurant.id} className={`restaurant-chip ${selectedRestaurant === restaurant.id ? "selected" : ""}`} onClick={() => setSelectedRestaurant(restaurant.id)}><ImageWithFallback src={restaurant.image} fallback="/assets/restaurant-fallback.svg" alt="" className="restaurant-logo"/><span>{restaurant.name}</span></button>)}</div>}
      {!loading && restaurantSource === "mock" && <p className="demo-note">Demo restaurant data is being shown because the configured endpoint returned an eligible 404 or demo mode is enabled.</p>}
    </section>

    <section className="search-row"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dishes and favourites" aria-label="Search dishes"/></section>

    <section className="best-seller-section">
      <div className="section-heading"><div><p className="eyebrow">CUSTOMER FAVOURITES</p><h2>Best Seller</h2></div><Sparkles size={19} className="orange-icon"/></div>
      <div className="best-seller-grid">{(loading ? [1,2,3,4] : filteredMenu.filter((item) => item.category === "Best Seller")).map((item, index) => loading ? <FoodCardSkeleton key={item}/> : <Link to={`/product/${item.id}`} className="best-seller-card" key={item.id}><ImageWithFallback src={item.image} alt={item.name} className="seller-image"/><span className="seller-price">{currency(item.price)}</span><span className="seller-name">{item.name}</span></Link>)}</div>
    </section>

    <section className="promo-banner">
      <div className="promo-copy"><span className="promo-kicker">A LITTLE SOMETHING EXTRA</span><h2>Experience our delicious new dish</h2><strong>30% OFF</strong><span className="promo-footnote">On selected favourites</span></div>
      <ImageWithFallback src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80" alt="Fresh pizza" className="promo-image"/>
    </section>

    <section className="popular-section">
      <div className="section-heading"><div><p className="eyebrow">MADE FOR YOUR CRAVINGS</p><h2>Popular Items</h2></div><span className="cart-count">{totalItems} in cart</span></div>
      <div className="popular-list">{loading ? <ListSkeleton/> : filteredMenu.map((item) => <article className="popular-item" key={item.id}>
        <Link to={`/product/${item.id}`} className="popular-image-wrap"><ImageWithFallback src={item.image} alt={item.name} className="popular-image"/></Link>
        <div className="popular-info"><Link to={`/product/${item.id}`}><h3>{item.name}</h3></Link><p>{item.description}</p><span className="popular-meta">Popular choice · Made fresh</span><div className="popular-actions"><Link className="small-orange-button" to={`/product/${item.id}`}>Customize</Link><span className="popular-price">{currency(item.price)}</span></div></div>
      </article>)}</div>
    </section>
  </div>;
}