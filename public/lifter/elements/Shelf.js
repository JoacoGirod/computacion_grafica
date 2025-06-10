import * as THREE from 'three';

export class Shelf {
    constructor(config = {}) {
        // Model Configuration
        this.rows = config.rows || 2;
        this.cols = config.cols || 8;
        this.scale = config.scale || new THREE.Vector3(1, 1, 1);

        // Static Dimensions
        this.separatorHeight = 0.15;
        this.yInferiorOffset = 2.2;
        this.ySuperiorOffset = 0.2;

        // Shelf Cell Dimensions
        this.qx = 2;
        this.qy = 3.2;
        this.qz = 1.5;

        // Shelf state
        this.matrix = Array.from({ length: this.cols }, () =>
            Array(this.rows).fill(null)
        );

        this.group = new THREE.Group();
    }

    generate() {
        this.group.clear();

        const normalMaterial = new THREE.MeshNormalMaterial();

        const totalHeight =
            this.yInferiorOffset +
            this.rows * (this.qy + this.separatorHeight) +
            this.ySuperiorOffset;

        // Poles
        for (let col = 0; col < this.cols + 1; col++) {
            const x = col * this.qx;
            for (let depth of [0, this.qz]) {
                const pole = new THREE.Mesh(new THREE.BoxGeometry(0.2, totalHeight, 0.2), normalMaterial)
                pole.scale.copy(new THREE.Vector3(this.scale.x, 1, this.scale.z))
                pole.position.set(x, totalHeight / 2, depth);
                this.group.add(pole);
            }
        }

        // Planes
        for (let row = 0; row <= this.rows; row++) {
            const y = this.yInferiorOffset + row * (this.qy + this.separatorHeight);
            const level = new THREE.Mesh(new THREE.BoxGeometry(this.cols * this.qx, this.separatorHeight, this.qz), normalMaterial);
            level.scale.copy(new THREE.Vector3(1.1, 1, 1.5))
            level.position.set(
                (this.cols * this.qx) / 2,
                y,
                this.qz / 2
            );
            this.group.add(level);
        }

        this.group.position.z = this.cols * this.qx / 2;
        this.group.rotation.y = Math.PI / 2;
        return this.group;
    }

    placeModelIfClose(planePosition, model, threshold = 0.5) {
        if (!model) return false;

        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                if (this.matrix[col][row] !== null) continue;

                const localCenter = new THREE.Vector3(
                    (col + 0.5) * this.qx,
                    this.yInferiorOffset + row * (this.qy + this.separatorHeight),
                    this.qz / 2
                );

                const worldCenter = localCenter.clone();
                this.group.localToWorld(worldCenter);

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
