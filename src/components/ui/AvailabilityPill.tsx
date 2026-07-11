import { assets } from "../../data";

// Migrated to Tailwind utilities (was `.availability` in styles.css). Tokens
// (border-line, bg-jade) come from the @theme block in index.css. The optional
// `className` still passes through so callers can layer on `inline-availability`
// / `hero-profile-badge` (those rules live unlayered in styles.css and win).
export function AvailabilityPill({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex w-fit items-center gap-3 h-14 py-2 pl-2 pr-[18px] rounded-full border border-line bg-white/[.88] shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-[14px] text-base font-normal text-ink whitespace-nowrap max-[760px]:w-[278px] max-[760px]:pr-16 max-[380px]:text-sm ${className}`}
    >
      <img
        src={assets.avatar}
        alt="Portfolio creator avatar"
        className="w-10 h-10 rounded-full object-cover"
        width={320}
        height={320}
      />
      <span>OPEN TO 2026 INTERNSHIP</span>
      <i className="shrink-0 w-[7px] h-[7px] rounded-full bg-jade shadow-[0_0_12px_rgb(72_187_170/0.7)]" />
    </div>
  );
}
