const ionicLattice3dContainer = document.getElementById("ionic-lattice-3d-viewer");

if (ionicLattice3dContainer) {
    injectIonicLattice3dStyles();

    ionicLattice3dContainer.classList.add("ionic-lattice-3d-component");
    ionicLattice3dContainer.innerHTML = `
        <div class="ionic-lattice-3d-toolbar">
            <div class="ionic-lattice-3d-legend" aria-label="Ionic lattice key">
                <span><i class="ionic-lattice-3d-swatch ionic-lattice-3d-swatch--sodium"></i>Na+</span>
                <span><i class="ionic-lattice-3d-swatch ionic-lattice-3d-swatch--chloride"></i>Cl-</span>
                <span><i class="ionic-lattice-3d-bond-line"></i>Ionic bonding</span>
            </div>
        </div>
        <div class="ionic-lattice-3d-stage" aria-label="Interactive 3D sodium chloride ionic lattice"></div>
    `;

    Promise.all([
        import("https://esm.sh/three@0.164.1"),
        import("https://esm.sh/three@0.164.1/examples/jsm/controls/OrbitControls.js?deps=three@0.164.1"),
    ]).then(([THREE, controlsModule]) => {
        createIonicLatticeScene(THREE, controlsModule.OrbitControls, ionicLattice3dContainer);
    }).catch(() => {
        ionicLattice3dContainer.querySelector(".ionic-lattice-3d-stage").innerHTML = `
            <div class="ionic-lattice-3d-fallback">3D lattice could not be loaded.</div>
        `;
    });
}

function createIonicLatticeScene(THREE, OrbitControls, container) {
    const stage = container.querySelector(".ionic-lattice-3d-stage");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true,
    });
    const lattice = new THREE.Group();
    const initialCameraPosition = new THREE.Vector3(5.2, 4.3, 6.4);
    const initialTarget = new THREE.Vector3(0, 0, 0);

    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    stage.append(renderer.domElement);

    scene.background = new THREE.Color(0xffffff);
    camera.position.copy(initialCameraPosition);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 4.2;
    controls.maxDistance = 11;
    controls.target.copy(initialTarget);
    controls.update();

    addLights(THREE, scene);
    buildSodiumChlorideLattice(THREE, lattice);
    scene.add(lattice);

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

    container.ionicLattice3d = { camera, controls, renderer };
    animate();
}

function addLights(THREE, scene) {
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(5, 7, 6);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.1);
    fillLight.position.set(-4, -2, -5);
    scene.add(fillLight);
}

function buildSodiumChlorideLattice(THREE, lattice) {
    const spacing = 1.08;
    const gridSize = 4;
    const sodiumMaterial = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.46,
        metalness: 0.05,
    });
    const chlorideMaterial = new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        roughness: 0.52,
        metalness: 0.02,
    });
    const sodiumGeometry = new THREE.SphereGeometry(0.145, 32, 20);
    const chlorideGeometry = new THREE.SphereGeometry(0.265, 40, 24);
    const positions = [];

    for (let x = 0; x < gridSize; x += 1) {
        for (let y = 0; y < gridSize; y += 1) {
            for (let z = 0; z < gridSize; z += 1) {
                positions.push({
                    x,
                    y,
                    z,
                    position: new THREE.Vector3(
                        (x - (gridSize - 1) / 2) * spacing,
                        (y - (gridSize - 1) / 2) * spacing,
                        (z - (gridSize - 1) / 2) * spacing,
                    ),
                    ion: (x + y + z) % 2 === 0 ? "chloride" : "sodium",
                });
            }
        }
    }

    positions.forEach((node) => {
        if (node.ion === "chloride") {
            const chloride = new THREE.Mesh(chlorideGeometry, chlorideMaterial);
            chloride.position.copy(node.position);
            lattice.add(chloride);
        } else {
            const sodium = new THREE.Mesh(sodiumGeometry, sodiumMaterial);
            sodium.position.copy(node.position);
            lattice.add(sodium);
        }
    });

    lattice.add(createLatticeLines(THREE, positions, gridSize));
    lattice.rotation.set(-0.25, 0.5, 0.05);
}

function createLatticeLines(THREE, positions, gridSize) {
    const pointsByKey = new Map();
    const linePoints = [];
    const material = new THREE.LineBasicMaterial({
        color: 0x5f6b7a,
        transparent: true,
        opacity: 0.48,
    });

    positions.forEach((node) => {
        pointsByKey.set(`${node.x},${node.y},${node.z}`, node.position);
    });

    positions.forEach((node) => {
        [
            [node.x + 1, node.y, node.z],
            [node.x, node.y + 1, node.z],
            [node.x, node.y, node.z + 1],
        ].forEach(([x, y, z]) => {
            if (x < gridSize && y < gridSize && z < gridSize) {
                linePoints.push(node.position, pointsByKey.get(`${x},${y},${z}`));
            }
        });
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);

    return new THREE.LineSegments(geometry, material);
}

function injectIonicLattice3dStyles() {
    if (document.getElementById("ionic-lattice-3d-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "ionic-lattice-3d-styles";
    style.textContent = `
        .ionic-lattice-3d-component {
            width: 100%;
            max-width: 900px;
            margin: 1.25rem 0;
        }

        .ionic-lattice-3d-toolbar {
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-bottom: 0.65rem;
        }

        .ionic-lattice-3d-legend {
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            gap: 0.85rem;
            font: 700 0.95rem Roboto, Arial, sans-serif;
        }

        .ionic-lattice-3d-legend span {
            align-items: center;
            display: inline-flex;
            gap: 0.35rem;
        }

        .ionic-lattice-3d-swatch {
            border: 1px solid #111827;
            border-radius: 999px;
            display: inline-block;
            height: 0.8rem;
            width: 0.8rem;
        }

        .ionic-lattice-3d-swatch--sodium {
            background: #ef4444;
        }

        .ionic-lattice-3d-swatch--chloride {
            background: #22c55e;
        }

        .ionic-lattice-3d-bond-line {
            background: #5f6b7a;
            display: inline-block;
            height: 0.16rem;
            width: 1.4rem;
        }

        .ionic-lattice-3d-stage {
            background: #ffffff;
            height: clamp(330px, 58vw, 560px);
            overflow: hidden;
            position: relative;
            touch-action: none;
            width: 100%;
        }

        .ionic-lattice-3d-stage canvas {
            display: block;
            height: 100%;
            outline: none;
            width: 100%;
        }

        .ionic-lattice-3d-fallback {
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
