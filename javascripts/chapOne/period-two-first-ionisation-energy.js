const periodTwoFirstIonisationContainer = document.getElementById("period-two-first-ionisation-energy");

if (periodTwoFirstIonisationContainer) {
    const points = [
        { atomicNumber: 3, element: "Li", energy: 520, labelX: -16, labelY: 25 },
        { atomicNumber: 4, element: "Be", energy: 900, labelX: 0, labelY: -18 },
        { atomicNumber: 5, element: "B", energy: 801, labelX: 0, labelY: -18 },
        { atomicNumber: 6, element: "C", energy: 1086, labelX: 0, labelY: -18 },
        { atomicNumber: 7, element: "N", energy: 1402, labelX: 0, labelY: -18 },
        { atomicNumber: 8, element: "O", energy: 1314, labelX: 0, labelY: -18 },
        { atomicNumber: 9, element: "F", energy: 1681, labelX: 0, labelY: -18 },
        { atomicNumber: 10, element: "Ne", energy: 2081, labelX: -8, labelY: -18 },
    ];

    injectPeriodTwoFirstIonisationStyles();
    periodTwoFirstIonisationContainer.classList.add("period-two-first-ie-component");
    periodTwoFirstIonisationContainer.innerHTML = createPeriodTwoFirstIonisationGraph(points);
}

function createPeriodTwoFirstIonisationGraph(points) {
    const width = 780;
    const height = 450;
    const margin = {
        top: 42,
        right: 38,
        bottom: 76,
        left: 82,
    };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const xMin = 3;
    const xMax = 10;
    const yMin = 400;
    const yMax = 2200;
    const xScale = (value) => margin.left + ((value - xMin) / (xMax - xMin)) * plotWidth;
    const yScale = (value) => margin.top + plotHeight - ((value - yMin) / (yMax - yMin)) * plotHeight;
    const pathData = points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${xScale(point.atomicNumber).toFixed(2)} ${yScale(point.energy).toFixed(2)}`)
        .join(" ");
    const xTicks = points.map((point) => point.atomicNumber);
    const yTicks = [500, 1000, 1500, 2000];

    return `
        <svg class="period-two-first-ie-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="First ionisation energy across Period 2">
            <rect class="period-two-first-ie-background" x="0" y="0" width="${width}" height="${height}"></rect>
            <g class="period-two-first-ie-grid">
                ${yTicks.map((tick) => createPeriodTwoHorizontalTick(margin, plotWidth, yScale(tick))).join("")}
            </g>
            <g class="period-two-first-ie-axes">
                <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}"></line>
                <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}"></line>
                ${xTicks.map((tick) => createPeriodTwoXAxisTick(tick, xScale(tick), margin.top + plotHeight)).join("")}
                ${yTicks.map((tick) => createPeriodTwoYAxisTick(margin.left, yScale(tick))).join("")}
            </g>
            <g class="period-two-first-ie-period-label">
                ${createPeriodTwoBracket(xScale(3), xScale(10), margin.top - 18)}
            </g>
            <path class="period-two-first-ie-line" d="${pathData}"></path>
            <g class="period-two-first-ie-points">
                ${points.map((point) => createPeriodTwoPoint(point, xScale(point.atomicNumber), yScale(point.energy))).join("")}
            </g>
            <g class="period-two-first-ie-point-labels">
                ${points.map((point) => createPeriodTwoPointLabel(point, xScale(point.atomicNumber), yScale(point.energy))).join("")}
            </g>
            <text class="period-two-first-ie-x-label" x="${margin.left + plotWidth / 2}" y="${height - 22}">Atomic Number</text>
            <text class="period-two-first-ie-y-label" x="${-(margin.top + plotHeight / 2)}" y="24" transform="rotate(-90)">
                Ionisation Energy / kJ mol<tspan baseline-shift="super" font-size="12">-1</tspan>
            </text>
        </svg>
    `;
}

function createPeriodTwoHorizontalTick(margin, plotWidth, y) {
    return `<line x1="${margin.left}" y1="${y.toFixed(2)}" x2="${margin.left + plotWidth}" y2="${y.toFixed(2)}"></line>`;
}

function createPeriodTwoXAxisTick(tick, x, axisY) {
    return `
        <g>
            <line x1="${x.toFixed(2)}" y1="${axisY}" x2="${x.toFixed(2)}" y2="${axisY + 8}"></line>
            <text x="${x.toFixed(2)}" y="${axisY + 31}">${tick}</text>
        </g>
    `;
}

function createPeriodTwoYAxisTick(axisX, y) {
    return `<line x1="${axisX - 9}" y1="${y.toFixed(2)}" x2="${axisX}" y2="${y.toFixed(2)}"></line>`;
}

function createPeriodTwoBracket(startX, endX, y) {
    return `
        <line x1="${startX}" y1="${y}" x2="${endX}" y2="${y}"></line>
        <line x1="${startX}" y1="${y - 7}" x2="${startX}" y2="${y + 7}"></line>
        <line x1="${endX}" y1="${y - 7}" x2="${endX}" y2="${y + 7}"></line>
        <text x="${(startX + endX) / 2}" y="${y - 10}">Period 2</text>
    `;
}

function createPeriodTwoPoint(point, x, y) {
    return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="7"><title>${point.element}: ${point.energy} kJ mol-1</title></circle>`;
}

function createPeriodTwoPointLabel(point, x, y) {
    return `<text x="${(x + point.labelX).toFixed(2)}" y="${(y + point.labelY).toFixed(2)}">${point.element}</text>`;
}

function injectPeriodTwoFirstIonisationStyles() {
    if (document.getElementById("period-two-first-ie-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "period-two-first-ie-styles";
    style.textContent = `
        .period-two-first-ie-component {
            width: 100%;
            max-width: 900px;
            margin: 1.25rem 0;
        }

        .period-two-first-ie-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
        }

        .period-two-first-ie-background {
            fill: #ffffff;
        }

        .period-two-first-ie-grid line {
            stroke: #edf1f5;
            stroke-width: 1;
        }

        .period-two-first-ie-axes line {
            stroke: #6b7280;
            stroke-width: 1.5;
        }

        .period-two-first-ie-axes text,
        .period-two-first-ie-x-label,
        .period-two-first-ie-y-label,
        .period-two-first-ie-point-labels text,
        .period-two-first-ie-period-label text {
            fill: #111827;
            font-family: Roboto, Arial, sans-serif;
        }

        .period-two-first-ie-axes text {
            font-size: 16px;
            font-weight: 700;
            text-anchor: middle;
        }

        .period-two-first-ie-x-label,
        .period-two-first-ie-y-label {
            font-size: 17px;
            font-weight: 700;
            text-anchor: middle;
        }

        .period-two-first-ie-line {
            fill: none;
            stroke: #111827;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 5;
        }

        .period-two-first-ie-points circle {
            fill: #ffffff;
            stroke: #000000;
            stroke-width: 3;
        }

        .period-two-first-ie-point-labels text {
            font-size: 17px;
            font-weight: 700;
            text-anchor: middle;
        }

        .period-two-first-ie-period-label line {
            stroke: #111827;
            stroke-width: 1.6;
        }

        .period-two-first-ie-period-label text {
            font-size: 17px;
            font-weight: 700;
            text-anchor: middle;
        }
    `;

    document.head.appendChild(style);
}
