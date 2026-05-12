const vectorAdditionExample = {
    origin: { x: 310, y: 250 },
    scale: 18,
    width: 640,
    height: 380,
    vectors: [
        {
            id: "a",
            label: "A",
            magnitude: 10,
            angle: 30,
            color: "#2563eb",
        },
        {
            id: "b",
            label: "B",
            magnitude: 8,
            angle: 120,
            color: "#16a34a",
        },
    ],
};

const vectorAdditionSteps = [
    {
        title: "Sample Question",
        diagramState: "question",
        working: `
            <p>Two forces act at a point.</p>
            <p><strong>A</strong> = 10 N at 30&deg; above the positive x-axis.</p>
            <p><strong>B</strong> = 8 N at 120&deg; from the positive x-axis.</p>
            <p>Find the magnitude and direction of the resultant vector.</p>
        `,
    },
    {
        title: "Step 1: Resolve Both Vectors",
        diagramState: "resolve",
        working: `
            <p>Resolve each vector into horizontal and vertical components.</p>
            <p>A<sub>x</sub> = 10 cos 30&deg; = <strong>8.66 N</strong></p>
            <p>A<sub>y</sub> = 10 sin 30&deg; = <strong>5.00 N</strong></p>
            <p>B<sub>x</sub> = 8 cos 120&deg; = <strong>-4.00 N</strong></p>
            <p>B<sub>y</sub> = 8 sin 120&deg; = <strong>6.93 N</strong></p>
        `,
    },
    {
        title: "Step 2: Combine Components",
        diagramState: "combine",
        working: `
            <p>Add the horizontal components together, then add the vertical components together.</p>
            <p>R<sub>x</sub> = A<sub>x</sub> + B<sub>x</sub> = 8.66 + (-4.00) = <strong>4.66 N</strong></p>
            <p>R<sub>y</sub> = A<sub>y</sub> + B<sub>y</sub> = 5.00 + 6.93 = <strong>11.93 N</strong></p>
        `,
    },
    {
        title: "Step 3: Find Magnitude",
        diagramState: "resultant",
        working: `
            <p>Use Pythagoras Theorem with the resultant horizontal and vertical components.</p>
            <p>R = &radic;(R<sub>x</sub><sup>2</sup> + R<sub>y</sub><sup>2</sup>)</p>
            <p>R = &radic;(4.66<sup>2</sup> + 11.93<sup>2</sup>) = <strong>12.8 N</strong></p>
        `,
    },
    {
        title: "Step 4: Find Direction",
        diagramState: "direction",
        working: `
            <p>Use tan<sup>-1</sup> to find the angle from the positive x-axis.</p>
            <p>&theta; = tan<sup>-1</sup>(R<sub>y</sub> / R<sub>x</sub>)</p>
            <p>&theta; = tan<sup>-1</sup>(11.93 / 4.66) = <strong>68.6&deg;</strong></p>
            <p>The resultant is <strong>12.8 N at 68.6&deg; above the positive x-axis</strong>.</p>
        `,
    },
];

function initVectorAdditionSteps() {
    const container = document.getElementById("vector-addition-steps");

    if (!container || container.dataset.vectorAdditionReady === "true") {
        return;
    }

    container.dataset.vectorAdditionReady = "true";
    injectVectorAdditionStyles();

    let currentStep = 0;
    container.classList.add("vector-addition-component");
    container.innerHTML = createVectorAdditionMarkup();

    const elements = {
        chips: Array.from(container.querySelectorAll(".vector-addition-chip")),
        previous: container.querySelector("[data-vector-addition-action='previous']"),
        next: container.querySelector("[data-vector-addition-action='next']"),
        title: container.querySelector(".vector-addition-step-title"),
        working: container.querySelector(".vector-addition-working"),
        diagram: container.querySelector(".vector-addition-diagram"),
    };

    function setStep(stepIndex) {
        currentStep = Math.min(Math.max(stepIndex, 0), vectorAdditionSteps.length - 1);
        const step = vectorAdditionSteps[currentStep];

        elements.chips.forEach((chip, index) => {
            const isActive = index === currentStep;
            chip.classList.toggle("is-active", isActive);
            chip.setAttribute("aria-pressed", String(isActive));
        });

        elements.previous.disabled = currentStep === 0;
        elements.next.disabled = currentStep === vectorAdditionSteps.length - 1;
        elements.title.textContent = step.title;
        elements.working.innerHTML = step.working;
        elements.diagram.innerHTML = createVectorAdditionSvg(step.diagramState);
    }

    container.addEventListener("click", (event) => {
        const chip = event.target.closest(".vector-addition-chip");
        const actionButton = event.target.closest("[data-vector-addition-action]");

        if (chip) {
            setStep(Number(chip.dataset.step));
            return;
        }

        if (!actionButton) {
            return;
        }

        if (actionButton.dataset.vectorAdditionAction === "previous") {
            setStep(currentStep - 1);
        }

        if (actionButton.dataset.vectorAdditionAction === "next") {
            setStep(currentStep + 1);
        }
    });

    setStep(0);
}

