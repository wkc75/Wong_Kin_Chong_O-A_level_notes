const vseprShapeContainer = document.getElementById("vsepr-shape-viewer");

if (vseprShapeContainer) {
    const shapes = createVseprShapeData();
    let selectedKey = "4-0";
    let threeState;
    let threePromise;

    injectVseprShapeStyles();

    vseprShapeContainer.classList.add("vsepr-shape-component");
    vseprShapeContainer.innerHTML = `
        <div class="vsepr-shape-controls" aria-label="Choose VSEPR electron pair counts">
            <div class="vsepr-shape-control-group">
                <span class="vsepr-shape-control-label">Bond pairs</span>
                <div class="vsepr-shape-button-row" data-control="bond"></div>
            </div>
            <div class="vsepr-shape-control-group">
                <span class="vsepr-shape-control-label">Lone pairs</span>
                <div class="vsepr-shape-button-row" data-control="lone"></div>
            </div>
        </div>
        <div class="vsepr-shape-layout">
            <aside class="vsepr-shape-panel" aria-live="polite">
                <div class="vsepr-shape-stat">
                    <span>Total electron pairs</span>
                    <strong data-vsepr-total></strong>
                </div>
                <div class="vsepr-shape-stat">
                    <span>Bond pairs</span>
                    <strong data-vsepr-bond></strong>
                </div>
                <div class="vsepr-shape-stat">
                    <span>Lone pairs</span>
                    <strong data-vsepr-lone></strong>
                </div>
            </aside>
            <div class="vsepr-shape-stage">
                <div class="vsepr-shape-canvas" aria-label="Interactive 3D VSEPR molecular shape"></div>
                <div class="vsepr-shape-caption">
                    <strong data-vsepr-name></strong>
                    <span data-vsepr-angle></span>
                </div>
            </div>
        </div>
    `;

    const bondButtonRow = vseprShapeContainer.querySelector('[data-control="bond"]');
    const loneButtonRow = vseprShapeContainer.querySelector('[data-control="lone"]');
    const stage = vseprShapeContainer.querySelector(".vsepr-shape-canvas");
    const statTotal = vseprShapeContainer.querySelector("[data-vsepr-total]");
    const statBond = vseprShapeContainer.querySelector("[data-vsepr-bond]");
    const statLone = vseprShapeContainer.querySelector("[data-vsepr-lone]");
    const shapeName = vseprShapeContainer.querySelector("[data-vsepr-name]");
    const shapeAngle = vseprShapeContainer.querySelector("[data-vsepr-angle]");

    renderButtons();
    initialiseVsepr3d().then(render);

    function renderButtons() {
        const bondValues = [2, 3, 4, 5, 6];
        const loneValues = [0, 1, 2, 3];

        bondButtonRow.innerHTML = bondValues.map((value) => {
            return `<button class="vsepr-shape-button" type="button" data-bond="${value}" aria-pressed="false">${value}</button>`;
        }).join("");

        loneButtonRow.innerHTML = loneValues.map((value) => {
            return `<button class="vsepr-shape-button" type="button" data-lone="${value}" aria-pressed="false">${value}</button>`;
        }).join("");

        bondButtonRow.addEventListener("click", (event) => {
            const button = event.target.closest("[data-bond]");
            if (!button || button.disabled) {
                return;
            }

            const [, lonePairs] = selectedKey.split("-").map(Number);
            selectedKey = getValidShapeKey(Number(button.dataset.bond), lonePairs);
            render();
        });

        loneButtonRow.addEventListener("click", (event) => {
            const button = event.target.closest("[data-lone]");
            if (!button || button.disabled) {
                return;
            }

            const [bondPairs] = selectedKey.split("-").map(Number);
            selectedKey = getValidShapeKey(bondPairs, Number(button.dataset.lone));
            render();
        });
    }

    function getValidShapeKey(bondPairs, lonePairs) {
        const directKey = `${bondPairs}-${lonePairs}`;

        if (shapes[directKey]) {
            return directKey;
        }

        const fallback = Object.values(shapes).find((shape) => shape.bondPairs === bondPairs);
        return fallback ? fallback.key : selectedKey;
    }

    function initialiseVsepr3d() {
        if (threePromise) {
            return threePromise;
        }

        stage.innerHTML = `<div class="vsepr-shape-loading">Loading 3D view...</div>`;
        threePromise = Promise.all([
            import("https://esm.sh/three@0.164.1"),
            import("https://esm.sh/three@0.164.1/examples/jsm/controls/OrbitControls.js?deps=three@0.164.1"),
        ]).then(([THREE, controlsModule]) => {
            threeState = createVsepr3dScene(THREE, controlsModule.OrbitControls, stage);
            stage.querySelector(".vsepr-shape-loading")?.remove();
        }).catch(() => {
            stage.innerHTML = `<div class="vsepr-shape-loading">3D view could not be loaded.</div>`;
        });

        return threePromise;
    }

    function render() {
        const shape = shapes[selectedKey];

        statTotal.textContent = shape.totalPairs;
        statBond.textContent = shape.bondPairs;
        statLone.textContent = shape.lonePairs;
        shapeName.textContent = shape.name;
        shapeAngle.textContent = shape.angle;
        updateVseprButtonState(shape);

        if (threeState) {
            renderVseprShape3d(threeState.THREE, threeState, shape);
        }
    }

    function updateVseprButtonState(shape) {
        vseprShapeContainer.querySelectorAll("[data-bond]").forEach((button) => {
            const value = Number(button.dataset.bond);
            const isActive = value === shape.bondPairs;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        vseprShapeContainer.querySelectorAll("[data-lone]").forEach((button) => {
            const value = Number(button.dataset.lone);
            const isValid = Boolean(shapes[`${shape.bondPairs}-${value}`]);
            const isActive = value === shape.lonePairs;

            button.disabled = !isValid;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }
}

function createVseprShapeData() {
    const linear = [
        [-1, 0, 0],
        [1, 0, 0],
    ];
    const trigonalPlanar = [
        [1, 0, 0],
        [-0.5, 0, 0.866],
        [-0.5, 0, -0.866],
    ];
    const tetrahedral = [
        [1, 1, 1],
        [1, -1, -1],
        [-1, 1, -1],
        [-1, -1, 1],
    ];
    const trigonalBipyramidal = [
        [0, 1, 0],
        [0, -1, 0],
        [1, 0, 0],
        [-0.5, 0, 0.866],
        [-0.5, 0, -0.866],
    ];
    const octahedral = [
        [1, 0, 0],
        [-1, 0, 0],
        [0, 0, 1],
        [0, 0, -1],
        [0, 1, 0],
        [0, -1, 0],
    ];
    const squarePyramidal = [
        [1, 0.22, 0],
        [-1, 0.22, 0],
        [0, 0.22, 1],
        [0, 0.22, -1],
        [0, 1, 0],
    ];

    const data = [
        {
            key: "2-0",
            name: "linear",
            angle: "180 deg",
            bonds: linear,
            lonePairs: [],
        },
        {
            key: "3-0",
            name: "trigonal planar",
            angle: "120 deg",
            bonds: trigonalPlanar,
            lonePairs: [],
        },
        {
            key: "2-1",
            name: "bent",
            angle: "eg. 118 deg",
            bonds: [
                [0.515, 0, 0.857],
                [0.515, 0, -0.857],
            ],
            lonePairs: [[-1, 0, 0]],
        },
        {
            key: "4-0",
            name: "tetrahedral",
            angle: "109.5 deg",
            bonds: tetrahedral,
            lonePairs: [],
        },
        {
            key: "3-1",
            name: "trigonal pyramidal",
            angle: "107 deg",
            bonds: tetrahedral.slice(1),
            lonePairs: [tetrahedral[0]],
        },
        {
            key: "2-2",
            name: "bent",
            angle: "104.5 deg",
            bonds: tetrahedral.slice(2),
            lonePairs: tetrahedral.slice(0, 2),
        },
        {
            key: "5-0",
            name: "trigonal bipyramidal",
            angle: "90 deg, 120 deg",
            bonds: trigonalBipyramidal,
            lonePairs: [],
        },
        {
            key: "4-1",
            name: "see-saw",
            angle: "less than 90 deg and 120 deg",
            bonds: trigonalBipyramidal.slice(0, 4),
            lonePairs: [trigonalBipyramidal[4]],
        },
        {
            key: "3-2",
            name: "T-shaped",
            angle: "about 90 deg",
            bonds: trigonalBipyramidal.slice(0, 3),
            lonePairs: trigonalBipyramidal.slice(3),
        },
        {
            key: "2-3",
            name: "linear",
            angle: "180 deg",
            bonds: trigonalBipyramidal.slice(0, 2),
            lonePairs: trigonalBipyramidal.slice(2),
        },
        {
            key: "6-0",
            name: "octahedral",
            angle: "90 deg",
            bonds: octahedral,
            lonePairs: [],
        },
        {
            key: "5-1",
            name: "square pyramidal",
            angle: "about 90 deg",
            bonds: squarePyramidal,
            lonePairs: [octahedral[5]],
        },
        {
            key: "4-2",
            name: "square planar",
            angle: "90 deg",
            bonds: octahedral.slice(0, 4),
            lonePairs: octahedral.slice(4),
        },
    ];

    return Object.fromEntries(data.map((shape) => {
        const [bondPairs, lonePairs] = shape.key.split("-").map(Number);

        return [
            shape.key,
            {
                ...shape,
                bondPairs,
                lonePairPositions: shape.lonePairs,
                lonePairs,
                totalPairs: bondPairs + lonePairs,
            },
        ];
    }));
}

function createVsepr3dScene(THREE, OrbitControls, stage) {
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
    camera.position.set(3.3, 2.5, 6.4);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 4.4;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 1.45));

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.1);
    mainLight.position.set(4, 5, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.1);
    fillLight.position.set(-4, -2, -3);
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
    stage.__vseprGroup = group;

    return { THREE, scene, camera, renderer, controls, group };
}

function renderVseprShape3d(THREE, state, shape) {
    clearVseprGroup(state.group);

    const materials = createVseprMaterials(THREE);
    const bondLength = 1.38;
    const loneLength = 1.22;
    const centralAtom = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 20), materials.central);

    state.group.add(centralAtom);

    const bondDirections = shape.bonds.map((point) => normalizePoint(THREE, point));
    const loneDirections = shape.lonePairPositions.map((point) => normalizePoint(THREE, point));

    bondDirections.forEach((direction) => {
        const end = direction.clone().multiplyScalar(bondLength);
        addBond(THREE, state.group, materials.bond, end);
        addBondedAtom(THREE, state.group, materials.bonded, end);
    });

    loneDirections.forEach((direction) => {
        addLonePair(THREE, state.group, materials.lonePair, direction.clone().multiplyScalar(loneLength), direction);
    });

    addAngleGuide(THREE, state.group, materials.angle, bondDirections, shape.angle);
}

