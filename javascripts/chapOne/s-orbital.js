import * as THREE from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("s-orbital-viewer");

if (container) {
    const orbitals = {
        "1s": {
            label: "1s",
            radius: 0.85,
            pointSize: 0.032,
            shells: [{ weight: 1, min: 0, max: 1, scale: 0.45 }],
        },
        "2s": {
            label: "2s",
            radius: 1.7,
            pointSize: 0.03,
            shells: [
                { weight: 0.25, min: 0, max: 0.35, scale: 0.28 },
                { weight: 0.75, min: 0.55, max: 1, scale: 0.55 },
            ],
        },
        "3s": {
            label: "3s",
            radius: 2.8,
            pointSize: 0.028,
            shells: [
                { weight: 0.15, min: 0, max: 0.18, scale: 0.24 },
                { weight: 0.25, min: 0.32, max: 0.55, scale: 0.32 },
                { weight: 0.6, min: 0.72, max: 1, scale: 0.52 },
            ],
        },
    };

    injectStyles();

    container.classList.add("s-orbital-component");
    container.innerHTML = `
        <div class="s-orbital-toolbar" aria-label="Choose s orbital">
            <button class="s-orbital-option is-active" type="button" data-orbital="1s" aria-pressed="true">1s</button>
            <button class="s-orbital-option" type="button" data-orbital="2s" aria-pressed="false">2s</button>
            <button class="s-orbital-option" type="button" data-orbital="3s" aria-pressed="false">3s</button>
        </div>
        <div class="s-orbital-canvas" aria-label="Interactive s orbital point cloud"></div>
    `;

    const canvasHost = container.querySelector(".s-orbital-canvas");
    const optionButtons = [...container.querySelectorAll(".s-orbital-option")];

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

    const axesGroup = createAxes(4.2);
    scene.add(axesGroup);

    let orbitalPoints = createOrbitalPoints(orbitals["1s"]);
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
    const pointCount = 9000;
    const positions = [];

    for (let i = 0; i < pointCount; i++) {
        const shell = chooseShell(orbital.shells);
        const direction = randomDirection();
        const radialBias = Math.pow(Math.random(), shell.scale);
        const radialFraction = shell.min + (shell.max - shell.min) * radialBias;
        const radius = radialFraction * orbital.radius;

        positions.push(
            radius * direction.x,
            radius * direction.y,
            radius * direction.z
        );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xd71920,
        size: orbital.pointSize,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
    });

    return new THREE.Points(geometry, material);
}

function chooseShell(shells) {
    const totalWeight = shells.reduce((sum, shell) => sum + shell.weight, 0);
    let target = Math.random() * totalWeight;

    for (const shell of shells) {
        target -= shell.weight;

        if (target <= 0) {
            return shell;
        }
    }

    return shells[shells.length - 1];
}

function randomDirection() {
    const theta = Math.random() * Math.PI * 2;
    const z = Math.random() * 2 - 1;
    const radius = Math.sqrt(1 - z * z);

    return {
        x: radius * Math.cos(theta),
        y: radius * Math.sin(theta),
        z,
    };
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
    if (document.getElementById("s-orbital-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "s-orbital-styles";
    style.textContent = `
        .s-orbital-component {
            width: 100%;
            max-width: 760px;
            margin: 1.25rem 0;
            background: #ffffff;
        }

        .s-orbital-toolbar {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.625rem;
        }

        .s-orbital-option {
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

        .s-orbital-option:hover,
        .s-orbital-option:focus-visible {
            border-color: #d71920;
            outline: none;
        }

        .s-orbital-option.is-active {
            background: #d71920;
            border-color: #d71920;
            color: #ffffff;
        }

        .s-orbital-canvas {
            width: 100%;
            height: min(460px, 68vw);
            min-height: 320px;
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .s-orbital-canvas canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
    `;

    document.head.appendChild(style);
}