function createVectorAdditionMarkup() {
    return `
        <div class="vector-addition-stepper" role="group" aria-label="Vector addition steps">
            ${vectorAdditionSteps
                .map((step, index) => `<button class="vector-addition-chip" type="button" data-step="${index}" aria-pressed="false">${index === 0 ? "Question" : `Step ${index}`}</button>`)
                .join("")}
        </div>
        <div class="vector-addition-layout">
            <div class="vector-addition-diagram"></div>
            <div class="vector-addition-panel">
                <h3 class="vector-addition-step-title"></h3>
                <div class="vector-addition-working"></div>
                <div class="vector-addition-controls">
                    <button type="button" data-vector-addition-action="previous">Previous</button>
                    <button type="button" data-vector-addition-action="next">Next</button>
                </div>
            </div>
        </div>
    `;
}

function createVectorAdditionSvg(diagramState) {
    const { origin, width, height } = vectorAdditionExample;
    const vectors = vectorAdditionExample.vectors.map(getVectorGeometry);
    const resultant = getResultantGeometry(vectors);
    const showComponents = ["resolve", "combine", "resultant", "direction"].includes(diagramState);
    const showResultantComponents = ["combine", "resultant", "direction"].includes(diagramState);
    const showResultant = ["resultant", "direction"].includes(diagramState);
    const showAngle = diagramState === "direction";

    return `
        <svg class="vector-addition-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Worked example for combining two dimensional vectors">
            <defs>
                <marker id="vector-addition-arrow" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="5.4" markerHeight="5.4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z"></path>
                </marker>
            </defs>
            <rect class="vector-addition-bg" x="0" y="0" width="${width}" height="${height}"></rect>
            ${createVectorAdditionGrid()}
            <line class="vector-addition-axis" x1="48" y1="${origin.y}" x2="${width - 42}" y2="${origin.y}"></line>
            <line class="vector-addition-axis" x1="${origin.x}" y1="${height - 36}" x2="${origin.x}" y2="36"></line>
            <text class="vector-addition-axis-label" x="${width - 32}" y="${origin.y + 5}">x</text>
            <text class="vector-addition-axis-label" x="${origin.x - 5}" y="25">y</text>

            ${vectors.map((vector) => createMainVector(vector, diagramState)).join("")}
            ${showComponents ? vectors.map(createVectorComponents).join("") : ""}
            ${showResultantComponents ? createResultantComponents(resultant) : ""}
            ${showResultant ? createResultantVector(resultant) : ""}
            ${showAngle ? createResultantAngle(resultant) : ""}
        </svg>
    `;
}

function createVectorAdditionGrid() {
    const { width, height } = vectorAdditionExample;
    const lines = [];

    for (let x = 70; x <= width - 70; x += 40) {
        lines.push(`<line x1="${x}" y1="40" x2="${x}" y2="${height - 40}"></line>`);
    }

    for (let y = 50; y <= height - 50; y += 40) {
        lines.push(`<line x1="40" y1="${y}" x2="${width - 40}" y2="${y}"></line>`);
    }

    return `<g class="vector-addition-grid">${lines.join("")}</g>`;
}

function getVectorGeometry(vector) {
    const { origin, scale } = vectorAdditionExample;
    const angle = vector.angle * Math.PI / 180;
    const dx = vector.magnitude * Math.cos(angle);
    const dy = vector.magnitude * Math.sin(angle);

    return {
        ...vector,
        dx,
        dy,
        start: origin,
        end: {
            x: origin.x + dx * scale,
            y: origin.y - dy * scale,
        },
    };
}

