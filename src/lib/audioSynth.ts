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
    id: "nadaswaram-muhurtham",
    label: "Nadaswaram Morning Raga",
    mood: "Tamil Muhurtham · Bright & Auspicious",
    notes: [293.66, 329.63, 369.99, 440.0, 493.88, 440.0, 369.99, 329.63],
    wave: "sawtooth",
    tempoMs: 640,
  },
  {
    id: "dhol-sangeet",
    label: "Dhol & Sangeet Nights",
    mood: "Punjabi Celebration · Festive Pulse",
    notes: [329.63, 329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63],
    wave: "square",
    tempoMs: 520,
  },
  {
    id: "temple-bells",
    label: "Temple Bells & Drone",
    mood: "Sacred · Slow Bell Resonance",
    notes: [523.25, 392.0, 329.63, 261.63, 329.63, 392.0, 440.0, 523.25],
    wave: "sine",
    tempoMs: 1200,
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
  {
    id: "deco-swing",
    label: "Art-Deco Swing Quartet",
    mood: "Engagement Soirée · Bold & Brassy",
    notes: [261.63, 311.13, 392.0, 466.16, 523.25, 466.16, 392.0, 311.13],
    wave: "square",
    tempoMs: 600,
  },
  {
    id: "ring-box-music",
    label: "Music-Box Proposal Waltz",
    mood: "Engagement · Delicate Music Box",
    notes: [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 440.0],
    wave: "sine",
    tempoMs: 700,
  },
  {
    id: "starry-celesta",
    label: "Starlight Celesta",
    mood: "Night Sky · Twinkling Lullaby",
    notes: [659.25, 523.25, 587.33, 783.99, 880.0, 783.99, 587.33, 523.25],
    wave: "sine",
    tempoMs: 820,
  },
  {
    id: "petal-kalimba",
    label: "Rosewater Kalimba",
    mood: "Garden Romance · Soft Plucks",
    notes: [392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0, 329.63],
    wave: "triangle",
    tempoMs: 740,
  },
  {
    id: "curtain-strings",
    label: "Curtain-Rise Strings",
    mood: "Theatrical · Slow Swell",
    notes: [196.0, 261.63, 329.63, 392.0, 493.88, 392.0, 329.63, 261.63],
    wave: "triangle",
    tempoMs: 1100,
  },
  {
    id: "passport-chime",
    label: "Departure Lounge Chimes",
    mood: "Travel · Airy Boarding Call",
    notes: [440.0, 523.25, 659.25, 523.25, 440.0, 392.0, 440.0, 523.25],
    wave: "sine",
    tempoMs: 860,
  },
  {
    id: "oud-lounge",
    label: "Marrakech Lounge Oud",
    mood: "Moorish Dusk · Warm Groove",
    notes: [246.94, 293.66, 329.63, 392.0, 329.63, 293.66, 246.94, 220.0],
    wave: "triangle",
    tempoMs: 690,
  },
];

export function getTrackLabel(trackId: string): string {
  return SYNTH_TRACKS.find((t) => t.id === trackId)?.label ?? "Wedding Overture";
}

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
