const dispersionForceContainer = document.getElementById("dispersion-force-viewer");

const dispersionForceStages = [
    {
        title: "Electrons are constantly moving",
        detail: "The electron clouds in these non-polar molecules are roughly symmetrical on average.",
        shiftA: 0,
        shiftB: 0,
    },
    {
        title: "Temporary uneven electron distribution",
        detail: "A random fluctuation makes molecule A electron-rich on the side facing molecule B.",
        shiftA: 0.72,
        shiftB: 0,
    },
    {
        title: "Instantaneous dipole forms",
        detail: "The electron-rich side is &delta;- and the electron-poor side is &delta;+.",
        shiftA: 0.86,
        shiftB: 0,
    },
    {
        title: "Nearby molecule becomes an induced dipole",
        detail: "Molecule B's electrons shift away from the &delta;- side of molecule A. No electrons are transferred.",
        shiftA: 0.86,
        shiftB: 0.62,
    },
    {
        title: "Weak, short-lived attraction: dispersion force",
        detail: "Opposite partial charges attract briefly before the electron distribution changes again.",
        shiftA: 0.76,
        shiftB: 0.58,
    },
];

const dispersionForceMolecules = {
    a: { cx: 275, cy: 190 },
    b: { cx: 625, cy: 190 },
};

const dispersionForceElectronConfigs = {
    a: [
        { radius: 76, yScale: 0.70, phase: 0.1, speed: 0.92, bias: 1.05 },
        { radius: 70, yScale: 0.76, phase: 1.0, speed: -0.82, bias: 0.88 },
        { radius: 82, yScale: 0.66, phase: 1.9, speed: 0.72, bias: 1.18 },
        { radius: 58, yScale: 0.88, phase: 2.8, speed: -1.04, bias: 0.95 },
        { radius: 88, yScale: 0.62, phase: 3.6, speed: 0.84, bias: 1.10 },
        { radius: 64, yScale: 0.92, phase: 4.5, speed: -0.94, bias: 0.82 },
        { radius: 80, yScale: 0.72, phase: 5.3, speed: 0.78, bias: 1.20 },
    ],
    b: [
        { radius: 78, yScale: 0.70, phase: 0.4, speed: -0.86, bias: 0.92 },
        { radius: 68, yScale: 0.80, phase: 1.3, speed: 0.96, bias: 1.08 },
        { radius: 84, yScale: 0.62, phase: 2.1, speed: -0.76, bias: 1.16 },
        { radius: 60, yScale: 0.90, phase: 2.9, speed: 0.88, bias: 0.88 },
        { radius: 86, yScale: 0.66, phase: 3.8, speed: -0.92, bias: 1.14 },
        { radius: 66, yScale: 0.86, phase: 4.7, speed: 0.82, bias: 0.96 },
        { radius: 80, yScale: 0.72, phase: 5.5, speed: -1.02, bias: 1.05 },
    ],
};

if (dispersionForceContainer) {
    initDispersionForceComponent(dispersionForceContainer);
}