function createVseprMaterials(THREE) {
    return {
        central: new THREE.MeshStandardMaterial({
            color: 0x6b7280,
            roughness: 0.35,
            metalness: 0.08,
        }),
        bonded: new THREE.MeshStandardMaterial({
            color: 0xd71920,
            roughness: 0.32,
            metalness: 0.04,
        }),
        bond: new THREE.MeshStandardMaterial({
            color: 0x9ca3af,
            roughness: 0.45,
            metalness: 0.05,
        }),
        lonePair: new THREE.MeshStandardMaterial({
            color: 0x60a5fa,
            transparent: true,
            opacity: 0.78,
            roughness: 0.4,
            metalness: 0.02,
        }),
        angle: new THREE.LineBasicMaterial({
            color: 0x111827,
            transparent: true,
            opacity: 0.55,
        }),
    };
}

function clearVseprGroup(group) {
    group.traverse((child) => {
        if (child.geometry) {
            child.geometry.dispose();
        }

        if (child.material) {
            if (child.material.map) {
                child.material.map.dispose();
            }

            child.material.dispose();
        }
    });
    group.clear();
}

function normalizePoint(THREE, point) {
    return new THREE.Vector3(point[0], point[1], point[2]).normalize();
}

function addBond(THREE, group, material, end) {
    const length = end.length();
    const geometry = new THREE.CylinderGeometry(0.045, 0.045, length, 20);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(end.clone().multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().normalize());
    group.add(mesh);
}

