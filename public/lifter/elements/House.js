import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';


export class House {
    constructor(config = {}) {
        // Model Generation
        this.scale = config.scale || new THREE.Vector3(1, 1, 1);
        this.group = new THREE.Group(); // all 3D parts here
    }

    generate() {
        this.group.clear()

        const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 200), new THREE.MeshNormalMaterial())

        this.group.add(boxMesh)

        return this.group
    }

}