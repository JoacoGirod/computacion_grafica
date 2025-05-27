
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function generateVehicle(scene, factor) {
    const normalMaterial = new THREE.MeshNormalMaterial();

    const boxGeometry = new THREE.BoxGeometry(factor * 4, factor * 2, factor * 4);
    const box = new THREE.Mesh(boxGeometry, normalMaterial)

    scene.add(box)
}