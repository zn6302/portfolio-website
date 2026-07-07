import { Hand } from "lucide-react";

export function HiBubble({ small = false }: { small?: boolean }) {
  return (
    <div className={`hi-bubble ${small ? "small" : ""}`}>
      <Hand aria-hidden="true" size={small ? 30 : 46} strokeWidth={2.4} />
      <span>Hi</span>
    </div>
  );
}
