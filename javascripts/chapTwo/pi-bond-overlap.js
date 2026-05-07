const piBondOverlapContainer = document.getElementById("pi-bond-overlap-viewer");

if (piBondOverlapContainer) {
    let selectedMode = "2d";
    let threeState;
    let threePromise;

    injectPiBondOverlapStyles();

    piBondOverlapContainer.classList.add("pi-bond-overlap-component");
    piBondOverlapContainer.innerHTML = `
        <div class="pi-bond-overlap-toolbar">
            <div class="pi-bond-overlap-button-group" aria-label="Choose view">
                <button class="pi-bond-overlap-button is-active" type="button" data-mode="2d" aria-pressed="true">2D</button>
                <button class="pi-bond-overlap-button" type="button" data-mode="3d" aria-pressed="false">3D</button>
            </div>
        </div>
        <div class="pi-bond-overlap-stage">
            <div class="pi-bond-overlap-2d"></div>
            <div class="pi-bond-overlap-3d" aria-label="Interactive 3D pi bond orbital overlap"></div>
        </div>
    `;

    const modeButtons = [...piBondOverlapContainer.querySelectorAll("[data-mode]")];
    const twoDStage = piBondOverlapContainer.querySelector(".pi-bond-overlap-2d");
    const threeDStage = piBondOverlapContainer.querySelector(".pi-bond-overlap-3d");

    modeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedMode = button.dataset.mode;
            render();
        });
    });

    function render() {
        twoDStage.innerHTML = createPiBond2dSvg();
        piBondOverlapContainer.dataset.mode = selectedMode;
        updatePiBondButtonState(modeButtons, selectedMode);

        if (selectedMode === "3d") {
            initialisePiBond3d().then(() => {
                renderPiBond3d(threeState.THREE, threeState);
            });
        }
    }

    function initialisePiBond3d() {
        if (threePromise) {
            return threePromise;
        }

        threeDStage.innerHTML = `<div class="pi-bond-overlap-loading">Loading 3D view...</div>`;
        threePromise = Promise.all([
            import("https://esm.sh/three@0.164.1"),
            import("https://esm.sh/three@0.164.1/examples/jsm/controls/OrbitControls.js?deps=three@0.164.1"),
        ]).then(([THREE, controlsModule]) => {
            threeState = createPiBond3dScene(THREE, controlsModule.OrbitControls, threeDStage);
            threeDStage.querySelector(".pi-bond-overlap-loading")?.remove();
        }).catch(() => {
            threeDStage.innerHTML = `<div class="pi-bond-overlap-loading">3D view could not be loaded.</div>`;
        });

        return threePromise;
    }

    render();
}

