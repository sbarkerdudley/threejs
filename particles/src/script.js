import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug

const sizes = {
  w: window.innerWidth,
  h: window.innerHeight,
};

const cam = {
  fov: 35,
  ratio: sizes.w / sizes.h,
  near: 1,
  far: 40,
  x: 3,
  y: 10,
  z: -15,
};

var PARAMS = {
  qty: 20_000,
  size: 0.25,
  texture: 3,
};

var color = {
  rgbColor: {
    r: 0.2,
    g: 0.2,
    b: 0.2,
  },
};

const gui = new dat.GUI({ touchStyles: true });

gui.add(cam, 'fov', 10, 180, 10);
gui.add(cam, 'far', 10, 150, 10);
gui.add(cam, 'near', 0, 1, 0.1);
gui.add(cam, 'x', 0, 5, 0.5);
gui.add(cam, 'y', 0, 5, 0.5);
gui.add(cam, 'z', 0, 5, 0.5);
gui.add(PARAMS, 'qty', 2_000, 200_000, 20_000);
gui.add(PARAMS, 'size', 0.005, 0.9, 0.01);

gui.addColor(color, 'rgbColor');

gui.close();

// gui.onChange(({ color, rgbColor }) => {
//   particlesMaterial.color = new THREE.BufferAttribute('color', rgbColor);
// });

// Canvas
const $canvas = document.querySelector('canvas');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load(
  `/textures/particles/${PARAMS.texture}.png`,
);

const [COLORS, POINTS] = populate(PARAMS.qty);

function populate(count = 10_000) {
  /**
   * @param {number} count count * 3 => represents x, y, z coordinates
   */
  var colors = new Float32Array(count * 3);
  var points = new Float32Array(count * 3).fill().map((element, i) => {
    let seed = Math.random();
    colors[i] = seed;
    return (seed - 0.5) * 10;
  });
  return [colors, points];
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(POINTS, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(COLORS, 3));
const particlesMaterial = new THREE.PointsMaterial();

particlesMaterial.size = PARAMS.size;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.color = new THREE.Color(0xa0a0a0);

// particlesMaterial.map = particleTexture; // opaque texture loader

particlesMaterial.alphaMap = particleTexture;
particlesMaterial.transparent = true;

// particlesMaterial.blending = THREE.NormalBlending;
// particlesMaterial.blending = THREE.NoBlending;
// particlesMaterial.blending = THREE.SubtractiveBlending;
particlesMaterial.blending = THREE.AdditiveBlending;

particlesMaterial.vertexColors = true;

/**
 * @param {number} alphaTest 0 <= n <= 1  Default `0`
 * Sets the alpha value to be used when running an alpha test.
 * The material will not be rendered if the opacity is lower than this value.
 *
 * @param {boolean} depthTest Default `true`
 */

particlesMaterial.alphaTest = 0.001;

particlesMaterial.depthTest = false;

/**
 * Test cube
 */
const particles = new THREE.Points(geometry, particlesMaterial);
scene.add(particles);

particles.position.z = 0;

// particles.rotation.z = 1;
// particles.rotation.y = 1;
// particles.rotation.x = 1;

/**
 * Sizes
 */

window.addEventListener('resize', () => {
  // Update sizes
  sizes.w = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.w / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.w, sizes.height);
  // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setPixelRatio(window.devicePixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  cam.fov,
  cam.ratio,
  cam.near,
  cam.far,
);

camera.position.x = cam.x;
camera.position.y = cam.y;
camera.position.z = cam.z;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, $canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: $canvas,
});

renderer.setSize(sizes.w, sizes.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.antialias = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime() / 4;

  const wave = Math.sin(elapsedTime);

  // Update controls
  controls.update();

  //   particles.rotation.z += 0.002;
  //   particles.rotation.y += 0.002;
  //   particles.rotation.x += 0.002;

  //   particles.position.z -= elapsedTime * 0.01;
  //   camera.position.z += 0.03;

  for (var i = 0; i < PARAMS.qty; i++) {
    geometry.attributes.position.array[i * 3 + 1] = wave
  }
  particles.rotation.z = wave / 4;
  particles.rotation.y = wave / 6;
  particles.rotation.x = wave;

  // Render
  renderer.render(scene, camera);

  camera.lookAt(
    particles.position.x,
    particles.position.y,
    particles.position.z,
  );

  geometry.attributes.position.needsUpdate = true;

  // Call animate again on the next frame
  window.requestAnimationFrame(animate);
};

animate();
