import * as THREE from 'three';
import { SweepGenerator } from '../helpers/SweepGenerator.js';
import { RevolutionGenerator } from '../helpers/RevolutionGenerator.js';
import { baseCurves, flattenBezierSegments, flattenCatmullSegments, rescaleCurve } from '../helpers/Curves.js';

export class TridimensionalPrinter {
    constructor(config = {}) {
        // Printing
        this.maxHeight = config.maxHeight || 3.2;
        this.maxWidth = config.maxWidth || 2;
        this.currentObject = null;

        // Model Generation
        this.scale = config.scale || new THREE.Vector3(1, 1, 1);
        this.group = new THREE.Group(); // all 3D parts here

        // Clipping
        this.clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    }

    generate() {
        this.group.clear();
        const normalMaterial = new THREE.MeshNormalMaterial();

        // Plane and Box
        const planeMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 2), normalMaterial);
        planeMesh.position.y = -0.125;
        const planeTopMesh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 1), normalMaterial);

        const handGroup = new THREE.Group();
        handGroup.add(planeMesh, planeTopMesh);

        // Arms & Box
        const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.75), normalMaterial);
        const arm1Mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.1), normalMaterial);
        arm1Mesh.position.x = 0.75; arm1Mesh.position.z = 0.1;

        const arm2Mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.1), normalMaterial);
        arm2Mesh.position.x = 0.75; arm2Mesh.position.z = -0.1;

        const connectionGroup = new THREE.Group();
        connectionGroup.name = 'connectionGroup';
        handGroup.position.x = 1.5;
        connectionGroup.add(boxMesh, arm1Mesh, arm2Mesh, handGroup);

        // Elevating bar
        const barMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 7), normalMaterial);
        barMesh.position.y = 3.5;
        const barGroup = new THREE.Group();
        connectionGroup.position.y = 6;
        barGroup.add(barMesh, connectionGroup);

        // Base
        const baseCurve = [[0.0, 1.6], [1.2, 1.6], [1.4, 2.0], [1.6, 2.0], [1.8, 1.6], [1.8, 0.0], [0.0, 0.0]].map(([x, y]) => new THREE.Vector2(x, y));

        const revGen = new RevolutionGenerator(100);
        const baseMesh = new THREE.Mesh(revGen.generateGeometry(baseCurve), normalMaterial);

        barGroup.position.x = -1.5;
        this.group.add(baseMesh, barGroup);

        this.group.scale.copy(this.scale);

        return this.group;
    }

    print(menuValues) {
        const {
            tipoSuperficie,
            forma2DRevolucion,
            forma2DBarrido,
            anguloTorsion,
            anchoTotal,
            alturaTotal,
            pasosGeneracion,
            pasosCurva
        } = menuValues;

        if (alturaTotal <= 0 || alturaTotal > this.maxHeight) {
            throw new Error("Altura inválida.");
        }
        if (anchoTotal <= 0 || anchoTotal > this.maxWidth) {
            throw new Error("Ancho inválido.");
        }

        const tipo = tipoSuperficie.toLowerCase();
        const curvaKey = tipo === "revolucion" ? forma2DRevolucion.toUpperCase() : forma2DBarrido.toUpperCase();

        const baseCurve = baseCurves.get(curvaKey);
        if (!baseCurve) {
            throw new Error(`Curva desconocida: ${curvaKey}`);
        }

        let generator;
        let scaledCurve;
        if (tipo === "revolucion") {
            scaledCurve = rescaleCurve(baseCurve.segments, { maxWidth: anchoTotal / 2, maxHeight: alturaTotal, center: false, preserveAspect: false });
            generator = new RevolutionGenerator(pasosGeneracion);
        } else if (tipo === "barrido") {
            scaledCurve = rescaleCurve(baseCurve.segments, { maxWidth: anchoTotal, maxHeight: anchoTotal, center: false, preserveAspect: true });
            generator = new SweepGenerator(alturaTotal, anguloTorsion * 2 * Math.PI / 360, pasosGeneracion);
        } else {
            throw new Error(`Tipo de superficie inválido: ${tipoSuperficie}`);
        }

        let flattenedCurve;
        if (baseCurve.type == "catmull") {
            flattenedCurve = flattenCatmullSegments(scaledCurve, pasosCurva);
        } else if (baseCurve.type == "bezier") {
            flattenedCurve = flattenBezierSegments(scaledCurve, pasosCurva);
        }

        const geometry = generator.generateGeometry(flattenedCurve);
        geometry.computeBoundingBox();

        const frankenstein = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({
            clippingPlanes: [this.clippingPlane],
            clipShadows: true,
        }));

        frankenstein.position.y = 2;
        frankenstein.name = 'PrintedObject';

        if (this.currentObject) {
            this.group.remove(this.currentObject);
            this.currentObject.geometry.dispose();
            this.currentObject.material.dispose();
            this.currentObject = null;
        }

        this.group.add(frankenstein);
        this.currentObject = frankenstein;

        this.simulatePrint(2000, alturaTotal);
    }

    simulatePrint(duration = 2000, alturaTotal) {
        if (!this.currentObject) return;

        const connectionGroup = this.group.getObjectByName('connectionGroup');
        if (!connectionGroup) return;

        const totalDistance = alturaTotal;
        const startY = 2;

        const boundingBox = this.currentObject.geometry.boundingBox;
        const maxY = boundingBox.max.y;

        const start = performance.now();

        const animate = (time) => {
            const elapsed = time - start;
            const t = Math.min(elapsed / duration, 1);

            connectionGroup.position.y = 0.1 + startY + t * totalDistance;

            this.clippingPlane.constant = this.currentObject.position.y + t * maxY;

            if (t < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    releaseCurrentObject() {
        if (!this.currentObject) return null;

        const mesh = this.currentObject;

        // Clean up material references
        if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => {
                m.clippingPlanes = null;
                m.dispose();
            });
        } else {
            mesh.material.clippingPlanes = null;
            mesh.material.dispose();
        }

        mesh.geometry.dispose();
        this.group.remove(mesh);
        this.currentObject = null;

        return mesh;
    }
}
