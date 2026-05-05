import * as THREE from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("p-orbital-viewer");

if (container) {
    const orbitals = {
        px: {
            label: "px",
            axis: "x",
            pointSize: 0.028,
        },
        py: {
            label: "py",
            axis: "y",
            pointSize: 0.028,
        },
        pz: {
            label: "pz",
            axis: "z",
            pointSize: 0.028,
        },
    };

    injectStyles();

    container.classList.add("p-orbital-component");
    container.innerHTML = `
        <div class="p-orbital-toolbar" aria-label="Choose p orbital orientation">
            <button class="p-orbital-option" type="button" data-orbital="px" aria-pressed="false">px</button>
            <button class="p-orbital-option is-active" type="button" data-orbital="py" aria-pressed="true">py</button>
            <button class="p-orbital-option" type="button" data-orbital="pz" aria-pressed="false">pz</button>
        </div>
        <div class="p-orbital-canvas" aria-label="Interactive p orbital point cloud"></div>
    `;

    const canvasHost = container.querySelector(".p-orbital-canvas");
    const optionButtons = [...container.querySelectorAll(".p-orbital-option")];

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

    let orbitalPoints = createOrbitalPoints(orbitals.py);
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
    const pointCount = 12000;
    const positions = [];
    const lobeLength = 1.85;
    const lobeWidth = 0.78;
    const nodeGap = 0.16;

    for (let i = 0; i < pointCount; i++) {
        const sign = Math.random() < 0.5 ? -1 : 1;
        const t = Math.pow(Math.random(), 0.7);
        const axisDistance = sign * (nodeGap + lobeLength * t);
        const width = lobeWidth * Math.pow(Math.sin(Math.PI * t), 0.55) * (0.72 + 0.28 * t);
        const angle = Math.random() * Math.PI * 2;
        const radial = width * Math.sqrt(Math.random());
        const localPoint = {
            axis: axisDistance,
            firstPerp: radial * Math.cos(angle),
            secondPerp: radial * Math.sin(angle),
        };

        positions.push(...mapLocalPoint(localPoint, orbital.axis));
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

function mapLocalPoint(point, axis) {
    if (axis === "x") {
        return [point.axis, point.firstPerp, point.secondPerp];
    }

    if (axis === "y") {
        return [point.firstPerp, point.axis, point.secondPerp];
    }

    return [point.firstPerp, point.secondPerp, point.axis];
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
    if (document.getElementById("p-orbital-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "p-orbital-styles";
    style.textContent = `
        .p-orbital-component {
            width: 100%;
            max-width: 760px;
            margin: 1.25rem 0;
            background: #ffffff;
        }

        .p-orbital-toolbar {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.625rem;
        }

        .p-orbital-option {
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

        .p-orbital-option:hover,
        .p-orbital-option:focus-visible {
            border-color: #d71920;
            outline: none;
        }

        .p-orbital-option.is-active {
            background: #d71920;
            border-color: #d71920;
            color: #ffffff;
        }

        .p-orbital-canvas {
            width: 100%;
            height: min(460px, 68vw);
            min-height: 320px;
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .p-orbital-canvas canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
    `;

    document.head.appendChild(style);
}
