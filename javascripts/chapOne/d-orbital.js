import * as THREE from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("d-orbital-viewer");

if (container) {
    const orbitals = {
        dxy: {
            label: "dxy",
            type: "four-lobed",
            directions: [
                [1, 1, 0],
                [-1, 1, 0],
                [1, -1, 0],
                [-1, -1, 0],
            ],
        },
        dxz: {
            label: "dxz",
            type: "four-lobed",
            directions: [
                [1, 0, 1],
                [-1, 0, 1],
                [1, 0, -1],
                [-1, 0, -1],
            ],
        },
        dyz: {
            label: "dyz",
            type: "four-lobed",
            directions: [
                [0, 1, 1],
                [0, -1, 1],
                [0, 1, -1],
                [0, -1, -1],
            ],
        },
        dx2y2: {
            label: "dx^2-y^2",
            type: "four-lobed",
            directions: [
                [1, 0, 0],
                [-1, 0, 0],
                [0, 1, 0],
                [0, -1, 0],
            ],
        },
        dz2: {
            label: "dz^2",
            type: "dz2",
        },
    };

    injectStyles();

    container.classList.add("d-orbital-component");
    container.innerHTML = `
        <div class="d-orbital-toolbar" aria-label="Choose d orbital">
            <button class="d-orbital-option is-active" type="button" data-orbital="dxy" aria-pressed="true">dxy</button>
            <button class="d-orbital-option" type="button" data-orbital="dxz" aria-pressed="false">dxz</button>
            <button class="d-orbital-option" type="button" data-orbital="dyz" aria-pressed="false">dyz</button>
            <button class="d-orbital-option" type="button" data-orbital="dx2y2" aria-pressed="false">dx^2-y^2</button>
            <button class="d-orbital-option" type="button" data-orbital="dz2" aria-pressed="false">dz^2</button>
        </div>
        <div class="d-orbital-canvas" aria-label="Interactive d orbital point cloud"></div>
    `;

    const canvasHost = container.querySelector(".d-orbital-canvas");
    const optionButtons = [...container.querySelectorAll(".d-orbital-option")];

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(4.8, 3.6, 5.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasHost.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    scene.add(createAxes(4.2));

    let orbitalPoints = createOrbitalPoints(orbitals.dxy);
    scene.add(orbitalPoints);

    optionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selected = button.dataset.orbital;

            optionButtons.forEach((item) => {
                item.classList.toggle("is-active", item === button);
                item.setAttribute("aria-pressed", item === button ? "true" : "false");
            });

            scene.remove(orbitalPoints);
            orbitalPoints.geometry.dispose();
            orbitalPoints.material.dispose();

            orbitalPoints = createOrbitalPoints(orbitals[selected]);
            scene.add(orbitalPoints);
        });
    });

    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(canvasHost);
    resizeRenderer();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    function resizeRenderer() {
        const width = canvasHost.clientWidth;
        const height = canvasHost.clientHeight;

        if (!width || !height) {
            return;
        }

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

function createOrbitalPoints(orbital) {
    const positions = orbital.type === "dz2"
        ? createDz2Points()
        : createFourLobedPoints(orbital.directions);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xd71920,
        size: 0.027,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
    });

    return new THREE.Points(geometry, material);
}

function createFourLobedPoints(directions) {
    const positions = [];
    const pointCount = 15000;
    const lobeLength = 1.75;
    const lobeWidth = 0.58;
    const nodeGap = 0.12;
    const normalizedDirections = directions.map((direction) =>
        new THREE.Vector3(...direction).normalize()
    );

    for (let i = 0; i < pointCount; i++) {
        const direction = normalizedDirections[Math.floor(Math.random() * normalizedDirections.length)];
        const point = pointInLobe(direction, lobeLength, lobeWidth, nodeGap);

        positions.push(point.x, point.y, point.z);
    }

    return positions;
}

function createDz2Points() {
    const positions = [];
    const axialPointCount = 10500;
    const ringPointCount = 4500;
    const lobeLength = 1.95;
    const lobeWidth = 0.48;
    const nodeGap = 0.14;
    const axialDirections = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
    ];

    for (let i = 0; i < axialPointCount; i++) {
        const direction = axialDirections[Math.floor(Math.random() * axialDirections.length)];
        const point = pointInLobe(direction, lobeLength, lobeWidth, nodeGap);

        positions.push(point.x, point.y, point.z);
    }

    for (let i = 0; i < ringPointCount; i++) {
        const point = pointInTorus(0.72, 0.11);

        positions.push(point.x, point.y, point.z);
    }

    return positions;
}