function addBondedAtom(THREE, group, material, position) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 28, 18), material);

    mesh.position.copy(position);
    group.add(mesh);
}

function addLonePair(THREE, group, material, position, direction) {
    const lonePair = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.52, 28), material);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.18, 28, 16), material);

    cone.position.set(0, 0.16, 0);
    cap.position.set(0, 0.4, 0);
    lonePair.add(cone, cap);
    lonePair.position.copy(position);
    lonePair.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    group.add(lonePair);
}

function addAngleGuide(THREE, group, material, bondDirections, label) {
    if (bondDirections.length < 2) {
        return;
    }

    const points = getAngleArcPoints(THREE, bondDirections[0], bondDirections[1], 0.72);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    const labelPosition = points[Math.floor(points.length / 2)].clone().multiplyScalar(1.18);

    group.add(line);
    group.add(createTextSprite(THREE, label, labelPosition));
}

function getAngleArcPoints(THREE, first, second, radius) {
    const angle = first.angleTo(second);
    const points = [];

    if (Math.abs(Math.PI - angle) < 0.01) {
        for (let index = 0; index <= 42; index += 1) {
            const theta = (Math.PI * index) / 42;
            points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
        }

        return points;
    }

    const sinAngle = Math.sin(angle);

    for (let index = 0; index <= 42; index += 1) {
        const t = index / 42;
        const firstScale = Math.sin((1 - t) * angle) / sinAngle;
        const secondScale = Math.sin(t * angle) / sinAngle;
        const point = first.clone().multiplyScalar(firstScale)
            .add(second.clone().multiplyScalar(secondScale))
            .normalize()
            .multiplyScalar(radius);

        points.push(point);
    }

    return points;
}

