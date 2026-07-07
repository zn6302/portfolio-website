import { assets } from "../../data";

export function AvailabilityPill({ className = "" }: { className?: string }) {
  return (
    <div className={`availability ${className}`}>
      <img src={assets.avatar} alt="Portfolio creator avatar" />
      <span>Open to internship</span>
      <i />
    </div>
  );
}