function getResultantGeometry(vectors) {
    const { origin, scale } = vectorAdditionExample;
    const dx = vectors.reduce((total, vector) => total + vector.dx, 0);
    const dy = vectors.reduce((total, vector) => total + vector.dy, 0);
    const magnitude = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    return {
        label: "R",
        dx,
        dy,
        magnitude,
        angle,
        start: origin,
        end: {
            x: origin.x + dx * scale,
            y: origin.y - dy * scale,
        },
    };
}

function createMainVector(vector, diagramState) {
    const faded = ["combine", "resultant", "direction"].includes(diagramState) ? " is-faded" : "";

    return `
        <g class="vector-addition-vector-group${faded}" style="--vector-color:${vector.color}">
            <line class="vector-addition-main-vector" x1="${vector.start.x}" y1="${vector.start.y}" x2="${vector.end.x.toFixed(2)}" y2="${vector.end.y.toFixed(2)}"></line>
            <text class="vector-addition-label" x="${getLabelX(vector)}" y="${getLabelY(vector)}">${vector.label} = ${vector.magnitude} N</text>
        </g>
    `;
}

function createVectorComponents(vector) {
    const { origin, scale } = vectorAdditionExample;
    const componentX = origin.x + vector.dx * scale;
    const componentY = origin.y - vector.dy * scale;
    const xLabelY = origin.y + (vector.dy >= 0 ? 24 : -12);
    const yLabelX = componentX + (vector.dx >= 0 ? 10 : -72);

    return `
        <g class="vector-addition-components" style="--vector-color:${vector.color}">
            <line x1="${origin.x}" y1="${origin.y}" x2="${componentX.toFixed(2)}" y2="${origin.y}"></line>
            <line x1="${componentX.toFixed(2)}" y1="${origin.y}" x2="${componentX.toFixed(2)}" y2="${componentY.toFixed(2)}"></line>
            <text class="vector-addition-component-label" x="${(origin.x + vector.dx * scale * 0.5 - 20).toFixed(2)}" y="${xLabelY}">${vector.label}<tspan baseline-shift="sub" font-size="11">x</tspan></text>
            <text class="vector-addition-component-label" x="${yLabelX.toFixed(2)}" y="${(origin.y - vector.dy * scale * 0.5).toFixed(2)}">${vector.label}<tspan baseline-shift="sub" font-size="11">y</tspan></text>
        </g>
    `;
}

function createResultantComponents(resultant) {
    const { origin, scale } = vectorAdditionExample;
    const componentX = origin.x + resultant.dx * scale;
    const componentY = origin.y - resultant.dy * scale;

    return `
        <g class="vector-addition-resultant-components">
            <line x1="${origin.x}" y1="${origin.y}" x2="${componentX.toFixed(2)}" y2="${origin.y}"></line>
            <line x1="${componentX.toFixed(2)}" y1="${origin.y}" x2="${componentX.toFixed(2)}" y2="${componentY.toFixed(2)}"></line>
            <text class="vector-addition-resultant-label" x="${(origin.x + resultant.dx * scale * 0.5 - 20).toFixed(2)}" y="${origin.y + 28}">R<tspan baseline-shift="sub" font-size="11">x</tspan></text>
            <text class="vector-addition-resultant-label" x="${componentX + 12}" y="${(origin.y - resultant.dy * scale * 0.5).toFixed(2)}">R<tspan baseline-shift="sub" font-size="11">y</tspan></text>
        </g>
    `;
}

function createResultantVector(resultant) {
    return `
        <g class="vector-addition-resultant">
            <line x1="${resultant.start.x}" y1="${resultant.start.y}" x2="${resultant.end.x.toFixed(2)}" y2="${resultant.end.y.toFixed(2)}"></line>
            <text class="vector-addition-resultant-vector-label" x="${resultant.end.x + 12}" y="${resultant.end.y + 4}">R = 12.8 N</text>
        </g>
    `;
}

function createResultantAngle(resultant) {
    const { origin } = vectorAdditionExample;
    const radius = 54;
    const angle = Math.atan2(resultant.dy, resultant.dx);
    const endX = origin.x + radius * Math.cos(angle);
    const endY = origin.y - radius * Math.sin(angle);
    const labelX = origin.x + 72 * Math.cos(angle / 2);
    const labelY = origin.y - 50 * Math.sin(angle / 2) + 4;

    return `
        <g class="vector-addition-angle">
            <path d="M ${origin.x + radius} ${origin.y} A ${radius} ${radius} 0 0 0 ${endX.toFixed(2)} ${endY.toFixed(2)}"></path>
            <text x="${labelX.toFixed(2)}" y="${labelY.toFixed(2)}">68.6&deg;</text>
        </g>
    `;
}

