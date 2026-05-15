const vectorResolutionConfig = {
    origin: { x: 310, y: 210 },
    width: 620,
    height: 420,
    scale: 20,
    minX: 50,
    maxX: 570,
    minY: 50,
    maxY: 370,
};

function initVectorResolution() {
    const container = document.getElementById("vector-resolution-component");

    if (!container || container.dataset.vectorResolutionReady === "true") {
        return;
    }

    container.dataset.vectorResolutionReady = "true";
    injectVectorResolutionStyles();

    container.classList.add("vector-resolution-component");
    container.innerHTML = createVectorResolutionMarkup();

    const svg = container.querySelector(".vector-resolution-svg");
    const state = {
        endpoint: {
            x: vectorResolutionConfig.origin.x + 200 * Math.cos(Math.PI / 4),
            y: vectorResolutionConfig.origin.y - 200 * Math.sin(Math.PI / 4),
        },
        dragging: false,
    };

    const elements = {
        vector: svg.querySelector(".vector-resolution-vector"),
        xComponent: svg.querySelector(".vector-resolution-x-component"),
        yComponent: svg.querySelector(".vector-resolution-y-component"),
        xGuide: svg.querySelector(".vector-resolution-x-guide"),
        yGuide: svg.querySelector(".vector-resolution-y-guide"),
        hitArea: svg.querySelector(".vector-resolution-hit-area"),
        arc: svg.querySelector(".vector-resolution-angle-arc"),
        vectorLabel: svg.querySelector(".vector-resolution-vector-label"),
        xLabel: svg.querySelector(".vector-resolution-x-label"),
        yLabel: svg.querySelector(".vector-resolution-y-label"),
        angleLabel: svg.querySelector(".vector-resolution-angle-label"),
        magnitudeValue: container.querySelector("[data-vector-value='magnitude']"),
        xValue: container.querySelector("[data-vector-value='x']"),
        yValue: container.querySelector("[data-vector-value='y']"),
        angleValue: container.querySelector("[data-vector-value='angle']"),
    };

    function moveToPointer(event) {
        const point = getSvgPoint(svg, event);

        state.endpoint = {
            x: clamp(point.x, vectorResolutionConfig.minX, vectorResolutionConfig.maxX),
            y: clamp(point.y, vectorResolutionConfig.minY, vectorResolutionConfig.maxY),
        };

        updateVectorResolution(elements, state.endpoint);
    }

    svg.addEventListener("pointerdown", (event) => {
        if (!event.target.closest(".vector-resolution-drag-target")) {
            return;
        }

        state.dragging = true;
        svg.setPointerCapture(event.pointerId);
        moveToPointer(event);
    });

    svg.addEventListener("pointermove", (event) => {
        if (!state.dragging) {
            return;
        }

        moveToPointer(event);
    });

    svg.addEventListener("pointerup", (event) => {
        state.dragging = false;

        if (svg.hasPointerCapture(event.pointerId)) {
            svg.releasePointerCapture(event.pointerId);
        }
    });

    svg.addEventListener("pointercancel", () => {
        state.dragging = false;
    });

    updateVectorResolution(elements, state.endpoint);
}

function createVectorResolutionMarkup() {
    const { origin, width, height } = vectorResolutionConfig;

    return `
        <div class="vector-resolution-stage">
            <svg class="vector-resolution-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Resolution of a vector into horizontal and vertical components">
                <defs>
                    <marker id="vector-resolution-arrowhead" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="5.2" markerHeight="5.2" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z"></path>
                    </marker>
                </defs>
                <rect class="vector-resolution-background" x="0" y="0" width="${width}" height="${height}"></rect>
                ${createVectorResolutionGrid()}
                <line class="vector-resolution-axis" x1="44" y1="${origin.y}" x2="${width - 44}" y2="${origin.y}"></line>
                <line class="vector-resolution-axis" x1="${origin.x}" y1="${height - 36}" x2="${origin.x}" y2="36"></line>
                <text class="vector-resolution-axis-label" x="${width - 34}" y="${origin.y + 5}">x</text>
                <text class="vector-resolution-axis-label" x="${origin.x - 5}" y="25">y</text>

                <line class="vector-resolution-guide vector-resolution-x-guide"></line>
                <line class="vector-resolution-guide vector-resolution-y-guide"></line>
                <path class="vector-resolution-angle-arc"></path>

                <line class="vector-resolution-component-line vector-resolution-x-component"></line>
                <line class="vector-resolution-component-line vector-resolution-y-component"></line>
                <line class="vector-resolution-vector vector-resolution-drag-target"></line>
                <line class="vector-resolution-hit-area vector-resolution-drag-target"></line>

                <text class="vector-resolution-label vector-resolution-vector-label">v</text>
                <text class="vector-resolution-label vector-resolution-x-label">v<tspan baseline-shift="sub" font-size="12">x</tspan></text>
                <text class="vector-resolution-label vector-resolution-y-label">v<tspan baseline-shift="sub" font-size="12">y</tspan></text>
                <text class="vector-resolution-label vector-resolution-angle-label"></text>
            </svg>
        </div>
        <div class="vector-resolution-values" aria-label="Vector component values">
            <span><strong>v</strong> = <span data-vector-value="magnitude"></span> N</span>
            <span><strong>v<sub>x</sub></strong> = <span data-vector-value="x"></span> N</span>
            <span><strong>v<sub>y</sub></strong> = <span data-vector-value="y"></span> N</span>
            <span><strong>angle</strong> = <span data-vector-value="angle"></span> deg</span>
        </div>
    `;
}

