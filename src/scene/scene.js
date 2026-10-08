import * as THREE from 'three';
import { createParticles } from './particles.js';
import { cinemaVertex, cinemaFragment } from './shaders.js';
import { sampleFlight } from '../experience/flight.js';

export async function createScene({ canvas, context, assets, reducedMotion, onFallback }) {
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: false, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52.25, 2.04, .15, 100);
  camera.position.z = 10;
  const world = new THREE.Group(); scene.add(world);
  const owned = [], textures = [];
  let disposed = false, paused = false, ambient = false, width = 1, height = 1, dpr = 1;
  let state = sampleFlight(0), slowTime = 0, renderedFrames = 0;
  const loader = new THREE.TextureLoader();
  let maps;
  try { maps = await Promise.all([assets.gateway, assets.panorama || assets.giza].map(async (url) => {
    const map = await loader.loadAsync(url); map.colorSpace = THREE.SRGBColorSpace; textures.push(map); return map;
  })); } catch (error) { textures.forEach(t => t.dispose()); renderer.dispose(); throw error; }
  const remember = (geometry, material) => { owned.push(geometry, material); return new THREE.Mesh(geometry, material); };
  const doorMaterial = new THREE.MeshBasicMaterial({ map: maps[0], transparent: true, alphaTest: .025, color: 0xffffff, side: THREE.DoubleSide });
  const door = remember(new THREE.PlaneGeometry(20, 9.808), doorMaterial); door.renderOrder = 2; world.add(door);
  const panoramaWidth = 24.3 * maps[1].image.width / maps[1].image.height;
  const horizon = remember(new THREE.PlaneGeometry(panoramaWidth, 24.3), new THREE.MeshBasicMaterial({ map: maps[1], color: 0xffffff }));
  horizon.position.set(.516, -.273, -20); world.add(horizon);
  // The texture carries the carved face; stone boxes give the threshold real depth.
  const stoneMap = maps[0].clone(); stoneMap.needsUpdate = true;
  stoneMap.repeat.set(.16, .8); stoneMap.offset.set(.015, .1); textures.push(stoneMap);
  const stoneMaterial = new THREE.MeshStandardMaterial({ map: stoneMap, color: 0x8c7359, roughness: 1 }); owned.push(stoneMaterial);
  // Keep the rear edges behind the carved frame at rest. Oversized boxes used
  // to draw a hard, dark rectangle across the photographic opening.
  for (const x of [-8.05, 8.05]) {
    const support = remember(new THREE.BoxGeometry(3.9, 9.808, 2.5), stoneMaterial);
    support.position.set(x, 0, -1.3); world.add(support);
  }
  const lintel = remember(new THREE.BoxGeometry(20, .96, 2.5), stoneMaterial); lintel.position.set(0, 5.55, -1.3); world.add(lintel);
  scene.add(new THREE.AmbientLight(0xf7d6ad, 1.7));
  const sunlight = new THREE.DirectionalLight(0xffcd7e, 2.3); sunlight.position.set(8, 5, -3); scene.add(sunlight);
  const dust = createParticles({ scene, count: window.innerWidth > 900 ? 360 : 160, reducedMotion });
  const target = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: true });
  target.depthTexture = new THREE.DepthTexture(1, 1, THREE.UnsignedShortType);
  const postScene = new THREE.Scene(), postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const postMaterial = new THREE.ShaderMaterial({ vertexShader: cinemaVertex, fragmentShader: cinemaFragment,
    uniforms: { tScene: { value: target.texture }, tDepth: { value: target.depthTexture }, uResolution: { value: new THREE.Vector2(1, 1) },
      uBlur: { value: 0 }, uFlare: { value: 0 }, uVignette: { value: 0 } }, depthWrite: false, depthTest: false });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial); postScene.add(quad);
  const lost = (event) => { event.preventDefault(); if (!disposed) onFallback('context-lost'); };
  canvas.addEventListener('webglcontextlost', lost);
  function resize(w, h, ratio) {
    width = Math.max(1, w); height = Math.max(1, h); dpr = Math.min(ratio || 1, 1.5);
    renderer.setPixelRatio(dpr); renderer.setSize(width, height, false);
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    target.setSize(size.x, size.y); postMaterial.uniforms.uResolution.value.copy(size);
    camera.aspect = width / height;
    // Maintain the comp's horizontal framing across common desktop proportions.
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(10 / camera.aspect / 10));
    // Match the HTML portal's full-width/full-height framing, including capped
    // and minimum-height viewports, before the camera starts travelling.
    world.scale.y = (20 / camera.aspect) / 9.808;
    camera.updateProjectionMatrix();
  }
  return {
    setFlight(next) { state = next; },
    setAmbient(value) { ambient = value; world.visible = !value; },
    resize,
    setPaused(value) { paused = value; },
    render(time, delta) {
      if (disposed || paused) return;
      canvas.dataset.frames = String(++renderedFrames);
      if (delta > .027 && delta < .2) slowTime += delta; else slowTime = Math.max(0, slowTime - delta * .25);
      if (slowTime > 2.5 && dpr > .85) { resize(width, height, Math.max(.85, dpr - .2)); slowTime = 0; }
      camera.position.z = ambient ? 10 : state.cameraZ;
      doorMaterial.opacity = state.portalOpacity;
      dust.update(time, delta, ambient ? .42 : state.sandOpacity, dpr);
      if (ambient) { renderer.setRenderTarget(null); renderer.render(scene, camera); return; }
      postMaterial.uniforms.uBlur.value = state.backgroundBlur;
      postMaterial.uniforms.uFlare.value = state.flare;
      renderer.setRenderTarget(target); renderer.render(scene, camera);
      renderer.setRenderTarget(null); renderer.render(postScene, postCamera);
    },
    dispose() {
      if (disposed) return; disposed = true;
      canvas.removeEventListener('webglcontextlost', lost); dust.dispose();
      for (const object of new Set(owned)) object.dispose();
      textures.forEach(t => t.dispose()); target.depthTexture.dispose(); target.dispose();
      quad.geometry.dispose(); postMaterial.dispose(); renderer.dispose();
    },
  };
}
