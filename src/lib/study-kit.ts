export type Phase = "kerja" | "jeda" | "panjang";

const WORK_KEY = "sumbu-pomo-work";
export const WORK_CHOICES = [12, 25] as const;
let work = 25 * 60;
const SHORT = 5 * 60;
const LONG = 15 * 60;
const BPM = 76;
const BEAT = 60 / BPM;

const CHORDS = [
  [50, 53, 57, 60],
  [55, 59, 62, 65],
  [48, 52, 55, 59],
  [45, 48, 52, 55],
];

export type StudySnap = {
  music: boolean;
  volume: number;
  phase: Phase;
  running: boolean;
  remaining: number;
  round: number;
  workMinutes: number;
};

type Listener = (snap: StudySnap) => void;

const listeners = new Set<Listener>();

let volume = 0.45;
let music = false;
let phase: Phase = "kerja";
let running = false;
let remaining = work;
let loadedWork = false;

function loadWork() {
  if (loadedWork || typeof window === "undefined") return;
  loadedWork = true;
  try {
    const saved = Number(localStorage.getItem(WORK_KEY));
    if (WORK_CHOICES.includes(saved as (typeof WORK_CHOICES)[number])) {
      work = saved * 60;
      if (!running && phase === "kerja") remaining = work;
    }
  } catch {
    // Penyimpanan diblokir: pakai 25 menit.
  }
}

/** Panjang blok kerja: 12 menit (blok pendek) atau 25 menit (Pomodoro klasik). */
export function setWorkMinutes(minutes: number) {
  work = minutes * 60;
  try {
    localStorage.setItem(WORK_KEY, String(minutes));
  } catch {
    // Abaikan.
  }
  if (!running && phase === "kerja") remaining = work;
  emit();
}
let round = 0;
let endsAt = 0;
let tick: number | null = null;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let drumBus: GainNode | null = null;
let filter: BiquadFilterNode | null = null;
let noise: AudioBuffer | null = null;
let vinyl: AudioBufferSourceNode | null = null;
let clock: number | null = null;
let next = 0;
let step = 0;

function midi(note: number) {
  return 440 * 2 ** ((note - 69) / 12);
}

function snap(): StudySnap {
  loadWork();
  return { music, volume, phase, running, remaining: liveRemaining(), round, workMinutes: work / 60 };
}

function liveRemaining() {
  if (!running) return remaining;
  return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
}

function emit() {
  const nextSnap = snap();
  listeners.forEach((listener) => listener(nextSnap));
}

export function subscribeStudy(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function studySnapshot() {
  return snap();
}

function ensure() {
  if (ctx) return ctx;
  const audio = new AudioContext();
  ctx = audio;
  master = audio.createGain();
  master.gain.value = volume;
  musicBus = audio.createGain();
  musicBus.gain.value = 0.22;
  drumBus = audio.createGain();
  drumBus.gain.value = 0.55;
  filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 980;
  filter.Q.value = 0.6;
  const wobble = audio.createOscillator();
  const wobbleGain = audio.createGain();
  wobble.frequency.value = 0.12;
  wobbleGain.gain.value = 140;
  wobble.connect(wobbleGain).connect(filter.frequency);
  wobble.start();
  musicBus.connect(filter).connect(master);
  drumBus.connect(master);
  master.connect(audio.destination);
  const samples = audio.sampleRate * 2;
  noise = audio.createBuffer(1, samples, audio.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < samples; i += 1) data[i] = Math.random() * 2 - 1;
  return audio;
}

function tone(bus: GainNode, freq: number, at: number, dur: number, peak: number, type: OscillatorType) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), at + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(bus);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

function burst(at: number, dur: number, freq: number, peak: number, kind: BiquadFilterType) {
  if (!ctx || !noise || !drumBus) return;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const shape = ctx.createBiquadFilter();
  shape.type = kind;
  shape.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(shape).connect(gain).connect(drumBus);
  src.start(at);
  src.stop(at + dur + 0.02);
}

function kick(at: number) {
  if (!ctx || !drumBus) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, at);
  osc.frequency.exponentialRampToValueAtTime(46, at + 0.09);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.7, at + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.18);
  osc.connect(gain).connect(drumBus);
  osc.start(at);
  osc.stop(at + 0.2);
}

