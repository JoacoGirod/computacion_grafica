import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class Shelf {
    constructor(config = {}) {
        // Optional Input
        this.rows = config.rows ?? 2;
        this.cols = config.cols ?? 8;
        this.scale = config.scale ?? new THREE.Vector3(1, 1, 1);

        // Derived values
        this.separatorHeight = 0.1 * this.scale.y;
        this.yInferiorOffset = this.scale.y * 0.5;
        this.ySuperiorOffset = this.scale.y * 0.5;

        // Shelf state
        this.matrix = Array.from({ length: this.cols }, () =>
            Array(this.rows).fill(null)
        );

        this.group = new THREE.Group();
    }

    generate() {
        this.group.clear();

        const normalMaterial = new THREE.MeshNormalMaterial();

        const qx = this.scale.x;
        const qy = this.scale.y;
        const qz = this.scale.z;

        const totalHeight =
            this.yInferiorOffset +
            this.rows * (qy + this.separatorHeight) +
            this.ySuperiorOffset;

        // Poles
        for (let col = 0; col < this.cols + 1; col++) {
            const x = col * qx;
            for (let depth of [0, qz]) {
                const pole = new THREE.Mesh(new THREE.BoxGeometry(0.05, totalHeight, 0.05), normalMaterial)
                pole.scale.copy(new THREE.Vector3(this.scale.x, 1, this.scale.z))
                pole.position.set(x, totalHeight / 2, depth);
                this.group.add(pole);
            }
        }

        // Planes
        for (let row = 0; row <= this.rows; row++) {
            const y = this.yInferiorOffset + row * (qy + this.separatorHeight);
            const level = new THREE.Mesh(new THREE.BoxGeometry(this.cols * qx, this.separatorHeight, qz), normalMaterial);
            level.scale.copy(new THREE.Vector3(1.1, 1, 1.2))
            level.position.set(
                (this.cols * qx) / 2,
                y,
                qz / 2
            );
            this.group.add(level);
        }

        this.group.position.z = this.cols * qx / 2

        return this.group;
    }

    placeModelIfClose(model, coordinate, threshold = 0.5) {
        const qx = this.scale.x;
        const qy = this.scale.y;

        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                if (this.matrix[col][row]) continue;

                const pos = new THREE.Vector3(
                    col * qx,
                    this.yInferiorOffset + row * (qy + this.separatorHeight),
                    0
                );

                if (pos.distanceTo(coordinate) < threshold) {
                    model.position.copy(pos);
                    this.group.add(model);
                    this.matrix[col][row] = model;
                    return true;
                }
            }
        }
        return false;
    }
}
