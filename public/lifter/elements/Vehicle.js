import * as THREE from 'three';
import { RevolutionGenerator } from '../helpers/RevolutionGenerator.js';
import { SweepGenerator } from '../helpers/SweepGenerator.js';
import { flattenBezierSegments } from '../helpers/Curves.js';
import { rescaleCurve } from '../helpers/Curves.js';
import { ThreeHelperGenerator } from '../helpers/Helpers.js';

export class Vehicle {
    constructor(config = {}) {
        // Model Generation
        this.scale = config.scale || new THREE.Vector3(1, 1, 1);
        this.group = new THREE.Group(); // all 3D parts here
        this.wheels = [];
        this.plane = null; // Moving plane
        this.heldObject = null;

        const loader = new THREE.TextureLoader();

        // Basic Vehicle Textures
        this.bodyTexture = loader.load(`/lifter/assets/defaultVehicle/texturaGrua.jpg`);
        this.wheelTexture = loader.load('/lifter/assets/defaultVehicle/rueda.jpg')

        // Reflective texture
        const path = '/lifter/assets/tridimensionalPrinter/';
        const format = '.jpg';
        const envMapUrls = [
            path + 'greyRoom1_right' + format,
            path + 'greyRoom1_left' + format,
            path + 'greyRoom1_top' + format,
            path + 'greyRoom1_bottom' + format,
            path + 'greyRoom1_front' + format,
            path + 'greyRoom1_back' + format,
        ];

        this.cubeTexture = new THREE.CubeTextureLoader().load(envMapUrls);
        this.cubeTexture.encoding = THREE.sRGBEncoding;
    }

