import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { SweepGenerator } from '../helpers/SweepGenerator.js';
import { RevolutionGenerator } from '../helpers/RevolutionGenerator.js';
import { curves } from '../helpers/Curves.js';
import { rescaleCurve } from '../helpers/utils/curves.js';

export class TridimensionalPrinter {
    constructor(config = {}) {
        // Printing
        this.maxHeight = config.maxHeight || 10;
        this.sweepingSteps = config.sweepingSteps || 10;
        this.revolutionSteps = config.revolutionSteps || 10;

        // Model Generation
        this.scale = config.scale || new THREE.Vector3(1, 1, 1);
        this.group = new THREE.Group(); // all 3D parts here
    }

    generate() {
        // Clear existing printer visual
        this.group.clear();
        const normalMaterial = new THREE.MeshNormalMaterial()

        // Plane and Box
        const planeMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 2), normalMaterial);
        planeMesh.position.y = -0.125
        const planeTopMesh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 1), normalMaterial)

        const handGroup = new THREE.Group()
        handGroup.add(planeMesh)
        handGroup.add(planeTopMesh)

        // Arms & Box
        const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.75), normalMaterial)
        const arm1Mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.1), normalMaterial);
        arm1Mesh.position.x = 0.75
        arm1Mesh.position.z = 0.1

        const arm2Mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.1), normalMaterial);
        arm2Mesh.position.x = 0.75
        arm2Mesh.position.z = -0.1

        const connectionGroup = new THREE.Group()
        connectionGroup.add(boxMesh)
        connectionGroup.add(arm1Mesh)
        connectionGroup.add(arm2Mesh)
        handGroup.position.x = 1.5
        connectionGroup.add(handGroup)

        // Elevating bar
        const barMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 7), normalMaterial)
        barMesh.position.y = 3.5

        const barGroup = new THREE.Group()
        barGroup.add(barMesh)
        connectionGroup.position.y = 6 // THIS MOVES THE ARM
        barGroup.add(connectionGroup)

        // Base
        const baseCurve = [
            [0.0, 1.6], [1.2, 1.6], [1.4, 2.0],
            [1.6, 2.0], [1.8, 1.6], [1.8, 0.0], [0.0, 0.0]
        ].map(([x, y]) => new THREE.Vector2(x, y));
        const scaledCurve = rescaleCurve([baseCurve], { maxWidth: 3, center: false })[0];
        console.log(scaledCurve);

        const revGen = new RevolutionGenerator(1, this.revolutionSteps);
        const baseMesh = new THREE.Mesh(revGen.generateGeometry(baseCurve), normalMaterial);

        this.group.add(baseMesh)
        barGroup.position.x = -1.5
        this.group.add(barGroup)

        this.group.scale.copy(this.scale);

        return this.group;
    }


    print(menuValues) {
        const {
            tipoSuperficie,
            forma2DRevolucion,
            forma2DBarrido,
            anguloTorsion,
            alturaTotal
        } = menuValues;

        if (alturaTotal <= 0 || alturaTotal > this.maxHeight) {
            throw new Error("Altura inválida.");
        }

        const tipo = tipoSuperficie.toLowerCase();
        const curvaKey = tipo === "revolucion" ? forma2DRevolucion.toUpperCase() : forma2DBarrido.toUpperCase();

        const curvaFn = curves[curvaKey];
        if (!curvaFn) {
            throw new Error(`Curva desconocida: ${curvaKey}`);
        }

        const curva = curvaFn();

        let generator;
        if (tipo === "revolucion") {
            generator = new RevolutionGenerator(curva, alturaTotal, anguloTorsion, this.revolutionSteps);
        } else if (tipo === "barrido") {
            generator = new SweepGenerator(curva, alturaTotal, anguloTorsion, this.sweepingSteps);
        } else {
            throw new Error(`Tipo de superficie inválido: ${tipoSuperficie}`);
        }

        const { vertices, faces } = generator.generateGeometry();
        const geometry = createGeometry(vertices, faces);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0xff5500 }));

        // Position it just above the base
        mesh.position.y = 0.2;
        this.group.add(mesh);
    }
}
