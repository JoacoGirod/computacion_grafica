import * as THREE from 'three';

export const curves = {
    A2: () => [
        [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(-8, 1),
            new THREE.Vector2(-6, 8),
            new THREE.Vector2(-4, 14),
            new THREE.Vector2(-8, 24),
            new THREE.Vector2(-5, 26),
            new THREE.Vector2(-4, 28)
        ]
    ],
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
    C1: () => [
        [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(5, 5),
        ]
    ],
};
