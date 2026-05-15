const sigmaBondOverlapContainer = document.getElementById("sigma-bond-overlap-viewer");

if (sigmaBondOverlapContainer) {
    const bondTypes = {
        ss: "s-s",
        sp: "s-p",
        pp: "p-p",
    };
    let selectedMode = "2d";
    let selectedBond = "ss";
    let threeState;
    let threePromise;

    injectSigmaBondOverlapStyles();

    sigmaBondOverlapContainer.classList.add("sigma-bond-overlap-component");
    sigmaBondOverlapContainer.innerHTML = `
        <div class="sigma-bond-overlap-toolbar">
            <div class="sigma-bond-overlap-button-group" aria-label="Choose view">
                <button class="sigma-bond-overlap-button is-active" type="button" data-mode="2d" aria-pressed="true">2D</button>
                <button class="sigma-bond-overlap-button" type="button" data-mode="3d" aria-pressed="false">3D</button>
            </div>
            <div class="sigma-bond-overlap-button-group" aria-label="Choose sigma bond type">
                ${Object.entries(bondTypes).map(([key, label], index) => `
                    <button class="sigma-bond-overlap-button ${index === 0 ? "is-active" : ""}" type="button" data-bond="${key}" aria-pressed="${index === 0 ? "true" : "false"}">${label}</button>
                `).join("")}
            </div>
        </div>
        <div class="sigma-bond-overlap-stage">
            <div class="sigma-bond-overlap-2d"></div>
            <div class="sigma-bond-overlap-3d" aria-label="Interactive 3D sigma bond orbital overlap"></div>
        </div>
    `;

    const modeButtons = [...sigmaBondOverlapContainer.querySelectorAll("[data-mode]")];
    const bondButtons = [...sigmaBondOverlapContainer.querySelectorAll("[data-bond]")];
    const twoDStage = sigmaBondOverlapContainer.querySelector(".sigma-bond-overlap-2d");
    const threeDStage = sigmaBondOverlapContainer.querySelector(".sigma-bond-overlap-3d");

    modeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedMode = button.dataset.mode;
            render();
        });
    });

    bondButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedBond = button.dataset.bond;
            render();
        });
    });

    function render() {
        twoDStage.innerHTML = createSigmaBond2dSvg(selectedBond);
        sigmaBondOverlapContainer.dataset.mode = selectedMode;

        updateButtonState(modeButtons, "mode", selectedMode);
        updateButtonState(bondButtons, "bond", selectedBond);

        if (selectedMode === "3d") {
            initialiseSigmaBond3d().then(() => {
                renderSigmaBond3d(threeState.THREE, threeState, selectedBond);
            });
        }
    }

    function initialiseSigmaBond3d() {
        if (threePromise) {
            return threePromise;
        }

        threeDStage.innerHTML = `<div class="sigma-bond-overlap-loading">Loading 3D view...</div>`;
        threePromise = Promise.all([
            import("https://esm.sh/three@0.164.1"),
            import("https://esm.sh/three@0.164.1/examples/jsm/controls/OrbitControls.js?deps=three@0.164.1"),
        ]).then(([THREE, controlsModule]) => {
            threeState = createSigmaBond3dScene(THREE, controlsModule.OrbitControls, threeDStage);
            threeDStage.querySelector(".sigma-bond-overlap-loading")?.remove();
        }).catch(() => {
            threeDStage.innerHTML = `<div class="sigma-bond-overlap-loading">3D view could not be loaded.</div>`;
        });

        return threePromise;
    }

    render();
}