function initDispersionForceComponent(container) {
    if (container.dataset.dispersionForceReady === "true") {
        return;
    }

    container.dataset.dispersionForceReady = "true";
    injectDispersionForceStyles();

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeStage = 0;
    let isPlaying = !reducedMotionQuery.matches;
    let stageTimer;
    let animationFrame;
    let animationStart = performance.now();
    const currentShift = { a: 0, b: 0 };
    const targetShift = { a: 0, b: 0 };

    container.classList.add("dispersion-force-component");
    container.innerHTML = `
        <div class="dispersion-force-controls" role="group" aria-label="Dispersion force animation controls">
            <button class="dispersion-force-button dispersion-force-button--play" type="button" aria-pressed="${String(isPlaying)}">
                ${isPlaying ? "Pause" : "Play"}
            </button>
            <button class="dispersion-force-button" type="button" data-dispersion-action="restart">
                Restart
            </button>
            <button class="dispersion-force-button" type="button" data-dispersion-action="step">
                Step
            </button>
        </div>
        <div class="dispersion-force-stage is-stage-0" role="region" aria-label="Interactive animation showing how London dispersion force arises">
            ${createDispersionForceSvg()}
            <div class="dispersion-force-caption" aria-live="polite">
                <strong class="dispersion-force-caption-title"></strong>
                <span class="dispersion-force-caption-detail"></span>
            </div>
        </div>
    `;

    const playButton = container.querySelector(".dispersion-force-button--play");
    const stage = container.querySelector(".dispersion-force-stage");
    const captionTitle = container.querySelector(".dispersion-force-caption-title");
    const captionDetail = container.querySelector(".dispersion-force-caption-detail");
    const electrons = Array.from(container.querySelectorAll(".dispersion-force-electron"));

    container.addEventListener("click", (event) => {
        const button = event.target.closest(".dispersion-force-button");

        if (!button) {
            return;
        }

        const action = button.dataset.dispersionAction;

        if (button === playButton) {
            isPlaying = !isPlaying;
            updateDispersionForcePlayButton(playButton, isPlaying);
            scheduleDispersionForceStageAdvance();
            return;
        }

        if (action === "restart") {
            activeStage = 0;
            animationStart = performance.now();
            setDispersionForceStage(activeStage, stage, captionTitle, captionDetail, targetShift);
            syncReducedMotionElectrons();
            scheduleDispersionForceStageAdvance();
            return;
        }

        if (action === "step") {
            isPlaying = false;
            activeStage = (activeStage + 1) % dispersionForceStages.length;
            updateDispersionForcePlayButton(playButton, isPlaying);
            setDispersionForceStage(activeStage, stage, captionTitle, captionDetail, targetShift);
            syncReducedMotionElectrons();
            scheduleDispersionForceStageAdvance();
        }
    });

    setDispersionForceStage(activeStage, stage, captionTitle, captionDetail, targetShift);
    updateDispersionForceElectrons(electrons, 0, currentShift);

    if (reducedMotionQuery.matches) {
        syncReducedMotionElectrons();
    } else {
        animationFrame = requestAnimationFrame(animateDispersionForceElectrons);
    }

    scheduleDispersionForceStageAdvance();

    window.addEventListener("pagehide", () => {
        window.clearTimeout(stageTimer);
        window.cancelAnimationFrame(animationFrame);
    }, { once: true });

    function animateDispersionForceElectrons(now) {
        const elapsed = (now - animationStart) / 1000;

        currentShift.a += (targetShift.a - currentShift.a) * 0.08;
        currentShift.b += (targetShift.b - currentShift.b) * 0.08;
        updateDispersionForceElectrons(electrons, elapsed, currentShift);
        animationFrame = requestAnimationFrame(animateDispersionForceElectrons);
    }

    function scheduleDispersionForceStageAdvance() {
        window.clearTimeout(stageTimer);

        if (!isPlaying) {
            return;
        }

        const delay = activeStage === dispersionForceStages.length - 1 ? 2400 : 2600;

        stageTimer = window.setTimeout(() => {
            activeStage = (activeStage + 1) % dispersionForceStages.length;
            setDispersionForceStage(activeStage, stage, captionTitle, captionDetail, targetShift);
            syncReducedMotionElectrons();
            scheduleDispersionForceStageAdvance();
        }, delay);
    }

    function syncReducedMotionElectrons() {
        if (!reducedMotionQuery.matches) {
            return;
        }

        currentShift.a = targetShift.a;
        currentShift.b = targetShift.b;
        updateDispersionForceElectrons(electrons, 0, currentShift);
    }
}

