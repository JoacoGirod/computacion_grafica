import * as THREE from 'three';

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

export function rescaleCurve(curves, { maxWidth, maxHeight, center = true }) {
    const allPoints = curves.flat();
    const xs = allPoints.map(p => p.x);
    const ys = allPoints.map(p => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;

    let scaleX = maxWidth ? maxWidth / width : 1;
    let scaleY = maxHeight ? maxHeight / height : 1;
    let scale = Math.max(scaleX, scaleY);
    console.log(scale);


    const offsetX = center ? (minX + maxX) / 2 : 0;
    const offsetY = center ? (minY + maxY) / 2 : 0;

    return curves.map(curve =>
        curve.map(p =>
            new THREE.Vector2(
                (p.x - offsetX) * scale,
                (p.y - offsetY) * scale
            )
        )
    );
}
