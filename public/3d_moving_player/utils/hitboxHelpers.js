export function markBoxHitbox(hitboxGrid, x, y, z, width, height, depth, label) {
    const minX = Math.floor(x - width / 2);
    const maxX = Math.floor(x + width / 2);
    const minY = Math.floor(y - height / 2);
    const maxY = Math.floor(y + height / 2);
    const minZ = Math.floor(z - depth / 2);
    const maxZ = Math.floor(z + depth / 2);

    for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
            for (let k = minZ; k <= maxZ; k++) {
                hitboxGrid.set(`${i},${j},${k}`, label);
            }
        }
    }
}

export function markSphereHitbox(hitboxGrid, cx, cy, cz, radius, label) {
    const rSquared = radius * radius;
    const min = Math.floor(-radius);
    const max = Math.ceil(radius);

    for (let dx = min; dx <= max; dx++) {
        for (let dy = min; dy <= max; dy++) {
            for (let dz = min; dz <= max; dz++) {
                const distSq = dx * dx + dy * dy + dz * dz;
                if (distSq <= rSquared) {
                    const x = Math.floor(cx + dx);
                    const y = Math.floor(cy + dy);
                    const z = Math.floor(cz + dz);
                    hitboxGrid.set(`${x},${y},${z}`, label);
                }
            }
        }
    }
}
