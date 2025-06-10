import * as THREE from 'three';
import { RevolutionGenerator } from '../helpers/RevolutionGenerator.js';
import { SweepGenerator } from '../helpers/SweepGenerator.js';
import { flattenBezierSegments } from '../helpers/Curves.js';
import { rescaleCurve } from '../helpers/Curves.js';

export class Vehicle {
    constructor(config = {}) {
        // Model Generation
        this.scale = config.scale || new THREE.Vector3(1, 1, 1);
        this.group = new THREE.Group(); // all 3D parts here
        this.wheels = [];
        this.plane = null; // Moving plane
        this.heldObject = null;
    }

    generate() {
        this.group.clear();
        this.wheels = []

        const normalMaterial = new THREE.MeshNormalMaterial()

        // ================ LIFTER
        // Rails
        const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7, 0.3), normalMaterial)
        rail1.position.y = 3.5; rail1.position.z = 0.75
        const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7, 0.3), normalMaterial)
        rail2.position.y = 3.5; rail2.position.z = -0.75

        // Cross Rails
        const crossRail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), normalMaterial)
        crossRail1.position.x = 0.05; crossRail1.position.y = 0.5
        const crossRail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), normalMaterial)
        crossRail2.position.x = 0.05; crossRail2.position.y = 3.66
        const crossRail3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), normalMaterial)
        crossRail3.position.x = 0.05; crossRail3.position.y = 6.8

        // Plane
        this.plane = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1.5), normalMaterial)
        this.plane.position.x = -1; this.plane.position.y = 2

        const railGroup = new THREE.Group()
        railGroup.add(rail1, rail2, crossRail1, crossRail2, crossRail3, this.plane)
        railGroup.position.y = 0.5

        // ================ BODY
        // Vehicle Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1, 2), normalMaterial)
        body.position.x = 3.8 / 2 + 0.05; body.position.y = 0.5 + 1.25 / 2

        // ================ WHEELS
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.25), normalMaterial)
        wheel.rotation.x = Math.PI / 2
        const wheelDecoration = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.1, 0.1), normalMaterial)
        wheelDecoration.position.z = 0.25;

        const wheel1Group = new THREE.Group()
        wheel1Group.add(wheel, wheelDecoration)
        wheel1Group.position.y = 0.5

        const wheel2Group = wheel1Group.clone()
        const wheel3Group = wheel1Group.clone();
        wheel3Group.scale.copy(new THREE.Vector3(1, -1, -1));
        const wheel4Group = wheel1Group.clone();
        wheel4Group.scale.copy(new THREE.Vector3(1, -1, -1));

        wheel1Group.position.x = 1; wheel1Group.position.z = 1
        wheel2Group.position.x = 2.75; wheel2Group.position.z = 1
        wheel3Group.position.x = 1; wheel3Group.position.z = -1
        wheel4Group.position.x = 2.75; wheel4Group.position.z = -1

        this.wheels.push(wheel1Group, wheel2Group, wheel3Group, wheel4Group)

        // ================ VEHICLE
        const vehicleGroup = new THREE.Group()
        vehicleGroup.add(body, wheel1Group, wheel2Group, wheel3Group, wheel4Group)

        this.group.add(railGroup, vehicleGroup)

        this.group.scale.copy(this.scale);

        return this.group;
    }

    generateZonda() {
        this.group.clear();
        this.wheels = []

        const normalMaterial = new THREE.MeshNormalMaterial()

        // ================ LIFTER
        // Rails
        const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7, 0.3), normalMaterial)
        rail1.position.y = 3.5; rail1.position.z = 0.75
        const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7, 0.3), normalMaterial)
        rail2.position.y = 3.5; rail2.position.z = -0.75

        // Cross Rails
        const crossRail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), normalMaterial)
        crossRail1.position.x = 0.05; crossRail1.position.y = 0.5
        const crossRail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), normalMaterial)
        crossRail2.position.x = 0.05; crossRail2.position.y = 3.66
        const crossRail3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), normalMaterial)
        crossRail3.position.x = 0.05; crossRail3.position.y = 6.8

        // Plane
        this.plane = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1.5), normalMaterial)
        this.plane.position.x = -1; this.plane.position.y = 2

        const railGroup = new THREE.Group()
        railGroup.add(rail1, rail2, crossRail1, crossRail2, crossRail3, this.plane)
        railGroup.position.y = 0.5

        // =============== WHEELS
        const wheelOutside = [
            [new THREE.Vector2(0, 3), new THREE.Vector2(-1, 3), new THREE.Vector2(-1, 1)],
            [new THREE.Vector2(-1, 1), new THREE.Vector2(-5, 1)],
            [new THREE.Vector2(-5, 1), new THREE.Vector2(-5, 3), new THREE.Vector2(-6, 3)],
            [new THREE.Vector2(-6, 3), new THREE.Vector2(-7, 3), new THREE.Vector2(-7, 1)],
            [new THREE.Vector2(-7, 1), new THREE.Vector2(-7, 0)],
            [new THREE.Vector2(-7, 0), new THREE.Vector2(0, 0)]
        ]
        const scaledCurveWO = rescaleCurve(wheelOutside, { maxWidth: 0.6, maxHeight: 0.2, center: false, preserveAspect: false });
        const flattenedCurveWO = flattenBezierSegments(scaledCurveWO);
        const generatorWO = new RevolutionGenerator(50);
        const wheelOutsideMesh = new THREE.Mesh(generatorWO.generateGeometry(flattenedCurveWO), normalMaterial);
        wheelOutsideMesh.rotation.x = Math.PI / 2

        const wheelInside = [
            [new THREE.Vector2(0.5, 4.5), new THREE.Vector2(-0.5, 4.5)],
            [new THREE.Vector2(-0.5, 4.5), new THREE.Vector2(-0.5, 1.5)],
            [new THREE.Vector2(-0.5, 1.5), new THREE.Vector2(-2.5, 3.5)],
            [new THREE.Vector2(-2.5, 3.5), new THREE.Vector2(-3.5, 2.5)],
            [new THREE.Vector2(-3.5, 2.5), new THREE.Vector2(-1.5, 0.5)],
            [new THREE.Vector2(-1.5, 0.5), new THREE.Vector2(-4.5, 0.5)],
            [new THREE.Vector2(-4.5, 0.5), new THREE.Vector2(-4.5, -0.5)],
            [new THREE.Vector2(-4.5, -0.5), new THREE.Vector2(-1.5, -0.5)],
            [new THREE.Vector2(-1.5, -0.5), new THREE.Vector2(-3.5, -2.5)],
            [new THREE.Vector2(-3.5, -2.5), new THREE.Vector2(-2.5, -3.5)],
            [new THREE.Vector2(-2.5, -3.5), new THREE.Vector2(-0.5, -1.5)],
            [new THREE.Vector2(-0.5, -1.5), new THREE.Vector2(-0.5, -4.5)],
            [new THREE.Vector2(-0.5, -4.5), new THREE.Vector2(0.5, -4.5)],
            [new THREE.Vector2(0.5, -4.5), new THREE.Vector2(0.5, -1.5)],
            [new THREE.Vector2(0.5, -1.5), new THREE.Vector2(2.5, -3.5)],
            [new THREE.Vector2(2.5, -3.5), new THREE.Vector2(3.5, -2.5)],
            [new THREE.Vector2(3.5, -2.5), new THREE.Vector2(1.5, -0.5)],
            [new THREE.Vector2(1.5, -0.5), new THREE.Vector2(4.5, -0.5)],
            [new THREE.Vector2(4.5, -0.5), new THREE.Vector2(4.5, 0.5)],
            [new THREE.Vector2(4.5, 0.5), new THREE.Vector2(1.5, 0.5)],
            [new THREE.Vector2(1.5, 0.5), new THREE.Vector2(3.5, 2.5)],
            [new THREE.Vector2(3.5, 2.5), new THREE.Vector2(2.5, 3.5)],
            [new THREE.Vector2(2.5, 3.5), new THREE.Vector2(0.5, 1.5)],
            [new THREE.Vector2(0.5, 1.5), new THREE.Vector2(0.5, 4.5)]
        ]

        const scaledCurveWI = rescaleCurve(wheelInside, { maxWidth: 1, center: false, preserveAspect: true });
        const flattenedCurveWI = flattenBezierSegments(scaledCurveWI);
        const generatorWI = new SweepGenerator(0.2, 0, 3);

        const wheelInsideMesh1 = new THREE.Mesh(generatorWI.generateGeometry(flattenedCurveWI), normalMaterial);
        wheelInsideMesh1.rotation.x = Math.PI / 2

        const wheelInsideMesh2 = new THREE.Mesh(generatorWI.generateGeometry(flattenedCurveWI), normalMaterial);
        wheelInsideMesh2.rotation.x = Math.PI / 2

        const wheel1Group = new THREE.Group()
        wheel1Group.add(wheelOutsideMesh, wheelInsideMesh1, wheelInsideMesh2)
        wheel1Group.position.y = 0.6

        const wheel2Group = wheel1Group.clone()
        const wheel3Group = wheel1Group.clone();
        wheel3Group.scale.copy(new THREE.Vector3(1, -1, -1));
        const wheel4Group = wheel1Group.clone();
        wheel4Group.scale.copy(new THREE.Vector3(1, -1, -1));

        wheel1Group.position.x = 1.8; wheel1Group.position.z = 1.85
        wheel2Group.position.x = 6.5; wheel2Group.position.z = 1.85
        wheel3Group.position.x = 1.8; wheel3Group.position.z = -1.85
        wheel4Group.position.x = 6.5; wheel4Group.position.z = -1.85

        this.wheels.push(wheel1Group, wheel2Group, wheel3Group, wheel4Group)

        const wheels = new THREE.Group()

        wheels.add(wheel1Group, wheel2Group, wheel3Group, wheel4Group)

        // ================== CHASIS
        const outerChasis = [
            [new THREE.Vector2(17, 7), new THREE.Vector2(11, 10), new THREE.Vector2(1, 5)],
            [new THREE.Vector2(1, 5), new THREE.Vector2(3, 3), new THREE.Vector2(3, 1)],
            [new THREE.Vector2(3, 1), new THREE.Vector2(5, 0), new THREE.Vector2(0, 0)],
            [new THREE.Vector2(0, 0), new THREE.Vector2(9, 0)],
            [new THREE.Vector2(10, 0), new THREE.Vector2(8.5, 0), new THREE.Vector2(8, 3)],
            [new THREE.Vector2(8, 3), new THREE.Vector2(9, 6), new THREE.Vector2(12, 6)],
            [new THREE.Vector2(12, 6), new THREE.Vector2(15, 6), new THREE.Vector2(16, 3)],
            [new THREE.Vector2(16, 3), new THREE.Vector2(16, 1), new THREE.Vector2(14, 0)],
            [new THREE.Vector2(15, 0), new THREE.Vector2(40, 0)],
            [new THREE.Vector2(41, 0), new THREE.Vector2(39.5, 0), new THREE.Vector2(39, 3)],
            [new THREE.Vector2(39, 3), new THREE.Vector2(40, 6), new THREE.Vector2(43, 6)],
            [new THREE.Vector2(43, 6), new THREE.Vector2(46, 6), new THREE.Vector2(47, 3)],
            [new THREE.Vector2(47, 3), new THREE.Vector2(47, 1), new THREE.Vector2(45, 0)],
            [new THREE.Vector2(46, 0), new THREE.Vector2(49, 0), new THREE.Vector2(53, 0)],
            [new THREE.Vector2(53, 0), new THREE.Vector2(53, 3), new THREE.Vector2(53, 4)],
            [new THREE.Vector2(53, 4), new THREE.Vector2(52, 4), new THREE.Vector2(51, 6)],
            [new THREE.Vector2(51, 6), new THREE.Vector2(48, 7), new THREE.Vector2(44, 9), new THREE.Vector2(40, 8)],
            [new THREE.Vector2(40, 8), new THREE.Vector2(33, 6), new THREE.Vector2(29, 6)],
            [new THREE.Vector2(29, 6), new THREE.Vector2(20, 6), new THREE.Vector2(17, 7)]
        ]
        const scaledCurveCO = rescaleCurve(outerChasis, { maxWidth: 8, center: false, preserveAspect: true });
        const flattenedCurveCO = flattenBezierSegments(scaledCurveCO);
        const generatorCO = new SweepGenerator(1, 0, 3);
        const outerChasisMesh1 = new THREE.Mesh(generatorCO.generateGeometry(flattenedCurveCO), normalMaterial);
        const outerChasisMesh2 = new THREE.Mesh(generatorCO.generateGeometry(flattenedCurveCO), normalMaterial);
        outerChasisMesh1.rotation.x = -Math.PI / 2
        outerChasisMesh1.position.y = 0.08; outerChasisMesh1.position.z = 2
        outerChasisMesh2.rotation.x = -Math.PI / 2
        outerChasisMesh2.position.y = 0.08; outerChasisMesh2.position.z = -1

        const innerChasis = [
            [new THREE.Vector2(16, 7), new THREE.Vector2(9, 7), new THREE.Vector2(0, 5)],
            [new THREE.Vector2(0, 5), new THREE.Vector2(2, 2), new THREE.Vector2(0, 0)],
            [new THREE.Vector2(52, 0), new THREE.Vector2(52, 3), new THREE.Vector2(52, 4)],
            [new THREE.Vector2(52, 4), new THREE.Vector2(51, 5), new THREE.Vector2(50, 6)],
            [new THREE.Vector2(50, 6), new THREE.Vector2(48, 8), new THREE.Vector2(43, 9), new THREE.Vector2(39, 7)],
            [new THREE.Vector2(39, 7), new THREE.Vector2(32, 6), new THREE.Vector2(28, 6)],
            [new THREE.Vector2(28, 6), new THREE.Vector2(19, 6), new THREE.Vector2(16, 7)]
        ]

        const scaledCurveCI = rescaleCurve(innerChasis, { maxWidth: 8, center: false, preserveAspect: true });
        const flattenedCurveCI = flattenBezierSegments(scaledCurveCI);
        const generatorCI = new SweepGenerator(2, 0, 3);
        const innerChasisMesh = new THREE.Mesh(generatorCI.generateGeometry(flattenedCurveCI), normalMaterial);
        innerChasisMesh.rotation.x = -Math.PI / 2
        innerChasisMesh.position.y = 0.05; innerChasisMesh.position.z = 1

        // ================== COCKPIT
        const cockpit = [
            [new THREE.Vector2(10, 8), new THREE.Vector2(6, 8), new THREE.Vector2(0, 2)],
            [new THREE.Vector2(0, 2), new THREE.Vector2(3, 2), new THREE.Vector2(6, 0)],
            [new THREE.Vector2(6, 0), new THREE.Vector2(18, 0), new THREE.Vector2(27, 4)],
            [new THREE.Vector2(27, 4), new THREE.Vector2(19, 8), new THREE.Vector2(10, 8)]
        ]
        const scaledCurveC = rescaleCurve(cockpit, { maxWidth: 3.6, center: false, preserveAspect: true });
        const flattenedCurveC = flattenBezierSegments(scaledCurveC);
        const generatorC = new SweepGenerator(1.6, 0, 3);
        const cockpitMesh = new THREE.Mesh(generatorC.generateGeometry(flattenedCurveC), normalMaterial);
        cockpitMesh.rotation.x = -Math.PI / 2
        cockpitMesh.position.x = 2.2; cockpitMesh.position.y = 0.7; cockpitMesh.position.z = 0.8

        // ================== SPOILER
        const spoilerArm = [
            [new THREE.Vector2(6, 6), new THREE.Vector2(3, 6)],
            [new THREE.Vector2(3, 6), new THREE.Vector2(1, 4), new THREE.Vector2(0, 0)],
            [new THREE.Vector2(5, 0), new THREE.Vector2(0, 0)],
            [new THREE.Vector2(5, 0), new THREE.Vector2(6, 6)]
        ]
        const scaledCurveSA = rescaleCurve(spoilerArm, { maxWidth: 0.4, center: false, preserveAspect: true });
        const flattenedCurveSA = flattenBezierSegments(scaledCurveSA);
        const generatorSA = new SweepGenerator(0.4, 0, 3);
        const spoilerArmMesh1 = new THREE.Mesh(generatorSA.generateGeometry(flattenedCurveSA), normalMaterial);
        spoilerArmMesh1.rotation.x = -Math.PI / 2
        spoilerArmMesh1.position.x = 7; spoilerArmMesh1.position.y = 1.2; spoilerArmMesh1.position.z = 1.3
        const spoilerArmMesh2 = new THREE.Mesh(generatorSA.generateGeometry(flattenedCurveSA), normalMaterial);
        spoilerArmMesh2.rotation.x = -Math.PI / 2
        spoilerArmMesh2.position.x = 7; spoilerArmMesh2.position.y = 1.2; spoilerArmMesh2.position.z = -0.9

        const spoiler = [
            [new THREE.Vector2(12, 4), new THREE.Vector2(2, 4)],
            [new THREE.Vector2(2, 4), new THREE.Vector2(0, 4), new THREE.Vector2(0, 3)],
            [new THREE.Vector2(0, 3), new THREE.Vector2(0, 2)],
            [new THREE.Vector2(0, 2), new THREE.Vector2(2, 0)],
            [new THREE.Vector2(2, 0), new THREE.Vector2(7, 0)],
            [new THREE.Vector2(7, 0), new THREE.Vector2(13, 3), new THREE.Vector2(12, 4)]
        ]
        const scaledCurveS = rescaleCurve(spoiler, { maxWidth: 0.7, center: false, preserveAspect: true });
        const flattenedCurveS = flattenBezierSegments(scaledCurveS);
        const generatorS = new SweepGenerator(4, 0, 3);
        const spoilerMesh = new THREE.Mesh(generatorS.generateGeometry(flattenedCurveS), normalMaterial);
        spoilerMesh.rotation.x = -Math.PI / 2
        spoilerMesh.position.x = 7.2; spoilerMesh.position.y = 1.5; spoilerMesh.position.z = 2

        // ================== AIR INTAKE
        const airIntake = [
            [new THREE.Vector2(8, 2), new THREE.Vector2(4, 5), new THREE.Vector2(0, 5)],
            [new THREE.Vector2(0, 5), new THREE.Vector2(1, 2), new THREE.Vector2(0, 0)],
            [new THREE.Vector2(8, 2), new THREE.Vector2(0, 0)]
        ]
        const scaledCurveAI = rescaleCurve(airIntake, { maxWidth: 0.7, center: false, preserveAspect: true });
        const flattenedCurveAI = flattenBezierSegments(scaledCurveAI);
        const generatorAI1 = new SweepGenerator(0.8, 0, 3);
        const airIntakeMesh1 = new THREE.Mesh(generatorAI1.generateGeometry(flattenedCurveAI), normalMaterial);
        airIntakeMesh1.rotation.x = -Math.PI / 2
        airIntakeMesh1.position.x = 1.5; airIntakeMesh1.position.y = 0.8; airIntakeMesh1.position.z = 0.4
        const generatorAI2 = new SweepGenerator(0.6, 0, 3);
        const airIntakeMesh2 = new THREE.Mesh(generatorAI2.generateGeometry(flattenedCurveAI), normalMaterial);
        airIntakeMesh2.rotation.x = -Math.PI / 2
        airIntakeMesh2.position.x = 1.1; airIntakeMesh2.position.y = 0.7; airIntakeMesh2.position.z = 0.3

        // ================== HEADLIGHTS
        const headlight = [
            [new THREE.Vector2(8, 2), new THREE.Vector2(5, 5), new THREE.Vector2(0, 5)],
            [new THREE.Vector2(0, 5), new THREE.Vector2(0, 2), new THREE.Vector2(0, 0)],
            [new THREE.Vector2(8, 2), new THREE.Vector2(0, 0)]
        ]
        const scaledCurveH = rescaleCurve(headlight, { maxWidth: 0.7, center: false, preserveAspect: true });
        const flattenedCurveH = flattenBezierSegments(scaledCurveH);
        const generatorH = new SweepGenerator(0.5, 0, 3);
        const headlightMesh1 = new THREE.Mesh(generatorH.generateGeometry(flattenedCurveH), normalMaterial);
        headlightMesh1.rotation.x = -Math.PI / 2
        headlightMesh1.position.x = 0.8; headlightMesh1.position.y = 1; headlightMesh1.position.z = 1.65
        const headlightMesh2 = new THREE.Mesh(generatorH.generateGeometry(flattenedCurveH), normalMaterial);
        headlightMesh2.rotation.x = -Math.PI / 2
        headlightMesh2.position.x = 0.8; headlightMesh2.position.y = 1; headlightMesh2.position.z = -1.15

        const mainBody = new THREE.Group()

        mainBody.add(headlightMesh1, headlightMesh2)
        mainBody.add(airIntakeMesh1, airIntakeMesh2)
        mainBody.add(spoilerArmMesh1, spoilerArmMesh2, spoilerMesh)
        mainBody.add(cockpitMesh)
        mainBody.add(innerChasisMesh, outerChasisMesh1, outerChasisMesh2)

        // ================ VEHICLE
        const carGroup = new THREE.Group()
        carGroup.add(railGroup, mainBody, wheels)

        this.group.add(carGroup)

        this.group.scale.copy(this.scale);

        return this.group;
    }

    generateForklift() {
        this.group.clear();
        this.wheels = []

        const normalMaterial = new THREE.MeshNormalMaterial()

        // ================ LIFTER
        // Rails
        const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7, 0.3), normalMaterial)
        rail1.position.y = 3.5; rail1.position.z = 0.75
        const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7, 0.3), normalMaterial)
        rail2.position.y = 3.5; rail2.position.z = -0.75

        // Cross Rails
        const crossRail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), normalMaterial)
        crossRail1.position.x = 0.05; crossRail1.position.y = 0.5
        const crossRail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), normalMaterial)
        crossRail2.position.x = 0.05; crossRail2.position.y = 3.66
        const crossRail3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), normalMaterial)
        crossRail3.position.x = 0.05; crossRail3.position.y = 6.8

        // Plane
        this.plane = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1.5), normalMaterial)
        this.plane.position.x = -1; this.plane.position.y = 2

        const railGroup = new THREE.Group()
        railGroup.add(rail1, rail2, crossRail1, crossRail2, crossRail3, this.plane)
        railGroup.position.y = 0.5

        // =============== WHEELS
        const wheelOutside = [
            [new THREE.Vector2(0, 3), new THREE.Vector2(-1, 3), new THREE.Vector2(-1, 1)],
            [new THREE.Vector2(-1, 1), new THREE.Vector2(-5, 1)],
            [new THREE.Vector2(-5, 1), new THREE.Vector2(-5, 3), new THREE.Vector2(-6, 3)],
            [new THREE.Vector2(-6, 3), new THREE.Vector2(-7, 3), new THREE.Vector2(-7, 1)],
            [new THREE.Vector2(-7, 1), new THREE.Vector2(-7, 0)],
            [new THREE.Vector2(-7, 0), new THREE.Vector2(0, 0)]
        ]
        const scaledCurveWO = rescaleCurve(wheelOutside, { maxWidth: 0.6, maxHeight: 0.2, center: false, preserveAspect: false });
        const flattenedCurveWO = flattenBezierSegments(scaledCurveWO);
        const generatorWO = new RevolutionGenerator(50);
        const wheelOutsideMesh = new THREE.Mesh(generatorWO.generateGeometry(flattenedCurveWO), normalMaterial);
        wheelOutsideMesh.rotation.x = Math.PI / 2

        const wheelInside = [
            [new THREE.Vector2(0.5, 4.5), new THREE.Vector2(-0.5, 4.5)],
            [new THREE.Vector2(-0.5, 4.5), new THREE.Vector2(-0.5, 1.5)],
            [new THREE.Vector2(-0.5, 1.5), new THREE.Vector2(-2.5, 3.5)],
            [new THREE.Vector2(-2.5, 3.5), new THREE.Vector2(-3.5, 2.5)],
            [new THREE.Vector2(-3.5, 2.5), new THREE.Vector2(-1.5, 0.5)],
            [new THREE.Vector2(-1.5, 0.5), new THREE.Vector2(-4.5, 0.5)],
            [new THREE.Vector2(-4.5, 0.5), new THREE.Vector2(-4.5, -0.5)],
            [new THREE.Vector2(-4.5, -0.5), new THREE.Vector2(-1.5, -0.5)],
            [new THREE.Vector2(-1.5, -0.5), new THREE.Vector2(-3.5, -2.5)],
            [new THREE.Vector2(-3.5, -2.5), new THREE.Vector2(-2.5, -3.5)],
            [new THREE.Vector2(-2.5, -3.5), new THREE.Vector2(-0.5, -1.5)],
            [new THREE.Vector2(-0.5, -1.5), new THREE.Vector2(-0.5, -4.5)],
            [new THREE.Vector2(-0.5, -4.5), new THREE.Vector2(0.5, -4.5)],
            [new THREE.Vector2(0.5, -4.5), new THREE.Vector2(0.5, -1.5)],
            [new THREE.Vector2(0.5, -1.5), new THREE.Vector2(2.5, -3.5)],
            [new THREE.Vector2(2.5, -3.5), new THREE.Vector2(3.5, -2.5)],
            [new THREE.Vector2(3.5, -2.5), new THREE.Vector2(1.5, -0.5)],
            [new THREE.Vector2(1.5, -0.5), new THREE.Vector2(4.5, -0.5)],
            [new THREE.Vector2(4.5, -0.5), new THREE.Vector2(4.5, 0.5)],
            [new THREE.Vector2(4.5, 0.5), new THREE.Vector2(1.5, 0.5)],
            [new THREE.Vector2(1.5, 0.5), new THREE.Vector2(3.5, 2.5)],
            [new THREE.Vector2(3.5, 2.5), new THREE.Vector2(2.5, 3.5)],
            [new THREE.Vector2(2.5, 3.5), new THREE.Vector2(0.5, 1.5)],
            [new THREE.Vector2(0.5, 1.5), new THREE.Vector2(0.5, 4.5)]
        ]

        const scaledCurveWI = rescaleCurve(wheelInside, { maxWidth: 1, center: false, preserveAspect: true });
        const flattenedCurveWI = flattenBezierSegments(scaledCurveWI);
        const generatorWI = new SweepGenerator(0.2, 0, 3);
        const wheelInsideMesh = new THREE.Mesh(generatorWI.generateGeometry(flattenedCurveWI), normalMaterial);
        wheelInsideMesh.rotation.x = Math.PI / 2
        const wheel1Group = new THREE.Group()
        wheel1Group.add(wheelOutsideMesh, wheelInsideMesh)

        const wheel2Group = wheel1Group.clone()
        wheel1Group.scale.copy(new THREE.Vector3(1.3, 1.3, 1))
        const wheel3Group = wheel1Group.clone();
        wheel3Group.scale.copy(new THREE.Vector3(1.3, -1.3, -1))
        const wheel4Group = wheel1Group.clone();
        wheel4Group.scale.copy(new THREE.Vector3(1, -1, -1));

        wheel1Group.position.x = 1.7; wheel1Group.position.y = 0.77; wheel1Group.position.z = 1.3
        wheel2Group.position.x = 5.3; wheel2Group.position.y = 0.6; wheel2Group.position.z = 1.3
        wheel3Group.position.x = 1.7; wheel3Group.position.y = 0.77; wheel3Group.position.z = -1.5
        wheel4Group.position.x = 5.3; wheel4Group.position.y = 0.6; wheel4Group.position.z = -1.5

        this.wheels.push(wheel1Group, wheel2Group, wheel3Group, wheel4Group)

        const wheels = new THREE.Group()

        wheels.add(wheel1Group, wheel2Group, wheel3Group, wheel4Group)

        // ================ BODIES
        const body = [
            [new THREE.Vector2(4, 0), new THREE.Vector2(4, 4), new THREE.Vector2(0, 4)],
            [new THREE.Vector2(4, 0), new THREE.Vector2(12, 0)],
            [new THREE.Vector2(12, 0), new THREE.Vector2(12, 3), new THREE.Vector2(14, 3)],
            [new THREE.Vector2(14, 3), new THREE.Vector2(16, 3)],
            [new THREE.Vector2(16, 3), new THREE.Vector2(18, 3), new THREE.Vector2(18, 0)],
            [new THREE.Vector2(18, 0), new THREE.Vector2(20, 1)],
            [new THREE.Vector2(20, 1), new THREE.Vector2(20, 2)],
            [new THREE.Vector2(20, 2), new THREE.Vector2(19, 3)],
            [new THREE.Vector2(19, 3), new THREE.Vector2(19, 4)],
            [new THREE.Vector2(19, 4), new THREE.Vector2(20, 4)],
            [new THREE.Vector2(20, 4), new THREE.Vector2(20, 5)],
            [new THREE.Vector2(20, 5), new THREE.Vector2(18, 5), new THREE.Vector2(19, 7), new THREE.Vector2(18, 7)],
            [new THREE.Vector2(18, 7), new THREE.Vector2(14, 7)],
            [new THREE.Vector2(14, 7), new THREE.Vector2(14, 6)],
            [new THREE.Vector2(14, 6), new THREE.Vector2(12, 6)],
            [new THREE.Vector2(12, 6), new THREE.Vector2(8, 3)],
            [new THREE.Vector2(8, 3), new THREE.Vector2(5, 3)],
            [new THREE.Vector2(5, 3), new THREE.Vector2(4, 4), new THREE.Vector2(0, 5)],
            [new THREE.Vector2(0, 5), new THREE.Vector2(0, 4)]
        ]

        const scaledCurveB = rescaleCurve(body, { maxWidth: 5, center: false, preserveAspect: true });
        const flattenedCurveB = flattenBezierSegments(scaledCurveB);
        const generatorB = new SweepGenerator(3, 0, 3);
        const bodyMesh = new THREE.Mesh(generatorB.generateGeometry(flattenedCurveB), normalMaterial);
        bodyMesh.rotation.x = - Math.PI / 2
        bodyMesh.position.x = 1.5; bodyMesh.position.y = 0.6; bodyMesh.position.z = 1.5

        const secondBody = [
            [new THREE.Vector2(0, 2), new THREE.Vector2(4, 1), new THREE.Vector2(5, 0)],
            [new THREE.Vector2(5, 0), new THREE.Vector2(9, 0)],
            [new THREE.Vector2(9, 0), new THREE.Vector2(13, 3)],
            [new THREE.Vector2(13, 3), new THREE.Vector2(15, 3)],
            [new THREE.Vector2(15, 3), new THREE.Vector2(15, 4)],
            [new THREE.Vector2(15, 4), new THREE.Vector2(14, 5)],
            [new THREE.Vector2(14, 5), new THREE.Vector2(10, 5)],
            [new THREE.Vector2(10, 5), new THREE.Vector2(8, 5), new THREE.Vector2(8, 3)],
            [new THREE.Vector2(8, 3), new THREE.Vector2(8, 2)],
            [new THREE.Vector2(8, 2), new THREE.Vector2(4, 2)],
            [new THREE.Vector2(4, 2), new THREE.Vector2(0, 4)],
            [new THREE.Vector2(0, 4), new THREE.Vector2(0, 2)]
        ]
        const scaledCurveSB = rescaleCurve(secondBody, { maxWidth: 3, center: false, preserveAspect: true });
        const flattenedCurveSB = flattenBezierSegments(scaledCurveSB);
        const generatorSB = new SweepGenerator(2, 0, 3);
        const secondBodyMesh = new THREE.Mesh(generatorSB.generateGeometry(flattenedCurveSB), normalMaterial);
        secondBodyMesh.rotation.x = - Math.PI / 2
        secondBodyMesh.position.x = 1.8; secondBodyMesh.position.y = 1.4; secondBodyMesh.position.z = 1

        // ================ STEERING WHEEL
        const steeringWheelSupport = [
            [new THREE.Vector2(0, 1), new THREE.Vector2(3, 0)],
            [new THREE.Vector2(3, 0), new THREE.Vector2(3, 4), new THREE.Vector2(5, 5)],
            [new THREE.Vector2(5, 5), new THREE.Vector2(6, 7), new THREE.Vector2(5, 8)],
            [new THREE.Vector2(5, 8), new THREE.Vector2(6, 8), new THREE.Vector2(7, 9), new THREE.Vector2(6, 10)],
            [new THREE.Vector2(6, 10), new THREE.Vector2(7, 10), new THREE.Vector2(7, 11)],
            [new THREE.Vector2(7, 11), new THREE.Vector2(6, 12)],
            [new THREE.Vector2(6, 12), new THREE.Vector2(2, 10), new THREE.Vector2(1, 8), new THREE.Vector2(1, 6)],
            [new THREE.Vector2(1, 6), new THREE.Vector2(0, 6), new THREE.Vector2(0, 1)]
        ]
        const scaledCurveWS = rescaleCurve(steeringWheelSupport, { maxWidth: 0.7, center: false, preserveAspect: true });
        const flattenedCurveWS = flattenBezierSegments(scaledCurveWS);
        const generatorWS = new SweepGenerator(1, 0, 3);
        const wheelSupportMesh = new THREE.Mesh(generatorWS.generateGeometry(flattenedCurveWS), normalMaterial);
        wheelSupportMesh.rotation.x = - Math.PI / 2
        wheelSupportMesh.position.x = 1.8; wheelSupportMesh.position.y = 2; wheelSupportMesh.position.z = 0.5

        const steeringWheel = wheel1Group.clone()
        steeringWheel.scale.copy(new THREE.Vector3(0.5, 0.8, 0.5))
        steeringWheel.rotation.x = 0
        steeringWheel.rotation.z = -Math.PI / 3
        steeringWheel.position.x = 2.5; steeringWheel.position.y = 3.2, steeringWheel.position.z = 0

        // ================ SEAT
        const seat = [
            [new THREE.Vector2(1, 3), new THREE.Vector2(0, 2), new THREE.Vector2(1, 1)],
            [new THREE.Vector2(1, 1), new THREE.Vector2(3, 0), new THREE.Vector2(13, 0), new THREE.Vector2(14, 1)],
            [new THREE.Vector2(14, 1), new THREE.Vector2(15, 3), new THREE.Vector2(15, 4)],
            [new THREE.Vector2(15, 4), new THREE.Vector2(16, 7), new THREE.Vector2(17, 13), new THREE.Vector2(16, 16)],
            [new THREE.Vector2(16, 16), new THREE.Vector2(15, 18), new THREE.Vector2(14, 16)],
            [new THREE.Vector2(14, 16), new THREE.Vector2(14, 12), new THREE.Vector2(12, 3)],
            [new THREE.Vector2(12, 3), new THREE.Vector2(6, 4), new THREE.Vector2(1, 3)]
        ]
        const scaledCurveS = rescaleCurve(seat, { maxWidth: 1, center: false, preserveAspect: true });
        const flattenedCurveS = flattenBezierSegments(scaledCurveS);
        const generatorS = new SweepGenerator(0.8, 0, 3);
        const seatMesh = new THREE.Mesh(generatorS.generateGeometry(flattenedCurveS), normalMaterial);
        seatMesh.rotation.x = - Math.PI / 2
        seatMesh.position.x = 3.5; seatMesh.position.y = 2.3; seatMesh.position.z = 0.4

        // ================ CAGE
        const cage = [
            [new THREE.Vector2(16, 14), new THREE.Vector2(8, 14)],
            [new THREE.Vector2(8, 14), new THREE.Vector2(4, 15), new THREE.Vector2(0, 0)],
            [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0)],
            [new THREE.Vector2(1, 0), new THREE.Vector2(5, 15), new THREE.Vector2(8, 13)],
            [new THREE.Vector2(8, 13), new THREE.Vector2(16, 13)],
            [new THREE.Vector2(16, 13), new THREE.Vector2(18, 6), new THREE.Vector2(18, 0)],
            [new THREE.Vector2(18, 0), new THREE.Vector2(20, 0)],
            [new THREE.Vector2(20, 0), new THREE.Vector2(20, 6), new THREE.Vector2(17, 14)],
            [new THREE.Vector2(17, 14), new THREE.Vector2(16, 14)]
        ]
        const scaledCurveC = rescaleCurve(cage, { maxWidth: 4, center: false, preserveAspect: true });
        const flattenedCurveC = flattenBezierSegments(scaledCurveC);
        const generatorC = new SweepGenerator(0.3, 0, 3);
        const cageMesh1 = new THREE.Mesh(generatorC.generateGeometry(flattenedCurveC), normalMaterial);
        cageMesh1.rotation.x = - Math.PI / 2
        cageMesh1.position.x = 1.5; cageMesh1.position.y = 1.7; cageMesh1.position.z = 1.2
        const cageMesh2 = new THREE.Mesh(generatorC.generateGeometry(flattenedCurveC), normalMaterial);
        cageMesh2.rotation.x = - Math.PI / 2
        cageMesh2.position.x = 1.5; cageMesh2.position.y = 1.7; cageMesh2.position.z = -0.9

        const cageCrossBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 1.8), normalMaterial)
        cageCrossBar1.position.x = 3; cageCrossBar1.position.y = 4.41
        const cageCrossBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 1.8), normalMaterial)
        cageCrossBar2.position.x = 4.8; cageCrossBar2.position.y = 4.41

        // ================ LIFTER CONNECTOR
        const railConnector = [
            [new THREE.Vector2(0, 8), new THREE.Vector2(4, 4), new THREE.Vector2(0, 2)],
            [new THREE.Vector2(0, 2), new THREE.Vector2(0, 0)],
            [new THREE.Vector2(18, 0), new THREE.Vector2(0, 0)],
            [new THREE.Vector2(18, 0), new THREE.Vector2(13, 9)],
            [new THREE.Vector2(13, 9), new THREE.Vector2(0, 8)]
        ]
        const scaledCurveRC = rescaleCurve(railConnector, { maxWidth: 3, maxHeight: 1.2, center: false, preserveAspect: false });
        const flattenedCurveRC = flattenBezierSegments(scaledCurveRC);
        const generatorRC = new SweepGenerator(2.25, 0, 3);
        const railConnectorMesh = new THREE.Mesh(generatorRC.generateGeometry(flattenedCurveRC), normalMaterial);
        railConnectorMesh.rotation.x = - Math.PI / 2
        railConnectorMesh.position.y = 0.7; railConnectorMesh.position.z = 1.125


        // ================ VEHICLE
        const mainBody = new THREE.Group()
        mainBody.add(bodyMesh, secondBodyMesh, wheelSupportMesh, steeringWheel, seatMesh, cageMesh1, cageMesh2, cageCrossBar1, cageCrossBar2, railConnectorMesh)
        const carGroup = new THREE.Group()
        carGroup.add(railGroup, mainBody, wheels)

        this.group.add(carGroup)

        this.group.scale.copy(this.scale);

        return this.group;

    }

    animate(keys) {
        const speed = 0.05;
        const rotationSpeed = 0.02;
        const liftSpeed = 0.01;
        const maxLift = 7;
        const minLift = 0;

        let moved = false;
        let deltaX = 0;

        // FORWARD
        if (keys['KeyW']) {
            this.group.translateX(-speed);
            deltaX = speed;
            moved = true;
        }
        // BACKWARD
        if (keys['KeyS']) {
            this.group.translateX(speed);
            deltaX = -speed;
            moved = true;
        }
        // TURN LEFT
        if (keys['KeyA']) {
            this.group.rotateY(rotationSpeed);
        }
        // TURN RIGHT
        if (keys['KeyD']) {
            this.group.rotateY(-rotationSpeed);
        }

        // LIFT the plane (Q/E)
        if (keys['KeyQ'] && this.plane) {
            this.plane.position.y = Math.min(maxLift, this.plane.position.y + liftSpeed);
        }
        if (keys['KeyE'] && this.plane) {
            this.plane.position.y = Math.max(minLift, this.plane.position.y - liftSpeed);
        }

        // Rotate wheels if we moved
        if (moved) {
            const wheelRotation = deltaX / 0.5; // approximate
            this.zondaMode ? this._rotateWheels2(wheelRotation) : this._rotateWheels(wheelRotation)
        }

        // If we are holding something, keep it “attached” to the plane:
        if (this.heldObject) {
            this.heldObject.position.set(0, 0.05, 0); // sits slightly above the plane
        }
    }

    _rotateWheels(amount) {
        for (const wheel of this.wheels) {
            wheel.rotation.z += amount;
        }
    }

    _rotateWheels2(amount) {
        for (const wheel of this.wheels) {
            wheel.rotation.y += amount;
        }
    }

    pickUpObject(mesh) {
        if (!mesh || this.heldObject) return false;
        // Parent it to the plane:
        this.plane.add(mesh);
        mesh.position.set(0, 0.05, 0);
        this.heldObject = mesh;
        return true;
    }

    dropOffObject() {
        if (!this.heldObject) return null;
        const mesh = this.heldObject;
        this.plane.remove(mesh);
        this.heldObject = null;
        return mesh;
    }

    isCarrying() {
        return this.heldObject !== null;
    }
}
