import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';


export function generateDebugElements(scene, gridSize) {
    let halfGridSize = gridSize / 2;

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(gridSize);
    scene.add(axesHelper);

    // XZ Grids
    const gridXZ1 = new THREE.GridHelper(gridSize, gridSize);
    gridXZ1.position.y = -halfGridSize;
    scene.add(gridXZ1);
    const gridXZ2 = new THREE.GridHelper(gridSize, gridSize);
    gridXZ2.position.y = halfGridSize;
    scene.add(gridXZ2);

    // XY Grids
    const gridXY2 = new THREE.GridHelper(gridSize, gridSize);
    gridXY2.rotation.x = Math.PI / 2;
    gridXY2.position.z = halfGridSize;
    scene.add(gridXY2);
    const gridXY1 = new THREE.GridHelper(gridSize, gridSize);
    gridXY1.rotation.x = Math.PI / 2;
    gridXY1.position.z = -halfGridSize;
    scene.add(gridXY1);

    // YZ Grids
    const gridYZ1 = new THREE.GridHelper(gridSize, gridSize);
    gridYZ1.rotation.z = Math.PI / 2;
    gridYZ1.position.x = halfGridSize;
    scene.add(gridYZ1);
    const gridYZ2 = new THREE.GridHelper(gridSize, gridSize);
    gridYZ2.rotation.z = Math.PI / 2;
    gridYZ2.position.x = -halfGridSize;
    scene.add(gridYZ2);
}