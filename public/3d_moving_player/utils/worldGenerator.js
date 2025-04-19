import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { markBoxHitbox, markSphereHitbox } from './hitboxHelpers.js';

export function generateElements({ shipCount, frogCount, asteroidCount, planetCount, gridSize, hitboxGrid, scene }) {
    for (let i = 0; i < asteroidCount; i++) {
        const x = rand(gridSize);
        const y = rand(gridSize);
        const z = rand(gridSize);

        const size = { w: 1, h: 1, d: 1 };
        createAsteroid(x, y, z, scene, size);
        markBoxHitbox(hitboxGrid, x, y, z, size.w, size.h, size.d, 'asteroid');
    }

    for (let i = 0; i < shipCount; i++) {
        const x = rand(gridSize);
        const y = rand(gridSize);
        const z = rand(gridSize);

        const size = { w: 10, h: 2, d: 4 };
        createShip(x, y, z, scene, size);
        markBoxHitbox(hitboxGrid, x, y, z, size.w, size.h, size.d, 'ship');
    }

    for (let i = 0; i < planetCount; i++) {
        const x = rand(gridSize);
        const y = rand(gridSize);
        const z = rand(gridSize);

        const radius = 5;
        createPlanet(x, y, z, scene, radius);
        markSphereHitbox(hitboxGrid, x, y, z, radius, 'planet');
    }

    for (let i = 0; i < frogCount; i++) {
        const x = rand(gridSize);
        const y = rand(gridSize);
        const z = rand(gridSize);

        const size = { w: 1, h: 1, d: 1 };
        createGrabbableBox(x, y, z, scene, size);
        markBoxHitbox(hitboxGrid, x, y, z, size.w, size.h, size.d, 'grabbable');
    }
}

function rand(gridSize) {
    return Math.floor(Math.random() * gridSize - gridSize / 2);
}

function createAsteroid(x, y, z, scene, { w, h, d }) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const asteroid = new THREE.Mesh(geometry, material);
    asteroid.position.set(x, y, z);
    scene.add(asteroid);
}

function createShip(x, y, z, scene, { w, h, d }) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshBasicMaterial({ color: 0x3366ff });
    const ship = new THREE.Mesh(geometry, material);
    ship.position.set(x, y, z);
    scene.add(ship);
}

function createPlanet(x, y, z, scene, radius) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00cc00 });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(x, y, z);
    scene.add(planet);
}

function createGrabbableBox(x, y, z, scene, { w, h, d }) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, z);
    scene.add(box);
}
