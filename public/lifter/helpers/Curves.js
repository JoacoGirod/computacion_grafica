import * as THREE from 'three';

export const baseCurves = new Map([
    ['A1', {
        type: 'catmull',
        segments: [
            [new THREE.Vector2(0, 21), new THREE.Vector2(-7, 21)],
            [new THREE.Vector2(-7, 21), new THREE.Vector2(-7, 18)],
            [new THREE.Vector2(-7, 18), new THREE.Vector2(-2, 16), new THREE.Vector2(-4, 14), new THREE.Vector2(-5, 11), new THREE.Vector2(-4, 8), new THREE.Vector2(-2, 6), new THREE.Vector2(-7, 4)],
            [new THREE.Vector2(-7, 4), new THREE.Vector2(-7, 0)],
            [new THREE.Vector2(-7, 0), new THREE.Vector2(0, 0)]
        ]
    }],
    ['A2', {
        type: 'catmull',
        segments: [
            [new THREE.Vector2(-4, 28), new THREE.Vector2(-5, 26), new THREE.Vector2(-8, 24), new THREE.Vector2(-4, 14), new THREE.Vector2(-6, 8), new THREE.Vector2(-8, 1), new THREE.Vector2(0, 0)],
        ]
    }],
    ['A3', {
        type: 'bezier',
        segments: [
            [new THREE.Vector2(-4, 23), new THREE.Vector2(-5, 21), new THREE.Vector2(-8, 21)],
            [new THREE.Vector2(-8, 21), new THREE.Vector2(-11, 21), new THREE.Vector2(-11, 18)],
            [new THREE.Vector2(-11, 18), new THREE.Vector2(-11, 12)],
            [new THREE.Vector2(-11, 12), new THREE.Vector2(-11, 8), new THREE.Vector2(-3, 7)],
            [new THREE.Vector2(-3, 7), new THREE.Vector2(-3, 4)],
            [new THREE.Vector2(-3, 4), new THREE.Vector2(-12, 0)],
            [new THREE.Vector2(-12, 0), new THREE.Vector2(0, 0)],
        ]
    }],
    ['A4', {
        type: 'catmull',
        segments: [
            [new THREE.Vector2(-1, 19), new THREE.Vector2(-3, 18), new THREE.Vector2(-4, 17), new THREE.Vector2(-5, 15), new THREE.Vector2(-5, 13), new THREE.Vector2(-6, 11), new THREE.Vector2(-11, 10)],
            [new THREE.Vector2(-11, 10), new THREE.Vector2(-5, 9), new THREE.Vector2(-3, 7), new THREE.Vector2(-3, 4), new THREE.Vector2(-7, 3), new THREE.Vector2(-7, 1), new THREE.Vector2(-5, 0), new THREE.Vector2(0, 0)]
        ]
    }],
    ['B1', {
        type: 'catmull',
        segments: [
            [new THREE.Vector2(-4, 5), new THREE.Vector2(-4, -5)],
            [new THREE.Vector2(-4, -5), new THREE.Vector2(4, 0)],
            [new THREE.Vector2(4, 0), new THREE.Vector2(-4, 5)],
        ]
    }],
    ['B2', {
        type: 'bezier',
        segments: [
            [new THREE.Vector2(-6, 7), new THREE.Vector2(-3, 2), new THREE.Vector2(-9, 0)],
            [new THREE.Vector2(-9, 0), new THREE.Vector2(-3, -1), new THREE.Vector2(-6, -7)],
            [new THREE.Vector2(-6, -7), new THREE.Vector2(0, -3), new THREE.Vector2(2, -9)],
            [new THREE.Vector2(2, -9), new THREE.Vector2(2, -3), new THREE.Vector2(8, -4)],
            [new THREE.Vector2(8, -4), new THREE.Vector2(4, 0), new THREE.Vector2(8, 4)],
            [new THREE.Vector2(8, 4), new THREE.Vector2(2, 5), new THREE.Vector2(2, 10)],
            [new THREE.Vector2(2, 10), new THREE.Vector2(0, 5), new THREE.Vector2(-6, 7)],
        ]
    }],
    ['B3', {
        type: 'bezier',
        segments: [
            [new THREE.Vector2(2, 3), new THREE.Vector2(-2, 3)],
            [new THREE.Vector2(-2, 9), new THREE.Vector2(-2, 3)],
            [new THREE.Vector2(-4, 9), new THREE.Vector2(-2, 9)],
            [new THREE.Vector2(-4, 9), new THREE.Vector2(-9, 9), new THREE.Vector2(-9, 4)],
            [new THREE.Vector2(-9, 4), new THREE.Vector2(-9, 2)],
            [new THREE.Vector2(-9, 2), new THREE.Vector2(-3, 2)],
            [new THREE.Vector2(-3, -2), new THREE.Vector2(-3, 2)],
            [new THREE.Vector2(-9, -2), new THREE.Vector2(-3, -2)],
            [new THREE.Vector2(-9, -2), new THREE.Vector2(-9, -4)],
            [new THREE.Vector2(-9, -4), new THREE.Vector2(-9, -8), new THREE.Vector2(-4, -8)],
            [new THREE.Vector2(-4, -8), new THREE.Vector2(-2, -8)],
            [new THREE.Vector2(-2, -8), new THREE.Vector2(-2, -3)],
            [new THREE.Vector2(-2, -3), new THREE.Vector2(2, -3)],
            [new THREE.Vector2(2, -3), new THREE.Vector2(2, -8)],
            [new THREE.Vector2(2, -8), new THREE.Vector2(4, -8)],
            [new THREE.Vector2(4, -8), new THREE.Vector2(8, -8), new THREE.Vector2(8, -4)],
            [new THREE.Vector2(8, -4), new THREE.Vector2(8, -2)],
            [new THREE.Vector2(8, -2), new THREE.Vector2(3, -2)],
            [new THREE.Vector2(3, -2), new THREE.Vector2(3, 2)],
            [new THREE.Vector2(3, 2), new THREE.Vector2(8, 2)],
            [new THREE.Vector2(8, 2), new THREE.Vector2(8, 4)],
            [new THREE.Vector2(8, 4), new THREE.Vector2(8, 9), new THREE.Vector2(4, 9)],
            [new THREE.Vector2(4, 9), new THREE.Vector2(2, 9)],
            [new THREE.Vector2(2, 9), new THREE.Vector2(2, 3)],
        ]
    }],
    ['B4', {
        type: 'bezier',
        segments:
            [
                [
                    new THREE.Vector2(0, 10),
                    new THREE.Vector2(-4, 10),
                    new THREE.Vector2(-4, 6)
                ],
                [
                    new THREE.Vector2(-4, 6),
                    new THREE.Vector2(-4, -6)
                ],
                [
                    new THREE.Vector2(-4, -6),
                    new THREE.Vector2(-4, -10),
                    new THREE.Vector2(0, -10)
                ],
                [
                    new THREE.Vector2(0, -10),
                    new THREE.Vector2(4, -10),
                    new THREE.Vector2(4, -6)
                ],
                [
                    new THREE.Vector2(4, -6),
                    new THREE.Vector2(4, 6)
                ],
                [
                    new THREE.Vector2(4, 6),
                    new THREE.Vector2(4, 10),
                    new THREE.Vector2(0, 10)
                ]
            ]

    }],
]);

