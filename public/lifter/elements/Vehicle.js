import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class Vehicle {
    constructor(config = {}) {
        // Model Generation
        this.scale = config.scale || new THREE.Vector3(1, 1, 1);
        this.group = new THREE.Group(); // all 3D parts here
        this.wheels = [];
        this.plane = null; // Moving plane
        this.heldObject = null;
    }

    generate() {
        this.group.clear();

        const normalMaterial = new THREE.MeshNormalMaterial()

        // Rails
        const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7, 0.3), normalMaterial)
        rail1.position.y = 3.5; rail1.position.z = 0.75
        const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7, 0.3), normalMaterial)
        rail2.position.y = 3.5; rail2.position.z = -0.75

        // Cross Rails
        const crossRail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), normalMaterial)
        crossRail1.position.x = 0.05; crossRail1.position.y = 0.5
        const crossRail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), normalMaterial)
        crossRail2.position.x = 0.05; crossRail2.position.y = 3.66
        const crossRail3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), normalMaterial)
        crossRail3.position.x = 0.05; crossRail3.position.y = 6.8

        // Plane
        this.plane = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1.5), normalMaterial)
        this.plane.position.x = -1; this.plane.position.y = 2

        const railGroup = new THREE.Group()
        railGroup.add(rail1, rail2, crossRail1, crossRail2, crossRail3, this.plane)
        railGroup.position.y = 0.5

        // Vehicle Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1, 2), normalMaterial)
        body.position.x = 3.8 / 2 + 0.05; body.position.y = 0.5 + 1.25 / 2

        // Wheels
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.25), normalMaterial)
        wheel.rotation.x = Math.PI / 2
        const wheelDecoration = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.1, 0.1), normalMaterial)
        wheelDecoration.position.z = 0.25;

        const wheel1Group = new THREE.Group()
        wheel1Group.add(wheel, wheelDecoration)
        wheel1Group.position.y = 0.5

        const wheel2Group = wheel1Group.clone()
        const wheel3Group = wheel1Group.clone();
        wheel3Group.scale.copy(new THREE.Vector3(1, -1, -1));
        const wheel4Group = wheel1Group.clone();
        wheel4Group.scale.copy(new THREE.Vector3(1, -1, -1));

        wheel1Group.position.x = 1; wheel1Group.position.z = 1
        wheel2Group.position.x = 2.75; wheel2Group.position.z = 1
        wheel3Group.position.x = 1; wheel3Group.position.z = -1
        wheel4Group.position.x = 2.75; wheel4Group.position.z = -1

        this.wheels.push(wheel1Group, wheel2Group, wheel3Group, wheel4Group)

        const carGroup = new THREE.Group()
        carGroup.add(body, wheel1Group, wheel2Group, wheel3Group, wheel4Group)

        this.group.add(railGroup, carGroup)

        this.group.scale.copy(this.scale);

        return this.group;
    }

    animate(keys) {
        const speed = 0.05;
        const rotationSpeed = 0.02;
        const liftSpeed = 0.01;
        const maxLift = 7;
        const minLift = 0;

        let moved = false;
        let deltaX = 0;

        // FORWARD
        if (keys['KeyW']) {
            this.group.translateX(-speed);
            deltaX = speed;
            moved = true;
        }
        // BACKWARD
        if (keys['KeyS']) {
            this.group.translateX(speed);
            deltaX = -speed;
            moved = true;
        }
        // TURN LEFT
        if (keys['KeyA']) {
            this.group.rotateY(rotationSpeed);
        }
        // TURN RIGHT
        if (keys['KeyD']) {
            this.group.rotateY(-rotationSpeed);
        }

        // LIFT the plane (Q/E)
        if (keys['KeyQ'] && this.plane) {
            this.plane.position.y = Math.min(maxLift, this.plane.position.y + liftSpeed);
        }
        if (keys['KeyE'] && this.plane) {
            this.plane.position.y = Math.max(minLift, this.plane.position.y - liftSpeed);
        }

        // Rotate wheels if we moved
        if (moved) {
            const wheelRotation = deltaX / 0.5; // approximate
            this._rotateWheels(wheelRotation);
        }

        // If we are holding something, keep it “attached” to the plane:
        if (this.heldObject) {
            this.heldObject.position.set(0, 0.05, 0); // sits slightly above the plane
        }
    }

    _rotateWheels(amount) {
        for (const wheel of this.wheels) {
            wheel.rotation.z += amount;
        }
    }

    pickUpObject(mesh) {
        if (!mesh || this.heldObject) return false;
        // Parent it to the plane:
        this.plane.add(mesh);
        mesh.position.set(0, 0.05, 0);
        this.heldObject = mesh;
        return true;
    }

    dropOffObject() {
        if (!this.heldObject) return null;
        const mesh = this.heldObject;
        this.plane.remove(mesh);
        this.heldObject = null;
        return mesh;
    }

    isCarrying() {
        return this.heldObject !== null;
    }
}
