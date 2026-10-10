export default function PrimaryButton({ children, loading = false, disabled = false, className = "", ...props }) {
  return <button className={`primary-button ${className}`} disabled={disabled || loading} {...props}>{loading ? <><span className="button-spinner" /> Please wait…</> : children}</button>;
}