function updateButtonState(buttons, dataKey, activeValue) {
    buttons.forEach((button) => {
        const isActive = button.dataset[dataKey] === activeValue;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function createSigmaBond2dSvg(type) {
    const diagrams = {
        ss: createSs2d(),
        sp: createSp2d(),
        pp: createPp2d(),
    };

    return `
        <svg class="sigma-bond-overlap-svg" viewBox="0 0 760 300" role="img" aria-label="${type} sigma bond orbital overlap">
            <rect class="sigma-bond-overlap-bg" x="0" y="0" width="760" height="300"></rect>
            <line class="sigma-bond-overlap-axis" x1="82" y1="150" x2="678" y2="150"></line>
            ${diagrams[type]}
        </svg>
    `;
}

function createSs2d() {
    return `
        <circle class="sigma-bond-orbital sigma-bond-orbital--left" cx="320" cy="150" r="82"></circle>
        <circle class="sigma-bond-orbital sigma-bond-orbital--right" cx="440" cy="150" r="82"></circle>
        <circle class="sigma-bond-nucleus" cx="320" cy="150" r="6"></circle>
        <circle class="sigma-bond-nucleus" cx="440" cy="150" r="6"></circle>
    `;
}

function createSp2d() {
    return `
        <circle class="sigma-bond-orbital sigma-bond-orbital--left" cx="300" cy="150" r="74"></circle>
        <circle class="sigma-bond-nucleus" cx="300" cy="150" r="6"></circle>
        ${createPOrbital2d(520, 150, 160, 160, 55)}
    `;
}

function createPp2d() {
    return `
        ${createPOrbital2d(275, 150, 130, 130, 52)}
        ${createPOrbital2d(485, 150, 130, 130, 52)}
    `;
}

function createPOrbital2d(centerX, centerY, leftLength, rightLength, height) {
    const leftCapX = centerX - leftLength * 1.08;
    const rightCapX = centerX + rightLength * 1.08;
    const leftShoulderX = centerX - leftLength * 0.64;
    const rightShoulderX = centerX + rightLength * 0.64;

    return `
        <path class="sigma-bond-p-lobe sigma-bond-p-lobe--left" d="
            M ${centerX} ${centerY}
            C ${centerX - leftLength * 0.08} ${centerY - height * 0.2}, ${centerX - leftLength * 0.22} ${centerY - height * 0.72}, ${leftShoulderX} ${centerY - height * 0.86}
            C ${centerX - leftLength * 0.96} ${centerY - height * 0.84}, ${leftCapX} ${centerY - height * 0.42}, ${leftCapX} ${centerY}
            C ${leftCapX} ${centerY + height * 0.42}, ${centerX - leftLength * 0.96} ${centerY + height * 0.84}, ${leftShoulderX} ${centerY + height * 0.86}
            C ${centerX - leftLength * 0.22} ${centerY + height * 0.72}, ${centerX - leftLength * 0.08} ${centerY + height * 0.2}, ${centerX} ${centerY}
            Z"></path>
        <path class="sigma-bond-p-lobe sigma-bond-p-lobe--right" d="
            M ${centerX} ${centerY}
            C ${centerX + rightLength * 0.08} ${centerY - height * 0.2}, ${centerX + rightLength * 0.22} ${centerY - height * 0.72}, ${rightShoulderX} ${centerY - height * 0.86}
            C ${centerX + rightLength * 0.96} ${centerY - height * 0.84}, ${rightCapX} ${centerY - height * 0.42}, ${rightCapX} ${centerY}
            C ${rightCapX} ${centerY + height * 0.42}, ${centerX + rightLength * 0.96} ${centerY + height * 0.84}, ${rightShoulderX} ${centerY + height * 0.86}
            C ${centerX + rightLength * 0.22} ${centerY + height * 0.72}, ${centerX + rightLength * 0.08} ${centerY + height * 0.2}, ${centerX} ${centerY}
            Z"></path>
        <circle class="sigma-bond-nucleus" cx="${centerX}" cy="${centerY}" r="6"></circle>
    `;
}

function createSigmaBond3dScene(THREE, OrbitControls, stage) {
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
    camera.position.set(0, 2.4, 6.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 4.4;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
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

    stage.__camera = camera;
    stage.__controls = controls;
    stage.__sigmaGroup = group;

    return { THREE, scene, camera, renderer, controls, group };
}

function renderSigmaBond3d(THREE, state, type) {
    clearSigmaBond3dGroup(state.group);

    const materials = createSigmaBond3dMaterials(THREE);
    addBondAxis(THREE, state.group);

    if (type === "ss") {
        const leftOrbital = createSOrbitalVolume([-0.62, 0, 0], 1.08);
        const rightOrbital = createSOrbitalVolume([0.62, 0, 0], 1.08);

        addSOrbitalPointCloud(THREE, state.group, materials.orbital, leftOrbital.center, leftOrbital.radius, 16000);
        addSOrbitalPointCloud(THREE, state.group, materials.orbital, rightOrbital.center, rightOrbital.radius, 16000);
        addOrbitalIntersectionPointCloud(THREE, state.group, materials.overlap, leftOrbital, rightOrbital, 18000);
        addNucleus(THREE, state.group, materials.nucleus, -0.62, 0, 0);
        addNucleus(THREE, state.group, materials.nucleus, 0.62, 0, 0);
    }

    if (type === "sp") {
        const sOrbital = createSOrbitalVolume([-1.02, 0, 0], 0.92);
        const pOrbital = createPOrbitalVolume([0.78, 0, 0], "x", 1.55, 0.66);

        addSOrbitalPointCloud(THREE, state.group, materials.orbital, sOrbital.center, sOrbital.radius, 6500);
        addPOrbitalPointCloud(THREE, state.group, materials.orbital, pOrbital.center, pOrbital.axis, pOrbital.lobeLength, pOrbital.lobeWidth, 10000);
        addOrbitalIntersectionPointCloud(THREE, state.group, materials.overlap, sOrbital, pOrbital, 9500);
        addNucleus(THREE, state.group, materials.nucleus, -1.02, 0, 0);
        addNucleus(THREE, state.group, materials.nucleus, 0.78, 0, 0);
    }

    if (type === "pp") {
        const leftOrbital = createPOrbitalVolume([-0.92, 0, 0], "x", 1.35, 0.62);
        const rightOrbital = createPOrbitalVolume([0.92, 0, 0], "x", 1.35, 0.62);

        addPOrbitalPointCloud(THREE, state.group, materials.orbital, leftOrbital.center, leftOrbital.axis, leftOrbital.lobeLength, leftOrbital.lobeWidth, 10000);
        addPOrbitalPointCloud(THREE, state.group, materials.orbital, rightOrbital.center, rightOrbital.axis, rightOrbital.lobeLength, rightOrbital.lobeWidth, 10000);
        addOrbitalIntersectionPointCloud(THREE, state.group, materials.overlap, leftOrbital, rightOrbital, 12000);
        addNucleus(THREE, state.group, materials.nucleus, -0.92, 0, 0);
        addNucleus(THREE, state.group, materials.nucleus, 0.92, 0, 0);
    }
}

function createSigmaBond3dMaterials(THREE) {
    return {
        orbital: new THREE.PointsMaterial({
            color: 0xd71920,
            transparent: true,
            opacity: 0.72,
            size: 0.026,
            depthWrite: false,
        }),
        overlap: new THREE.PointsMaterial({
            color: 0xa80f16,
            transparent: true,
            opacity: 0.92,
            size: 0.031,
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

function clearSigmaBond3dGroup(group) {
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

function addSOrbitalPointCloud(THREE, group, material, center, radius, pointCount) {
    const positions = [];

    for (let i = 0; i < pointCount; i += 1) {
        const direction = randomDirection();
        const radialBias = Math.pow(Math.random(), 0.45);
        const distance = radialBias * radius;

        positions.push(
            center[0] + distance * direction.x,
            center[1] + distance * direction.y,
            center[2] + distance * direction.z,
        );
    }

    group.add(createPointCloud(THREE, positions, material));
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

function addOrbitalIntersectionPointCloud(THREE, group, material, firstOrbital, secondOrbital, pointCount) {
    const bounds = intersectBounds(firstOrbital.bounds, secondOrbital.bounds);
    const positions = [];
    const maxAttemptsPerPoint = 140;

    if (!bounds) {
        return;
    }

    for (let i = 0; i < pointCount; i += 1) {
        const point = findIntersectionPoint(firstOrbital, secondOrbital, bounds, i, pointCount, maxAttemptsPerPoint);

        if (point) {
            positions.push(point[0], point[1], point[2]);
        }
    }

    group.add(createPointCloud(THREE, positions, material));
}

function findIntersectionPoint(firstOrbital, secondOrbital, bounds, index, pointCount, maxAttempts) {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const point = getRandomPointInBounds(bounds, index, pointCount, attempt < 40);

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

function createSOrbitalVolume(center, radius) {
    return {
        center,
        radius,
        bounds: {
            min: [center[0] - radius, center[1] - radius, center[2] - radius],
            max: [center[0] + radius, center[1] + radius, center[2] + radius],
        },
        contains(point) {
            const dx = point[0] - center[0];
            const dy = point[1] - center[1];
            const dz = point[2] - center[2];

            return dx * dx + dy * dy + dz * dz <= radius * radius;
        },
    };
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

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function createPointCloud(THREE, positions, material) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    return new THREE.Points(geometry, material.clone());
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

function mapLocalPoint(point, axis) {
    if (axis === "x") {
        return [point.axis, point.firstPerp, point.secondPerp];
    }

    if (axis === "y") {
        return [point.firstPerp, point.axis, point.secondPerp];
    }

    return [point.firstPerp, point.secondPerp, point.axis];
}

function addNucleus(THREE, group, material, x, y, z) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 16), material);
    mesh.position.set(x, y, z);
    group.add(mesh);
}

function addBondAxis(THREE, group) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2.9, 0, 0),
        new THREE.Vector3(2.9, 0, 0),
    ]);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0x111827,
        transparent: true,
        opacity: 0.45,
    }));
    group.add(line);
}

function injectSigmaBondOverlapStyles() {
    if (document.getElementById("sigma-bond-overlap-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "sigma-bond-overlap-styles";
    style.textContent = `
        .sigma-bond-overlap-component {
            width: 100%;
            max-width: 920px;
            margin: 1.25rem 0;
        }

        .sigma-bond-overlap-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
        }

        .sigma-bond-overlap-button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
        }

        .sigma-bond-overlap-button {
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            min-width: 4.25rem;
            padding: 0.45rem 0.75rem;
        }

        .sigma-bond-overlap-button:hover,
        .sigma-bond-overlap-button.is-active {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .sigma-bond-overlap-stage {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .sigma-bond-overlap-component[data-mode="3d"] .sigma-bond-overlap-2d,
        .sigma-bond-overlap-component[data-mode="2d"] .sigma-bond-overlap-3d {
            display: none;
        }

        .sigma-bond-overlap-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .sigma-bond-overlap-bg {
            fill: #ffffff;
        }

        .sigma-bond-overlap-axis {
            stroke: #111827;
            stroke-linecap: round;
            stroke-width: 2.4;
        }

        .sigma-bond-orbital,
        .sigma-bond-p-lobe {
            fill: #4fc3f7;
            fill-opacity: 0.62;
            stroke: #0f172a;
            stroke-width: 2.2;
        }

        .sigma-bond-p-lobe--outer {
            fill-opacity: 0.48;
        }

        .sigma-bond-nucleus {
            fill: #d71920;
        }

        .sigma-bond-overlap-3d {
            background: #ffffff;
            height: clamp(330px, 55vw, 540px);
            position: relative;
            touch-action: none;
            width: 100%;
        }

        .sigma-bond-overlap-3d canvas {
            display: block;
            height: 100%;
            outline: none;
            width: 100%;
        }

        .sigma-bond-overlap-loading {
            align-items: center;
            color: #4b5563;
            display: flex;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            height: 100%;
            justify-content: center;
            min-height: 330px;
        }
    `;

    document.head.appendChild(style);
}
