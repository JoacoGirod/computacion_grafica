import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { SweepGenerator } from '../helpers/SweepGenerator.js';
import { RevolutionGenerator } from '../helpers/RevolutionGenerator.js';
import { baseCurves, flattenBezierSegments, flattenCatmullSegments, rescaleCurve } from '../helpers/Curves.js';

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
        handGroup.add(planeMesh, planeTopMesh)

        // Arms & Box
        const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.75), normalMaterial)
        const arm1Mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.1), normalMaterial);
        arm1Mesh.position.x = 0.75; arm1Mesh.position.z = 0.1

        const arm2Mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.1), normalMaterial);
        arm2Mesh.position.x = 0.75; arm2Mesh.position.z = -0.1

        const connectionGroup = new THREE.Group()
        handGroup.position.x = 1.5
        connectionGroup.add(boxMesh, arm1Mesh, arm2Mesh, handGroup)

        // Elevating bar
        const barMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 7), normalMaterial)
        barMesh.position.y = 3.5

        const barGroup = new THREE.Group()
        connectionGroup.position.y = 6 // THIS MOVES THE ARM
        barGroup.add(barMesh, connectionGroup)

        // Base
        const baseCurve = [
            [0.0, 1.6], [1.2, 1.6], [1.4, 2.0],
            [1.6, 2.0], [1.8, 1.6], [1.8, 0.0], [0.0, 0.0]
        ].map(([x, y]) => new THREE.Vector2(x, y));

        const revGen = new RevolutionGenerator(this.revolutionSteps);
        const baseMesh = new THREE.Mesh(revGen.generateGeometry(baseCurve), normalMaterial);

        barGroup.position.x = -1.5
        this.group.add(baseMesh)
        this.group.add(baseMesh, barGroup)

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

        const baseCurve = baseCurves.get(curvaKey);
        if (!baseCurve) {
            throw new Error(`Curva desconocida: ${curvaKey}`);
        }
        console.log(baseCurve);



        let generator;
        let scaledCurve
        if (tipo === "revolucion") {
            scaledCurve = rescaleCurve(baseCurve.segments, { maxWidth: 1, maxHeight: alturaTotal, center: false, preserveAspect: false });
            generator = new RevolutionGenerator(50);
        } else if (tipo === "barrido") {
            scaledCurve = rescaleCurve(baseCurve.segments, { maxWidth: 1, maxHeight: 1, center: true });
            generator = new SweepGenerator(alturaTotal, anguloTorsion * 2 * Math.PI / 360, 50);
        } else {
            throw new Error(`Tipo de superficie inválido: ${tipoSuperficie}`);
        }
        console.log(scaledCurve);


        let flattenedCurve;
        if (baseCurve.type == "catmull") {
            flattenedCurve = flattenCatmullSegments(scaledCurve)
        }
        else if (baseCurve.type == "bezier") {
            flattenedCurve = flattenBezierSegments(scaledCurve)
        }
        console.log(flattenedCurve);

        const geometry = generator.generateGeometry(flattenedCurve);
        const frankenstein = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial())

        frankenstein.position.y = 2;
        this.group.add(frankenstein);
    }
}
