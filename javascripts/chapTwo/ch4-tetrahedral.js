const ch4TetrahedralContainer = document.getElementById("ch4-tetrahedral-viewer");

if (ch4TetrahedralContainer) {
    let threeState;
    let threePromise;

    injectCh4TetrahedralStyles();

    ch4TetrahedralContainer.classList.add("ch4-tetrahedral-component");
    ch4TetrahedralContainer.innerHTML = `
        <div class="ch4-tetrahedral-layout">
            <div class="ch4-tetrahedral-canvas" aria-label="Interactive 3D tetrahedral structure of methane"></div>
            <div class="ch4-tetrahedral-caption">
                <strong>CH<sub>4</sub></strong>
                <span>tetrahedral, 109.5 deg</span>
            </div>
        </div>
    `;

    const stage = ch4TetrahedralContainer.querySelector(".ch4-tetrahedral-canvas");

    initialiseCh4Tetrahedral3d().then(() => {
        renderCh4Tetrahedral3d(threeState.THREE, threeState);
    });

    function initialiseCh4Tetrahedral3d() {
        if (threePromise) {
            return threePromise;
        }

        stage.innerHTML = `<div class="ch4-tetrahedral-loading">Loading 3D view...</div>`;
        threePromise = Promise.all([
            import("https://esm.sh/three@0.164.1"),
            import("https://esm.sh/three@0.164.1/examples/jsm/controls/OrbitControls.js?deps=three@0.164.1"),
        ]).then(([THREE, controlsModule]) => {
            threeState = createCh4TetrahedralScene(THREE, controlsModule.OrbitControls, stage);
            stage.querySelector(".ch4-tetrahedral-loading")?.remove();
        }).catch(() => {
            stage.innerHTML = `<div class="ch4-tetrahedral-loading">3D view could not be loaded.</div>`;
        });

        return threePromise;
    }
}

function createCh4TetrahedralScene(THREE, OrbitControls, stage) {
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
    stage.__ch4Group = group;

    return { THREE, scene, camera, renderer, controls, group };
}

function renderCh4Tetrahedral3d(THREE, state) {
    clearCh4TetrahedralGroup(state.group);

    const materials = createCh4TetrahedralMaterials(THREE);
    const bondLength = 1.38;
    const tetrahedralDirections = [
        [1, 1, 1],
        [1, -1, -1],
        [-1, 1, -1],
        [-1, -1, 1],
    ].map((point) => new THREE.Vector3(point[0], point[1], point[2]).normalize());

    const carbon = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 20), materials.carbon);
    state.group.add(carbon);

    tetrahedralDirections.forEach((direction) => {
        const hydrogenPosition = direction.clone().multiplyScalar(bondLength);

        addCh4Bond(THREE, state.group, materials.bond, hydrogenPosition);
        addCh4Hydrogen(THREE, state.group, materials.hydrogen, hydrogenPosition);
    });

    addCh4AngleGuide(THREE, state.group, materials.angle, tetrahedralDirections[0], tetrahedralDirections[1], "109.5 deg");
    state.group.add(createCh4TextSprite(THREE, "C", new THREE.Vector3(0, 0.42, 0)));
}

function createCh4TetrahedralMaterials(THREE) {
    return {
        carbon: new THREE.MeshStandardMaterial({
            color: 0x6b7280,
            roughness: 0.35,
            metalness: 0.08,
        }),
        hydrogen: new THREE.MeshStandardMaterial({
            color: 0xd71920,
            roughness: 0.32,
            metalness: 0.04,
        }),
        bond: new THREE.MeshStandardMaterial({
            color: 0x9ca3af,
            roughness: 0.45,
            metalness: 0.05,
        }),
        angle: new THREE.LineBasicMaterial({
            color: 0x111827,
            transparent: true,
            opacity: 0.55,
        }),
    };
}

function clearCh4TetrahedralGroup(group) {
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

function addCh4Bond(THREE, group, material, end) {
    const length = end.length();
    const geometry = new THREE.CylinderGeometry(0.045, 0.045, length, 20);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(end.clone().multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().normalize());
    group.add(mesh);
}

function addCh4Hydrogen(THREE, group, material, position) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 28, 18), material);

    mesh.position.copy(position);
    group.add(mesh);
    group.add(createCh4TextSprite(THREE, "H", position.clone().multiplyScalar(1.18)));
}

function addCh4AngleGuide(THREE, group, material, first, second, label) {
    const points = getCh4AngleArcPoints(THREE, first, second, 0.72);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    const labelPosition = points[Math.floor(points.length / 2)].clone().multiplyScalar(1.18);

    group.add(line);
    group.add(createCh4TextSprite(THREE, label, labelPosition));
}

function getCh4AngleArcPoints(THREE, first, second, radius) {
    const angle = first.angleTo(second);
    const sinAngle = Math.sin(angle);
    const points = [];

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

function createCh4TextSprite(THREE, text, position) {
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
    sprite.scale.set(text.length > 2 ? 1.15 : 0.38, 0.24, 1);

    return sprite;
}

function injectCh4TetrahedralStyles() {
    if (document.getElementById("ch4-tetrahedral-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "ch4-tetrahedral-styles";
    style.textContent = `
        .ch4-tetrahedral-component {
            width: 100%;
            max-width: 920px;
            margin: 1.25rem 0;
        }

        .ch4-tetrahedral-layout {
            position: relative;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
            background: #ffffff;
        }

        .ch4-tetrahedral-canvas {
            height: clamp(380px, 56vw, 540px);
            touch-action: none;
            width: 100%;
        }

        .ch4-tetrahedral-canvas canvas {
            display: block;
            height: 100% !important;
            outline: none;
            width: 100% !important;
        }

        .ch4-tetrahedral-caption {
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

        .ch4-tetrahedral-caption strong {
            color: #111827;
            font: 800 1.05rem Roboto, Arial, sans-serif;
        }

        .ch4-tetrahedral-caption span {
            color: #334155;
            font: 700 0.92rem Roboto, Arial, sans-serif;
        }

        .ch4-tetrahedral-loading {
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
