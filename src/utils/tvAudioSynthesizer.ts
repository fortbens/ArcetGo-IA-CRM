/**
 * Web Audio API Synthesizer for TV Salão de Vendas
 * Gera efeitos sonoros realistas diretamente no navegador sem dependências externas de áudio ou arquivos MP3,
 * garantindo execução instantânea e funcionamento em Smart TVs, tablets e desktops.
 */

import { TvSoundType } from '../types/tvRanking';

let audioCtxInstance: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtxInstance) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxInstance = new AudioContextClass();
      }
    }
    if (audioCtxInstance && audioCtxInstance.state === 'suspended') {
      audioCtxInstance.resume().catch(() => {});
    }
    return audioCtxInstance;
  } catch {
    return null;
  }
}

/**
 * Toca o som selecionado pelo Gestor para comemorações, sino virtual e alertas
 */
export function playTvCustomSound(soundType: TvSoundType | string): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  switch (soundType) {
    case 'SINO_TRADICIONAL':
    case 'bell': {
      // Sino de bronze com harmônicos fundamentais e decay rico
      const fundamental = 850;
      const harmonics = [
        { freq: fundamental, gain: 0.35, decay: 2.2 },
        { freq: fundamental * 1.5, gain: 0.18, decay: 1.6 },
        { freq: fundamental * 2.05, gain: 0.12, decay: 1.1 },
        { freq: fundamental * 2.76, gain: 0.08, decay: 0.8 },
        { freq: fundamental * 3.45, gain: 0.04, decay: 0.5 }
      ];

      harmonics.forEach(h => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(h.freq, now);
        
        gain.gain.setValueAtTime(h.gain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + h.decay + 0.1);
      });
      break;
    }

    case 'BUZINA_FESTA': {
      // Efeito de Buzina de Estádio / Airhorn com repetição em staccato (Bwah-bwah-bwahhh!)
      const bursts = [
        { start: 0, dur: 0.14 },
        { start: 0.18, dur: 0.14 },
        { start: 0.36, dur: 0.55 }
      ];

      bursts.forEach(b => {
        const t = now + b.start;
        // Combinação de osciladores ligeiramente desafinados em onda dente-de-serra (sawtooth)
        [280, 282, 330, 420].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.linearRampToValueAtTime(freq * 1.03, t + b.dur);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(idx === 0 ? 0.25 : 0.15, t + 0.02);
          gain.gain.setValueAtTime(idx === 0 ? 0.25 : 0.15, t + b.dur - 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, t + b.dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + b.dur + 0.05);
        });
      });
      break;
    }

    case 'SIRENE_POLICIA': {
      // Sirene vibrante de conquista com oscilação contínua de frequência
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';

      const duration = 2.4;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(1300, now + 0.4);
      osc.frequency.linearRampToValueAtTime(600, now + 0.8);
      osc.frequency.linearRampToValueAtTime(1300, now + 1.2);
      osc.frequency.linearRampToValueAtTime(600, now + 1.6);
      osc.frequency.linearRampToValueAtTime(1300, now + 2.0);
      osc.frequency.linearRampToValueAtTime(600, now + duration);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.setValueAtTime(0.22, now + duration - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
      break;
    }

    case 'FANFARRA_TRIUNFO': {
      // Fanfarra triunfal com trompetes em acorde maior arpejado (Do, Mi, Sol, Do Maior)
      const chordNotes = [
        { time: 0, freq: 523.25, dur: 0.18 },    // C5
        { time: 0.18, freq: 659.25, dur: 0.18 }, // E5
        { time: 0.36, freq: 783.99, dur: 0.25 }, // G5
        { time: 0.65, freq: 1046.50, dur: 1.2 }  // C6 Sustenido com brilho
      ];

      chordNotes.forEach(n => {
        const t = now + n.time;
        [n.freq, n.freq * 1.005].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.2, t + 0.03);
          gain.gain.setValueAtTime(0.18, t + n.dur - 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, t + n.dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + n.dur + 0.05);
        });
      });
      break;
    }

    case 'ALERTA_FLASH': {
      // Alerta de comunicado urgente (dois beeps nítidos de alta frequência)
      [0, 0.22].forEach(startOffset => {
        const t = now + startOffset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1050, t);
        osc.frequency.exponentialRampToValueAtTime(1400, t + 0.12);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.18);
      });
      break;
    }

    case 'VITORIA_CHIME':
    case 'victory':
    default: {
      // Arpeggio de vitória clássico
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.12);
        
        gain.gain.setValueAtTime(0, now + index * 0.12);
        gain.gain.linearRampToValueAtTime(0.22, now + index * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.6);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 0.7);
      });
      break;
    }
  }
}
