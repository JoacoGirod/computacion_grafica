import * as THREE from 'three';
import { rescaleCurve } from '../helpers/Curves.js';
import { flattenBezierSegments } from '../helpers/Curves.js';
import { SweepGenerator } from '../helpers/SweepGenerator.js';

export class House {
    constructor(config = {}) {
        this.scale = config.scale || new THREE.Vector3(1, 1, 1);
        this.group = new THREE.Group();
    }

    generate() {
        this.group.clear()

        const baseCurve = [
            [new THREE.Vector2(18, 10), new THREE.Vector2(9, 14), new THREE.Vector2(0, 10)],
            [new THREE.Vector2(0, 10), new THREE.Vector2(0, 0)],
            [new THREE.Vector2(0, 0), new THREE.Vector2(18, 0)],
            [new THREE.Vector2(18, 0), new THREE.Vector2(18, 10)]
        ]
        const scaledCurve = rescaleCurve(baseCurve, { maxWidth: 100, maxHeight: 50, center: false, preserveAspect: false });
        const flattenedCurve = flattenBezierSegments(scaledCurve);
        const generator = new SweepGenerator(100, 0, 50, true);
        const geometry = generator.generateGeometry(flattenedCurve,);
        const house = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());

        house.rotation.x = -Math.PI / 2; house.rotation.z = - Math.PI / 2
        house.position.x = -50; house.position.z = -50

        this.group.add(house)

        this.group.scale.copy(this.scale)
        return this.group
    }

}