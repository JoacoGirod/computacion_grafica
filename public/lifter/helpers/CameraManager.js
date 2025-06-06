import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraManager {
    constructor(renderer, scene, vehicle, printer, shelf) {
        this.renderer = renderer;
        this.scene = scene;
        this.vehicle = vehicle;
        this.printer = printer;
        this.shelf = shelf;

        this.cameras = {};
        this.controls = {};
        this.currentCamera = null;

        this.initCameras();
    }

    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        // Scene Orbit
        const sceneOrbit = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        sceneOrbit.position.set(0, 15, 15);
        this.cameras.sceneOrbit = sceneOrbit;
        this.controls.sceneOrbit = new OrbitControls(sceneOrbit, this.renderer.domElement);
        this.controls.sceneOrbit.target.set(0, 0, 0);
        this.controls.sceneOrbit.update();

        // Printer Orbit
        const printerOrbit = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        printerOrbit.position.set(0, 10, 10);
        this.cameras.printerOrbit = printerOrbit;
        this.controls.printerOrbit = new OrbitControls(printerOrbit, this.renderer.domElement);
        this.controls.printerOrbit.target.copy(this.printer.group.position);
        this.controls.printerOrbit.update();

        // Shelf Orbit
        const shelfOrbit = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        shelfOrbit.position.set(0, 10, 10);
        this.cameras.shelfOrbit = shelfOrbit;
        this.controls.shelfOrbit = new OrbitControls(shelfOrbit, this.renderer.domElement);
        this.controls.shelfOrbit.target.copy(this.shelf.group.position);
        this.controls.shelfOrbit.update();

        // Driver camera
        const driver = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        driver.position.set(2, 3, 0);
        driver.lookAt(new THREE.Vector3(1, 3, 0));
        this.vehicle.group.add(driver);
        this.cameras.driver = driver;

        // Rear follow
        const rearFollow = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.scene.add(rearFollow);
        this.cameras.rearFollow = rearFollow;

        // Side follow
        const sideFollow = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.scene.add(sideFollow);
        this.cameras.sideFollow = sideFollow;

        this.setActiveCamera('sceneOrbit');
    }

    setActiveCamera(name) {
        if (this.controls[this.currentCamera]) {
            this.controls[this.currentCamera].enabled = false;
        }
        if (this.controls[name]) {
            this.controls[name].enabled = true;
        }
        this.currentCamera = name;
    }

    animate(keys) {
        if (this.currentCamera === 'rearFollow') {
            const offset = new THREE.Vector3(12, 5, 0).applyQuaternion(this.vehicle.group.quaternion);
            this.cameras.rearFollow.position.copy(this.vehicle.group.position).add(offset);

            const lookAtTarget = new THREE.Vector3(-1, 0, 0).applyQuaternion(this.vehicle.group.quaternion).add(this.vehicle.group.position);
            this.cameras.rearFollow.lookAt(lookAtTarget);
        }


        if (this.currentCamera === 'sideFollow') {
            const offset = new THREE.Vector3(0, 2, -5).applyQuaternion(this.vehicle.group.quaternion);
            this.cameras.sideFollow.position.copy(this.vehicle.group.position).add(offset);
            this.cameras.sideFollow.lookAt(this.vehicle.group.position);
        }

        // Handle zoom if applicable
        const camera = this.cameras[this.currentCamera];
        if (camera && camera.isPerspectiveCamera) {
            if (keys['KeyO']) {
                camera.zoom *= 1.01;
                camera.updateProjectionMatrix();
                console.log(`[${this.currentCamera}] Zooming in`);
            }
            if (keys['KeyP']) {
                camera.zoom /= 1.01;
                camera.updateProjectionMatrix();
                console.log(`[${this.currentCamera}] Zooming out`);
            }
        } else if (keys['KeyO'] || keys['KeyP']) {
            console.warn(`Zoom not supported on current camera: ${this.currentCamera}`);
        }
    }

    handleKeyDown(code) {
        switch (code) {
            case 'Digit1': this.setActiveCamera('sceneOrbit'); break;
            case 'Digit2': this.setActiveCamera('printerOrbit'); break;
            case 'Digit3': this.setActiveCamera('shelfOrbit'); break;
            case 'Digit4': this.setActiveCamera('driver'); break;
            case 'Digit5': this.setActiveCamera('rearFollow'); break;
            case 'Digit6': this.setActiveCamera('sideFollow'); break;
        }
    }

    getCamera() {
        return this.cameras[this.currentCamera];
    }
}