function updatePiBondButtonState(buttons, activeMode) {
    buttons.forEach((button) => {
        const isActive = button.dataset.mode === activeMode;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function createPiBond2dSvg() {
    const centerX = 380;
    const centerY = 180;
    const lobeLength = 126;
    const lobeWidth = 62;
    const centerSeparation = (2 * lobeWidth) / 2;
    const leftCenterX = centerX - centerSeparation / 2;
    const rightCenterX = centerX + centerSeparation / 2;

    return `
        <svg class="pi-bond-overlap-svg" viewBox="0 0 760 360" role="img" aria-label="pi bond formed by side-by-side p orbital overlap">
            <rect class="pi-bond-overlap-bg" x="0" y="0" width="760" height="360"></rect>
            <line class="pi-bond-overlap-axis" x1="82" y1="${centerY}" x2="678" y2="${centerY}"></line>
            ${createVerticalPOrbital2d(leftCenterX, centerY, lobeLength, lobeLength, lobeWidth)}
            ${createVerticalPOrbital2d(rightCenterX, centerY, lobeLength, lobeLength, lobeWidth)}
            <circle class="pi-bond-nucleus" cx="${leftCenterX}" cy="${centerY}" r="6"></circle>
            <circle class="pi-bond-nucleus" cx="${rightCenterX}" cy="${centerY}" r="6"></circle>
        </svg>
    `;
}

function createVerticalPOrbital2d(centerX, centerY, upperLength, lowerLength, width) {
    const upperCapY = centerY - upperLength * 1.08;
    const lowerCapY = centerY + lowerLength * 1.08;
    const upperShoulderY = centerY - upperLength * 0.64;
    const lowerShoulderY = centerY + lowerLength * 0.64;

    return `
        <path class="pi-bond-p-lobe pi-bond-p-lobe--upper" d="
            M ${centerX} ${centerY}
            C ${centerX - width * 0.2} ${centerY - upperLength * 0.08}, ${centerX - width * 0.72} ${centerY - upperLength * 0.22}, ${centerX - width * 0.86} ${upperShoulderY}
            C ${centerX - width * 0.84} ${centerY - upperLength * 0.96}, ${centerX - width * 0.42} ${upperCapY}, ${centerX} ${upperCapY}
            C ${centerX + width * 0.42} ${upperCapY}, ${centerX + width * 0.84} ${centerY - upperLength * 0.96}, ${centerX + width * 0.86} ${upperShoulderY}
            C ${centerX + width * 0.72} ${centerY - upperLength * 0.22}, ${centerX + width * 0.2} ${centerY - upperLength * 0.08}, ${centerX} ${centerY}
            Z"></path>
        <path class="pi-bond-p-lobe pi-bond-p-lobe--lower" d="
            M ${centerX} ${centerY}
            C ${centerX - width * 0.2} ${centerY + lowerLength * 0.08}, ${centerX - width * 0.72} ${centerY + lowerLength * 0.22}, ${centerX - width * 0.86} ${lowerShoulderY}
            C ${centerX - width * 0.84} ${centerY + lowerLength * 0.96}, ${centerX - width * 0.42} ${lowerCapY}, ${centerX} ${lowerCapY}
            C ${centerX + width * 0.42} ${lowerCapY}, ${centerX + width * 0.84} ${centerY + lowerLength * 0.96}, ${centerX + width * 0.86} ${lowerShoulderY}
            C ${centerX + width * 0.72} ${centerY + lowerLength * 0.22}, ${centerX + width * 0.2} ${centerY + lowerLength * 0.08}, ${centerX} ${centerY}
            Z"></path>
    `;
}

function createPiBond3dScene(THREE, OrbitControls, stage) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true,
    });
    const group = new THREE.Group();

    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    stage.append(renderer.domElement);

    scene.background = new THREE.Color(0xffffff);
    camera.position.set(0, 1.9, 6.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 4.4;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));

    const mainLight = new THREE.DirectionalLight(0xffffff, 2);
    mainLight.position.set(4, 5, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-4, -2, -4);
    scene.add(fillLight);
    scene.add(group);

    const resize = () => {
        const rect = stage.getBoundingClientRect();
        const width = Math.max(320, rect.width);
        const height = Math.max(320, rect.height);

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();

    function animate() {
        controls.update();
        renderer.render(scene, camera);
        stage.dataset.ready = "true";
        requestAnimationFrame(animate);
    }

    animate();

    stage.__piGroup = group;

    return { THREE, scene, camera, renderer, controls, group };
}

function renderPiBond3d(THREE, state) {
    clearPiBond3dGroup(state.group);

    const materials = createPiBond3dMaterials(THREE);
    const pLobeWidth = 0.62;
    const centerSeparation = (2 * pLobeWidth) / 2;
    const leftOrbital = createPOrbitalVolume([-centerSeparation / 2, 0, 0], "y", 1.35, pLobeWidth);
    const rightOrbital = createPOrbitalVolume([centerSeparation / 2, 0, 0], "y", 1.35, pLobeWidth);

    addInternuclearAxis(THREE, state.group, materials.axis);
    addPOrbitalPointCloud(THREE, state.group, materials.orbital, leftOrbital.center, leftOrbital.axis, leftOrbital.lobeLength, leftOrbital.lobeWidth, 13000);
    addPOrbitalPointCloud(THREE, state.group, materials.orbital, rightOrbital.center, rightOrbital.axis, rightOrbital.lobeLength, rightOrbital.lobeWidth, 13000);
    addPiOverlapIntersectionPointCloud(THREE, state.group, materials.overlap, leftOrbital, rightOrbital, 1, 11000);
    addPiOverlapIntersectionPointCloud(THREE, state.group, materials.overlap, leftOrbital, rightOrbital, -1, 11000);
    addNucleus(THREE, state.group, materials.nucleus, leftOrbital.center);
    addNucleus(THREE, state.group, materials.nucleus, rightOrbital.center);
}

