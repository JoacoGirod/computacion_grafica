# TO DO
## High Priority
- Check with scaling?
- Centrado el modulo no el valor literal bozo
- Put a camera on the car so i can see stuff
- Check generation width, width rescaling may be necessary
- Objects dont seem to be centered when rotating them in sweeps
- Implement Object moving logic
- Refine models visually
- Make several cars? lambo, ups truck

- B1 esta chueco; B2 esta levemente chueco

## Low Priority
- Transition generateHelpers() into a class
- Use singletons?
- Revisar que es un centroide

- Comment everything with this convention
/**
 * Flattens an array of bezier segment definitions into a single array of [x, z] points
 * @param {Array<Array<string>>} bezierSegments - Each inner array is 2 or 3 Vector2 definitions
 * @param {number} [pointsPerSegment=20] - Number of points to sample per segment
 * @returns {Array<Array<number>>} Flattened list of [x, z] points
 */