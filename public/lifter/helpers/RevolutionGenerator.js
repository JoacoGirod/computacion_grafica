import { buildGeometry } from "./utils/buildGeometry.js";

export class RevolutionGenerator {
    constructor(baseCurve, height, torsion, steps) {
        this.baseCurve = baseCurve; // Array de [x,z]
        this.height = height;
        this.steps = steps;
    }

    generateGeometry() {
        const vertices = [];
        const faces = [];

        const nPoints = this.baseCurve.length;
        const steps = this.steps; // parametrizing this steps would be logical
        const fullRotation = Math.PI * 2; // Having objects made from a smaller rotation would be kinda cool

        for (let i = 0; i <= steps; i++) {
            const angle = (fullRotation * i) / steps;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            for (const [x, y] of this.baseCurve) {
                const xr = x * cosA;
                const zr = x * sinA;
                vertices.push([xr, y * this.height, zr]);
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
                faces.push([v0, v1, v2]);
                faces.push([v0, v2, v3]);
            }
        }

        return buildGeometry(vertices, faces);
    }
}