function createPiBond3dMaterials(THREE) {
    return {
        orbital: new THREE.PointsMaterial({
            color: 0xd71920,
            transparent: true,
            opacity: 0.66,
            size: 0.026,
            depthWrite: false,
        }),
        overlap: new THREE.PointsMaterial({
            color: 0xa80f16,
            transparent: true,
            opacity: 0.92,
            size: 0.032,
            depthWrite: false,
        }),
        nucleus: new THREE.MeshStandardMaterial({
            color: 0x111827,
            roughness: 0.35,
            metalness: 0.05,
        }),
        axis: new THREE.LineBasicMaterial({
            color: 0x111827,
            transparent: true,
            opacity: 0.5,
        }),
    };
}

function clearPiBond3dGroup(group) {
    group.traverse((child) => {
        if (child.geometry) {
            child.geometry.dispose();
        }

        if (child.material) {
            child.material.dispose();
        }
    });
    group.clear();
}

function addPOrbitalPointCloud(THREE, group, material, center, axis, lobeLength, lobeWidth, pointCount) {
    const positions = [];
    const nodeGap = 0.12;

    for (let i = 0; i < pointCount; i += 1) {
        const sign = Math.random() < 0.5 ? -1 : 1;
        const t = Math.pow(Math.random(), 0.7);
        const axisDistance = sign * (nodeGap + lobeLength * t);
        const width = getPOrbitalWidth(t, lobeWidth);
        const angle = Math.random() * Math.PI * 2;
        const radial = width * Math.sqrt(Math.random());
        const localPoint = {
            axis: axisDistance,
            firstPerp: radial * Math.cos(angle),
            secondPerp: radial * Math.sin(angle),
        };
        const mapped = mapLocalPoint(localPoint, axis);

        positions.push(
            center[0] + mapped[0],
            center[1] + mapped[1],
            center[2] + mapped[2],
        );
    }

    group.add(createPointCloud(THREE, positions, material));
}

function addPiOverlapIntersectionPointCloud(THREE, group, material, firstOrbital, secondOrbital, lobeSign, pointCount) {
    const bounds = intersectBounds(firstOrbital.bounds, secondOrbital.bounds);
    const positions = [];

    if (!bounds) {
        return;
    }

    const axisIndex = getAxisIndex(firstOrbital.axis);
    const lobeBounds = {
        min: [...bounds.min],
        max: [...bounds.max],
    };

    if (lobeSign > 0) {
        lobeBounds.min[axisIndex] = Math.max(lobeBounds.min[axisIndex], firstOrbital.center[axisIndex] + firstOrbital.nodeGap);
    } else {
        lobeBounds.max[axisIndex] = Math.min(lobeBounds.max[axisIndex], firstOrbital.center[axisIndex] - firstOrbital.nodeGap);
    }

    for (let i = 0; i < pointCount; i += 1) {
        const point = findIntersectionPoint(firstOrbital, secondOrbital, lobeBounds, i, pointCount, 180);

        if (point) {
            positions.push(point[0], point[1], point[2]);
        }
    }

    group.add(createPointCloud(THREE, positions, material));
}

function findIntersectionPoint(firstOrbital, secondOrbital, bounds, index, pointCount, maxAttempts) {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const point = getRandomPointInBounds(bounds, index, pointCount, attempt < 60);

        if (firstOrbital.contains(point) && secondOrbital.contains(point)) {
            return point;
        }
    }

    return null;
}

function getRandomPointInBounds(bounds, index, pointCount, useAxisStratification) {
    const x = useAxisStratification
        ? bounds.min[0] + ((index + Math.random()) / pointCount) * (bounds.max[0] - bounds.min[0])
        : randomBetween(bounds.min[0], bounds.max[0]);

    return [
        x,
        randomBetween(bounds.min[1], bounds.max[1]),
        randomBetween(bounds.min[2], bounds.max[2]),
    ];
}

