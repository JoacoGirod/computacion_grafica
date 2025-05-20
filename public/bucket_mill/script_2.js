import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { updateCamera, keys } from '../utils.js';

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

// GAMEPLAN
// Create Box and Bar Group (G1)
// Create Circular Prism Group (G2)
// Add G1 to G2
// Create Long Bar Group (G3)
// Add G2 to G3
// G3 rotates with w
// G1 rotates with -w

const normal_material = new THREE.MeshNormalMaterial();

// Hanging BoxBar Elements
const box_geometry = new THREE.BoxGeometry(2, 1, 2);
const box = new THREE.Mesh(box_geometry, normal_material);
box.position.y = -2.5

const bar_geometry = new THREE.BoxGeometry(1, 2, 1);
const bar = new THREE.Mesh(bar_geometry, normal_material);
bar.postition.y = -1.5

// Hanging BoxBar Composition
const box_bar_group = new THREE.Group();
box_bar_group.add(box)
box_bar_group.add(bar)

// Arm Sphere
const sphere_geometry = new THREE.SphereGeometry(1.5);
const sphere = new THREE.Mesh(sphere_geometry, normal_material);

// Arm Sphere Composition
box_bar_group.position.y = -1.5 // THIS IS THE PROBLEM
const arm_sphere_group = new THREE.Group()
arm_sphere_group.add(sphere)
arm_sphere_group.add(box_bar_group)

scene.add(arm_sphere_group)




// Arm
const long_bar_geometry = new THREE.BoxGeometry(1, 6, 1)
const long_bar = new THREE.Mesh(long_bar_geometry, normal_material)




// Camera position
camera.position.z = 5;

// Camera
window.addEventListener('keydown', (event) => keys[event.code] = true);
window.addEventListener('keyup', (event) => keys[event.code] = false);

// Set initial camera position
camera.position.set(0, 0, 5);


function animate() {
    requestAnimationFrame(animate);

    // Camera
    updateCamera(camera);

    box_bar_group.rotation.z += 0.01
    renderer.render(scene, camera);
}

animate();