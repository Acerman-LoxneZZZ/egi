import * as THREE from 'three';
import { dustVertex, dustFragment } from './shaders.js';

export function createParticles({ scene, count = 360, reducedMotion = false }) {
  const plans = [];
  let seed = 9384;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (const [z, size, proportion, alpha] of [[-2, 6, .12, .17], [-8, 3, .33, .3], [-22, 2, .55, .28]]) {
    const amount = Math.ceil(count * proportion);
    const positions = new Float32Array(amount * 3), seeds = new Float32Array(amount);
    for (let i = 0; i < amount; i++) {
      positions.set([(random() - .5) * 36, (random() - .5) * 15, z + (random() - .5) * 2], i * 3);
      seeds[i] = random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const material = new THREE.ShaderMaterial({ vertexShader: dustVertex, fragmentShader: dustFragment,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uSize: { value: size }, uDpr: { value: 1 } },
      transparent: true, depthWrite: false, depthTest: false, blending: THREE.NormalBlending });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false; points.renderOrder = 10; scene.add(points);
    plans.push({ points, material, geometry, alpha });
  }
  return {
    update(time, _delta, opacity, dpr = 1) {
      for (const plan of plans) {
        plan.material.uniforms.uTime.value = reducedMotion ? 0 : time;
        plan.material.uniforms.uOpacity.value = reducedMotion ? 0 : opacity * plan.alpha;
        plan.material.uniforms.uDpr.value = dpr;
      }
    },
    dispose() { for (const p of plans) { scene.remove(p.points); p.geometry.dispose(); p.material.dispose(); } },
  };
}
