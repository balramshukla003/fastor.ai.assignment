import { Home, UserRound, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export function AppShell({ children }) {
  const location = useLocation();
  const { totalItems } = useCart();
  const active = location.pathname;
  return <div className="app-frame">
    <header className="app-header">
      <Link to="/home" className="brand"><span className="brand-mark">F</span><span>fastor</span></Link>
      <nav className="desktop-nav">
        <Link className={active === "/home" ? "nav-link active" : "nav-link"} to="/home"><Home size={17}/> Discover</Link>
        <Link className={active === "/cart" ? "nav-link active" : "nav-link nav-cart"} to="/cart" aria-label={`Open cart, ${totalItems} items`}><ShoppingBag size={17}/> Cart <b>{totalItems}</b></Link>
        <Link className={active === "/profile" ? "nav-link active" : "nav-link"} to="/profile"><UserRound size={17}/> Profile</Link>
      </nav>
      <Link to="/profile" className="profile-shortcut" aria-label="View profile"><UserRound size={20}/></Link>
    </header>
    <main className="app-main">{children}</main>
    <nav className="mobile-bottom-nav">
      <Link className={active === "/home" ? "bottom-link active" : "bottom-link"} to="/home"><Home size={20}/><span>Home</span></Link>
      <Link className={active === "/cart" ? "bottom-link active" : "bottom-link"} to="/cart" aria-label={`Open cart, ${totalItems} items`}><ShoppingBag size={20}/><span>Cart ({totalItems})</span></Link>
      <Link className={active === "/profile" ? "bottom-link active" : "bottom-link"} to="/profile"><UserRound size={20}/><span>Profile</span></Link>
    </nav>
  </div>;
}