function createTextSprite(THREE, text, position) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const scale = window.devicePixelRatio || 1;

    canvas.width = 180 * scale;
    canvas.height = 58 * scale;
    context.scale(scale, scale);
    context.font = "700 20px Roboto, Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#111827";
    context.fillText(text, 90, 29);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
    });
    const sprite = new THREE.Sprite(material);

    sprite.position.copy(position);
    sprite.scale.set(1.15, 0.37, 1);

    return sprite;
}

function injectVseprShapeStyles() {
    if (document.getElementById("vsepr-shape-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "vsepr-shape-styles";
    style.textContent = `
        .vsepr-shape-component {
            width: 100%;
            max-width: 980px;
            margin: 1.25rem 0;
        }

        .vsepr-shape-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 0.9rem;
            margin-bottom: 0.75rem;
        }

        .vsepr-shape-control-group {
            display: grid;
            gap: 0.4rem;
        }

        .vsepr-shape-control-label {
            color: #334155;
            font: 700 0.86rem Roboto, Arial, sans-serif;
        }

        .vsepr-shape-button-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
        }

        .vsepr-shape-button {
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            min-width: 2.75rem;
            padding: 0.45rem 0.7rem;
        }

        .vsepr-shape-button:hover,
        .vsepr-shape-button.is-active {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .vsepr-shape-button:disabled {
            background: #f1f5f9;
            border-color: #e2e8f0;
            color: #94a3b8;
            cursor: not-allowed;
        }

        .vsepr-shape-layout {
            display: grid;
            grid-template-columns: minmax(190px, 0.34fr) minmax(320px, 1fr);
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
            background: #ffffff;
        }

        .vsepr-shape-panel {
            display: grid;
            align-content: start;
            gap: 0.75rem;
            border-right: 1px solid #dde3ea;
            background: #f8fafc;
            padding: 1rem;
        }

        .vsepr-shape-stat {
            display: grid;
            gap: 0.2rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: #ffffff;
            padding: 0.75rem;
        }

        .vsepr-shape-stat span {
            color: #64748b;
            font: 700 0.82rem Roboto, Arial, sans-serif;
        }

        .vsepr-shape-stat strong {
            color: #111827;
            font: 800 1.55rem Roboto, Arial, sans-serif;
        }

        .vsepr-shape-stage {
            position: relative;
            min-width: 0;
            background: #ffffff;
        }

        .vsepr-shape-canvas {
            height: clamp(380px, 56vw, 560px);
            touch-action: none;
            width: 100%;
        }

        .vsepr-shape-canvas canvas {
            display: block;
            height: 100% !important;
            outline: none;
            width: 100% !important;
        }

        .vsepr-shape-caption {
            position: absolute;
            left: 50%;
            bottom: 0.9rem;
            display: grid;
            min-width: min(78%, 360px);
            transform: translateX(-50%);
            border: 1px solid #dbe3ef;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.92);
            padding: 0.55rem 0.8rem;
            text-align: center;
            box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
        }

        .vsepr-shape-caption strong {
            color: #111827;
            font: 800 1.05rem Roboto, Arial, sans-serif;
        }

        .vsepr-shape-caption span {
            color: #334155;
            font: 700 0.92rem Roboto, Arial, sans-serif;
        }

        .vsepr-shape-loading {
            align-items: center;
            color: #4b5563;
            display: flex;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            height: 100%;
            justify-content: center;
            min-height: 360px;
        }

        @media (max-width: 760px) {
            .vsepr-shape-layout {
                grid-template-columns: 1fr;
            }

            .vsepr-shape-panel {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                border-right: 0;
                border-bottom: 1px solid #dde3ea;
            }

            .vsepr-shape-stat {
                padding: 0.6rem;
            }
        }
    `;

    document.head.appendChild(style);
}
