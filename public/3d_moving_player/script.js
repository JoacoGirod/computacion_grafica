import { updateCamera, keys } from '../utils.js';
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// HELPERS
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(100, 100, 100);
scene.add(gridHelper);

// COLOR
const blue = 0x194163;
const light_blue = 0x88e1ff;

// GUIDING TOWERS
const tower_geometry = new THREE.BoxGeometry(5, 50, 5);
const tower_material = new THREE.MeshBasicMaterial({ color: blue });
const tower_1 = new THREE.Mesh(tower_geometry, tower_material); tower_1.position.set(20, 0, 20); scene.add(tower_1);
const tower_2 = new THREE.Mesh(tower_geometry, tower_material); tower_2.position.set(-20, 0, 20); scene.add(tower_2);
const tower_3 = new THREE.Mesh(tower_geometry, tower_material); tower_3.position.set(20, 0, -20); scene.add(tower_3);
const tower_4 = new THREE.Mesh(tower_geometry, tower_material); tower_4.position.set(-20, 0, -20); scene.add(tower_4);

// START TOWER
const start_tower_geometry = new THREE.BoxGeometry(2.5, 10, 2.5);
const start_tower_material = new THREE.MeshBasicMaterial({ color: light_blue });
const start_tower = new THREE.Mesh(start_tower_geometry, start_tower_material); start_tower.position.set(0, 0, -5); scene.add(start_tower);

// PLAYER MOVEMENT
let clock = new THREE.Clock(); // Keeps track of time

camera.position.set(0, 3, 8);

window.addEventListener('keydown', (event) => keys[event.code] = true);
window.addEventListener('keyup', (event) => keys[event.code] = false);

function updatePlayer(player, deltaTime) {
    console.log('Executing updatePlayer()');

    const speed = 5;
    const rotationSpeed = 2;

    let direction = new THREE.Vector3();

    player.getWorldDirection(direction); // Gets the forward vector

    player.position.addScaledVector(direction, speed * deltaTime);

    // Rotate around the local X (pitch) and Y (yaw) axes using quaternions
    // Fix this scheise
    const quaternion = new THREE.Quaternion();
    if (keys["KeyA"]) {
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed * deltaTime); // Yaw (rotate left/right)
        player.quaternion.multiplyQuaternions(quaternion, player.quaternion);
    }
    if (keys["KeyD"]) {
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -rotationSpeed * deltaTime);
        player.quaternion.multiplyQuaternions(quaternion, player.quaternion);
    }
    if (keys["KeyW"]) {
        quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rotationSpeed * deltaTime); // Pitch (look up/down)
        player.quaternion.multiplyQuaternions(quaternion, player.quaternion);
    }
    if (keys["KeyS"]) {
        quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -rotationSpeed * deltaTime);
        player.quaternion.multiplyQuaternions(quaternion, player.quaternion);
    }
}

function animate() {
    requestAnimationFrame(animate); // Sets the animate function to run on the next step

    let deltaTime = clock.getDelta();
    updatePlayer(camera, deltaTime);

    renderer.render(scene, camera);
}

animate();


// DEBUGGING CAMERA

// camera.position.set(0, 3, 8);

// function animate() {
//     requestAnimationFrame(animate);
//     updateCamera(camera);
//     renderer.render(scene, camera);
// }

// animate();