function createVectorResolutionGrid() {
    const { width, height } = vectorResolutionConfig;
    const verticalLines = [];
    const horizontalLines = [];

    for (let x = 60; x <= width - 60; x += 40) {
        verticalLines.push(`<line x1="${x}" y1="40" x2="${x}" y2="${height - 40}"></line>`);
    }

    for (let y = 60; y <= height - 60; y += 40) {
        horizontalLines.push(`<line x1="40" y1="${y}" x2="${width - 40}" y2="${y}"></line>`);
    }

    return `<g class="vector-resolution-grid">${verticalLines.join("")}${horizontalLines.join("")}</g>`;
}

function updateVectorResolution(elements, endpoint) {
    const { origin, scale } = vectorResolutionConfig;
    const dx = endpoint.x - origin.x;
    const dy = origin.y - endpoint.y;
    const magnitude = Math.hypot(dx, dy) / scale;
    const angle = Math.atan2(dy, dx);
    const referenceAngle = Math.atan2(Math.abs(dy), Math.abs(dx));
    const referenceAngleDeg = referenceAngle * 180 / Math.PI;
    const vx = dx / scale;
    const vy = dy / scale;

    setLine(elements.vector, origin.x, origin.y, endpoint.x, endpoint.y);
    setLine(elements.xComponent, origin.x, origin.y, endpoint.x, origin.y);
    setLine(elements.yComponent, endpoint.x, origin.y, endpoint.x, endpoint.y);
    setLine(elements.xGuide, origin.x, endpoint.y, endpoint.x, endpoint.y);
    setLine(elements.yGuide, endpoint.x, origin.y, endpoint.x, endpoint.y);
    setLine(elements.hitArea, origin.x, origin.y, endpoint.x, endpoint.y);

    elements.arc.setAttribute("d", createAngleArcPath(origin, 58, getReferenceArcAngles(dx, dy, referenceAngle)));

    setTextPosition(elements.vectorLabel, origin.x + dx * 0.55 + (dx >= 0 ? 10 : -86), origin.y - dy * 0.55 + (dy >= 0 ? -12 : 24));
    setTextPosition(elements.xLabel, origin.x + dx * 0.5 - 32, origin.y + (dy >= 0 ? 28 : -14));
    setTextPosition(elements.yLabel, endpoint.x + (dx >= 0 ? 18 : -76), origin.y - dy * 0.5 + 5);
    setTextPosition(elements.angleLabel, getReferenceAngleLabelX(origin, dx, dy, referenceAngle), getReferenceAngleLabelY(origin, dx, dy, referenceAngle));

    elements.vectorLabel.textContent = `v = ${formatNumber(magnitude)} N`;
    elements.xLabel.innerHTML = `v<tspan baseline-shift="sub" font-size="12">x</tspan> = ${formatNumber(vx)} N`;
    elements.yLabel.innerHTML = `v<tspan baseline-shift="sub" font-size="12">y</tspan> = ${formatNumber(vy)} N`;
    elements.angleLabel.textContent = `${Math.round(referenceAngleDeg)} deg`;

    elements.magnitudeValue.textContent = formatNumber(magnitude);
    elements.xValue.textContent = formatNumber(vx);
    elements.yValue.textContent = formatNumber(vy);
    elements.angleValue.textContent = `${Math.round(referenceAngleDeg)}`;
}

function getReferenceArcAngles(dx, dy, referenceAngle) {
    if (dx >= 0) {
        return {
            startAngle: 0,
            endAngle: dy >= 0 ? referenceAngle : -referenceAngle,
        };
    }

    return {
        startAngle: Math.PI,
        endAngle: dy >= 0 ? Math.PI - referenceAngle : Math.PI + referenceAngle,
    };
}

function getReferenceAngleLabelX(origin, dx, dy, referenceAngle) {
    const labelAngle = getReferenceAngleLabelAngle(dx, dy, referenceAngle);

    return origin.x + 72 * Math.cos(labelAngle) - (dx < 0 ? 34 : 0);
}