function createDispersionForceSvg() {
    return `
        <svg class="dispersion-force-svg" viewBox="0 0 900 430" role="img" aria-labelledby="dispersion-force-title dispersion-force-description">
            <title id="dispersion-force-title">London dispersion force between two non-polar molecules</title>
            <desc id="dispersion-force-description">
                Electrons in molecule A fluctuate to form an instantaneous dipole, inducing a dipole in molecule B and creating a weak short-lived attraction.
            </desc>
            <defs>
                <marker id="dispersion-force-arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z"></path>
                </marker>
            </defs>
            <rect class="dispersion-force-background" x="0" y="0" width="900" height="430"></rect>
            ${createDispersionForceMolecule("a", "Molecule A")}
            ${createDispersionForceMolecule("b", "Molecule B")}
            ${createDispersionForceCharges()}
            ${createDispersionForceAttraction()}
            <g class="dispersion-force-temporary-badge" aria-hidden="true">
                <rect x="363" y="322" width="174" height="32" rx="16"></rect>
                <text x="450" y="344">temporary, short-lived</text>
            </g>
        </svg>
    `;
}

function createDispersionForceMolecule(key, label) {
    const molecule = dispersionForceMolecules[key];

    return `
        <g class="dispersion-force-molecule dispersion-force-molecule--${key}">
            <ellipse class="dispersion-force-electron-cloud" cx="${molecule.cx}" cy="${molecule.cy}" rx="112" ry="84"></ellipse>
            <ellipse class="dispersion-force-electron-density" cx="${molecule.cx}" cy="${molecule.cy}" rx="78" ry="66"></ellipse>
            <ellipse class="dispersion-force-orbit" cx="${molecule.cx}" cy="${molecule.cy}" rx="84" ry="58"></ellipse>
            <ellipse class="dispersion-force-orbit dispersion-force-orbit--tilted" cx="${molecule.cx}" cy="${molecule.cy}" rx="84" ry="58"></ellipse>
            <circle class="dispersion-force-nucleus" cx="${molecule.cx}" cy="${molecule.cy}" r="30"></circle>
            <text class="dispersion-force-nucleus-label" x="${molecule.cx}" y="${molecule.cy + 6}">X</text>
            ${createDispersionForceElectrons(key)}
            <text class="dispersion-force-molecule-label" x="${molecule.cx}" y="${molecule.cy + 132}">${label}</text>
            <text class="dispersion-force-molecule-type" x="${molecule.cx}" y="${molecule.cy + 157}">non-polar on average</text>
        </g>
    `;
}

function createDispersionForceElectrons(molecule) {
    return dispersionForceElectronConfigs[molecule]
        .map((_, index) => `
            <circle class="dispersion-force-electron" data-molecule="${molecule}" data-electron-index="${index}" r="7"></circle>
        `)
        .join("");
}

function createDispersionForceCharges() {
    return `
        <g class="dispersion-force-partial-charges dispersion-force-partial-charges--a" aria-hidden="true">
            <text class="dispersion-force-charge dispersion-force-charge--positive" x="152" y="108">&delta;+</text>
            <text class="dispersion-force-charge dispersion-force-charge--negative" x="386" y="108">&delta;-</text>
            <text class="dispersion-force-dipole-label" x="275" y="62">instantaneous dipole</text>
        </g>
        <g class="dispersion-force-partial-charges dispersion-force-partial-charges--b" aria-hidden="true">
            <text class="dispersion-force-charge dispersion-force-charge--positive" x="512" y="108">&delta;+</text>
            <text class="dispersion-force-charge dispersion-force-charge--negative" x="742" y="108">&delta;-</text>
            <text class="dispersion-force-dipole-label" x="625" y="62">induced dipole</text>
        </g>
    `;
}

function createDispersionForceAttraction() {
    return `
        <g class="dispersion-force-attraction" aria-hidden="true">
            <line x1="405" y1="190" x2="495" y2="190"></line>
            <text x="450" y="166">dispersion force</text>
        </g>
    `;
}