function createPOrbitalVolume(center, axis, lobeLength, lobeWidth) {
    const nodeGap = 0.12;
    const axisIndex = getAxisIndex(axis);
    const bounds = {
        min: [center[0] - lobeWidth, center[1] - lobeWidth, center[2] - lobeWidth],
        max: [center[0] + lobeWidth, center[1] + lobeWidth, center[2] + lobeWidth],
    };

    bounds.min[axisIndex] = center[axisIndex] - nodeGap - lobeLength;
    bounds.max[axisIndex] = center[axisIndex] + nodeGap + lobeLength;

    return {
        center,
        axis,
        lobeLength,
        lobeWidth,
        nodeGap,
        bounds,
        contains(point) {
            const localAxis = point[axisIndex] - center[axisIndex];
            const t = (Math.abs(localAxis) - nodeGap) / lobeLength;

            if (t < 0 || t > 1) {
                return false;
            }

            const perpendicularDistance = getPerpendicularDistance(point, center, axisIndex);

            return perpendicularDistance <= getPOrbitalWidth(t, lobeWidth);
        },
    };
}

function intersectBounds(firstBounds, secondBounds) {
    const min = [
        Math.max(firstBounds.min[0], secondBounds.min[0]),
        Math.max(firstBounds.min[1], secondBounds.min[1]),
        Math.max(firstBounds.min[2], secondBounds.min[2]),
    ];
    const max = [
        Math.min(firstBounds.max[0], secondBounds.max[0]),
        Math.min(firstBounds.max[1], secondBounds.max[1]),
        Math.min(firstBounds.max[2], secondBounds.max[2]),
    ];

    if (min.some((value, index) => value >= max[index])) {
        return null;
    }

    return { min, max };
}

function getPOrbitalWidth(t, lobeWidth) {
    return lobeWidth * Math.pow(Math.sin(Math.PI * t), 0.55) * (0.72 + 0.28 * t);
}

function getPerpendicularDistance(point, center, axisIndex) {
    let total = 0;

    for (let index = 0; index < 3; index += 1) {
        if (index !== axisIndex) {
            const distance = point[index] - center[index];
            total += distance * distance;
        }
    }

    return Math.sqrt(total);
}

function getAxisIndex(axis) {
    if (axis === "x") {
        return 0;
    }

    if (axis === "y") {
        return 1;
    }

    return 2;
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

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function createPointCloud(THREE, positions, material) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    return new THREE.Points(geometry, material.clone());
}

function addNucleus(THREE, group, material, center) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 16), material);
    mesh.position.set(center[0], center[1], center[2]);
    group.add(mesh);
}

function addInternuclearAxis(THREE, group, material) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2.8, 0, 0),
        new THREE.Vector3(2.8, 0, 0),
    ]);

    group.add(new THREE.Line(geometry, material));
}

function injectPiBondOverlapStyles() {
    if (document.getElementById("pi-bond-overlap-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "pi-bond-overlap-styles";
    style.textContent = `
        .pi-bond-overlap-component {
            width: 100%;
            max-width: 920px;
            margin: 1.25rem 0;
        }

        .pi-bond-overlap-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
        }

        .pi-bond-overlap-button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
        }

        .pi-bond-overlap-button {
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            min-width: 4.25rem;
            padding: 0.45rem 0.75rem;
        }

        .pi-bond-overlap-button:hover,
        .pi-bond-overlap-button.is-active {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .pi-bond-overlap-stage {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .pi-bond-overlap-component[data-mode="3d"] .pi-bond-overlap-2d,
        .pi-bond-overlap-component[data-mode="2d"] .pi-bond-overlap-3d {
            display: none;
        }

        .pi-bond-overlap-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .pi-bond-overlap-bg {
            fill: #ffffff;
        }

        .pi-bond-overlap-axis {
            stroke: #111827;
            stroke-linecap: round;
            stroke-width: 2.4;
        }

        .pi-bond-p-lobe {
            fill: #4fc3f7;
            fill-opacity: 0.62;
            stroke: #0f172a;
            stroke-width: 2.2;
        }

        .pi-bond-nucleus {
            fill: #d71920;
        }

        .pi-bond-overlap-3d {
            background: #ffffff;
            height: clamp(330px, 55vw, 540px);
            position: relative;
            touch-action: none;
            width: 100%;
        }

        .pi-bond-overlap-3d canvas {
            display: block;
            height: 100% !important;
            outline: none;
            width: 100% !important;
        }

        .pi-bond-overlap-loading {
            align-items: center;
            color: #4b5563;
            display: flex;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            height: 100%;
            justify-content: center;
            min-height: 330px;
        }
    `;

    document.head.append(style);
}
