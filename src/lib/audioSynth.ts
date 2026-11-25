export interface SynthTrack {
  id: string;
  label: string;
  mood: string;
  notes: number[];
  wave: OscillatorType;
  tempoMs: number;
}

export const SYNTH_TRACKS: SynthTrack[] = [
  {
    id: "shehnai-silk",
    label: "Ceremonial Shehnai & Tanpura",
    mood: "Indian Royal · Warm Drone",
    notes: [261.63, 293.66, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66],
    wave: "triangle",
    tempoMs: 900,
  },
  {
    id: "oud-garden",
    label: "Sacred Oud & Fountain",
    mood: "Botanical Nikaah · Serene",
    notes: [220.0, 246.94, 293.66, 329.63, 392.0, 329.63, 293.66, 246.94],
    wave: "sine",
    tempoMs: 1050,
  },
  {
    id: "amalfi-harp",
    label: "Amalfi Coastal Harp",
    mood: "Destination · Sunlit Strings",
    notes: [293.66, 369.99, 440.0, 587.33, 440.0, 369.99, 329.63, 293.66],
    wave: "sine",
    tempoMs: 780,
  },
  {
    id: "velvet-piano",
    label: "Midnight Champagne Piano",
    mood: "Couture · Soft Chords",
    notes: [261.63, 329.63, 392.0, 493.88, 392.0, 329.63, 293.66, 246.94],
    wave: "triangle",
    tempoMs: 950,
  },
];

export function parseYoutubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export class InviteAudioController {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private htmlAudio: HTMLAudioElement | null = null;
  private playing = false;

  startSynth(trackId: string) {
    this.stop();
    if (typeof window === "undefined") return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const track = SYNTH_TRACKS.find((t) => t.id === trackId) ?? SYNTH_TRACKS[0];
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 2.0);
    master.connect(ctx.destination);

    this.ctx = ctx;
    this.master = master;
    this.playing = true;

    let step = 0;
    const playNote = () => {
      if (!this.ctx || !this.master || !this.playing) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const env = this.ctx.createGain();
      osc.type = track.wave;
      osc.frequency.setValueAtTime(track.notes[step % track.notes.length], now);
      env.gain.setValueAtTime(0.001, now);
      env.gain.linearRampToValueAtTime(0.45, now + 0.18);
      env.gain.exponentialRampToValueAtTime(0.001, now + track.tempoMs / 1000);
      osc.connect(env);
      env.connect(this.master);
      osc.start(now);
      osc.stop(now + track.tempoMs / 1000 + 0.05);
      step++;
    };
    playNote();
    this.timer = window.setInterval(playNote, track.tempoMs);
  }

  startMp3(url: string) {
    this.stop();
    if (!url || typeof window === "undefined") return;
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0;
    this.htmlAudio = audio;
    this.playing = true;
    audio.play().catch(() => {
      this.playing = false;
    });
    let vol = 0;
    const ramp = window.setInterval(() => {
      if (!this.htmlAudio || !this.playing) {
        window.clearInterval(ramp);
        return;
      }
      vol = Math.min(0.7, vol + 0.05);
      this.htmlAudio.volume = vol;
      if (vol >= 0.7) window.clearInterval(ramp);
    }, 120);
  }

  stop() {
    this.playing = false;
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
      this.master = null;
    }
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio = null;
    }
  }
}
