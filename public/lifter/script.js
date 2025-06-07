import * as THREE from 'three';
import { SceneConfig } from './configs/BaseConfig.js';
import { TridimensionalPrinter } from './elements/TridimensionalPrinter.js';
import { Shelf } from './elements/Shelf.js';
import { Vehicle } from './elements/Vehicle.js';
import { CameraManager } from './helpers/CameraManager.js';
import { House } from './elements/House.js';
import { PrinterGUI } from './helpers/PrinterGUI.js'
import { ThreeHelperGenerator } from './helpers/Helpers.js'


// =============== SETUP SCENE, CAMERA, RENDERER ===============
const scene = new THREE.Scene();

const shelfManager = new Shelf();
const shelfModel = shelfManager.generate();
shelfModel.position.x = 10;
scene.add(shelfModel);

const tridimensionalPrinterManager = new TridimensionalPrinter();
const tridimensionalPrinterModel = tridimensionalPrinterManager.generate();
tridimensionalPrinterModel.position.x = -8;
scene.add(tridimensionalPrinterModel);

const vehicleManager = new Vehicle();
const vehicleModel = vehicleManager.generate();
scene.add(vehicleModel);

const houseManager = new House();
const houseModel = houseManager.generate()
scene.add(houseModel)

const helperGen = new ThreeHelperGenerator(scene, 100);
helperGen.generate();

const guiManager = new PrinterGUI(tridimensionalPrinterManager, () => {
    console.log("Printed!");
});

const values = guiManager.generate();

// =============== RENDERER ===============

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('three-canvas')
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.localClippingEnabled = true;

const cameraManager = new CameraManager(renderer, scene, vehicleManager, tridimensionalPrinterManager, shelfManager);

const keys = {};

window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
    cameraManager.handleKeyDown(event.code); // Handles Camera Set Ups (1, 2, 3, 4, 5, 6)
});

window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
    cameraManager.handleKeyUp?.(event.code); // Handles Camera Set Ups (1, 2, 3, 4, 5, 6)
});

let gPreviouslyPressed = false;

// =============== MAIN LOOP ===============
function animate() {
    requestAnimationFrame(animate);

    vehicleManager.animate(keys); // Handles Vehicle Movement (w, a, s, d, q, e)
    cameraManager.animate(keys); // Handles Camera Movement (scrollup, scrolldown, O, P)

    const gNow = keys['KeyG'] === true;
    if (gNow && !gPreviouslyPressed)
        handleGrabOrRelease();
    gPreviouslyPressed = gNow;

    renderer.render(scene, cameraManager.getCamera());
}
animate();

// =================== GRAB / DROP LOGIC ===================

function handleGrabOrRelease() {
    if (!vehicleManager.isCarrying()) {
        const printedMesh = tridimensionalPrinterManager.currentObject;
        if (!printedMesh) {
            return;
        }

        const planeWorldPos = new THREE.Vector3();
        vehicleManager.plane.getWorldPosition(planeWorldPos);

        const objWorldPos = new THREE.Vector3();
        printedMesh.getWorldPosition(objWorldPos);

        const distance = planeWorldPos.distanceTo(objWorldPos);
        const grabThreshold = 1; // tweak as needed

        if (distance <= grabThreshold) {
            const meshToPick = tridimensionalPrinterManager.releaseCurrentObject();
            if (meshToPick) {
                vehicleManager.pickUpObject(meshToPick);
            }
        }
    } else {
        const heldMesh = vehicleManager.dropOffObject();

        const planeWorldPos = new THREE.Vector3();
        vehicleManager.plane.getWorldPosition(planeWorldPos);

        const dropThreshold = 1;
        const placed = shelfManager.placeModelIfClose(planeWorldPos, heldMesh, dropThreshold);

        if (!placed) {
            vehicleManager.pickUpObject(heldMesh);
        }
    }
}
