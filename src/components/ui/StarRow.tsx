import { Star } from "lucide-react";

export function StarRow() {
  return (
    <div className="stars" aria-label="Five star rating">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={18} fill="currentColor" />
      ))}
    </div>
  );
}
