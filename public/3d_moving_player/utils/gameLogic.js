export function checkCollision(position, grid, gridSize) {
    const x = Math.round(position.x);
    const y = Math.round(position.y);
    const z = Math.round(position.z);

    // Volume radius (1 means a 3x3x3 area)
    const radius = 1;

    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dz = -radius; dz <= radius; dz++) {
                const cx = x + dx;
                const cy = y + dy;
                const cz = z + dz;

                // World boundary check
                if (
                    cx < -gridSize / 2 || cx >= gridSize / 2 ||
                    cy < -gridSize / 2 || cy >= gridSize / 2 ||
                    cz < -gridSize / 2 || cz >= gridSize / 2
                ) {
                    console.log(`Collision with world wall at (${cx},${cy},${cz})`);
                    // Handle wall collision
                    return true;
                }

                const value = grid.get(`${cx},${cy},${cz}`);
                if (value) {
                    console.log(`Collision with ${value} at (${cx},${cy},${cz})`);
                    // Handle collision (e.g., player dies, bounce, etc.)
                    return true;
                }
            }
        }
    }

    return false;
}
