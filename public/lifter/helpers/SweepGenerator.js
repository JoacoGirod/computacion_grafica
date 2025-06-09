import * as THREE from 'three';
import { buildGeometry } from "./utils/buildGeometry.js";

export class SweepGenerator {
    constructor(height, torsion, steps, reverseNormals = false, capMode = "shape") {
        this.height = height;
        this.torsion = torsion;
        this.steps = steps;
        this.reverseNormals = reverseNormals;
        this.capMode = capMode;
    }

    generateGeometry(baseCurve) {
        const vertices = [];
        const faces = [];

        const nPoints = baseCurve.length;
        const steps = this.steps;

        // === Generate vertices ===
        for (let i = 0; i <= steps; i++) {
            const y = (this.height * i) / steps;
            const angle = this.torsion * (i / steps);

            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            for (const [x, z] of baseCurve) {
                const xr = x * cosA - z * sinA;
                const zr = x * sinA + z * cosA;
                vertices.push([xr, y, zr]);
            }
        }

        // === Generate side faces ===
        for (let i = 0; i < steps; i++) {
            const base = i * nPoints;
            const nextBase = (i + 1) * nPoints;
            for (let j = 0; j < nPoints - 1; j++) {
                const v0 = base + j;
                const v1 = base + j + 1;
                const v2 = nextBase + j + 1;
                const v3 = nextBase + j;

                if (this.reverseNormals) {
                    faces.push([v0, v1, v2]);
                    faces.push([v0, v2, v3]);
                } else {
                    faces.push([v0, v2, v1]);
                    faces.push([v0, v3, v2]);
                }
            }
        }

        // === Cap generation ===
        if (this.capMode === "shape") {
            const shape = new THREE.Shape(baseCurve.map(([x, z]) => new THREE.Vector2(x, z)));
            const triangles = THREE.ShapeUtils.triangulateShape(shape.getPoints(), []);

            const bottomStart = 0;
            const topStart = steps * nPoints;

            for (const [a, b, c] of triangles) {
                const bottom = [a, b, c];
                const top = [a + topStart, b + topStart, c + topStart];

                if (this.reverseNormals) {
                    faces.push([bottom[2], bottom[1], bottom[0]]);
                    faces.push(top);
                } else {
                    faces.push(bottom);
                    faces.push([top[2], top[1], top[0]]);
                }
            }

        } else if (this.capMode === "center") {
            // === Legacy center-based caps ===
            const bottomCenterIndex = vertices.length;
            const topCenterIndex = vertices.length + 1;
            const yBottom = 0;
            const yTop = this.height;

            // Average center points for bottom/top
            let sumBottom = [0, yBottom, 0], sumTop = [0, yTop, 0];
            for (let i = 0; i < nPoints; i++) {
                const [x, , z] = vertices[i];
                sumBottom[0] += x;
                sumBottom[2] += z;

                const [xt, , zt] = vertices[vertices.length - nPoints + i];
                sumTop[0] += xt;
                sumTop[2] += zt;
            }
            sumBottom[0] /= nPoints; sumBottom[2] /= nPoints;
            sumTop[0] /= nPoints; sumTop[2] /= nPoints;

            vertices.push(sumBottom); // bottom center
            vertices.push(sumTop);    // top center

            // Bottom cap
            for (let i = 0; i < nPoints - 1; i++) {
                const v0 = i;
                const v1 = i + 1;
                if (this.reverseNormals) {
                    faces.push([bottomCenterIndex, v1, v0]);
                } else {
                    faces.push([bottomCenterIndex, v0, v1]);
                }
            }

            // Top cap
            const base = steps * nPoints;
            for (let i = 0; i < nPoints - 1; i++) {
                const v0 = base + i;
                const v1 = base + i + 1;
                if (this.reverseNormals) {
                    faces.push([topCenterIndex, v0, v1]);
                } else {
                    faces.push([topCenterIndex, v1, v0]);
                }
            }
        }

        return buildGeometry(vertices, faces);
    }
}