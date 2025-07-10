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
        if (this.capMode === "shape" || this.capMode === "geometry") {
            const shapePoints = baseCurve.map(([x, z]) => new THREE.Vector2(x, z));
            const shape = new THREE.Shape(shapePoints);

            // Use THREE.ShapeGeometry to generate reliable triangulated caps
            if (this.capMode === "geometry") {
                const shapeGeometry = new THREE.ShapeGeometry(shape);
                const posAttr = shapeGeometry.getAttribute('position');
                const uvAttr = shapeGeometry.getAttribute('uv');
                const indexAttr = shapeGeometry.getIndex();

                const bottomStartIndex = vertices.length;
                for (let i = 0; i < posAttr.count; i++) {
                    const x = posAttr.getX(i);
                    const z = posAttr.getY(i);
                    vertices.push([x, 0, z]);
                    uvs.push([uvAttr.getX(i), uvAttr.getY(i)]);
                }

                for (let i = 0; i < indexAttr.count; i += 3) {
                    const a = indexAttr.getX(i) + bottomStartIndex;
                    const b = indexAttr.getX(i + 1) + bottomStartIndex;
                    const c = indexAttr.getX(i + 2) + bottomStartIndex;

                    if (this.reverseNormals) {
                        faces.push([c, b, a]);
                    } else {
                        faces.push([a, b, c]);
                    }
                }

                const topStartIndex = vertices.length;
                for (let i = 0; i < posAttr.count; i++) {
                    const x = posAttr.getX(i);
                    const z = posAttr.getY(i);
                    vertices.push([x, this.height, z]);
                    uvs.push([uvAttr.getX(i), uvAttr.getY(i)]);
                }

                for (let i = 0; i < indexAttr.count; i += 3) {
                    const a = indexAttr.getX(i) + topStartIndex;
                    const b = indexAttr.getX(i + 1) + topStartIndex;
                    const c = indexAttr.getX(i + 2) + topStartIndex;

                    if (this.reverseNormals) {
                        faces.push([a, b, c]);
                    } else {
                        faces.push([c, b, a]);
                    }
                }

            } else {
                // === Original triangulation ===
                const shapePoints = shape.getPoints();
                const triangles = THREE.ShapeUtils.triangulateShape(shapePoints, []);
                const bbox = new THREE.Box2().setFromPoints(shapePoints);

                const minX = bbox.min.x;
                const minY = bbox.min.y;
                const width = bbox.max.x - bbox.min.x;
                const height = bbox.max.y - bbox.min.y;

                const bottomStart = 0;
                for (let i = 0; i < shapePoints.length; i++) {
                    const x = shapePoints[i].x;
                    const z = shapePoints[i].y;
                    const u = (x - minX) / width;
                    const v = (z - minY) / height;
                    uvs[bottomStart + i] = [u, v];
                }

                const topStart = steps * nPoints;
                for (let i = 0; i < shapePoints.length; i++) {
                    const x = shapePoints[i].x;
                    const z = shapePoints[i].y;
                    const u = (x - minX) / width;
                    const v = (z - minY) / height;
                    uvs[topStart + i] = [u, v];
                }

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
        }

        return buildGeometry(vertices, faces, uvs);
    }
}
