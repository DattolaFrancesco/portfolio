import { useEffect, useRef } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const WAVE_THRESH = 3;
const CHAR_MULT = 3;
const ANIM_STEP = 40;
const WAVE_BUF = 5;

// ─── Core animation engine ───────────────────────────────────────────────────
export const createASCIIShift = (el, opts = {}) => {
  let origTxt = el.textContent;
  let origChars = origTxt.split("");
  let isAnim = false;
  let cursorPos = 0;
  let waves = [];
  let animId = null;
  let isHover = false;
  let origW = null;

  const cfg = {
    dur: 600,
    chars: '.,·-─~+:;=*π""┐┌┘┴┬╗╔╝╚╬╠╣╩╦║░▒▓█▄▀▌▐■!?&#$@0123456789*',
    preserveSpaces: true,
    spread: 0.3,
    ...opts,
  };

  const updateCursorPos = (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const len = origTxt.length;
    const pos = Math.round((x / rect.width) * len);
    cursorPos = Math.max(0, Math.min(pos, len - 1));
  };

  const startWave = () => {
    waves.push({ startPos: cursorPos, startTime: Date.now(), id: Math.random() });
    if (!isAnim) start();
  };

  const cleanupWaves = (t) => {
    waves = waves.filter((w) => t - w.startTime < cfg.dur);
  };

  const calcWaveEffect = (charIdx, t) => {
    let shouldAnim = false;
    let resultChar = origChars[charIdx];
    for (const w of waves) {
      const age = t - w.startTime;
      const prog = Math.min(age / cfg.dur, 1);
      const dist = Math.abs(charIdx - w.startPos);
      const maxDist = Math.max(w.startPos, origChars.length - w.startPos - 1);
      const rad = (prog * (maxDist + WAVE_BUF)) / cfg.spread;
      if (dist <= rad) {
        shouldAnim = true;
        const intens = Math.max(0, rad - dist);
        if (intens <= WAVE_THRESH && intens > 0) {
          const ci = (dist * CHAR_MULT + Math.floor(age / ANIM_STEP)) % cfg.chars.length;
          resultChar = cfg.chars[ci];
        }
      }
    }
    return { shouldAnim, char: resultChar };
  };

  const genScrambledTxt = (t) =>
    origChars
      .map((char, i) => {
        if (cfg.preserveSpaces && char === " ") return " ";
        const res = calcWaveEffect(i, t);
        return res.shouldAnim ? res.char : char;
      })
      .join("");

  const stop = () => {
    el.textContent = origTxt;
    el.classList.remove("as");
    if (origW !== null) { el.style.width = ""; origW = null; }
    isAnim = false;
  };

  const start = () => {
    if (isAnim) return;
    if (origW === null) {
      origW = el.getBoundingClientRect().width;
      el.style.width = `${origW}px`;
    }
    isAnim = true;
    el.classList.add("as");
    const animate = () => {
      const t = Date.now();
      cleanupWaves(t);
      if (waves.length === 0) { stop(); return; }
      el.textContent = genScrambledTxt(t);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
  };

  const handleEnter = (e) => { isHover = true; updateCursorPos(e); startWave(); };
  const handleMove = (e) => {
    if (!isHover) return;
    const old = cursorPos;
    updateCursorPos(e);
    if (cursorPos !== old) startWave();
  };
  const handleLeave = () => { isHover = false; };

  el.addEventListener("mouseenter", handleEnter);
  el.addEventListener("mousemove", handleMove);
  el.addEventListener("mouseleave", handleLeave);

  const destroy = () => {
    waves = [];
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (origW !== null) { el.style.width = ""; origW = null; }
    stop();
    el.removeEventListener("mouseenter", handleEnter);
    el.removeEventListener("mousemove", handleMove);
    el.removeEventListener("mouseleave", handleLeave);
  };

  return { destroy };
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * Attacca l'animazione ASCII glitch a qualsiasi elemento via ref.
 *
 * @param {object} opts - Opzioni animazione
 * @param {number} opts.dur       - Durata onda in ms (default: 600)
 * @param {string} opts.chars     - Set di caratteri glitch
 * @param {number} opts.spread    - Velocità di espansione onda (default: 0.3, più alto = più lenta)
 * @param {boolean} opts.preserveSpaces - Mantieni gli spazi (default: true)
 */
export function useASCIIShift(opts = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const instance = createASCIIShift(el, opts);
    return () => instance.destroy();
  }, []);
  return ref;
}

// ─── GlitchLink ───────────────────────────────────────────────────────────────
/**
 * Componente <a> con effetto ASCII glitch al hover.
 *
 * @example
 * <GlitchLink href="/about" ariaLabel="About page">About</GlitchLink>
 */
export function GlitchLink({ href = "#", children, ariaLabel, className = "", ...props }) {
  const ref = useASCIIShift({ dur: 1000, spread: 1 });
  return (
    <a ref={ref} href={href} aria-label={ariaLabel} className={className} {...props}>
      {children}
    </a>
  );
}

// ─── GlitchText ───────────────────────────────────────────────────────────────
/**
 * Componente generico con effetto ASCII glitch al hover.
 * Funziona su qualsiasi tag: p, h1, h2, span, div, ecc.
 *
 * @param {string} as       - Tag HTML da renderizzare (default: "p")
 * @param {object} glitchOpts - Opzioni passate a useASCIIShift
 *
 * @example
 * // Su un <p>
 * <GlitchText>Paragrafo con glitch</GlitchText>
 *
 * // Su un <h1>
 * <GlitchText as="h1" glitchOpts={{ dur: 800, spread: 0.5 }}>Titolo</GlitchText>
 *
 * // Su uno <span>
 * <GlitchText as="span" glitchOpts={{ dur: 400 }}>Inline text</GlitchText>
 */
export function GlitchText({ as: Tag = "p", children, glitchOpts = {}, className = "", ...props }) {
  const ref = useASCIIShift({ dur: 1000, spread: 1, ...glitchOpts });
  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
}
export default GlitchText;