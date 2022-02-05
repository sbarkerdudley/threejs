import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const $canvas = document.querySelector('canvas');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const geom = [
    1,
    80,
    80,
]
// const geom = {
//     radius: 50,
//     widthSegments: 10,
//     heightSegments: 10,
// }


const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(vertices(40000), 3))

const particlesMaterial = new THREE.PointsMaterial();

particlesMaterial.size = 0.05;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.color = new THREE.Color(0xCF9060);

/**
 * Test cube
 */
const particles = new THREE.Points(geometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  w: window.innerWidth,
  h: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.w = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.w / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.w, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const cam = {
  fov: 75,
  ratio: sizes.w / sizes.h,
  near: .1,
  far: 100,
  z: 3,
};
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    cam.fov,
    cam.ratio,
    cam.near,
    cam.far
);
camera.position.z = cam.z;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, $canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: $canvas
});

renderer.setSize(sizes.w, sizes.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.antialias = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call animate again on the next frame
  window.requestAnimationFrame(animate);
};

animate();


function vertices(count = 300) {
  const tripled = count * 3 /* represents x, y, z coordinates */

  return new Float32Array(count).fill().map((element, i) => (Math.random() - 0.2) * 10)
}