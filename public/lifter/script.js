// src/index.js
import * as THREE from 'three';
import { SceneConfig } from './configs/BaseConfig.js';
import { TridimensionalPrinter } from './elements/TridimensionalPrinter.js';
import { Shelf } from './elements/Shelf.js';
import { Vehicle } from './elements/Vehicle.js';
import { generateHelpers } from './debug/Helpers.js';
import { GUI } from 'dat.gui';

// =============== SETUP SCENE, CAMERA, RENDERER ===============
const scene = new THREE.Scene();

// 1) Shelf
const shelfManager = new Shelf();
const shelfModel = shelfManager.generate();
shelfModel.position.x = 10;
scene.add(shelfModel);

// 2) Tridimensional Printer (the “printer unit”)
const tridimensionalPrinterManager = new TridimensionalPrinter();
const tridimensionalPrinterModel = tridimensionalPrinterManager.generate();
tridimensionalPrinterModel.position.x = -8;
scene.add(tridimensionalPrinterModel);

// 3) Vehicle
const vehicleManager = new Vehicle();
const vehicleModel = vehicleManager.generate();
scene.add(vehicleModel);

// 4) Helpers (grid, axes, etc.)
generateHelpers(scene, SceneConfig.GRID_SIZE);

// =============== GUI MENU ===============
const gui = new GUI();
const menuValues = {
    tipoSuperficie: 'revolucion',
    forma2DRevolucion: 'A1',
    forma2DBarrido: 'B1',
    anguloTorsion: 0,
    alturaTotal: 1,
    anchoTotal: 1,
    imprimir: () => {
        try {
            tridimensionalPrinterManager.print(menuValues);
        } catch (err) {
            console.error(`Error: ${err}`);
        }
    }
};

const tipoController = gui
    .add(menuValues, 'tipoSuperficie', ['revolucion', 'barrido'])
    .name('Tipo de Superficie');

const revolucionFolder = gui.addFolder('Revolución');
revolucionFolder
    .add(menuValues, 'forma2DRevolucion', ['A1', 'A2', 'A3', 'A4'])
    .name('Forma 2D');

const barridoFolder = gui.addFolder('Barrido');
barridoFolder
    .add(menuValues, 'forma2DBarrido', ['B1', 'B2', 'B3', 'B4'])
    .name('Forma 2D');

gui
    .add(menuValues, 'anguloTorsion')
    .name('Ángulo de torsión')
    .min(0)
    .max(360)
    .step(1);
gui
    .add(menuValues, 'alturaTotal')
    .name('Altura total')
    .min(1)
    .max(3.2)
    .step(0.1);
gui
    .add(menuValues, 'anchoTotal')
    .name('Ancho total')
    .min(1)
    .max(2)
    .step(0.1);
gui.add(menuValues, 'imprimir').name('Imprimir');

function updateVisibility() {
    const isBarrido = menuValues.tipoSuperficie === 'barrido';
    barridoFolder.domElement.style.display = isBarrido ? '' : 'none';
    revolucionFolder.domElement.style.display = isBarrido ? 'none' : '';
}
tipoController.onChange(updateVisibility);
updateVisibility();

// =============== INPUT STATE ===============
export const keys = {};
window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});
window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// We want to detect a “fresh press” of G, not a hold.
// We'll track the previous frame’s state of G:
let gPreviouslyPressed = false;

// =============== CAMERA ===============
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(
    SceneConfig.CAMERA.POSITION.x,
    SceneConfig.CAMERA.POSITION.y,
    SceneConfig.CAMERA.POSITION.z
);

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('three-canvas')
});
renderer.setSize(window.innerWidth, window.innerHeight);

// =============== ANIMATE LOOP ===============
function animate() {
    requestAnimationFrame(animate);

    // Animate the vehicle based on WASD/Q/E
    vehicleManager.animate(keys);

    // Handle “G” press (pick up / drop off)
    const gNow = keys['KeyG'] === true;
    if (gNow && !gPreviouslyPressed) {
        handleGrabOrRelease();
    }
    gPreviouslyPressed = gNow;

    renderer.render(scene, camera);
}

animate();

// =================== GRAB / DROP LOGIC ===================

function handleGrabOrRelease() {
    // 1) Are we already carrying something?
    if (!vehicleManager.isCarrying()) {
        // Not carrying: try to pick up from printer if close enough

        // If there is no printed object at all, do nothing:
        const printedMesh = tridimensionalPrinterManager.currentObject;
        if (!printedMesh) {
            return; // nothing to pick up
        }

        // Get world‐space positions:
        const planeWorldPos = new THREE.Vector3();
        vehicleManager.plane.getWorldPosition(planeWorldPos);
        // console.log(planeWorldPos);

        const objWorldPos = new THREE.Vector3();
        printedMesh.getWorldPosition(objWorldPos);
        // console.log(objWorldPos);

        const distance = planeWorldPos.distanceTo(objWorldPos);
        const grabThreshold = 0.5; // tweak as needed

        if (distance <= grabThreshold) {
            // Actually detach from printer and attach to plane:
            //  releaseCurrentObject() removes it from printer.group and returns the mesh
            const meshToPick = tridimensionalPrinterManager.releaseCurrentObject();
            if (meshToPick) {
                vehicleManager.pickUpObject(meshToPick);
            }
        }
    } else {

        // Already carrying something: try to drop onto the shelf
        const heldMesh = vehicleManager.dropOffObject();
        if (!heldMesh) return; // Shouldn’t happen, but guard

        // World Pos
        const planeWorldPos = new THREE.Vector3();
        vehicleManager.plane.getWorldPosition(planeWorldPos);

        // Attempt to place into the nearest empty shelf cell:
        const dropThreshold = 1; // tweak until it “snaps” reliably
        const placed = shelfManager.placeModelIfClose(planeWorldPos, heldMesh, dropThreshold);

        if (!placed) {
            // If we weren’t close enough to any empty cell,
            // put it back on the plane so the vehicle still holds it:
            vehicleManager.pickUpObject(heldMesh);
        }
    }
}
