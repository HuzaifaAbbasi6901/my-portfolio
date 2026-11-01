/** Tiny WebAudio blip for micro-interactions. Off by default. */

let ctx: AudioContext | null = null;
let enabled = false;

const STORAGE_KEY = "portfolio-sound-enabled";

export function isSoundEnabled() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "1";
}

export function setSoundEnabled(value: boolean) {
  if (typeof window === "undefined") return;
  enabled = value;
  localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
}

export function initSoundFlag() {
  enabled = isSoundEnabled();
}

type SoundKind = "tick" | "click" | "success";

export function playSound(kind: SoundKind) {
  if (!enabled || typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    const freq = kind === "tick" ? 1800 : kind === "click" ? 900 : 1400;
    const dur = kind === "success" ? 0.14 : 0.05;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    if (kind === "success") {
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, now + dur);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  } catch {
    // AudioContext unavailable — stay silent.
  }
}
