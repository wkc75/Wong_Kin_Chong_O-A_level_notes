const mgSuccessiveIonisationContainer = document.getElementById("mg-successive-ionisation-energy");

if (mgSuccessiveIonisationContainer) {
    const points = [
        { electron: 1, energy: 0.82 },
        { electron: 2, energy: 0.9 },
        { electron: 3, energy: 1.42 },
        { electron: 4, energy: 1.58 },
        { electron: 5, energy: 1.74 },
        { electron: 6, energy: 1.92 },
        { electron: 7, energy: 2.14 },
        { electron: 8, energy: 2.42 },
        { electron: 9, energy: 3.1 },
        { electron: 10, energy: 3.35 },
        { electron: 11, energy: 8.85 },
        { electron: 12, energy: 9.65 },
    ];

    const subshells = [
        { label: "3s", start: 1, end: 2, y: 1.35 },
        { label: "2p", start: 3, end: 8, y: 2.85 },
        { label: "2s", start: 9, end: 10, y: 3.8 },
        { label: "1s", start: 11, end: 12, y: 10.2 },
    ];

    injectMgSuccessiveIonisationStyles();
    mgSuccessiveIonisationContainer.classList.add("mg-successive-ie-component");
    mgSuccessiveIonisationContainer.innerHTML = createMgSuccessiveIonisationGraph(points, subshells);
}

function createMgSuccessiveIonisationGraph(points, subshells) {
    const width = 760;
    const height = 460;
    const margin = {
        top: 28,
        right: 36,
        bottom: 70,
        left: 82,
    };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const xMin = 1;
    const xMax = 12;
    const yMin = 0;
    const yMax = 10.4;
    const xScale = (value) => margin.left + ((value - xMin) / (xMax - xMin)) * plotWidth;
    const yScale = (value) => margin.top + plotHeight - ((value - yMin) / (yMax - yMin)) * plotHeight;
    const pathData = points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${xScale(point.electron).toFixed(2)} ${yScale(point.energy).toFixed(2)}`)
        .join(" ");
    const xTicks = Array.from({ length: 12 }, (_, index) => index + 1);
    const yTicks = [0, 2, 4, 6, 8, 10];

    return `
        <svg class="mg-successive-ie-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Successive ionisation energy graph for magnesium">
            <rect class="mg-successive-ie-background" x="0" y="0" width="${width}" height="${height}"></rect>
            <g class="mg-successive-ie-grid">
                ${yTicks.map((tick) => createHorizontalTick(margin, plotWidth, yScale(tick))).join("")}
            </g>
            <g class="mg-successive-ie-axes">
                <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}"></line>
                <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}"></line>
                ${xTicks.map((tick) => createXAxisTick(tick, xScale(tick), margin.top + plotHeight)).join("")}
                ${yTicks.map((tick) => createYAxisTick(margin.left, yScale(tick))).join("")}
            </g>
            <g class="mg-successive-ie-shell-jumps" aria-hidden="true">
                ${createShellJumpMarker(xScale(2.5), margin.top + 8, plotHeight - 16, "n = 3 to n = 2")}
                ${createShellJumpMarker(xScale(10.5), margin.top + 8, plotHeight - 16, "n = 2 to n = 1")}
            </g>
            <path class="mg-successive-ie-line" d="${pathData}"></path>
            <g class="mg-successive-ie-points">
                ${points.map((point) => createPoint(point, xScale(point.electron), yScale(point.energy))).join("")}
            </g>
            <g class="mg-successive-ie-brackets">
                ${subshells.map((subshell) => createSubshellBracket(subshell, xScale, yScale)).join("")}
            </g>
            <text class="mg-successive-ie-x-label" x="${margin.left + plotWidth / 2}" y="${height - 20}">Number of Electrons Removed</text>
            <text class="mg-successive-ie-y-label" x="${-(margin.top + plotHeight / 2)}" y="24" transform="rotate(-90)">
                Ionisation Energy / kJ mol<tspan baseline-shift="super" font-size="12">-1</tspan>
            </text>
        </svg>
    `;
}

function createHorizontalTick(margin, plotWidth, y) {
    return `<line x1="${margin.left}" y1="${y.toFixed(2)}" x2="${margin.left + plotWidth}" y2="${y.toFixed(2)}"></line>`;
}

function createXAxisTick(tick, x, axisY) {
    return `
        <g>
            <line x1="${x.toFixed(2)}" y1="${axisY}" x2="${x.toFixed(2)}" y2="${axisY + 8}"></line>
            <text x="${x.toFixed(2)}" y="${axisY + 30}">${tick}</text>
        </g>
    `;
}

function createYAxisTick(axisX, y) {
    return `<line x1="${axisX - 9}" y1="${y.toFixed(2)}" x2="${axisX}" y2="${y.toFixed(2)}"></line>`;
}

function createPoint(point, x, y) {
    return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="7"><title>Electron ${point.electron}</title></circle>`;
}