export function flattenBezierSegments(bezierSegments, pointsPerSegment = 20) {
    const curvePoints = [];

    for (const segment of bezierSegments) {
        const points = segment.map(expr => {
            // Evaluate string like "new THREE.Vector2(2, 3)"
            return eval(expr);
        });

        let curve;
        if (points.length === 2) {
            curve = new THREE.LineCurve(points[0], points[1]);
        } else if (points.length === 3) {
            curve = new THREE.QuadraticBezierCurve(points[0], points[1], points[2]);
        } else {
            throw new Error("Unsupported number of control points: " + points.length);
        }

        const sampled = curve.getPoints(pointsPerSegment);

        // Avoid repeating points between segments
        if (curvePoints.length > 0 && sampled.length > 0) {
            sampled.shift(); // Remove first point to avoid duplicate
        }

        for (const p of sampled) {
            curvePoints.push([p.x, p.y]); // Note: Vector2 has x and y
        }
    }

    return curvePoints;
}

export function flattenCatmullSegments(catmullSegments, pointsPerSegment = 20, closed = false) {
    const curvePoints = [];

    for (const segment of catmullSegments) {
        const points = segment.map(expr => {
            // Evaluate string like "new THREE.Vector2(2, 3)"
            return typeof expr === 'string' ? eval(expr) : expr;
        });

        if (points.length < 2) {
            throw new Error("Each Catmull-Rom segment must have at least 2 points");
        }

        const curve = new THREE.CatmullRomCurve3(
            points.map(p => new THREE.Vector3(p.x, p.y, 0)),
            closed,
            'catmullrom',
            0.5 // tension
        );

        const sampled = curve.getPoints(pointsPerSegment);

        // Avoid repeating first point of segment
        if (curvePoints.length > 0 && sampled.length > 0) {
            sampled.shift();
        }

        for (const p of sampled) {
            curvePoints.push([p.x, p.y]);
        }
    }

    return curvePoints;
}

export function rescaleCurve(
    curves,
    { maxWidth, maxHeight, center = true, preserveAspect = true }
) {
    const allPoints = curves.flat();
    const xs = allPoints.map((p) => p.x);
    const ys = allPoints.map((p) => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;

    const scaleX = maxWidth ? maxWidth / width : 1;
    const scaleY = maxHeight ? maxHeight / height : 1;

    let finalScaleX, finalScaleY;
    if (preserveAspect) {
        const s = Math.min(scaleX, scaleY);
        finalScaleX = s;
        finalScaleY = s;
    } else {
        finalScaleX = scaleX;
        finalScaleY = scaleY;
    }

    const centroidX = xs.reduce((a, b) => a + b, 0) / xs.length;
    const centroidY = ys.reduce((a, b) => a + b, 0) / ys.length;
    const offsetX = center ? centroidX : 0;
    const offsetY = center ? centroidY : 0;

    return curves.map((curve) =>
        curve.map((p) => {
            const newX = (p.x - offsetX) * finalScaleX;
            const newY = (p.y - offsetY) * finalScaleY;
            return new THREE.Vector2(newX, newY);
        })
    );
}