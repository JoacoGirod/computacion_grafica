# TO DO
## High Priority
- Fix scaling special scaling should not be necessary, take measurements using grid on images,
- Implement Vehicle Movemenet
- Implement Printing menu
- Implement Object moving logic
- Refine models visually
- shelf could be simplified
- Make several cars?


## Low Priority
- Transition generateHelpers() into a class
- Transition so everything has config{} as parameter Scalers mainly

- Comment everything with this convention
/**
 * Flattens an array of bezier segment definitions into a single array of [x, z] points
 * @param {Array<Array<string>>} bezierSegments - Each inner array is 2 or 3 Vector2 definitions
 * @param {number} [pointsPerSegment=20] - Number of points to sample per segment
 * @returns {Array<Array<number>>} Flattened list of [x, z] points
 */