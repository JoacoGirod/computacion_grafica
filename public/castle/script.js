// script.js
import { mergeGeometries, updateCamera, keys } from '../utils.js';
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Capture key press for camera movement
window.addEventListener('keydown', (event) => keys[event.code] = true);
window.addEventListener('keyup', (event) => keys[event.code] = false);

// ------------ SCENE BUILDING
// Colors
const blue = 0x194163;
const light_blue = 0x88e1ff;
const gray = 0x9c8b71;
const brown = 0x6d3409;
const dark_brown = 0x3c2503;
const green = 0x1c5020;
const light_green = 0x448510;
const sky = 0xa8bbe6;

// Castle Base
const base_geometry = new THREE.BoxGeometry(4.5, 1.5, 4.5);
const base_material = new THREE.MeshBasicMaterial({ color: gray });
const base_cube = new THREE.Mesh(base_geometry, base_material);
base_cube.position.set(0, 0.75, 0);
scene.add(base_cube);

// Towers (Merge Version)
// const cone_geometry = new THREE.ConeGeometry(1, 2);
// const column_geometry = new THREE.CylinderGeometry(0.75, 0.75, 2.25);
// cone_geometry.translate(0, 3, 0);
// column_geometry.translate(0, 1.125, 0);
// const tower_geometry = mergeGeometries([cone_geometry, column_geometry]);
// const tower_material = new THREE.MeshBasicMaterial({ color: blue });

// const tower_1 = new THREE.Mesh(tower_geometry, tower_material); tower_1.position.set(2.25, 0, 2.25); scene.add(tower_1);
// const tower_2 = new THREE.Mesh(tower_geometry, tower_material); tower_2.position.set(-2.25, 0, 2.25); scene.add(tower_2);
// const tower_3 = new THREE.Mesh(tower_geometry, tower_material); tower_3.position.set(2.25, 0, -2.25); scene.add(tower_3);
// const tower_4 = new THREE.Mesh(tower_geometry, tower_material); tower_4.position.set(-2.25, 0, -2.25); scene.add(tower_4);

// Towers (None-Merge Version)
const cone_geometry = new THREE.ConeGeometry(1, 2);
const cone_material = new THREE.MeshBasicMaterial({ color: blue });
const cone_1 = new THREE.Mesh(cone_geometry, cone_material); cone_1.position.set(-2.25, 3, -2.25); scene.add(cone_1);
const cone_2 = new THREE.Mesh(cone_geometry, cone_material); cone_2.position.set(-2.25, 3, 2.25); scene.add(cone_2);
const cone_3 = new THREE.Mesh(cone_geometry, cone_material); cone_3.position.set(2.25, 3, -2.25); scene.add(cone_3);
const cone_4 = new THREE.Mesh(cone_geometry, cone_material); cone_4.position.set(2.25, 3, 2.25); scene.add(cone_4);
const column_geometry = new THREE.CylinderGeometry(0.75, 0.75, 2.25);
const column_material = new THREE.MeshBasicMaterial({ color: gray });
const column_1 = new THREE.Mesh(column_geometry, column_material); column_1.position.set(-2.25, 1.125, -2.25); scene.add(column_1);
const column_2 = new THREE.Mesh(column_geometry, column_material); column_2.position.set(-2.25, 1.125, 2.25); scene.add(column_2);
const column_3 = new THREE.Mesh(column_geometry, column_material); column_3.position.set(2.25, 1.125, -2.25); scene.add(column_3);
const column_4 = new THREE.Mesh(column_geometry, column_material); column_4.position.set(2.25, 1.125, 2.25); scene.add(column_4);

// Door
const door_geometry = new THREE.PlaneGeometry(0.75, 1.125);
const door_material = new THREE.MeshBasicMaterial({ color: brown });
const door = new THREE.Mesh(door_geometry, door_material); door.position.set(0, 1.125 / 2, 2.25); scene.add(door);

// Floor
const floor_geometry = new THREE.PlaneGeometry(30, 30);
const floor_material = new THREE.MeshBasicMaterial({ color: green });
const floor = new THREE.Mesh(floor_geometry, floor_material); floor.rotation.x = 3 * Math.PI / 2; scene.add(floor);

// Pond
const pond_1_geometry = new THREE.CircleGeometry(1.5);
const pond_1_material = new THREE.MeshBasicMaterial({ color: light_blue });
const pond_1 = new THREE.Mesh(pond_1_geometry, pond_1_material); pond_1.position.set(0, 0, 7); pond_1.rotation.x = 3 * Math.PI / 2; scene.add(pond_1);
const pond_2_geometry = new THREE.CircleGeometry(1.75);
const pond_2_material = new THREE.MeshBasicMaterial({ color: light_blue });
const pond_2 = new THREE.Mesh(pond_2_geometry, pond_2_material); pond_2.position.set(0.5, 0, 9); pond_2.rotation.x = 3 * Math.PI / 2; scene.add(pond_2);

// Tree Trunk
const trunk_geometry = new THREE.CylinderGeometry(0.10, 0.15, 1.5);
const trunk_material = new THREE.MeshBasicMaterial({ color: dark_brown });
const trunk = new THREE.Mesh(trunk_geometry, trunk_material); trunk.position.set(-4, 0.75, 6); scene.add(trunk)

// Tree Leaves
const leaves_geometry = new THREE.SphereGeometry(1.25);
const leaves_material = new THREE.MeshBasicMaterial({ color: light_green });
const leaves_1 = new THREE.Mesh(leaves_geometry, leaves_material); leaves_1.position.set(-4.25, 2.5, 6.25); scene.add(leaves_1)
const leaves_2 = new THREE.Mesh(leaves_geometry, leaves_material); leaves_2.position.set(-4, 3, 6); scene.add(leaves_2)
const leaves_3 = new THREE.Mesh(leaves_geometry, leaves_material); leaves_3.position.set(-4, 2.5, 5.75); scene.add(leaves_3)

// Sky
scene.background = new THREE.Color(sky); // Light blue color (Sky blue)

// -----------------------

// Set initial camera position
camera.position.set(0, 3, 8);

function animate() {
    requestAnimationFrame(animate);
    updateCamera(camera);
    renderer.render(scene, camera);
}

animate();
