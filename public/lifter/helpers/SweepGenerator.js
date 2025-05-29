import { buildGeometry } from "./utils/buildGeometry.js";

export class SweepGenerator {
    constructor(height, torsion, steps) {
        this.height = height;
        this.torsion = torsion;
        this.steps = steps;
    }

    generateGeometry(baseCurve) {
        const vertices = [];
        const faces = [];

        const nPoints = baseCurve.length;
        const steps = this.steps;

        for (let i = 0; i <= steps; i++) {
            const y = (this.height * i) / steps;
            const angle = this.torsion * (i / steps);

            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            for (const [x, z] of baseCurve) {
                // Aplica torsión: rotación alrededor del eje Y
                const xr = x * cosA - z * sinA;
                const zr = x * sinA + z * cosA;
                vertices.push([xr, y, zr]);
            }
        }

        for (let i = 0; i < steps; i++) {
            const base = i * nPoints;
            const nextBase = (i + 1) * nPoints;
            for (let j = 0; j < nPoints - 1; j++) {
                const v0 = base + j;
                const v1 = base + j + 1;
                const v2 = nextBase + j + 1;
                const v3 = nextBase + j;
                faces.push([v0, v2, v1]);
                faces.push([v0, v3, v2]);
            }
        }

        return buildGeometry(vertices, faces);
    }
}
