const clamp = (v) => Math.max(0, Math.min(1, v));
const smooth = (a, b, p) => { const t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); };

/** Absolute scroll state: reversing scroll never leaves a running camera tween. */
export function sampleFlight(value = 0, reducedMotion = false) {
  const progress = Number.isFinite(value) ? clamp(value) : 0;
  if (reducedMotion) return { progress, cameraZ: 10, portalOpacity: 1, copyOpacity: 1, flare: 0, backgroundBlur: 0, sandOpacity: 0 };
  return {
    progress,
    cameraZ: 10 - 16 * smooth(0, 1, progress),
    portalOpacity: 1 - smooth(.63, .84, progress),
    copyOpacity: 1 - smooth(.015, .22, progress),
    flare: .26 * Math.exp(-Math.pow((progress - .56) / .09, 2)),
    backgroundBlur: 7 * smooth(.62, .98, progress),
    sandOpacity: .7 - .2 * smooth(.7, 1, progress),
  };
}
