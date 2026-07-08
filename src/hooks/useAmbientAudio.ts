import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generative ambient background audio, built entirely on the native Web Audio
 * API (no packages, no mp3 downloads). Three detuned low-key oscillators
 * (a C–E–G triad, two octaves down) are slow-LFO'd in both level and filter
 * cutoff so nothing ever reads as a "note" or a beat, then run through a
 * short procedurally generated impulse response for a soft room tone.
 *
 * Browser autoplay policies mean an AudioContext can't produce sound before a
 * user gesture. This hook never calls `resume()` on mount — only `start()`,
 * invoked from a click handler, does that. `localStorage` remembers the
 * user's on/off *preference*, but actual playback always waits for a gesture.
 */

const STORAGE_KEY = "bgm-enabled";

// C2, E2, G2 (a major triad, two octaves below middle C) — a calm, harmonically
// static drone with no melodic movement.
const DRONE_FREQS = [65.41, 82.41, 98.0];
const OSC_TYPES: OscillatorType[] = ["sine", "sine", "triangle"];

function readStoredPreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function writeStoredPreference(enabled: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // localStorage unavailable (private mode / disabled) — ignore, in-memory
    // state still works for this session.
  }
}

/** Builds a short synthetic impulse response for a soft, subtle reverb tail. */
function createImpulseResponse(ctx: AudioContext, duration = 2.2, decay = 3.2) {
  const rate = ctx.sampleRate;
  const length = Math.max(1, Math.floor(rate * duration));
  const impulse = ctx.createBuffer(2, length, rate);
  for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      // White noise shaped by an exponential decay envelope — a diffuse,
      // unobtrusive "room" tail rather than anything metallic or splashy.
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

interface AmbientGraph {
  ctx: AudioContext;
  oscillators: OscillatorNode[];
  masterGain: GainNode;
  lfoLevel: OscillatorNode;
  lfoFilter: OscillatorNode;
}

export function useAmbientAudio() {
  const [enabled, setEnabled] = useState<boolean>(() => readStoredPreference());
  const [isPlaying, setIsPlaying] = useState(false);
  const graphRef = useRef<AmbientGraph | null>(null);

  const teardown = useCallback(() => {
    const graph = graphRef.current;
    if (!graph) return;
    const { ctx, oscillators, lfoLevel, lfoFilter } = graph;
    try {
      oscillators.forEach((osc) => osc.stop());
      lfoLevel.stop();
      lfoFilter.stop();
    } catch {
      // already stopped — safe to ignore
    }
    ctx.close().catch(() => {});
    graphRef.current = null;
    setIsPlaying(false);
  }, []);

  const buildGraph = useCallback((ctx: AudioContext) => {
    const now = ctx.currentTime;

    // Master gain: very low volume, long fade-in so the very first sound is
    // never a jump-scare click.
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.09, now + 3);

    // Slow LFO breathing the master level between roughly 0.06 and 0.12 so the
    // pad feels alive without ever swelling into "music."
    const lfoLevel = ctx.createOscillator();
    lfoLevel.frequency.value = 0.045; // ~22s cycle
    const lfoLevelGain = ctx.createGain();
    lfoLevelGain.gain.value = 0.025;
    lfoLevel.connect(lfoLevelGain);
    lfoLevelGain.connect(masterGain.gain);
    lfoLevel.start();

    // Gentle lowpass so the triangle harmonic doesn't turn buzzy, slowly
    // modulated for a slight "shimmer" that avoids a static, dead tone.
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.3;

    const lfoFilter = ctx.createOscillator();
    lfoFilter.frequency.value = 0.03; // ~33s cycle
    const lfoFilterGain = ctx.createGain();
    lfoFilterGain.gain.value = 220;
    lfoFilter.connect(lfoFilterGain);
    lfoFilterGain.connect(filter.frequency);
    lfoFilter.start();

    // Convolver for a soft, distant "room" quality — mixed in well under the
    // dry signal so it reads as space, not as an obvious effect.
    const convolver = ctx.createConvolver();
    convolver.buffer = createImpulseResponse(ctx);
    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.22;
    const dryGain = ctx.createGain();
    dryGain.gain.value = 1;

    const oscillators: OscillatorNode[] = DRONE_FREQS.map((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = OSC_TYPES[i];
      // Tiny detune per voice keeps the chord from sounding like a single
      // static tone (chorus-like beating), without any audible pitch drift.
      osc.frequency.value = freq;
      osc.detune.value = i === 2 ? 4 : i * -3;

      const voiceGain = ctx.createGain();
      // Root loudest, fifth quietest — a stable, unassuming voicing.
      voiceGain.gain.value = i === 0 ? 0.5 : i === 1 ? 0.32 : 0.22;

      osc.connect(voiceGain);
      voiceGain.connect(filter);
      osc.start();
      return osc;
    });

    filter.connect(dryGain);
    filter.connect(convolver);
    convolver.connect(wetGain);

    dryGain.connect(masterGain);
    wetGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    graphRef.current = { ctx, oscillators, masterGain, lfoLevel, lfoFilter };
  }, []);

  const start = useCallback(async () => {
    if (graphRef.current) {
      await graphRef.current.ctx.resume();
      setIsPlaying(true);
      return;
    }
    const AudioContextCtor =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextCtor();
    await ctx.resume();
    buildGraph(ctx);
    setIsPlaying(true);
  }, [buildGraph]);

  const stop = useCallback(() => {
    // Fade out briefly, then fully tear down the graph/context so nothing
    // keeps running (and no memory/CPU is held) while muted.
    const graph = graphRef.current;
    if (graph) {
      const now = graph.ctx.currentTime;
      graph.masterGain.gain.cancelScheduledValues(now);
      graph.masterGain.gain.setValueAtTime(graph.masterGain.gain.value, now);
      graph.masterGain.gain.linearRampToValueAtTime(0, now + 0.5);
      window.setTimeout(teardown, 550);
    } else {
      setIsPlaying(false);
    }
  }, [teardown]);

  const toggle = useCallback(async () => {
    const next = !enabled;
    setEnabled(next);
    writeStoredPreference(next);
    if (next) {
      await start();
    } else {
      stop();
    }
  }, [enabled, start, stop]);

  // Clean up the AudioContext on unmount (route change / hot reload) so it
  // never leaks.
  useEffect(() => {
    return () => {
      teardown();
    };
  }, [teardown]);

  return { enabled, isPlaying, toggle };
}
