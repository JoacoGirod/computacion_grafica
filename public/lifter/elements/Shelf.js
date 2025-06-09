import * as THREE from 'three';

export class Shelf {
    constructor(config = {}) {
        // Optional Input
        this.rows = config.rows ?? 2;
        this.cols = config.cols ?? 8;
        this.scale = config.scale ?? new THREE.Vector3(1, 1, 1);

        // Derived values
        this.separatorHeight = 0.15;
        this.yInferiorOffset = 2.2;
        this.ySuperiorOffset = 0.2;

        // Shelf state
        this.matrix = Array.from({ length: this.cols }, () =>
            Array(this.rows).fill(null)
        );

        this.group = new THREE.Group();
    }

    generate() {
        this.group.clear();

        const normalMaterial = new THREE.MeshNormalMaterial();

        const qx = 2;
        const qy = 3.2;
        const qz = 1.5;

        const totalHeight =
            this.yInferiorOffset +
            this.rows * (qy + this.separatorHeight) +
            this.ySuperiorOffset;

        // Poles
        for (let col = 0; col < this.cols + 1; col++) {
            const x = col * qx;
            for (let depth of [0, qz]) {
                const pole = new THREE.Mesh(new THREE.BoxGeometry(0.2, totalHeight, 0.2), normalMaterial)
                pole.scale.copy(new THREE.Vector3(this.scale.x, 1, this.scale.z))
                pole.position.set(x, totalHeight / 2, depth);
                this.group.add(pole);
            }
        }

        // Planes
        for (let row = 0; row <= this.rows; row++) {
            const y = this.yInferiorOffset + row * (qy + this.separatorHeight);
            const level = new THREE.Mesh(new THREE.BoxGeometry(this.cols * qx, this.separatorHeight, qz), normalMaterial);
            level.scale.copy(new THREE.Vector3(1.1, 1, 1.5))
            level.position.set(
                (this.cols * qx) / 2,
                y,
                qz / 2
            );
            this.group.add(level);
        }

        this.group.position.z = this.cols * qx / 2

        this.group.rotation.y = Math.PI / 2;
        return this.group;
    }

    placeModelIfClose(planePosition, model, threshold = 0.5) {
        if (!model) return false;

        const qx = 2;
        const qy = 3.2;
        const qz = 1.5;

        // For each possible column/row:
        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                // If already occupied, skip:
                if (this.matrix[col][row] !== null) continue;
                const localCenter = new THREE.Vector3((col + 0.5) * qx, this.yInferiorOffset + row * (qy + this.separatorHeight), qz / 2);

                // Convert that local center to *world* space:
                const worldCenter = localCenter.clone();
                this.group.localToWorld(worldCenter);

                // Compute Euclidean distance to our model’s world‐pos:
                const dist = worldCenter.distanceTo(planePosition);
                if (dist <= threshold) {
                    this.group.add(model);
                    model.position.copy(localCenter);
                    this.matrix[col][row] = model;
                    return true;
                }
            }
        }

        return false;
    }
}
