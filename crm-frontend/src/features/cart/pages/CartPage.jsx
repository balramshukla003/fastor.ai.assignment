import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ImageWithFallback from "../../../components/ui/ImageWithFallback";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { useCart } from "../../../context/CartContext";

const currency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  return <section className="cart-page">
    <button className="back-button cart-back" onClick={() => navigate(-1)}><ArrowLeft size={19}/> <span>Continue browsing</span></button>
    <div className="cart-heading"><div><p className="eyebrow">YOUR SELECTION</p><h1>Your Cart</h1><p>{totalItems} {totalItems === 1 ? "item" : "items"} selected</p></div>{items.length > 0 && <button className="cart-clear" onClick={clearCart}>Clear cart</button>}</div>
    {items.length === 0 ? <div className="cart-empty"><div className="cart-empty-icon"><ShoppingBag size={31}/></div><h2>Your cart is empty</h2><p>Add something delicious and it will show up here.</p><Link className="small-orange-button" to="/home">Explore menu</Link></div> : <div className="cart-layout">
      <div className="cart-items">{items.map((item) => <article className="cart-item" key={item.cartKey}>
        <ImageWithFallback src={item.image} alt={item.name} className="cart-item-image"/>
        <div className="cart-item-info"><h2>{item.name}</h2><p>{item.sizeLabel}</p><strong>{currency(item.unitPrice)}</strong><div className="cart-item-controls"><div className="quantity-control"><button aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}><Minus size={15}/></button><strong>{item.quantity}</strong><button aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} disabled={item.quantity >= 20}><Plus size={15}/></button></div><button className="cart-remove" onClick={() => removeItem(item.cartKey)} aria-label={`Remove ${item.name}`}><Trash2 size={16}/> Remove</button></div></div>
        <strong className="cart-line-total">{currency(item.unitPrice * item.quantity)}</strong>
      </article>)}</div>
      <aside className="cart-summary"><h2>Order summary</h2><div><span>Items ({totalItems})</span><span>{currency(totalPrice)}</span></div><div><span>Delivery fee</span><span>Calculated later</span></div><div className="cart-summary-total"><strong>Subtotal</strong><strong>{currency(totalPrice)}</strong></div><PrimaryButton onClick={() => window.alert("Checkout is not connected yet. Your cart is saved locally for this session.")}>Continue to checkout</PrimaryButton><p className="demo-note">Demo only: checkout and order placement are not connected to the server.</p><Link to="/home" className="text-link">Add more items</Link></aside>
    </div>}
  </section>;
}