function createSubshellBracket(subshell, xScale, yScale) {
    const startX = xScale(subshell.start - 0.3);
    const endX = xScale(subshell.end + 0.3);
    const labelX = (startX + endX) / 2;
    const bracketY = yScale(subshell.y);
    const stem = 15;

    return `
        <path d="M ${startX.toFixed(2)} ${bracketY + stem} L ${startX.toFixed(2)} ${bracketY} L ${endX.toFixed(2)} ${bracketY} L ${endX.toFixed(2)} ${bracketY + stem}"></path>
        <text x="${labelX.toFixed(2)}" y="${bracketY - 9}">${subshell.label}</text>
    `;
}

function createShellJumpMarker(x, y, height, label) {
    return `
        <line x1="${x.toFixed(2)}" y1="${y}" x2="${x.toFixed(2)}" y2="${y + height}"></line>
        <title>${label}</title>
    `;
}

function injectMgSuccessiveIonisationStyles() {
    if (document.getElementById("mg-successive-ie-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "mg-successive-ie-styles";
    style.textContent = `
        .mg-successive-ie-component {
            width: 100%;
            max-width: 980px;
            margin: 1.25rem 0;
        }

        .mg-successive-ie-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
        }

        .mg-successive-ie-background {
            fill: #ffffff;
        }

        .mg-successive-ie-grid line {
            stroke: #e8edf3;
            stroke-width: 1;
        }

        .mg-successive-ie-axes line {
            stroke: #6b7280;
            stroke-width: 1.5;
        }

        .mg-successive-ie-axes text,
        .mg-successive-ie-x-label,
        .mg-successive-ie-y-label {
            fill: #111827;
            font-family: Roboto, Arial, sans-serif;
        }

        .mg-successive-ie-axes text {
            font-size: 15px;
            font-weight: 700;
            text-anchor: middle;
        }

        .mg-successive-ie-x-label,
        .mg-successive-ie-y-label {
            font-size: 16px;
            font-weight: 700;
            text-anchor: middle;
        }

        .mg-successive-ie-line {
            fill: none;
            stroke: #111827;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 5;
        }

        .mg-successive-ie-points circle {
            fill: #000000;
            stroke: #ffffff;
            stroke-width: 1.5;
        }

        .mg-successive-ie-brackets path {
            fill: none;
            stroke: #2563eb;
            stroke-width: 1.7;
        }

        .mg-successive-ie-brackets text {
            fill: #111827;
            font-family: Roboto, Arial, sans-serif;
            font-size: 20px;
            font-weight: 700;
            text-anchor: middle;
        }

        .mg-successive-ie-shell-jumps line {
            stroke: #2563eb;
            stroke-dasharray: 6 8;
            stroke-width: 1.4;
            opacity: 0.45;
        }
    `;

    document.head.appendChild(style);
}
