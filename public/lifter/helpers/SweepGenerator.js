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
        const uvs = [];

        const nPoints = baseCurve.length;
        const steps = this.steps;

        // === Generate vertices and UVs ===
        for (let i = 0; i <= steps; i++) {
            const y = (this.height * i) / steps;
            const angle = this.torsion * (i / steps);
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            const u = i / steps;

            for (let j = 0; j < nPoints; j++) {
                const [x, z] = baseCurve[j];
                const xr = x * cosA - z * sinA;
                const zr = x * sinA + z * cosA;
                vertices.push([xr, y, zr]);

                const v = j / (nPoints - 1);
                uvs.push([u, v]);
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
            // Create triangulated face indices
            const shape = new THREE.Shape(baseCurve.map(([x, z]) => new THREE.Vector2(x, z)));
            const shapePoints = shape.getPoints();
            const triangles = THREE.ShapeUtils.triangulateShape(shapePoints, []);
            const bbox = new THREE.Box2().setFromPoints(shapePoints);

            const minX = bbox.min.x;
            const minY = bbox.min.y;
            const width = bbox.max.x - bbox.min.x;
            const height = bbox.max.y - bbox.min.y;

            // Bottom cap (y = 0)
            const bottomStart = 0;
            for (let i = 0; i < shapePoints.length; i++) {
                const x = shapePoints[i].x;
                const z = shapePoints[i].y;
                const u = (x - minX) / width;
                const v = (z - minY) / height;
                uvs[bottomStart + i] = [u, v];
            }

            // Top cap (y = this.height)
            const topStart = steps * nPoints;
            for (let i = 0; i < shapePoints.length; i++) {
                const x = shapePoints[i].x;
                const z = shapePoints[i].y;
                const u = (x - minX) / width;
                const v = (z - minY) / height;
                uvs[topStart + i] = [u, v];
            }

            // Add faces
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
        }

        return buildGeometry(vertices, faces, uvs);
    }
}
