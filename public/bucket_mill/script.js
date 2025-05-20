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

// LEVEL 1
// Center Sphere
const sphere_geometry = new THREE.SphereGeometry(1.5);
const sphere = new THREE.Mesh(sphere_geometry, normal_material);

// Arms
const long_bar_geometry = new THREE.BoxGeometry(1, 6, 1)
const long_bar_1 = new THREE.Mesh(long_bar_geometry, normal_material)
long_bar_1.rotation.z = (1 / 6) * Math.PI
long_bar_1.position.x = (- 3) / 2
long_bar_1.position.y = (3 * Math.sqrt(3)) / 2
const long_bar_2 = new THREE.Mesh(long_bar_geometry, normal_material)
long_bar_2.rotation.z = (5 / 6) * Math.PI
long_bar_2.position.x = (- 3) / 2
long_bar_2.position.y = -(3 * Math.sqrt(3)) / 2
const long_bar_3 = new THREE.Mesh(long_bar_geometry, normal_material)
long_bar_3.rotation.z = (3 / 2) * Math.PI
long_bar_3.position.x = 3

// Arm Sphere
const arm_sphere_1 = new THREE.Mesh(sphere_geometry, normal_material);

const arm_sphere_1_group = new THREE.Group()
arm_sphere_1_group.add(arm_sphere_1)
arm_sphere_1_group.position.x = (- 3)
arm_sphere_1_group.position.y = (3 * Math.sqrt(3))

const arm_sphere_2 = new THREE.Mesh(sphere_geometry, normal_material);

const arm_sphere_2_group = new THREE.Group()
arm_sphere_2_group.add(arm_sphere_2)
arm_sphere_2_group.position.x = (- 3)
arm_sphere_2_group.position.y = -(3 * Math.sqrt(3))

const arm_sphere_3 = new THREE.Mesh(sphere_geometry, normal_material);

const arm_sphere_3_group = new THREE.Group()
arm_sphere_3_group.add(arm_sphere_3)
arm_sphere_3_group.position.x = 6

// Hanging BoxBar Elements
const box_geometry = new THREE.BoxGeometry(2, 1, 2);
const box = new THREE.Mesh(box_geometry, normal_material);
box.position.y = -2.5

const bar_geometry = new THREE.BoxGeometry(1, 2, 1);
const bar = new THREE.Mesh(bar_geometry, normal_material);
bar.position.y = -1.5

const box_bar_group_1 = new THREE.Group();
box_bar_group_1.add(box)
box_bar_group_1.add(bar)

const box_bar_group_2 = box_bar_group_1.clone()
const box_bar_group_3 = box_bar_group_1.clone()

arm_sphere_1_group.add(box_bar_group_1)
arm_sphere_2_group.add(box_bar_group_2)
arm_sphere_3_group.add(box_bar_group_3)

const main_group = new THREE.Group()
main_group.add(arm_sphere_1_group)
main_group.add(arm_sphere_2_group)
main_group.add(arm_sphere_3_group)
main_group.add(long_bar_1)
main_group.add(long_bar_2)
main_group.add(long_bar_3)
main_group.add(sphere)

// SCENE
scene.add(main_group)





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

    main_group.rotation.z += 0.01
    box_bar_group_1.rotation.z -= 0.01
    box_bar_group_2.rotation.z -= 0.01
    box_bar_group_3.rotation.z -= 0.01

    renderer.render(scene, camera);
}

animate();