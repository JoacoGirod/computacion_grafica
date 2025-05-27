import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { updateCamera, keys } from '../utils.js';
import { generateHelpers } from './utils/helpers/generate.js';
import { SceneConfig } from './config.js';
import { generateVehicle } from './utils/vehicle/generate.js';

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



generateHelpers(scene, SceneConfig.GRID_SIZE);
generateVehicle(scene, SceneConfig.VEHICLE_UNIT_SCALE)







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