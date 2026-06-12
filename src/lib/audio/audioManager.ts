/**
 * Procedural audio engine built on the browser's audio stack.
 * Synthesizes all SFX and per-city ambient music at runtime, so the game
 * ships with zero binary audio assets and works fully offline.
 */

export type SfxName =
  | "quest-accepted"
  | "quest-completed"
  | "level-up"
  | "dialogue-advance"
  | "achievement"
  | "click"
  | "error"
  | "travel";

interface ThemeSpec {
  /** Scale degrees in semitones from the root. */
  scale: number[];
  /** Root frequency in Hz. */
  root: number;
  /** Seconds per melody note. */
  noteLength: number;
  /** Oscillator type for the lead voice. */
  voice: OscillatorType;
  /** Drone volume 0-1. */
  droneLevel: number;
}

const THEMES: Record<string, ThemeSpec> = {
  safi: { scale: [0, 3, 5, 7, 10, 12], root: 220, noteLength: 0.55, voice: "triangle", droneLevel: 0.05 },
  "el-jadida": { scale: [0, 2, 4, 7, 9, 12], root: 246.9, noteLength: 0.5, voice: "sine", droneLevel: 0.045 },
  azemmour: { scale: [0, 2, 3, 7, 8, 12], root: 196, noteLength: 0.6, voice: "triangle", droneLevel: 0.05 },
  "bir-jdid": { scale: [0, 2, 5, 7, 9, 12], root: 233.1, noteLength: 0.45, voice: "sine", droneLevel: 0.04 },
  "had-soualem": { scale: [0, 1, 4, 5, 8, 12], root: 207.7, noteLength: 0.55, voice: "triangle", droneLevel: 0.05 },
  casablanca: { scale: [0, 4, 5, 7, 11, 12], root: 261.6, noteLength: 0.4, voice: "sine", droneLevel: 0.055 },
  menu: { scale: [0, 4, 7, 9, 12], root: 220, noteLength: 0.7, voice: "sine", droneLevel: 0.04 },
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private droneNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private currentTheme: string | null = null;
  private musicEnabled = true;
  private sfxEnabled = true;
  private noteStep = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.5;
      this.musicGain.connect(this.masterGain);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.8;
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    } else if (this.currentTheme) {
      const theme = this.currentTheme;
      this.currentTheme = null;
      this.playTheme(theme);
    }
  }

  setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  /** Start (or switch to) a city's ambient theme loop. */
  playTheme(themeKey: string): void {
    if (this.currentTheme === themeKey && this.musicTimer) return;
    this.currentTheme = themeKey;
    if (!this.musicEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.musicGain) return;
    this.stopMusicNodes();

    const spec = THEMES[themeKey] ?? THEMES.menu!;

    const droneOsc = ctx.createOscillator();
    droneOsc.type = "sine";
    droneOsc.frequency.value = spec.root / 2;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0;
    droneGain.gain.linearRampToValueAtTime(spec.droneLevel, ctx.currentTime + 2);
    droneOsc.connect(droneGain);
    droneGain.connect(this.musicGain);
    droneOsc.start();
    this.droneNodes.push({ osc: droneOsc, gain: droneGain });

    this.noteStep = 0;
    this.musicTimer = setInterval(() => {
      this.scheduleMelodyNote(spec);
    }, spec.noteLength * 1000);
  }

  private scheduleMelodyNote(spec: ThemeSpec): void {
    const ctx = this.ctx;
    if (!ctx || !this.musicGain || document.hidden) return;
    // Gentle generative walk over the scale; rests keep it cozy.
    this.noteStep += 1;
    if (Math.random() < 0.25) return;
    const degree = spec.scale[Math.floor(Math.random() * spec.scale.length)]!;
    const octave = this.noteStep % 8 < 4 ? 1 : 2;
    const freq = spec.root * octave * Math.pow(2, degree / 12);
    const osc = ctx.createOscillator();
    osc.type = spec.voice;
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    const dur = spec.noteLength * 1.8;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(now);
    osc.stop(now + dur + 0.1);
  }

  private stopMusicNodes(): void {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    const ctx = this.ctx;
    for (const { osc, gain } of this.droneNodes) {
      try {
        if (ctx) {
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
          osc.stop(ctx.currentTime + 0.6);
        } else {
          osc.stop();
        }
      } catch {
        // Node may already be stopped.
      }
    }
    this.droneNodes = [];
  }

  stopMusic(): void {
    this.stopMusicNodes();
  }

  play(name: SfxName): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    switch (name) {
      case "quest-accepted":
        this.tone(523.25, now, 0.12, "triangle", 0.2);
        this.tone(659.25, now + 0.12, 0.18, "triangle", 0.2);
        break;
      case "quest-completed":
        this.tone(523.25, now, 0.12, "triangle", 0.22);
        this.tone(659.25, now + 0.1, 0.12, "triangle", 0.22);
        this.tone(783.99, now + 0.2, 0.12, "triangle", 0.22);
        this.tone(1046.5, now + 0.3, 0.3, "triangle", 0.22);
        break;
      case "level-up":
        this.tone(392, now, 0.15, "square", 0.12);
        this.tone(523.25, now + 0.12, 0.15, "square", 0.12);
        this.tone(659.25, now + 0.24, 0.15, "square", 0.12);
        this.tone(783.99, now + 0.36, 0.4, "square", 0.12);
        this.tone(1567.98, now + 0.36, 0.4, "sine", 0.1);
        break;
      case "dialogue-advance":
        this.tone(880, now, 0.06, "sine", 0.12);
        break;
      case "achievement":
        this.tone(987.77, now, 0.1, "sine", 0.2);
        this.tone(1318.5, now + 0.1, 0.1, "sine", 0.2);
        this.tone(1975.5, now + 0.2, 0.35, "sine", 0.18);
        break;
      case "click":
        this.tone(660, now, 0.05, "sine", 0.1);
        break;
      case "error":
        this.tone(220, now, 0.15, "sawtooth", 0.08);
        this.tone(196, now + 0.13, 0.2, "sawtooth", 0.08);
        break;
      case "travel":
        this.tone(440, now, 0.2, "sine", 0.15);
        this.tone(554.37, now + 0.18, 0.2, "sine", 0.15);
        this.tone(659.25, now + 0.36, 0.35, "sine", 0.15);
        break;
    }
  }

  private tone(
    freq: number,
    startAt: number,
    duration: number,
    type: OscillatorType,
    volume: number,
  ): void {
    const ctx = this.ctx;
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startAt);
    gain.gain.linearRampToValueAtTime(volume, startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.05);
  }
}

/** Module-level singleton — one audio graph for the whole app. */
export const audioManager = new AudioManager();