    generate() {
        this.group.clear();
        this.wheels = []

        // ================ LIFTER
        const railGroup = this.generateRails();

        // ================ BODY
        // Vehicle Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1, 2), new THREE.MeshPhongMaterial({ map: this.bodyTexture }))
        body.position.x = 3.8 / 2 + 0.05; body.position.y = 0.5 + 1.25 / 2

        // ================ WHEELS

        const wheelCurve = [
            [new THREE.Vector2(0, 2), new THREE.Vector2(-6, 2)],
            [new THREE.Vector2(-6, 2), new THREE.Vector2(-7, 3)],
            [new THREE.Vector2(-7, 3), new THREE.Vector2(-9, 3)],
            [new THREE.Vector2(-9, 3), new THREE.Vector2(-9, 0)],
            [new THREE.Vector2(-9, 0), new THREE.Vector2(0, 0)]
        ]
        const scaledCurve = rescaleCurve(wheelCurve, { maxWidth: 0.5, maxHeight: 0.5, center: false, preserveAspect: true });
        const flattenedCurve = flattenBezierSegments(scaledCurve);
        const revGen = new RevolutionGenerator(30, "radial");
        const wheel = new THREE.Mesh(revGen.generateGeometry(flattenedCurve), new THREE.MeshPhongMaterial({ map: this.wheelTexture, }));
        wheel.rotation.x = Math.PI / 2

        const wheel1Group = new THREE.Group()
        wheel1Group.add(wheel)
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

        // Materials
        const tireMaterial = new THREE.MeshPhongMaterial({ color: 0x0a0a0a })
        const blackMaterial = new THREE.MeshPhongMaterial({
            color: 0x3b1212,
            shininess: 10,
            specular: 0xaaaaaa,
            emissive: 0x000000,
        });
        const grayMaterial = new THREE.MeshPhongMaterial({
            color: 0x3d3d3d,
            shininess: 10,
            specular: 0xaaaaaa,
            emissive: 0x000000,
        });
        const reflectiveMaterial = new THREE.MeshStandardMaterial({
            metalness: 1.0,
            roughness: 0.1,
            envMap: this.cubeTexture,
            envMapIntensity: 1.2,
            color: 0x666666
        });

        // ================ LIFTER
        const railGroup = this.generateRails();

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
        const wheelOutsideMesh = new THREE.Mesh(generatorWO.generateGeometry(flattenedCurveWO), tireMaterial);

        wheelOutsideMesh.rotation.x = Math.PI / 2

        var wheelInsideGroup = new THREE.Group()

        var insideCircle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.1), blackMaterial)
        insideCircle.rotation.y = Math.PI / 2
        insideCircle.rotation.z = Math.PI / 2
        insideCircle.position.x = 0.02
        wheelInsideGroup.add(insideCircle)

        var totalNeedles = 60
        var step = Math.PI * 2 / totalNeedles
        for (let i = 0; i < Math.PI * 2; i += step) {
            let needle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.01, 0.9), reflectiveMaterial)
            needle.rotation.z = i;
            wheelInsideGroup.add(needle)
        }

        wheelInsideGroup.position.z = 0.1

        const wheel1Group = new THREE.Group()
        wheel1Group.add(wheelOutsideMesh, wheelInsideGroup)
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
        const generatorCO = new SweepGenerator(1, 0, 100);
        const outerChasisMesh1 = new THREE.Mesh(generatorCO.generateGeometry(flattenedCurveCO), blackMaterial);
        const outerChasisMesh2 = new THREE.Mesh(generatorCO.generateGeometry(flattenedCurveCO), blackMaterial);
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
        const generatorCI = new SweepGenerator(2, 0, 100);
        const innerChasisMesh = new THREE.Mesh(generatorCI.generateGeometry(flattenedCurveCI), grayMaterial);
        innerChasisMesh.rotation.x = -Math.PI / 2
        innerChasisMesh.position.y = 0.05; innerChasisMesh.position.z = 1

        // ================== LIGHTS

        const redMaterial = new THREE.MeshPhongMaterial({
            color: 0xd11204,
            emissive: 0xd11204,
            emissiveIntensity: 1
        });
        const leftBackHeadlight = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 16), redMaterial);
        leftBackHeadlight.rotation.x = Math.PI / 2
        leftBackHeadlight.position.set(7.85, 0.85, 1.5);
        const rightBackHeadlight = leftBackHeadlight.clone()
        rightBackHeadlight.position.set(7.85, 0.85, -1.5);
        this.group.add(leftBackHeadlight);
        this.group.add(rightBackHeadlight);

        const fixtureMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffee,
            emissiveIntensity: 1.0,
        });

        // Parameters
        const lightPositions = [
            new THREE.Vector3(0.77, 1.28, 1.4), // upper light
            new THREE.Vector3(0.77, 1.28, -1.4) // lower light
        ];

        lightPositions.forEach(pos => {
            // Create spotlight
            const spot = new THREE.SpotLight(0xffffff, 9, 100, Math.PI / 6, 0.3, 1);
            spot.position.copy(pos);

            // Create a target a few units in -X direction
            const target = new THREE.Object3D();
            target.position.set(pos.x - 5, pos.y, pos.z);
            this.group.add(target);
            spot.target = target;

            // Add light and target
            this.group.add(spot);
            this.group.add(spot.target);

            // Create a cylindrical fixture mesh that points in -X
            const fixture = new THREE.Mesh(
                new THREE.CylinderGeometry(0.12, 0.12, 0.05),
                fixtureMaterial
            );

            // Position at light position
            fixture.position.copy(pos);

            // Rotate cylinder to point in -X (from Y+ by default to X-)
            fixture.rotation.z = Math.PI / 2;

            this.group.add(fixture);
        });



        // ================== COCKPIT
        const cockpit = [
            [new THREE.Vector2(10, 8), new THREE.Vector2(6, 8), new THREE.Vector2(0, 2)],
            [new THREE.Vector2(0, 2), new THREE.Vector2(3, 2), new THREE.Vector2(6, 0)],
            [new THREE.Vector2(6, 0), new THREE.Vector2(18, 0), new THREE.Vector2(27, 4)],
            [new THREE.Vector2(27, 4), new THREE.Vector2(19, 8), new THREE.Vector2(10, 8)]
        ]
        const scaledCurveC = rescaleCurve(cockpit, { maxWidth: 3.6, center: false, preserveAspect: true });
        const flattenedCurveC = flattenBezierSegments(scaledCurveC);
        const generatorC = new SweepGenerator(1.6, 0, 100);
        const cockpitMesh = new THREE.Mesh(generatorC.generateGeometry(flattenedCurveC), reflectiveMaterial);
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
        const generatorSA = new SweepGenerator(0.4, 0, 100);
        const spoilerArmMesh1 = new THREE.Mesh(generatorSA.generateGeometry(flattenedCurveSA), grayMaterial);
        spoilerArmMesh1.rotation.x = -Math.PI / 2
        spoilerArmMesh1.position.x = 7; spoilerArmMesh1.position.y = 1.2; spoilerArmMesh1.position.z = 1.3
        const spoilerArmMesh2 = new THREE.Mesh(generatorSA.generateGeometry(flattenedCurveSA), grayMaterial);
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
        const generatorS = new SweepGenerator(4, 0, 100);
        const spoilerMesh = new THREE.Mesh(generatorS.generateGeometry(flattenedCurveS), reflectiveMaterial);
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
        const generatorAI1 = new SweepGenerator(0.8, 0, 100);
        const airIntakeMesh1 = new THREE.Mesh(generatorAI1.generateGeometry(flattenedCurveAI), reflectiveMaterial);
        airIntakeMesh1.rotation.x = -Math.PI / 2
        airIntakeMesh1.position.x = 1.5; airIntakeMesh1.position.y = 0.8; airIntakeMesh1.position.z = 0.4
        const generatorAI2 = new SweepGenerator(0.6, 0, 100);
        const airIntakeMesh2 = new THREE.Mesh(generatorAI2.generateGeometry(flattenedCurveAI), reflectiveMaterial);
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
        const generatorH = new SweepGenerator(0.5, 0, 100);
        const headlightMesh1 = new THREE.Mesh(generatorH.generateGeometry(flattenedCurveH), reflectiveMaterial);
        headlightMesh1.rotation.x = -Math.PI / 2
        headlightMesh1.position.x = 0.8; headlightMesh1.position.y = 1; headlightMesh1.position.z = 1.65
        const headlightMesh2 = new THREE.Mesh(generatorH.generateGeometry(flattenedCurveH), reflectiveMaterial);
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

        const tireMaterial = new THREE.MeshPhongMaterial({ color: 0x0a0a0a });
        const yellowMaterial = new THREE.MeshPhongMaterial({ color: 0xf6b437 })
        const grayMaterial = new THREE.MeshPhongMaterial({ color: 0x424242 })
        const blackMaterial = new THREE.MeshPhongMaterial({
            color: 0x0d0d0d,
            shininess: 100,
            specular: 0xaaaaaa,
            emissive: 0x000000,
        });
        const reflectiveMaterial = new THREE.MeshStandardMaterial({
            metalness: 1.0,
            roughness: 0.1,
            envMap: this.cubeTexture,
            envMapIntensity: 1.2,
            color: 0x666666
        });

        // ================ LIFTER
        const railGroup = this.generateRails();

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
        const wheelOutsideMesh = new THREE.Mesh(generatorWO.generateGeometry(flattenedCurveWO), tireMaterial);
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
        const generatorWI = new SweepGenerator(0.2, 0, 100);
        const wheelInsideMesh = new THREE.Mesh(generatorWI.generateGeometry(flattenedCurveWI), reflectiveMaterial);
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
        wheel3Group.position.x = 1.7; wheel3Group.position.y = 0.77; wheel3Group.position.z = -1.3
        wheel4Group.position.x = 5.3; wheel4Group.position.y = 0.6; wheel4Group.position.z = -1.3

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
        const generatorB = new SweepGenerator(3, 0, 100);
        const bodyMesh = new THREE.Mesh(generatorB.generateGeometry(flattenedCurveB), yellowMaterial);
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
        const generatorSB = new SweepGenerator(2, 0, 100);
        const secondBodyMesh = new THREE.Mesh(generatorSB.generateGeometry(flattenedCurveSB), grayMaterial);
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
        const generatorWS = new SweepGenerator(1, 0, 100);
        const wheelSupportMesh = new THREE.Mesh(generatorWS.generateGeometry(flattenedCurveWS), blackMaterial);
        wheelSupportMesh.rotation.x = - Math.PI / 2
        wheelSupportMesh.position.x = 1.8; wheelSupportMesh.position.y = 2; wheelSupportMesh.position.z = 0.5

        const steeringWheel = wheel1Group.clone()
        steeringWheel.scale.copy(new THREE.Vector3(0.5, 0.5, 0.5))
        steeringWheel.rotation.x = - Math.PI / 2
        steeringWheel.rotation.y = Math.PI / 4
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
        const generatorS = new SweepGenerator(0.8, 0, 100);
        const seatMesh = new THREE.Mesh(generatorS.generateGeometry(flattenedCurveS), blackMaterial);
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
        const generatorC = new SweepGenerator(0.3, 0, 100);
        const cageMesh1 = new THREE.Mesh(generatorC.generateGeometry(flattenedCurveC), blackMaterial);
        cageMesh1.rotation.x = - Math.PI / 2
        cageMesh1.position.x = 1.5; cageMesh1.position.y = 1.7; cageMesh1.position.z = 1.2
        const cageMesh2 = new THREE.Mesh(generatorC.generateGeometry(flattenedCurveC), blackMaterial);
        cageMesh2.rotation.x = - Math.PI / 2
        cageMesh2.position.x = 1.5; cageMesh2.position.y = 1.7; cageMesh2.position.z = -0.9

        const cageCrossBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 1.8), blackMaterial)
        cageCrossBar1.position.x = 3; cageCrossBar1.position.y = 4.41
        const cageCrossBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 1.8), blackMaterial)
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
        const generatorRC = new SweepGenerator(2.25, 0, 100);
        const railConnectorMesh = new THREE.Mesh(generatorRC.generateGeometry(flattenedCurveRC), yellowMaterial);
        railConnectorMesh.rotation.x = - Math.PI / 2
        railConnectorMesh.position.y = 0.6; railConnectorMesh.position.z = 1.125


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


    generateRails() {
        const brownMaterial = new THREE.MeshPhongMaterial({ color: 0x543922 });
        const orangeMaterial = new THREE.MeshPhongMaterial({ color: 0xa1612b });
        // Rails
        const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7, 0.3), brownMaterial)
        rail1.position.y = 3.5; rail1.position.z = 0.75
        const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7, 0.3), brownMaterial)
        rail2.position.y = 3.5; rail2.position.z = -0.75

        // Cross Rails
        const crossRail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), orangeMaterial)
        crossRail1.position.x = 0.05; crossRail1.position.y = 0.5
        const crossRail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), orangeMaterial)
        crossRail2.position.x = 0.05; crossRail2.position.y = 3.66
        const crossRail3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 2), orangeMaterial)
        crossRail3.position.x = 0.05; crossRail3.position.y = 6.8

        // Plane
        this.plane = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1.5), orangeMaterial)
        this.plane.position.x = -1; this.plane.position.y = 2

        const railGroup = new THREE.Group()
        railGroup.add(rail1, rail2, crossRail1, crossRail2, crossRail3, this.plane)
        railGroup.position.y = 0.5
        return railGroup
    }
}
