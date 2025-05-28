import { buildGeometry } from "./utils/buildGeometry.js";

export class SweepGenerator {
    constructor(baseCurve, height, torsion, steps) {
        this.baseCurve = baseCurve; // Array de [x,z]
        this.height = height;
        this.torsion = torsion;
        this.steps = steps;
    }

    generateGeometry() {
        const vertices = [];
        const faces = [];

        const nPoints = this.baseCurve.length;
        const steps = this.steps;

        for (let i = 0; i <= steps; i++) {
            const y = (this.height * i) / steps;
            const angle = this.torsion * (i / steps);

            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            for (const [x, z] of this.baseCurve) {
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
                // Dos triángulos por quad
                faces.push([v0, v1, v2]);
                faces.push([v0, v2, v3]);
            }
        }

        return buildGeometry(vertices, faces);
    }
}