function setDispersionForceStage(stageIndex, stage, captionTitle, captionDetail, targetShift) {
    const currentStage = dispersionForceStages[stageIndex];

    stage.classList.remove(...dispersionForceStages.map((_, index) => `is-stage-${index}`));
    stage.classList.add(`is-stage-${stageIndex}`);
    captionTitle.textContent = currentStage.title;
    captionDetail.innerHTML = currentStage.detail;
    targetShift.a = currentStage.shiftA;
    targetShift.b = currentStage.shiftB;
}

function updateDispersionForcePlayButton(button, isPlaying) {
    button.textContent = isPlaying ? "Pause" : "Play";
    button.setAttribute("aria-pressed", String(isPlaying));
}

function updateDispersionForceElectrons(electrons, time, currentShift) {
    electrons.forEach((electron) => {
        const moleculeKey = electron.dataset.molecule;
        const index = Number(electron.dataset.electronIndex);
        const molecule = dispersionForceMolecules[moleculeKey];
        const config = dispersionForceElectronConfigs[moleculeKey][index];
        const shift = currentShift[moleculeKey];
        const angle = config.phase + time * config.speed;
        const clusterBias = shift * 58 * config.bias;
        const x = molecule.cx + Math.cos(angle) * config.radius * (1 - shift * 0.12) + clusterBias;
        const y = molecule.cy + Math.sin(angle) * config.radius * config.yScale * (1 - shift * 0.08);

        electron.setAttribute("cx", x.toFixed(1));
        electron.setAttribute("cy", y.toFixed(1));
    });
}

