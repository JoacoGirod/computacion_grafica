import { buildGeometry } from "./utils/buildGeometry.js";

export class RevolutionGenerator {
    constructor(steps, uvMapping = "cylindrical") {
        this.steps = steps;
        this.uvMapping = uvMapping;
    }

    generateGeometry(baseCurve, uvMappingMode = this.uvMapping) {
        const vertices = [];
        const faces = [];
        const uvs = [];

        const nPoints = baseCurve.length;
        const steps = this.steps;
        const fullRotation = Math.PI * 2;

        // Compute max radius for radial UVs
        let maxRadius = 0;
        if (uvMappingMode === "radial") {
            maxRadius = Math.max(...baseCurve.map(([x, _]) => Math.abs(x)));
        }

        for (let i = 0; i <= steps; i++) {
            const angle = (fullRotation * i) / steps;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            for (let j = 0; j < nPoints; j++) {
                const [x, y] = baseCurve[j];
                const xr = x * cosA;
                const zr = x * sinA;
                vertices.push([xr, y, zr]);

                // UV mapping
                let u, v;
                if (uvMappingMode === "cylindrical") {
                    u = i / steps;
                    v = j / (nPoints - 1);
                } else if (uvMappingMode === "radial") {
                    const diameter = 2 * maxRadius;
                    u = 0.5 + xr / diameter;
                    v = 0.5 + zr / diameter;
                } else {
                    throw new Error(`Unsupported UV mapping mode: ${uvMappingMode}`);
                }

                uvs.push([u, v]);
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

        return buildGeometry(vertices, faces, uvs);
    }
}
