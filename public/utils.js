// utils.js
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// Merge geometries function
export function mergeGeometries(geometries) {
    const mergedGeometry = new THREE.BufferGeometry();

    const positions = [];
    const indices = [];
    let currentIndex = 0;

    geometries.forEach(geometry => {
        const positionAttribute = geometry.attributes.position;
        positions.push(...positionAttribute.array);

        const indexAttribute = geometry.index;
        if (indexAttribute) {
            for (let i = 0; i < indexAttribute.array.length; i++) {
                indices.push(indexAttribute.array[i] + currentIndex);
            }
        } else {
            for (let i = 0; i < positionAttribute.count; i++) {
                indices.push(i + currentIndex);
            }
        }

        currentIndex += positionAttribute.count;
    });

    mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    if (indices.length > 0) {
        mergedGeometry.setIndex(indices);
    }

    return mergedGeometry;
}

// Camera movement variables (can be customized)
export const movementSpeed = 0.1;
export const keys = {};

// Update camera function
export function updateCamera(camera) {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    if (keys['KeyW']) camera.position.addScaledVector(forward, movementSpeed);
    if (keys['KeyS']) camera.position.addScaledVector(forward, -movementSpeed);

    const right = new THREE.Vector3();
    camera.getWorldDirection(right);
    right.cross(camera.up);

    if (keys['KeyA']) camera.position.addScaledVector(right, -movementSpeed);
    if (keys['KeyD']) camera.position.addScaledVector(right, movementSpeed);

    if (keys['Space']) camera.position.y += movementSpeed;
    if (keys['ShiftLeft']) camera.position.y -= movementSpeed;

    if (keys['KeyQ']) camera.rotation.y += 0.02;
    if (keys['KeyE']) camera.rotation.y -= 0.02;

    if (keys['KeyZ']) camera.rotation.x += 0.02;
    if (keys['KeyC']) camera.rotation.x -= 0.02;
}
