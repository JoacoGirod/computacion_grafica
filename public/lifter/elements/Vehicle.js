import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class Vehicle {
    constructor(config = {}) {
        // Model Generation
        this.scale = config.scale || new THREE.Vector3(1, 1, 1);
        this.group = new THREE.Group(); // all 3D parts here
    }

    generate() {
        this.group.clear();

        const normalMaterial = new THREE.MeshNormalMaterial()

        // Rails
        const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 10, 0.3), normalMaterial)
        const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 10, 0.3), normalMaterial)
        rail1.position.z = 1
        rail1.position.y = 5
        rail2.position.z = -1
        rail2.position.y = 5

        // Cross Rails
        const crossRail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2.4), normalMaterial)
        const crossRail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2.4), normalMaterial)
        const crossRail3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2.4), normalMaterial)
        crossRail1.position.x = 0.05
        crossRail1.position.y = 1
        crossRail2.position.x = 0.05
        crossRail2.position.y = 5
        crossRail3.position.x = 0.05
        crossRail3.position.y = 9.6

        // Plane
        const plane = new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.1, 2.75), normalMaterial)
        plane.position.x = -3.25 / 2
        plane.position.y = 3

        const railGroup = new THREE.Group()
        railGroup.add(rail1)
        railGroup.add(rail2)
        railGroup.add(crossRail1)
        railGroup.add(crossRail2)
        railGroup.add(crossRail3)
        railGroup.add(plane)
        railGroup.position.y = 0.5

        // Vehicle Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(8, 1.75, 4), normalMaterial)
        body.position.x = 4
        body.position.y = 2

        // Wheels
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.25), normalMaterial)
        wheel.rotation.x = Math.PI / 2
        const wheelDecoration = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.1), normalMaterial)
        wheelDecoration.position.z = 0.25;
        const wheel1Group = new THREE.Group()
        wheel1Group.add(wheel)
        wheel1Group.add(wheelDecoration)
        wheel1Group.position.y = 1
        const wheel2Group = wheel1Group.clone()
        const wheel3Group = wheel1Group.clone();
        wheel3Group.scale.copy(new THREE.Vector3(-1, -1, -1));
        const wheel4Group = wheel1Group.clone();
        wheel4Group.scale.copy(new THREE.Vector3(-1, -1, -1));

        wheel1Group.position.x = 2
        wheel1Group.position.z = 2.25
        wheel2Group.position.x = 6
        wheel2Group.position.z = 2.25
        wheel3Group.position.x = 2
        wheel3Group.position.z = -2.25
        wheel4Group.position.x = 6
        wheel4Group.position.z = -2.25

        const carGroup = new THREE.Group()
        carGroup.add(body)
        carGroup.add(wheel1Group)
        carGroup.add(wheel2Group)
        carGroup.add(wheel3Group)
        carGroup.add(wheel4Group)

        this.group.add(railGroup)
        this.group.add(carGroup)

        this.group.scale.copy(this.scale);

        return this.group;
    }
}
