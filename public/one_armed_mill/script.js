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

const normal_material = new THREE.MeshNormalMaterial();


// Bucket
const bucket_geometry = new THREE.BoxGeometry(4, 2, 1);
const bucket = new THREE.Mesh(bucket_geometry, normal_material);
bucket.position.y = -2;
// bucket.position.y -= -2; // MY VERSION

// Bar
const bar_geometry = new THREE.BoxGeometry(1, 2, 1)
const bar = new THREE.Mesh(bar_geometry, normal_material)
// bar.position.y = -2; // MY VERSION

// Colgante Group
const colgante_group = new THREE.Group();
colgante_group.add(bucket)
colgante_group.add(bar)
colgante_group.position.x -= 2 // TAKE THE TRANSLATION TO THE CHILD

// ---------------
// Gear
const gear_geometry = new THREE.SphereGeometry(2, 8, 4);
const gear = new THREE.Mesh(gear_geometry, normal_material);

// Anclaje Group
const anclaje_group = new THREE.Group()
anclaje_group.add(colgante_group)
anclaje_group.add(gear)
anclaje_group.position.y -= 5

// ---------------
// Rama Group
const arm_geometry = new THREE.BoxGeometry(1, 6, 1)
const arm = new THREE.Mesh(arm_geometry, normal_material)

const rama_group = new THREE.Group()
rama_group.add(anclaje_group)
rama_group.add(arm)


scene.add(rama_group)




// Camera position
camera.position.z = 10;

// Camera
window.addEventListener('keydown', (event) => keys[event.code] = true);
window.addEventListener('keyup', (event) => keys[event.code] = false);

// Set initial camera position
camera.position.set(0, 0, 5);


let accum = 0.01
function animate() {
    requestAnimationFrame(animate);

    // Camera
    updateCamera(camera);
    rama_group.rotation.z += accum
    colgante_group.rotation.z -= accum

    renderer.render(scene, camera);
}

animate();