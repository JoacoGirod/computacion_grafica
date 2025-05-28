import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class Shelf {
    constructor(
        yInferiorOffset,
        ySuperiorOffset,
        planeFactor,
        cols = 8,
        rows = 2,
        quadrantX = 2,
        quadrantY = 2.5,
        quadrantZ = 1,
        separatorHeight = 0.1
    ) {
        this.yInferiorOffset = yInferiorOffset;
        this.ySuperiorOffset = ySuperiorOffset;
        this.planeFactor = planeFactor;
        this.rows = rows; // vertical (Y-axis)
        this.cols = cols; // horizontal (X-axis)
        this.quadrantX = quadrantX;
        this.quadrantY = quadrantY;
        this.quadrantZ = quadrantZ;
        this.separatorHeight = separatorHeight;

        // matrix[col][row] — row is vertical position
        this.matrix = Array.from({ length: cols }, () =>
            Array(rows).fill(null)
        );

        this.group = new THREE.Group();
    }

    generate() {
        const totalHeight =
            this.yInferiorOffset +
            this.rows * (this.quadrantY + this.separatorHeight) +
            this.ySuperiorOffset;

        // Create poles at every column (left/right) and every row level (vertical)
        const poleMaterial = new THREE.MeshNormalMaterial();
        const poleGeometry = new THREE.BoxGeometry(0.05, totalHeight, 0.05);

        for (let col = 0; col < this.cols; col++) {
            const x = col * this.quadrantX;
            for (let depth of [0, this.quadrantZ]) { // mini two item array
                const pole = new THREE.Mesh(poleGeometry, poleMaterial);
                pole.position.set(x, totalHeight / 2, depth);
                this.group.add(pole);
            }
        }

        // Add horizontal shelf levels
        const levelMaterial = new THREE.MeshNormalMaterial();
        const levelGeometry = new THREE.BoxGeometry(
            this.cols * this.quadrantX,
            this.separatorHeight,
            this.quadrantZ * this.planeFactor
        );

        for (let row = 0; row <= this.rows; row++) {
            const y = this.yInferiorOffset + row * (this.quadrantY + this.separatorHeight);

            const level = new THREE.Mesh(levelGeometry, levelMaterial);
            level.position.set(
                (this.cols * this.quadrantX) / 2 - this.quadrantX / 2,
                y,
                this.quadrantZ / 2
            );
            this.group.add(level);
        }

        return this.group;
    }

    placeModelIfClose(model, coordinate, threshold = 0.5) {
        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                if (this.matrix[col][row]) continue;

                const pos = new THREE.Vector3(
                    col * this.quadrantX,
                    this.yInferiorOffset + row * (this.quadrantY + this.separatorHeight),
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
