import './style.css';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { canvas, scene } from './scene';

const gui = new dat.GUI();

const SIZES = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const CAMERA = {
  fov: 75,
  near: 0.1,
  far: 100,
  position: {
    x: 1,
    y: 1,
    z: 2,
  },
};

const FONT = {
  size: 0.5,
  height: 0.2,
  curveSegments: 7,
  bevel: {
    Enabled: true,
    Thickness: 0.03,
    Size: 0.02,
    Offset: 0,
    Segments: 5,
  },
};

const axesHelper = new THREE.AxesHelper();

const textureLoader = new THREE.TextureLoader();

const fontLoader = new FontLoader();

fontLoader.load('/fonts/helvetiker_bold.typeface.json', (font) => {
  const textGeometry = new TextGeometry('SAM', {
    font,
    size: FONT.size,
    height: FONT.height,
    curveSegments: FONT.curveSegments,
    bevelEnabled: FONT.bevel.Enabled,
    bevelThickness: FONT.bevel.Thickness,
    bevelSize: FONT.bevel.Size,
    bevelOffset: FONT.bevel.Offset,
    bevelSegments: FONT.bevel.Segments,
  });

  textGeometry.groups.shift();
  textGeometry.groups.shift();
  textGeometry.parameters.shapes.pop();

  textGeometry.computeBoundingBox();
  textGeometry.translate(
    -(textGeometry.boundingBox.max.x - FONT.bevel.Size) * 0.5,
    -(textGeometry.boundingBox.max.y - FONT.bevel.Size) * 0.5,
    -(textGeometry.boundingBox.max.z - FONT.bevel.Size) * 0.5,
  );

  console.dir(textGeometry);

  const textMaterial = new THREE.MeshNormalMaterial({
    wireframe: true,
  });
  const text = new THREE.Mesh(textGeometry, textMaterial);

  scene.add(text, axesHelper);
});

/**
 * https://github.com/nidorx/matcaps
 */

window.addEventListener('resize', () => {
  SIZES.width = window.innerWidth;
  SIZES.height = window.innerHeight;

  // Update camera
  camera.aspect = SIZES.width / SIZES.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(SIZES.width, SIZES.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera

const camera = new THREE.PerspectiveCamera(
  CAMERA.fov,
  SIZES.width / SIZES.height,
  CAMERA.near,
  CAMERA.far,
);

camera.position.x = CAMERA.position.x;
camera.position.y = CAMERA.position.y;
camera.position.z = CAMERA.position.z;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(SIZES.width, SIZES.height);
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
