const groupOneFirstIonisationContainer = document.getElementById("group-one-first-ionisation-energy");

if (groupOneFirstIonisationContainer) {
    const points = [
        { element: "Li", energy: 5.2 },
        { element: "Na", energy: 4.95 },
        { element: "K", energy: 4.05 },
        { element: "Rb", energy: 3.85 },
        { element: "Cs", energy: 3.55 },
    ];

    injectGroupOneFirstIonisationStyles();
    groupOneFirstIonisationContainer.classList.add("group-one-first-ie-component");
    groupOneFirstIonisationContainer.innerHTML = createGroupOneFirstIonisationGraph(points);
}

function createGroupOneFirstIonisationGraph(points) {
    const width = 720;
    const height = 430;
    const margin = {
        top: 34,
        right: 42,
        bottom: 72,
        left: 82,
    };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const yMin = 3;
    const yMax = 5.6;
    const xStep = plotWidth / (points.length - 1);
    const xScale = (index) => margin.left + index * xStep;
    const yScale = (value) => margin.top + plotHeight - ((value - yMin) / (yMax - yMin)) * plotHeight;
    const pathData = points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${xScale(index).toFixed(2)} ${yScale(point.energy).toFixed(2)}`)
        .join(" ");
    const yTicks = [3, 3.5, 4, 4.5, 5, 5.5];

    return `
        <svg class="group-one-first-ie-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="First ionisation energy decreases down Group 1">
            <rect class="group-one-first-ie-background" x="0" y="0" width="${width}" height="${height}"></rect>
            <g class="group-one-first-ie-grid">
                ${yTicks.map((tick) => createGroupOneHorizontalTick(margin, plotWidth, yScale(tick))).join("")}
            </g>
            <g class="group-one-first-ie-axes">
                <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}"></line>
                <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}"></line>
                ${points.map((point, index) => createGroupOneXAxisTick(point.element, xScale(index), margin.top + plotHeight)).join("")}
                ${yTicks.map((tick) => createGroupOneYAxisTick(margin.left, yScale(tick))).join("")}
            </g>
            <path class="group-one-first-ie-line" d="${pathData}"></path>
            <g class="group-one-first-ie-points">
                ${points.map((point, index) => createGroupOnePoint(point, xScale(index), yScale(point.energy))).join("")}
            </g>
            <text class="group-one-first-ie-y-label" x="${-(margin.top + plotHeight / 2)}" y="24" transform="rotate(-90)">
                Ionisation Energy / kJ mol<tspan baseline-shift="super" font-size="12">-1</tspan>
            </text>
        </svg>
    `;
}

function createGroupOneHorizontalTick(margin, plotWidth, y) {
    return `<line x1="${margin.left}" y1="${y.toFixed(2)}" x2="${margin.left + plotWidth}" y2="${y.toFixed(2)}"></line>`;
}

function createGroupOneXAxisTick(label, x, axisY) {
    return `
        <g>
            <line x1="${x.toFixed(2)}" y1="${axisY}" x2="${x.toFixed(2)}" y2="${axisY + 8}"></line>
            <text x="${x.toFixed(2)}" y="${axisY + 32}">${label}</text>
        </g>
    `;
}

function createGroupOneYAxisTick(axisX, y) {
    return `<line x1="${axisX - 9}" y1="${y.toFixed(2)}" x2="${axisX}" y2="${y.toFixed(2)}"></line>`;
}

function createGroupOnePoint(point, x, y) {
    return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="7"><title>${point.element}</title></circle>`;
}

function injectGroupOneFirstIonisationStyles() {
    if (document.getElementById("group-one-first-ie-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "group-one-first-ie-styles";
    style.textContent = `
        .group-one-first-ie-component {
            width: 100%;
            max-width: 860px;
            margin: 1.25rem 0;
        }

        .group-one-first-ie-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
        }

        .group-one-first-ie-background {
            fill: #ffffff;
        }

        .group-one-first-ie-grid line {
            stroke: #edf1f5;
            stroke-width: 1;
        }

        .group-one-first-ie-axes line {
            stroke: #6b7280;
            stroke-width: 1.5;
        }

        .group-one-first-ie-axes text,
        .group-one-first-ie-y-label {
            fill: #111827;
            font-family: Roboto, Arial, sans-serif;
        }

        .group-one-first-ie-axes text {
            font-size: 17px;
            font-weight: 700;
            text-anchor: middle;
        }

        .group-one-first-ie-y-label {
            font-size: 17px;
            font-weight: 700;
            text-anchor: middle;
        }

        .group-one-first-ie-line {
            fill: none;
            stroke: #111827;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 5;
        }

        .group-one-first-ie-points circle {
            fill: #000000;
            stroke: #ffffff;
            stroke-width: 1.5;
        }
    `;

    document.head.appendChild(style);
}
