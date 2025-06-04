import * as THREE from 'three';
import { SceneConfig } from './configs/BaseConfig.js';
import { TridimensionalPrinter } from './elements/TridimensionalPrinter.js';
import { Shelf } from './elements/Shelf.js';
import { Vehicle } from './elements/Vehicle.js';
import { flattenBezierSegments, flattenCatmullSegments, rescaleCurve } from './helpers/utils/curves.js';
import { generateHelpers } from './debug/Helpers.js';
import { SweepGenerator } from './helpers/SweepGenerator.js';
import { curves } from './helpers/Curves.js';
import { RevolutionGenerator } from './helpers/RevolutionGenerator.js';

// The Scene contains all the elements
const scene = new THREE.Scene();

// Magic
generateHelpers(scene, SceneConfig.GRID_SIZE);


// =============== SCENE ================
const shelfManager = new Shelf();
const shelfModel = shelfManager.generate()
shelfModel.rotation.y = Math.PI / 2
shelfModel.position.x = 10
scene.add(shelfModel);

const tridimensionalPrinterManager = new TridimensionalPrinter()
const tridimensionalPrinterModel = tridimensionalPrinterManager.generate()
tridimensionalPrinterModel.position.x = -8
scene.add(tridimensionalPrinterModel)
//
const vehicleManager = new Vehicle()
const vehicleModel = vehicleManager.generate()
scene.add(vehicleModel)

// =============== CUSTOM CURVE TESTING ================
// const originalCurve = curves.A4();
// const scaledCurve = rescaleCurve(originalCurve, { maxWidth: 1, maxHeight: 1, center: false });
// const flattenedCurve = flattenCatmullSegments(scaledCurve)
// const generator = new RevolutionGenerator(1, 50);
// const geometry = generator.generateGeometry(flattenedCurve);
// const meshNormalMaterial = new THREE.MeshNormalMaterial();
// const frankenstein = new THREE.Mesh(geometry, meshNormalMaterial)
// scene.add(frankenstein)


// const originalCurve = curves.B1();
// const scaledCurve = rescaleCurve(originalCurve, { maxWidth: 1, maxHeight: 1, center: true });
// const flattenedCurve = flattenCatmullSegments(scaledCurve)

// const generator = new SweepGenerator(5, Math.PI, 50);
// const geometry = generator.generateGeometry(flattenedCurve);
// const meshNormalMaterial = new THREE.MeshNormalMaterial();
// const frankenstein = new THREE.Mesh(geometry, meshNormalMaterial)
// scene.add(frankenstein)

// ========= ANIMATION =======
export const keys = {};
window.addEventListener('keydown', (event) => keys[event.code] = true);
window.addEventListener('keyup', (event) => keys[event.code] = false);

// The camera determines the viewpoint, in this case, 75 degrees of field of view, establishes the screen dimensions using the window, define near and far ranges for Frustum
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Camera position
camera.position.set(
    SceneConfig.CAMERA.POSITION.x,
    SceneConfig.CAMERA.POSITION.y,
    SceneConfig.CAMERA.POSITION.z
);

// The renderer converts the 3D Scene into a 2D image
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
// Specify the sizes to the rendered
renderer.setSize(window.innerWidth, window.innerHeight);
// Add the canvas to the webpage
document.body.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);

    // Animate models
    vehicleManager.animate(keys);


    // Render
    renderer.render(scene, camera);
}

animate();