function injectDispersionForceStyles() {
    if (document.getElementById("dispersion-force-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "dispersion-force-styles";
    style.textContent = `
        .dispersion-force-component {
            width: 100%;
            max-width: 940px;
            margin: 1.25rem 0;
        }

        .dispersion-force-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }

        .dispersion-force-button {
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.92rem Roboto, Arial, sans-serif;
            min-width: 5.4rem;
            padding: 0.45rem 0.8rem;
        }

        .dispersion-force-button:hover,
        .dispersion-force-button:focus-visible,
        .dispersion-force-button[aria-pressed="true"] {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .dispersion-force-stage {
            position: relative;
            overflow: hidden;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            background: #ffffff;
        }

        .dispersion-force-svg {
            display: block;
            width: 100%;
            height: auto;
            min-height: 280px;
            background: #ffffff;
        }

        .dispersion-force-background {
            fill: #ffffff;
        }

        .dispersion-force-electron-cloud {
            fill: #eef6ff;
            stroke: #bfd4ee;
            stroke-width: 2;
        }

        .dispersion-force-electron-density {
            fill: #d7ebff;
            opacity: 0;
            transform-box: fill-box;
            transform-origin: center;
            transition: opacity 420ms ease, transform 720ms ease;
        }

        .dispersion-force-stage.is-stage-1 .dispersion-force-molecule--a .dispersion-force-electron-density,
        .dispersion-force-stage.is-stage-2 .dispersion-force-molecule--a .dispersion-force-electron-density,
        .dispersion-force-stage.is-stage-3 .dispersion-force-molecule--a .dispersion-force-electron-density,
        .dispersion-force-stage.is-stage-4 .dispersion-force-molecule--a .dispersion-force-electron-density {
            opacity: 0.88;
            transform: translateX(42px) scaleX(0.82);
        }

        .dispersion-force-stage.is-stage-3 .dispersion-force-molecule--b .dispersion-force-electron-density,
        .dispersion-force-stage.is-stage-4 .dispersion-force-molecule--b .dispersion-force-electron-density {
            opacity: 0.82;
            transform: translateX(34px) scaleX(0.86);
        }

        .dispersion-force-orbit {
            fill: none;
            stroke: #b9c6d6;
            stroke-dasharray: 5 8;
            stroke-width: 1.6;
        }

        .dispersion-force-orbit--tilted {
            transform: rotate(62deg);
            transform-box: fill-box;
            transform-origin: center;
        }

        .dispersion-force-nucleus {
            fill: #fbbf24;
            stroke: #92400e;
            stroke-width: 2;
        }

        .dispersion-force-nucleus-label {
            fill: #111827;
            font: 800 20px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .dispersion-force-electron {
            fill: #2563eb;
            stroke: #eff6ff;
            stroke-width: 2;
        }

        .dispersion-force-molecule-label {
            fill: #111827;
            font: 800 18px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .dispersion-force-molecule-type {
            fill: #475569;
            font: 700 14px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .dispersion-force-partial-charges,
        .dispersion-force-attraction,
        .dispersion-force-temporary-badge {
            opacity: 0;
            transition: opacity 420ms ease, transform 420ms ease;
        }

        .dispersion-force-stage.is-stage-2 .dispersion-force-partial-charges--a,
        .dispersion-force-stage.is-stage-3 .dispersion-force-partial-charges--a,
        .dispersion-force-stage.is-stage-4 .dispersion-force-partial-charges--a,
        .dispersion-force-stage.is-stage-3 .dispersion-force-partial-charges--b,
        .dispersion-force-stage.is-stage-4 .dispersion-force-partial-charges--b,
        .dispersion-force-stage.is-stage-4 .dispersion-force-attraction,
        .dispersion-force-stage.is-stage-2 .dispersion-force-temporary-badge,
        .dispersion-force-stage.is-stage-3 .dispersion-force-temporary-badge,
        .dispersion-force-stage.is-stage-4 .dispersion-force-temporary-badge {
            opacity: 1;
        }

        .dispersion-force-charge {
            font: 900 31px Georgia, "Times New Roman", serif;
            text-anchor: middle;
        }

        .dispersion-force-charge--negative {
            fill: #1d4ed8;
        }

        .dispersion-force-charge--positive {
            fill: #dc2626;
        }

        .dispersion-force-dipole-label {
            fill: #111827;
            font: 800 15px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .dispersion-force-attraction line {
            marker-end: url(#dispersion-force-arrowhead);
            stroke: #7c3aed;
            stroke-dasharray: 8 8;
            stroke-linecap: round;
            stroke-width: 4;
            animation: dispersion-force-dash 920ms linear infinite;
        }

        .dispersion-force-attraction text {
            fill: #4c1d95;
            font: 900 16px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        #dispersion-force-arrowhead path {
            fill: #7c3aed;
        }

        .dispersion-force-temporary-badge rect {
            fill: #fff7ed;
            stroke: #fb923c;
            stroke-width: 1.5;
        }

        .dispersion-force-temporary-badge text {
            fill: #9a3412;
            font: 800 14px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .dispersion-force-stage.is-stage-4 .dispersion-force-temporary-badge {
            animation: dispersion-force-pulse 900ms ease-in-out infinite alternate;
        }

        .dispersion-force-caption {
            border-top: 1px solid #dde3ea;
            background: #f8fafc;
            display: grid;
            gap: 0.18rem;
            padding: 0.72rem 0.9rem;
        }

        .dispersion-force-caption strong {
            color: #111827;
            font: 800 1rem Roboto, Arial, sans-serif;
        }

        .dispersion-force-caption span {
            color: #334155;
            font: 600 0.92rem/1.45 Roboto, Arial, sans-serif;
        }

        @keyframes dispersion-force-dash {
            to {
                stroke-dashoffset: -16;
            }
        }

        @keyframes dispersion-force-pulse {
            to {
                transform: translateY(-3px);
            }
        }

        @media (max-width: 640px) {
            .dispersion-force-button {
                flex: 1 1 5.8rem;
            }

            .dispersion-force-svg {
                min-height: 250px;
            }

            .dispersion-force-caption {
                padding: 0.65rem 0.75rem;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .dispersion-force-electron-density,
            .dispersion-force-partial-charges,
            .dispersion-force-attraction,
            .dispersion-force-temporary-badge {
                animation: none;
                transition: none;
            }

            .dispersion-force-attraction line {
                animation: none;
            }
        }
    `;

    document.head.appendChild(style);
}
