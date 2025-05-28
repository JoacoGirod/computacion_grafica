import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { updateCamera, keys } from '../utils.js';
import { SceneConfig } from './configs/BaseConfig.js';
import { TridimensionalPrinter } from './elements/TridimensionalPrinter.js';
import { Shelf } from './elements/Shelf.js';
import { generateHelpers } from './debug/Helpers.js';

// The Scene contains all the elements
const scene = new THREE.Scene();
// The camera determines the viewpoint, in this case, 75 degrees of field of view, establishes the screen dimensions using the window, define near and far ranges for Frustum
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// The renderer converts the 3D Scene into a 2D image
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
// Specify the sizes to the rendered
renderer.setSize(window.innerWidth, window.innerHeight);
// Add the canvas to the webpage
document.body.appendChild(renderer.domElement);

// Magic
generateHelpers(scene, SceneConfig.GRID_SIZE);

// TODO Take all parameters into a main config, maybe add more values, use objects?
const shelf = new Shelf(1.0, 0.2, 1.4); // default 2x8
scene.add(shelf.generate());

const impresora = new TridimensionalPrinter("barrido", "B1", Math.PI / 4, 2);
const mesh = impresora.generate();
scene.add(mesh);








// Camera
window.addEventListener('keydown', (event) => keys[event.code] = true);
window.addEventListener('keyup', (event) => keys[event.code] = false);

// Camera position
camera.position.set(
    SceneConfig.CAMERA.POSITION.x,
    SceneConfig.CAMERA.POSITION.y,
    SceneConfig.CAMERA.POSITION.z
);

function animate() {
    requestAnimationFrame(animate);
    // Camera
    updateCamera(camera);
    renderer.render(scene, camera);
}

animate();