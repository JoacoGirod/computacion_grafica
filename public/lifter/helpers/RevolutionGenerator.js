import { buildGeometry } from "./utils/buildGeometry.js";

export class RevolutionGenerator {
    constructor(steps) {
        this.steps = steps;
    }

    generateGeometry(baseCurve) {
        const vertices = [];
        const faces = [];

        const nPoints = baseCurve.length;
        const steps = this.steps;
        const fullRotation = Math.PI * 2; // Having objects made from a smaller rotation would be kinda cool

        for (let i = 0; i <= steps; i++) {
            const angle = (fullRotation * i) / steps;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            for (const [x, y] of baseCurve) {
                const xr = x * cosA;
                const zr = x * sinA;
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
                // faces.push([v0, v1, v2]); // triangle 1
                // faces.push([v0, v2, v3]); // triangle 2

                faces.push([v0, v2, v1]);
                faces.push([v0, v3, v2]);

            }
        }

        return buildGeometry(vertices, faces);
    }
}
