import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleFlight } from '../src/experience/flight.js';

test('bounds and invalid input produce a finite camera state', () => {
  assert.equal(sampleFlight(-1).progress, 0);
  assert.equal(sampleFlight(2).progress, 1);
  for (const value of [NaN, Infinity, -Infinity, undefined]) {
    for (const field of Object.values(sampleFlight(value))) assert.ok(Number.isFinite(field));
  }
});
test('fast forward and reverse do not accumulate state', () => {
  const expected = sampleFlight(.42);
  for (const p of [0, .8, 1, .05, .99, .2]) sampleFlight(p);
  assert.deepEqual(sampleFlight(.42), expected);
  assert.ok(sampleFlight(1).cameraZ < 0, 'camera crosses the actual portal plane');
});
test('reduced motion has no flare or moving sand', () => {
  for (const p of [0, .25, .5, .75, 1]) {
    assert.equal(sampleFlight(p, true).flare, 0);
    assert.equal(sampleFlight(p, true).sandOpacity, 0);
    assert.equal(sampleFlight(p, true).cameraZ, 10);
  }
});
test('camera travel is continuous and monotonic', () => {
  let previous = sampleFlight(0).cameraZ;
  for (let i = 1; i <= 100; i++) {
    const s = sampleFlight(i / 100);
    assert.ok(s.cameraZ <= previous);
    assert.ok(Math.abs(s.cameraZ - previous) < .5);
    assert.ok(s.flare >= 0 && s.flare <= .3);
    previous = s.cameraZ;
  }
});