function schedule(at: number, index: number) {
  if (!musicBus) return;
  const bar = Math.floor(index / 8);
  const beat = index % 8;
  if (beat === 0) {
    const chord = CHORDS[bar % CHORDS.length];
    chord.forEach((note, i) => {
      tone(musicBus!, midi(note), at, BEAT * 3.6, 0.07 - i * 0.008, "triangle");
      tone(musicBus!, midi(note) * 1.004, at, BEAT * 3.6, 0.03, "sine");
    });
    tone(musicBus, midi(chord[0] - 12), at, BEAT * 0.9, 0.12, "sine");
  }
  if (beat === 4) {
    const chord = CHORDS[bar % CHORDS.length];
    tone(musicBus, midi(chord[0] - 12), at, BEAT * 0.7, 0.08, "sine");
  }
  if (beat % 4 === 0) kick(at);
  if (beat === 2 || beat === 6) burst(at, 0.12, 1600, 0.18, "bandpass");
  const swing = beat % 2 === 1 ? BEAT * 0.08 : 0;
  burst(at + swing, 0.03, 7000, beat % 2 === 0 ? 0.05 : 0.03, "highpass");
}

function pump() {
  if (!ctx || !music) return;
  while (next < ctx.currentTime + 0.35) {
    schedule(next, step);
    next += BEAT / 2;
    step += 1;
  }
}

function startVinyl() {
  if (!ctx || !noise || !master || vinyl) return;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const crackle = ctx.createBiquadFilter();
  crackle.type = "bandpass";
  crackle.frequency.value = 1800;
  const gain = ctx.createGain();
  gain.gain.value = 0.018;
  src.connect(crackle).connect(gain).connect(master);
  src.start();
  vinyl = src;
}

export function setStudyVolume(value: number) {
  volume = Math.min(1, Math.max(0, value));
  if (master) master.gain.setTargetAtTime(music ? volume : 0.0001, master.context.currentTime, 0.03);
  emit();
}

export function toggleMusic() {
  const audio = ensure();
  if (music) {
    music = false;
    if (clock) window.clearInterval(clock);
    clock = null;
    master?.gain.setTargetAtTime(0.0001, audio.currentTime, 0.05);
    window.setTimeout(() => {
      if (!music) void audio.suspend();
    }, 180);
  } else {
    music = true;
    startVinyl();
    master?.gain.setTargetAtTime(volume, audio.currentTime, 0.05);
    if (next < audio.currentTime) next = audio.currentTime + 0.06;
    if (clock) window.clearInterval(clock);
    clock = window.setInterval(pump, 90);
    void audio.resume();
  }
  emit();
}

function phaseLength(nextPhase: Phase) {
  if (nextPhase === "kerja") return work;
  if (nextPhase === "jeda") return SHORT;
  return LONG;
}

function chime() {
  const audio = ensure();
  void audio.resume();
  const bus = audio.createGain();
  bus.gain.value = 0.2;
  bus.connect(audio.destination);
  tone(bus, midi(72), audio.currentTime, 0.35, 0.2, "sine");
  tone(bus, midi(79), audio.currentTime + 0.16, 0.5, 0.16, "sine");
}

function finishPhase() {
  running = false;
  if (phase === "kerja") {
    round += 1;
    phase = round % 4 === 0 ? "panjang" : "jeda";
  } else {
    phase = "kerja";
  }
  remaining = phaseLength(phase);
  chime();
  emit();
}

function armTick() {
  if (tick) window.clearInterval(tick);
  tick = window.setInterval(() => {
    if (!running) return;
    const left = liveRemaining();
    if (left <= 0) finishPhase();
    else emit();
  }, 250);
}

export function togglePomo() {
  if (running) {
    remaining = liveRemaining();
    running = false;
    emit();
    return;
  }
  if (remaining <= 0) remaining = phaseLength(phase);
  endsAt = Date.now() + remaining * 1000;
  running = true;
  armTick();
  emit();
}

export function skipPomo() {
  running = false;
  finishPhase();
}

export function resetPomo() {
  running = false;
  phase = "kerja";
  remaining = work;
  round = 0;
  emit();
}

export function phaseLabel(value: Phase) {
  if (value === "kerja") return "Kerja";
  if (value === "jeda") return "Istirahat";
  return "Istirahat panjang";
}

export function formatClock(seconds: number) {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
