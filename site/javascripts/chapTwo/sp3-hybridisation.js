const sp3HybridisationContainer = document.getElementById("sp3-hybridisation-viewer");

if (sp3HybridisationContainer) {
    let threeState;
    let threePromise;

    injectSp3HybridisationStyles();

    sp3HybridisationContainer.classList.add("sp3-hybridisation-component");
    sp3HybridisationContainer.innerHTML = `
        <div class="sp3-hybridisation-layout">
            <div class="sp3-hybridisation-canvas" aria-label="Interactive 3D sp3 hybrid orbitals arranged tetrahedrally"></div>
            <div class="sp3-hybridisation-caption">
                <strong>Four sp<sup>3</sup> hybrid orbitals</strong>
                <span>tetrahedral arrangement around carbon</span>
            </div>
        </div>
    `;

    const stage = sp3HybridisationContainer.querySelector(".sp3-hybridisation-canvas");

    initialiseSp3Hybridisation3d().then(() => {
        renderSp3Hybridisation3d(threeState.THREE, threeState);
    });

    function initialiseSp3Hybridisation3d() {
        if (threePromise) {
            return threePromise;
        }

        stage.innerHTML = `<div class="sp3-hybridisation-loading">Loading 3D view...</div>`;
        threePromise = Promise.all([
            import("https://esm.sh/three@0.164.1"),
            import("https://esm.sh/three@0.164.1/examples/jsm/controls/OrbitControls.js?deps=three@0.164.1"),
        ]).then(([THREE, controlsModule]) => {
            threeState = createSp3HybridisationScene(THREE, controlsModule.OrbitControls, stage);
            stage.querySelector(".sp3-hybridisation-loading")?.remove();
        }).catch(() => {
            stage.innerHTML = `<div class="sp3-hybridisation-loading">3D view could not be loaded.</div>`;
        });

        return threePromise;
    }
}

function createSp3HybridisationScene(THREE, OrbitControls, stage) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
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
    camera.position.set(4.4, 3.2, 5.6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 4.2;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 1.35));

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.9);
    mainLight.position.set(4, 5, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.1);
    fillLight.position.set(-4, -2, -4);
    scene.add(fillLight);
    scene.add(group);

    const resize = () => {
        const rect = stage.getBoundingClientRect();
        const width = Math.max(320, rect.width);
        const height = Math.max(340, rect.height);

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
    stage.__sp3Group = group;

    return { THREE, scene, camera, renderer, controls, group };
}

function renderSp3Hybridisation3d(THREE, state) {
    clearSp3HybridisationGroup(state.group);

    const materials = createSp3HybridisationMaterials(THREE);
    const directions = [
        [1, 1, 1],
        [1, -1, -1],
        [-1, 1, -1],
        [-1, -1, 1],
    ].map((point) => new THREE.Vector3(point[0], point[1], point[2]).normalize());

    const carbon = new THREE.Mesh(new THREE.SphereGeometry(0.13, 28, 18), materials.carbon);
    state.group.add(carbon);

    directions.forEach((direction, index) => {
        state.group.add(createSp3OrbitalPointCloud(THREE, direction, materials.orbital[index]));
    });
}

function createSp3HybridisationMaterials(THREE) {
    const orbitalColors = [0xd71920, 0xc1121f, 0xe11d48, 0xb91c1c];

    return {
        carbon: new THREE.MeshStandardMaterial({
            color: 0x111827,
            roughness: 0.35,
            metalness: 0.05,
        }),
        orbital: orbitalColors.map((color) => new THREE.PointsMaterial({
            color,
            transparent: true,
            opacity: 0.72,
            size: 0.026,
            depthWrite: false,
        })),
    };
}

function clearSp3HybridisationGroup(group) {
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

function createSp3OrbitalPointCloud(THREE, direction, material) {
    const positions = [];
    const basis = createDirectionalBasis(THREE, direction);

    addSp3LobePoints(positions, basis, {
        sign: 1,
        pointCount: 5400,
        length: 1.72,
        width: 0.54,
        nodeGap: 0.11,
        widthBias: 0.42,
    });
    addSp3LobePoints(positions, basis, {
        sign: -1,
        pointCount: 1700,
        length: 0.55,
        width: 0.21,
        nodeGap: 0.08,
        widthBias: 0.34,
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    return new THREE.Points(geometry, material);
}

function createDirectionalBasis(THREE, axis) {
    const normalizedAxis = axis.clone().normalize();
    const helper = Math.abs(normalizedAxis.y) > 0.9
        ? new THREE.Vector3(1, 0, 0)
        : new THREE.Vector3(0, 1, 0);
    const firstPerp = new THREE.Vector3().crossVectors(normalizedAxis, helper).normalize();
    const secondPerp = new THREE.Vector3().crossVectors(normalizedAxis, firstPerp).normalize();

    return {
        axis: normalizedAxis,
        firstPerp,
        secondPerp,
    };
}

function addSp3LobePoints(positions, basis, options) {
    for (let index = 0; index < options.pointCount; index += 1) {
        const t = Math.pow(Math.random(), 0.72);
        const axisDistance = options.sign * (options.nodeGap + options.length * t);
        const width = getSp3LobeWidth(t, options.width, options.widthBias);
        const angle = Math.random() * Math.PI * 2;
        const radial = width * Math.sqrt(Math.random());
        const point = basis.axis.clone().multiplyScalar(axisDistance)
            .add(basis.firstPerp.clone().multiplyScalar(radial * Math.cos(angle)))
            .add(basis.secondPerp.clone().multiplyScalar(radial * Math.sin(angle)));

        positions.push(point.x, point.y, point.z);
    }
}

function getSp3LobeWidth(t, lobeWidth, widthBias) {
    return lobeWidth * Math.pow(Math.sin(Math.PI * t), 0.58) * (widthBias + (1 - widthBias) * t);
}

function injectSp3HybridisationStyles() {
    if (document.getElementById("sp3-hybridisation-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "sp3-hybridisation-styles";
    style.textContent = `
        .sp3-hybridisation-component {
            width: 100%;
            max-width: 920px;
            margin: 1.25rem 0;
        }

        .sp3-hybridisation-layout {
            position: relative;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
            background: #ffffff;
        }

        .sp3-hybridisation-canvas {
            width: 100%;
            height: clamp(380px, 56vw, 540px);
            background: #ffffff;
            touch-action: none;
        }

        .sp3-hybridisation-canvas canvas {
            display: block;
            width: 100% !important;
            height: 100% !important;
            outline: none;
        }

        .sp3-hybridisation-caption {
            position: absolute;
            left: 50%;
            bottom: 0.9rem;
            display: grid;
            min-width: min(78%, 390px);
            transform: translateX(-50%);
            border: 1px solid #dbe3ef;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.92);
            padding: 0.55rem 0.8rem;
            text-align: center;
            box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
        }

        .sp3-hybridisation-caption strong {
            color: #111827;
            font: 800 1.05rem Roboto, Arial, sans-serif;
        }

        .sp3-hybridisation-caption span {
            color: #334155;
            font: 700 0.92rem Roboto, Arial, sans-serif;
        }

        .sp3-hybridisation-loading {
            align-items: center;
            color: #4b5563;
            display: flex;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            height: 100%;
            justify-content: center;
            min-height: 360px;
        }
    `;

    document.head.appendChild(style);
}
