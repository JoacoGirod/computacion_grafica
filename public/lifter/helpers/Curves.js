import * as THREE from 'three';

// Rotation is defined from top to bottom on the second xy quadrant
export const curves = {
    // Catmull-Rom
    A1: () => [
        [
            new THREE.Vector2(0, 14),
            new THREE.Vector2(-6, 14)
        ],
        [
            new THREE.Vector2(-6, 14),
            new THREE.Vector2(-6, 12)
        ],
        [
            new THREE.Vector2(-6, 12),
            new THREE.Vector2(-1, 11),
            new THREE.Vector2(-3, 10),
            new THREE.Vector2(-4, 7),
            new THREE.Vector2(-3, 4),
            new THREE.Vector2(-1, 3),
            new THREE.Vector2(-6, 2)
        ],
        [
            new THREE.Vector2(-6, 2),
            new THREE.Vector2(-6, 0)
        ],
        [
            new THREE.Vector2(-6, 0),
            new THREE.Vector2(0, 0)
        ]
    ],
    // Catmull-Rom
    A2: () => [
        [
            new THREE.Vector2(-4, 28),
            new THREE.Vector2(-5, 26),
            new THREE.Vector2(-8, 24),
            new THREE.Vector2(-4, 14),
            new THREE.Vector2(-6, 8),
            new THREE.Vector2(-8, 1),
            new THREE.Vector2(0, 0)
        ]
    ],
    // Bezzier
    A3: () => [
        [
            new THREE.Vector2(-4, 23),
            new THREE.Vector2(-5, 21),
            new THREE.Vector2(-8, 21)
        ],
        [
            new THREE.Vector2(-8, 21),
            new THREE.Vector2(-11, 21),
            new THREE.Vector2(-11, 18)
        ],
        [
            new THREE.Vector2(-11, 18),
            new THREE.Vector2(-11, 12)
        ],
        [
            new THREE.Vector2(-11, 12),
            new THREE.Vector2(-11, 8),
            new THREE.Vector2(-3, 7)
        ],
        [
            new THREE.Vector2(-3, 7),
            new THREE.Vector2(-3, 4)
        ],
        [
            new THREE.Vector2(-3, 4),
            new THREE.Vector2(-12, 0)
        ],
        [
            new THREE.Vector2(-12, 0),
            new THREE.Vector2(0, 0)
        ]
    ],
    // Catmull-Rom
    A4: () => [
        [
            new THREE.Vector2(-1, 30),
            new THREE.Vector2(-5, 29),
            new THREE.Vector2(-7, 27),
            new THREE.Vector2(-8, 24),
            new THREE.Vector2(-8, 21),
            new THREE.Vector2(-9, 18),
            new THREE.Vector2(-19, 15)
        ],
        [
            new THREE.Vector2(-19, 15),
            new THREE.Vector2(-9, 13),
            new THREE.Vector2(-5, 11),
            new THREE.Vector2(-5, 7),
            new THREE.Vector2(-10, 6),
            new THREE.Vector2(-11, 3),
            new THREE.Vector2(-10, 1),
            new THREE.Vector2(0, 0)
        ]
    ],
    // Catmull-Romm
    B1: () => [
        [
            new THREE.Vector2(-4, 5),
            new THREE.Vector2(-4, -5)
        ],
        [
            new THREE.Vector2(-4, -5),
            new THREE.Vector2(4, 0)
        ],
        [
            new THREE.Vector2(4, 0),
            new THREE.Vector2(-4, 5)
        ]
    ],
    // Bezzier
    B2: () => [
        [
            new THREE.Vector2(-6, 7),
            new THREE.Vector2(-3, 2),
            new THREE.Vector2(-9, 0)
        ],
        [
            new THREE.Vector2(-9, 0),
            new THREE.Vector2(-3, -1),
            new THREE.Vector2(-6, -7)
        ],
        [
            new THREE.Vector2(-6, -7),
            new THREE.Vector2(0, -3),
            new THREE.Vector2(2, -9)
        ],
        [
            new THREE.Vector2(2, -9),
            new THREE.Vector2(2, -3),
            new THREE.Vector2(8, -4)
        ],
        [
            new THREE.Vector2(8, -4),
            new THREE.Vector2(4, 0),
            new THREE.Vector2(8, 4)
        ],
        [
            new THREE.Vector2(8, 4),
            new THREE.Vector2(2, 5),
            new THREE.Vector2(2, 10)
        ],
        [
            new THREE.Vector2(2, 10),
            new THREE.Vector2(0, 5),
            new THREE.Vector2(-6, 7)
        ]
    ],
    // Bezzier
    B3: () => [
        [
            new THREE.Vector2(2, 3),
            new THREE.Vector2(-2, 3)
        ],
        [
            new THREE.Vector2(-2, 9),
            new THREE.Vector2(-2, 3)
        ],
        [
            new THREE.Vector2(-4, 9),
            new THREE.Vector2(-2, 9)
        ],
        [
            new THREE.Vector2(-4, 9),
            new THREE.Vector2(-9, 9),
            new THREE.Vector2(-9, 4)
        ],
        [
            new THREE.Vector2(-9, 4),
            new THREE.Vector2(-9, 2)
        ],
        [
            new THREE.Vector2(-9, 2),
            new THREE.Vector2(-3, 2)
        ],
        [
            new THREE.Vector2(-3, -2),
            new THREE.Vector2(-3, 2)
        ],
        [
            new THREE.Vector2(-9, -2),
            new THREE.Vector2(-3, -2)
        ],
        [
            new THREE.Vector2(-9, -2),
            new THREE.Vector2(-9, -4)
        ],
        [
            new THREE.Vector2(-9, -4),
            new THREE.Vector2(-9, -8),
            new THREE.Vector2(-4, -8)
        ],
        [
            new THREE.Vector2(-4, -8),
            new THREE.Vector2(-2, -8)
        ],
        [
            new THREE.Vector2(-2, -8),
            new THREE.Vector2(-2, -3)
        ],
        [
            new THREE.Vector2(-2, -3),
            new THREE.Vector2(2, -3)
        ],
        [
            new THREE.Vector2(2, -3),
            new THREE.Vector2(2, -8)
        ],
        [
            new THREE.Vector2(2, -8),
            new THREE.Vector2(4, -8)
        ],
        [
            new THREE.Vector2(4, -8),
            new THREE.Vector2(8, -8),
            new THREE.Vector2(8, -4)
        ],
        [
            new THREE.Vector2(8, -4),
            new THREE.Vector2(8, -2)
        ],
        [
            new THREE.Vector2(8, -2),
            new THREE.Vector2(3, -2)
        ],
        [
            new THREE.Vector2(3, -2),
            new THREE.Vector2(3, 2)
        ],
        [
            new THREE.Vector2(3, 2),
            new THREE.Vector2(8, 2)
        ],
        [
            new THREE.Vector2(8, 2),
            new THREE.Vector2(8, 4)
        ],
        [
            new THREE.Vector2(8, 4),
            new THREE.Vector2(8, 9),
            new THREE.Vector2(4, 9)
        ],
        [
            new THREE.Vector2(4, 9),
            new THREE.Vector2(2, 9)
        ],
        [
            new THREE.Vector2(2, 9),
            new THREE.Vector2(2, 3)
        ]
    ],
    // Bezzier
    B4: () => [
        [
            new THREE.Vector2(0, 11),
            new THREE.Vector2(-4, 11),
            new THREE.Vector2(-4, 7)
        ],
        [
            new THREE.Vector2(-4, 7),
            new THREE.Vector2(-4, -7)
        ],
        [
            new THREE.Vector2(-4, -7),
            new THREE.Vector2(-4, -11),
            new THREE.Vector2(0, -11)
        ],
        [
            new THREE.Vector2(0, -11),
            new THREE.Vector2(4, -11),
            new THREE.Vector2(4, -7)
        ],
        [
            new THREE.Vector2(4, -7),
            new THREE.Vector2(4, 7)
        ],
        [
            new THREE.Vector2(4, 7),
            new THREE.Vector2(4, 11),
            new THREE.Vector2(0, 11)
        ]],
    C1: () => [
        [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(5, 5),
        ]
    ],
};
