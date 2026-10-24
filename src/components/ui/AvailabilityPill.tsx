import { assets } from "../../data";
import { useLocale } from "../../hooks";

// Migrated to Tailwind utilities (was `.availability` in styles.css). Tokens
// (border-line, bg-jade) come from the @theme block in index.css. The optional
// `className` still passes through so callers can layer on `inline-availability`
// / `hero-profile-badge` (those rules live unlayered in styles.css and win).
// No phone-width sizing here: the fixed 278px sticky pill (room for the menu
// button) is `.header-availability` in the ≤760px block of styles.css. Setting
// it on every instance squeezed the hero badge and pushed its dot outside.
export function AvailabilityPill({ className = "" }: { className?: string }) {
  const { t } = useLocale();

  return (
    <div
      className={`flex w-fit items-center gap-3 h-14 py-2 pl-2 pr-[18px] rounded-full border border-line bg-white/[.88] shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-[14px] text-base font-normal text-ink whitespace-nowrap max-[380px]:text-sm ${className}`}
    >
      {/* Decorative: the availability text right after it carries the meaning. */}
      <img
        src={assets.avatar}
        alt=""
        className="w-10 h-10 rounded-full object-cover"
        width={320}
        height={320}
      />
      <span>{t.availability}</span>
      <i className="shrink-0 w-[7px] h-[7px] rounded-full bg-jade shadow-[0_0_12px_rgb(72_187_170/0.7)]" />
    </div>
  );
}