function getLabelX(vector) {
    const midpointX = (vector.start.x + vector.end.x) / 2;

    return midpointX + (vector.dx >= 0 ? 8 : -78);
}

function getLabelY(vector) {
    const midpointY = (vector.start.y + vector.end.y) / 2;

    return midpointY + (vector.dy >= 0 ? -12 : 24);
}

function injectVectorAdditionStyles() {
    if (document.getElementById("vector-addition-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "vector-addition-styles";
    style.textContent = `
        .vector-addition-component {
            width: 100%;
            max-width: 980px;
            margin: 1.25rem 0;
        }

        .vector-addition-stepper {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }

        .vector-addition-chip,
        .vector-addition-controls button {
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.9rem Roboto, Arial, sans-serif;
            padding: 0.48rem 0.7rem;
        }

        .vector-addition-chip:hover,
        .vector-addition-chip.is-active,
        .vector-addition-controls button:hover:not(:disabled) {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .vector-addition-controls button:disabled {
            cursor: not-allowed;
            opacity: 0.45;
        }

        .vector-addition-layout {
            display: grid;
            grid-template-columns: minmax(0, 1.45fr) minmax(260px, 0.9fr);
            gap: 0.85rem;
            align-items: stretch;
        }

        .vector-addition-diagram,
        .vector-addition-panel {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
        }

        .vector-addition-diagram {
            overflow: hidden;
        }

        .vector-addition-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .vector-addition-bg {
            fill: #ffffff;
        }

        .vector-addition-grid line {
            stroke: #e5e7eb;
            stroke-width: 1;
        }

        .vector-addition-axis {
            marker-end: url(#vector-addition-arrow);
            stroke: #111827;
            stroke-width: 1.7;
        }

        .vector-addition-axis-label,
        .vector-addition-label,
        .vector-addition-component-label,
        .vector-addition-resultant-label,
        .vector-addition-resultant-vector-label,
        .vector-addition-angle text {
            fill: #111827;
            paint-order: stroke;
            stroke: #ffffff;
            stroke-linejoin: round;
            stroke-width: 5;
            font: 700 15px Roboto, Arial, sans-serif;
        }

        .vector-addition-main-vector {
            marker-end: url(#vector-addition-arrow);
            stroke: var(--vector-color);
            stroke-linecap: round;
            stroke-width: 3.3;
        }

        .vector-addition-vector-group.is-faded {
            opacity: 0.35;
        }

        .vector-addition-components line {
            marker-end: url(#vector-addition-arrow);
            stroke: var(--vector-color);
            stroke-dasharray: 5 5;
            stroke-linecap: round;
            stroke-width: 2.5;
        }

        .vector-addition-resultant-components line {
            marker-end: url(#vector-addition-arrow);
            stroke: #9333ea;
            stroke-linecap: round;
            stroke-width: 3.4;
        }

        .vector-addition-resultant line {
            marker-end: url(#vector-addition-arrow);
            stroke: #dc2626;
            stroke-linecap: round;
            stroke-width: 4;
        }

        .vector-addition-angle path {
            fill: none;
            stroke: #111827;
            stroke-width: 2;
        }

        .vector-addition-panel {
            display: flex;
            flex-direction: column;
            min-height: 100%;
            padding: 0.95rem;
        }

        .vector-addition-step-title {
            margin: 0 0 0.65rem;
            font-size: 1.05rem;
        }

        .vector-addition-working {
            color: #111827;
            font-size: 0.96rem;
            line-height: 1.45;
        }

        .vector-addition-working p {
            margin: 0 0 0.55rem;
        }

        .vector-addition-controls {
            display: flex;
            gap: 0.5rem;
            justify-content: space-between;
            margin-top: auto;
            padding-top: 0.8rem;
        }

        #vector-addition-arrow path {
            fill: #111827;
        }

        @media (max-width: 860px) {
            .vector-addition-layout {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(style);
}

if (window.document$?.subscribe) {
    window.document$.subscribe(initVectorAdditionSteps);
} else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVectorAdditionSteps);
} else {
    initVectorAdditionSteps();
}