function pointInLobe(direction, lobeLength, lobeWidth, nodeGap) {
    const basis = perpendicularBasis(direction);
    const t = Math.pow(Math.random(), 0.68);
    const axisDistance = nodeGap + lobeLength * t;
    const width = lobeWidth * Math.pow(Math.sin(Math.PI * t), 0.58) * (0.72 + 0.28 * t);
    const angle = Math.random() * Math.PI * 2;
    const radial = width * Math.sqrt(Math.random());

    return new THREE.Vector3()
        .addScaledVector(direction, axisDistance)
        .addScaledVector(basis.u, radial * Math.cos(angle))
        .addScaledVector(basis.v, radial * Math.sin(angle));
}

function pointInTorus(majorRadius, minorRadius) {
    const angleAroundRing = Math.random() * Math.PI * 2;
    const angleAroundTube = Math.random() * Math.PI * 2;
    const tubeRadius = minorRadius * Math.sqrt(Math.random());
    const ringRadius = majorRadius + tubeRadius * Math.cos(angleAroundTube);

    return new THREE.Vector3(
        ringRadius * Math.cos(angleAroundRing),
        ringRadius * Math.sin(angleAroundRing),
        tubeRadius * Math.sin(angleAroundTube)
    );
}

function perpendicularBasis(direction) {
    const helper = Math.abs(direction.y) < 0.9
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(1, 0, 0);
    const u = new THREE.Vector3().crossVectors(direction, helper).normalize();
    const v = new THREE.Vector3().crossVectors(direction, u).normalize();

    return { u, v };
}

function createAxes(length) {
    const group = new THREE.Group();
    const axes = [
        {
            label: "x",
            color: 0xc62828,
            start: [-length, 0, 0],
            end: [length, 0, 0],
            labelPosition: [length + 0.25, 0, 0],
        },
        {
            label: "y",
            color: 0x2e7d32,
            start: [0, -length, 0],
            end: [0, length, 0],
            labelPosition: [0, length + 0.25, 0],
        },
        {
            label: "z",
            color: 0x1565c0,
            start: [0, 0, -length],
            end: [0, 0, length],
            labelPosition: [0, 0, length + 0.25],
        },
    ];

    axes.forEach((axis) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...axis.start),
            new THREE.Vector3(...axis.end),
        ]);
        const material = new THREE.LineBasicMaterial({ color: axis.color });
        const line = new THREE.Line(geometry, material);

        group.add(line);
        group.add(createAxisLabel(axis.label, axis.color, axis.labelPosition));
    });

    return group;
}

function createAxisLabel(text, color, position) {
    const canvas = document.createElement("canvas");
    const size = 128;
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, size, size);
    context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
    context.font = "700 64px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
    });
    const sprite = new THREE.Sprite(material);

    sprite.position.set(...position);
    sprite.scale.set(0.42, 0.42, 0.42);

    return sprite;
}

function injectStyles() {
    if (document.getElementById("d-orbital-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "d-orbital-styles";
    style.textContent = `
        .d-orbital-component {
            width: 100%;
            max-width: 760px;
            margin: 1.25rem 0;
            background: #ffffff;
        }

        .d-orbital-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.625rem;
        }

        .d-orbital-option {
            border: 1px solid #c7ced6;
            border-radius: 6px;
            background: #ffffff;
            color: #1f2933;
            cursor: pointer;
            font: inherit;
            line-height: 1;
            min-width: 3rem;
            padding: 0.55rem 0.75rem;
        }

        .d-orbital-option:hover,
        .d-orbital-option:focus-visible {
            border-color: #d71920;
            outline: none;
        }

        .d-orbital-option.is-active {
            background: #d71920;
            border-color: #d71920;
            color: #ffffff;
        }

        .d-orbital-canvas {
            width: 100%;
            height: min(460px, 68vw);
            min-height: 320px;
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .d-orbital-canvas canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
    `;

    document.head.appendChild(style);
}
