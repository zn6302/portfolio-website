import { Volume2, VolumeX } from "lucide-react";
import { useAmbientAudio } from "../../hooks";

/**
 * Fixed bottom-right toggle for the generative ambient background audio.
 * Bottom-right is free of every other fixed surface on the site (sticky
 * status pill + mobile drawer are top-anchored; the project overlay is a
 * full-screen modal), so it never collides with existing chrome.
 *
 * Default state is muted/silent — nothing plays until this button is
 * clicked (browser autoplay policy also enforces this regardless).
 */
export function AmbientAudioToggle() {
  const { enabled, isPlaying, toggle } = useAmbientAudio();

  // "enabled" persists the user's last choice (localStorage) even before a
  // gesture has actually started playback; "isPlaying" reflects whether
  // sound is truly running right now. When enabled-but-not-yet-playing
  // (e.g. right after reload, pre-gesture) the icon still shows the "on"
  // state so the button communicates intent, and the first click both
  // satisfies the gesture requirement and starts audio.
  const label = enabled ? "靜音" : "播放背景音樂";

  return (
    <button
      type="button"
      className={`ambient-audio-toggle ${enabled ? "is-on" : ""} ${isPlaying ? "is-playing" : ""}`}
      onClick={() => {
        void toggle();
      }}
      aria-label={label}
      aria-pressed={enabled}
      title={label}
    >
      <span className="ambient-audio-toggle-icon ambient-audio-toggle-icon-off">
        <VolumeX aria-hidden="true" size={20} strokeWidth={2} />
      </span>
      <span className="ambient-audio-toggle-icon ambient-audio-toggle-icon-on">
        <Volume2 aria-hidden="true" size={20} strokeWidth={2} />
      </span>
    </button>
  );
}
