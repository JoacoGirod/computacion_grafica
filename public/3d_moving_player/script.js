import { generateElements } from './utils/worldGenerator.js';
import { checkCollision } from './utils/gameLogic.js';
import { keys } from '../utils.js';
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { generateDebugElements } from './utils/debugElementsGenerator.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const GRID_SIZE = 100;

generateDebugElements(scene, GRID_SIZE);

// World state
const hitboxGrid = new Map();

generateElements({
    shipCount: 1,
    frogCount: 10,
    asteroidCount: 100,
    planetCount: 2,
    gridSize: GRID_SIZE,
    hitboxGrid: hitboxGrid,
    scene: scene
});

// PLAYER MOVEMENT
let clock = new THREE.Clock(); // Keeps track of time

camera.position.set(0, 3, 8);

window.addEventListener('keydown', (event) => keys[event.code] = true);
window.addEventListener('keyup', (event) => keys[event.code] = false);

function updatePlayer(player, deltaTime) {
    const speed = 5;
    const rotationSpeed = 2;

    // ROTATION — local axes
    if (keys["KeyA"]) player.rotateY(rotationSpeed * deltaTime);       // rotate left
    if (keys["KeyD"]) player.rotateY(-rotationSpeed * deltaTime);      // rotate right
    if (keys["KeyW"]) player.rotateX(rotationSpeed * deltaTime);       // look up
    if (keys["KeyS"]) player.rotateX(-rotationSpeed * deltaTime);      // look down
    if (keys["KeyQ"]) player.rotateZ(rotationSpeed * deltaTime);       // roll left
    if (keys["KeyE"]) player.rotateZ(-rotationSpeed * deltaTime);      // roll right

    // MOVEMENT — forward in local direction
    const direction = new THREE.Vector3();
    player.getWorldDirection(direction);
    player.position.addScaledVector(direction, speed * deltaTime);

    // COLLISION
    checkCollision(player.position, hitboxGrid, GRID_SIZE);
}

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
    updatePlayer(camera, deltaTime);
    renderer.render(scene, camera);
}

animate();
