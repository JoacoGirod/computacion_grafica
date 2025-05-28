import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { SweepGenerator } from '../helpers/SweepGenerator.js';
import { RevolutionGenerator } from '../helpers/RevolutionGenerator.js';
import { curves } from '../helpers/Curves.js';

export class TridimensionalPrinter {
    constructor(config = {}) {
        this.maxHeight = config.maxHeight || 10;
        this.sweepingSteps = config.sweepingSteps || 10;
        this.revolutionSteps = config.revolutionSteps || 10;

        this.group = new THREE.Group(); // all 3D parts here
    }

    generate() {
        // Clear existing printer visual
        this.group.clear();

        // Create base, platform, maybe axis or arms
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.2, 2),
            new THREE.MeshStandardMaterial({ color: 0x555555 })
        );
        base.position.y = 0.1;
        this.group.add(base);

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
