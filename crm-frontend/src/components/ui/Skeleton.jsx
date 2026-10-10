export function Skeleton({ className = "" }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}
export function FoodCardSkeleton() {
  return <div className="food-card"><Skeleton className="h-32 w-full rounded-xl" /><Skeleton className="mt-3 h-4 w-3/4" /><Skeleton className="mt-2 h-3 w-1/2" /></div>;
}
export function ListSkeleton() {
  return <div className="space-y-4">{[1,2,3].map((key) => <div key={key} className="flex gap-3 rounded-2xl border border-stone-100 p-3"><Skeleton className="h-20 w-20 shrink-0 rounded-xl" /><div className="flex-1 pt-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="mt-3 h-3 w-full" /><Skeleton className="mt-3 h-4 w-1/4" /></div></div>)}</div>;
}