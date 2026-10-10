import { useMemo, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, CheckCircle2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageWithFallback from "../../../components/ui/ImageWithFallback";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { mockMenu } from "../../../mocks/mockMenu";
import { useCart } from "../../../context/CartContext";

export default function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = mockMenu.find((item) => item.id === productId) || mockMenu[0];
  const [quantity, setQuantity] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState(product.sizes?.[0]?.id || "");
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const selectedSize = useMemo(() => product.sizes?.find((size) => size.id === selectedSizeId) || product.sizes?.[0], [product, selectedSizeId]);
  const total = (product.price + (selectedSize?.price || 0)) * quantity;

  const addToCart = () => { addItem(product, quantity, selectedSize); setAdded(true); window.setTimeout(() => setAdded(false), 2200); };

  return <div className="product-page">
    <button className="back-button product-back" onClick={() => navigate(-1)}><ArrowLeft size={20}/> <span>Back to menu</span></button>
    <div className="product-layout">
      <div className="product-photo-wrap"><ImageWithFallback src={product.image} alt={product.name} className="product-photo"/></div>
      <section className="product-details">
        <div className="product-title-row"><div><p className="eyebrow">{product.category || "POPULAR ITEM"}</p><h1>{product.name}</h1></div><strong className="product-price">₹{total.toFixed(2)}</strong></div>
        <p className="product-description">{product.description}</p>
        <div className="quantity-row"><div><h3>Quantity</h3><p>Choose how many you would like</p></div><div className="quantity-control"><button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={16}/></button><strong>{quantity}</strong><button onClick={() => setQuantity((q) => Math.min(20, q + 1))} aria-label="Increase quantity"><Plus size={16}/></button></div></div>
        <div className="portion-section"><h3>Select your portion</h3><p className="subtle-copy">Choose one option</p><div className="portion-list">{product.sizes?.map((size) => <label className={`portion-option ${selectedSizeId === size.id ? "selected" : ""}`} key={size.id}><input type="radio" name="portion" value={size.id} checked={selectedSizeId === size.id} onChange={() => setSelectedSizeId(size.id)}/><span>{size.label}</span><span className="portion-price">{size.price ? `+₹${size.price.toFixed(2)}` : "Included"}</span></label>)}</div></div>
        <div className="product-bottom"><div><span className="subtle-copy">Total</span><strong>₹{total.toFixed(2)}</strong></div><PrimaryButton onClick={addToCart}><ShoppingBag size={17}/> Add to cart</PrimaryButton></div>
        {added && <p className="success-message" role="status"><CheckCircle2 size={17}/> Added to your local demo cart.</p>}
        <p className="demo-note">Demo behavior: this adds an item to the local cart. No order or reservation is sent to the server.</p>
        <Link to="/home" className="text-link">Continue browsing</Link>
      </section>
    </div>
  </div>;
}