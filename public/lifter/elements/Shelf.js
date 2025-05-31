import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class Shelf {
    constructor(config = {}) {
        // Optional Input
        this.rows = config.rows ?? 2;
        this.cols = config.cols ?? 8;
        this.quadrantScale = config.quadrantScale ?? new THREE.Vector3(1, 1, 1);

        // Derived values
        this.separatorHeight = 0.1 * this.quadrantScale.y;
        this.yInferiorOffset = this.quadrantScale.y * 0.5;
        this.ySuperiorOffset = this.quadrantScale.y * 0.5;

        // Shelf state
        this.matrix = Array.from({ length: this.cols }, () =>
            Array(this.rows).fill(null)
        );

        this.group = new THREE.Group();
    }

    generate() {
        const qx = this.quadrantScale.x;
        const qy = this.quadrantScale.y;
        const qz = this.quadrantScale.z;

        const totalHeight =
            this.yInferiorOffset +
            this.rows * (qy + this.separatorHeight) +
            this.ySuperiorOffset;

        // Create vertical poles
        const poleGeometry = new THREE.BoxGeometry(0.05, totalHeight, 0.05);
        const poleMaterial = new THREE.MeshNormalMaterial();

        for (let col = 0; col < this.cols + 1; col++) {
            const x = col * qx;
            for (let depth of [0, qz]) {
                const pole = new THREE.Mesh(poleGeometry, poleMaterial);
                pole.scale.copy(new THREE.Vector3(this.quadrantScale.x, 1, this.quadrantScale.z))
                pole.position.set(x, totalHeight / 2, depth);
                this.group.add(pole);
            }
        }

        // Create horizontal shelves
        const levelGeometry = new THREE.BoxGeometry(
            this.cols * qx,
            this.separatorHeight,
            qz
        );
        const levelMaterial = new THREE.MeshNormalMaterial();

        for (let row = 0; row <= this.rows; row++) {
            const y = this.yInferiorOffset + row * (qy + this.separatorHeight);
            const level = new THREE.Mesh(levelGeometry, levelMaterial);
            level.scale.copy(new THREE.Vector3(1.1, 1, 1.2))
            level.position.set(
                (this.cols * qx) / 2,
                y,
                qz / 2
            );
            this.group.add(level);
        }

        return this.group;
    }

    placeModelIfClose(model, coordinate, threshold = 0.5) {
        const qx = this.quadrantScale.x;
        const qy = this.quadrantScale.y;

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
