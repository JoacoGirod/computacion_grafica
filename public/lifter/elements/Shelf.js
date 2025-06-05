import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

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


        console.log(planePosition);

        // We will reuse the same constants as in generate().
        const qx = 2;
        const qy = 3.2;
        const qz = 1.5;

        // For each possible column/row:
        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                // If already occupied, skip:
                if (this.matrix[col][row] !== null) continue;

                // Compute that cell’s *local* center (before transformations):
                //  - X direction: center of the “bin” is at (col + 0.5) * qx
                //  - Y direction: bottom offset + row*(qy+sep) + qy/2
                //  - Z direction: halfway into the shelf depth: qz/2
                const localCenter = new THREE.Vector3(
                    (col + 0.5) * qx,
                    this.yInferiorOffset + row * (qy + this.separatorHeight),
                    qz / 2
                );

                // Convert that local center to *world* space:
                const worldCenter = localCenter.clone();
                this.group.localToWorld(worldCenter);

                // Compute Euclidean distance to our model’s world‐pos:
                const dist = worldCenter.distanceTo(planePosition);
                if (dist <= threshold) {
                    // We can “snap” it into this cell:
                    // 1) Reparent under this.group:
                    this.group.add(model);

                    // 2) But model’s position must become exactly localCenter:
                    //    To do that, we can invert the world transform:
                    model.position.copy(localCenter);

                    // 3) Mark the matrix cell as occupied:
                    this.matrix[col][row] = model;
                    return true;
                }
            }
        }

        // No cell was close enough / empty
        return false;
    }
}
