import * as THREE from 'three';

export class ThreeHelperGenerator {
    constructor(scene, gridSize) {
        this.scene = scene;
        this.gridSize = gridSize;
        this.halfGridSize = gridSize / 2;
    }

    generate() {
        const { scene, gridSize, halfGridSize } = this;

        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0x999999,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2
        });

        // Axes
        const axesHelper = new THREE.AxesHelper(gridSize);
        axesHelper.position.y = halfGridSize;
        scene.add(axesHelper);

        // XZ Grid + Plane (bottom and top)
        const gridXZ1 = new THREE.GridHelper(gridSize, gridSize);
        gridXZ1.position.y = 0; // bottom
        scene.add(gridXZ1);

        const gridXZ2 = new THREE.GridHelper(gridSize, gridSize);
        gridXZ2.position.y = gridSize; // top
        scene.add(gridXZ2);

        const planeXZ = new THREE.Mesh(
            new THREE.PlaneGeometry(gridSize, gridSize),
            planeMaterial.clone()
        );
        planeXZ.rotation.x = -Math.PI / 2;
        planeXZ.position.y = halfGridSize; // center plane
        scene.add(planeXZ);

        // XY Grid + Plane (front and back)
        const gridXY1 = new THREE.GridHelper(gridSize, gridSize);
        gridXY1.rotation.x = Math.PI / 2;
        gridXY1.position.z = -halfGridSize;
        gridXY1.position.y = halfGridSize;
        scene.add(gridXY1);

        const gridXY2 = new THREE.GridHelper(gridSize, gridSize);
        gridXY2.rotation.x = Math.PI / 2;
        gridXY2.position.z = halfGridSize;
        gridXY2.position.y = halfGridSize;
        scene.add(gridXY2);

        const planeXY = new THREE.Mesh(
            new THREE.PlaneGeometry(gridSize, gridSize),
            planeMaterial.clone()
        );
        planeXY.position.y = halfGridSize;
        scene.add(planeXY); // XY is default orientation

        // YZ Grid + Plane (left and right)
        const gridYZ1 = new THREE.GridHelper(gridSize, gridSize);
        gridYZ1.rotation.z = Math.PI / 2;
        gridYZ1.position.x = -halfGridSize;
        gridYZ1.position.y = halfGridSize;
        scene.add(gridYZ1);

        const gridYZ2 = new THREE.GridHelper(gridSize, gridSize);
        gridYZ2.rotation.z = Math.PI / 2;
        gridYZ2.position.x = halfGridSize;
        gridYZ2.position.y = halfGridSize;
        scene.add(gridYZ2);

        const planeYZ = new THREE.Mesh(
            new THREE.PlaneGeometry(gridSize, gridSize),
            planeMaterial.clone()
        );
        planeYZ.rotation.y = Math.PI / 2;
        planeYZ.position.y = halfGridSize;
        scene.add(planeYZ);
    }
}
