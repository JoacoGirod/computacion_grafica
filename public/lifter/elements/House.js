import * as THREE from 'three';
import { rescaleCurve } from '../helpers/Curves.js';
import { flattenBezierSegments } from '../helpers/Curves.js';
import { SweepGenerator } from '../helpers/SweepGenerator.js';

export class House {
    constructor(config = {}) {
        this.scale = config.scale || new THREE.Vector3(1, 1, 1);
        this.group = new THREE.Group();

        const loader = new THREE.TextureLoader();

        this.stoneTexture = loader.load('/lifter/assets/house/StoneTilesFloor01_1K_BaseColor.png');
        this.stoneTexture.wrapS = THREE.RepeatWrapping;
        this.stoneTexture.wrapT = THREE.RepeatWrapping;
        this.stoneTexture.repeat.set(6, 6);

        this.metalTexture = loader.load('/lifter/assets/house/CorrugatedMetalPanel02_1K_BaseColor.png');
        this.metalTexture.wrapS = THREE.RepeatWrapping;
        this.metalTexture.wrapT = THREE.RepeatWrapping;
        this.metalTexture.repeat.set(3, 5);
    }

    generate() {
        this.group.clear()

        // Shell
        const baseCurve = [
            [new THREE.Vector2(18, 10), new THREE.Vector2(9, 14), new THREE.Vector2(0, 10)],
            [new THREE.Vector2(0, 10), new THREE.Vector2(0, 0)],
            [new THREE.Vector2(0, 0), new THREE.Vector2(18, 0)],
            [new THREE.Vector2(18, 0), new THREE.Vector2(18, 10)]
        ]
        const scaledCurve = rescaleCurve(baseCurve, { maxWidth: 50, maxHeight: 30, center: false, preserveAspect: false });
        const flattenedCurve = flattenBezierSegments(scaledCurve, 200);
        const generator = new SweepGenerator(50, 0, 200, true);
        const geometry = generator.generateGeometry(flattenedCurve,);

        const shellMaterial = new THREE.MeshStandardMaterial({
            map: this.metalTexture,
            metalness: 0.5,
            roughness: 0.7
        });
        const shell = new THREE.Mesh(geometry, shellMaterial);

        shell.rotation.x = -Math.PI / 2; shell.rotation.z = - Math.PI / 2
        shell.position.x = -25; shell.position.y = -1; shell.position.z = -25

        this.group.add(shell)

        // Floor
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: this.stoneTexture,
            metalness: 0.2,
            roughness: 0.8
        });
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), floorMaterial);
        floor.rotation.x = -Math.PI / 2

        this.group.add(floor)

        // Lights
        const rows = 2;
        const cols = 3;
        const spacingX = 20;
        const spacingZ = 10;
        const ceilingY = 20;

        const fixtureMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffee,
            emissiveIntensity: 1.0,
        });

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = -((cols - 1) * spacingX) / 2 + col * spacingX;
                const z = -((rows - 1) * spacingZ) / 2 + row * spacingZ;

                // SpotLight setup
                const spot = new THREE.SpotLight(0xffffff, 9, 100, Math.PI / 6, 0.3, 1);
                spot.position.set(x, ceilingY, z);
                spot.target.position.set(x, 0, z); // Aim downward

                // Add both light and target to the scene
                this.group.add(spot);
                this.group.add(spot.target);

                // Light fixture model
                const fixture = new THREE.Mesh(
                    new THREE.CylinderGeometry(1, 1, 0.5),
                    fixtureMaterial
                );
                fixture.position.set(x, ceilingY + 0.25, z);
                this.group.add(fixture);
            }
        }



        this.group.scale.copy(this.scale)
        return this.group
    }
}