function getReferenceAngleLabelY(origin, dx, dy, referenceAngle) {
    const labelAngle = getReferenceAngleLabelAngle(dx, dy, referenceAngle);

    return origin.y - 46 * Math.sin(labelAngle) + (dy >= 0 ? 5 : 18);
}

function getReferenceAngleLabelAngle(dx, dy, referenceAngle) {
    if (dx >= 0) {
        return dy >= 0 ? referenceAngle / 2 : -referenceAngle / 2;
    }

    return dy >= 0 ? Math.PI - referenceAngle / 2 : Math.PI + referenceAngle / 2;
}

function createAngleArcPath(origin, radius, angles) {
    const startX = origin.x + radius * Math.cos(angles.startAngle);
    const startY = origin.y - radius * Math.sin(angles.startAngle);
    const endX = origin.x + radius * Math.cos(angles.endAngle);
    const endY = origin.y - radius * Math.sin(angles.endAngle);
    const sweepFlag = angles.endAngle >= angles.startAngle ? 0 : 1;

    return `M ${startX.toFixed(2)} ${startY.toFixed(2)} A ${radius} ${radius} 0 0 ${sweepFlag} ${endX.toFixed(2)} ${endY.toFixed(2)}`;
}

function setLine(element, x1, y1, x2, y2) {
    element.setAttribute("x1", x1);
    element.setAttribute("y1", y1);
    element.setAttribute("x2", x2);
    element.setAttribute("y2", y2);
}

function setTextPosition(element, x, y) {
    element.setAttribute("x", x);
    element.setAttribute("y", y);
}

function getSvgPoint(svg, event) {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    return point.matrixTransform(svg.getScreenCTM().inverse());
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function formatNumber(value) {
    return value.toFixed(1);
}

function injectVectorResolutionStyles() {
    if (document.getElementById("vector-resolution-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "vector-resolution-styles";
    style.textContent = `
        .vector-resolution-component {
            width: 100%;
            max-width: 820px;
            margin: 1.25rem 0;
        }

        .vector-resolution-stage {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .vector-resolution-svg {
            display: block;
            width: 100%;
            height: auto;
            touch-action: none;
            user-select: none;
            background: #ffffff;
        }

        .vector-resolution-background {
            fill: #ffffff;
        }

        .vector-resolution-grid line {
            stroke: #e5e7eb;
            stroke-width: 1;
        }

        .vector-resolution-axis {
            marker-end: url(#vector-resolution-arrowhead);
            stroke: #111827;
            stroke-width: 1.8;
        }

        .vector-resolution-axis-label {
            fill: #111827;
            font: 700 16px Roboto, Arial, sans-serif;
        }

        .vector-resolution-guide {
            stroke: #6b7280;
            stroke-dasharray: 4 4;
            stroke-width: 1.5;
        }

        .vector-resolution-angle-arc {
            fill: none;
            stroke: #111827;
            stroke-width: 2;
        }

        .vector-resolution-component-line {
            marker-end: url(#vector-resolution-arrowhead);
            stroke-linecap: round;
            stroke-width: 3;
        }

        .vector-resolution-x-component {
            stroke: #2563eb;
        }

        .vector-resolution-y-component {
            stroke: #16a34a;
        }

        .vector-resolution-vector {
            marker-end: url(#vector-resolution-arrowhead);
            stroke: #111827;
            stroke-linecap: round;
            stroke-width: 3.2;
            cursor: grab;
        }

        .vector-resolution-svg:active .vector-resolution-vector {
            cursor: grabbing;
        }

        .vector-resolution-hit-area {
            stroke: transparent;
            stroke-linecap: round;
            stroke-width: 24;
            cursor: grab;
            pointer-events: stroke;
        }

        .vector-resolution-label {
            fill: #111827;
            paint-order: stroke;
            stroke: #ffffff;
            stroke-linejoin: round;
            stroke-width: 5;
            font: 700 16px Roboto, Arial, sans-serif;
        }

        .vector-resolution-values {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.5rem;
            margin-top: 0.75rem;
        }

        .vector-resolution-values span {
            background: #f8fafc;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            color: #111827;
            font-size: 0.95rem;
            padding: 0.5rem 0.6rem;
            text-align: center;
        }

        .vector-resolution-values sub {
            font-size: 0.72em;
        }

        #vector-resolution-arrowhead path {
            fill: #111827;
        }

        @media (max-width: 720px) {
            .vector-resolution-values {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        @media (max-width: 460px) {
            .vector-resolution-values {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(style);
}

if (window.document$?.subscribe) {
    window.document$.subscribe(initVectorResolution);
} else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVectorResolution);
} else {
    initVectorResolution();
}
