const accuracyPrecisionStates = [
    {
        id: "accurate-precise",
        label: "Accurate and precise",
        accurate: true,
        precise: true,
        dots: [
            [202, 165],
            [214, 172],
            [207, 181],
            [220, 160],
            [198, 175],
        ],
    },
    {
        id: "accurate-not-precise",
        label: "Accurate but not precise",
        accurate: true,
        precise: false,
        dots: [
            [142, 112],
            [276, 106],
            [291, 210],
            [146, 236],
            [210, 171],
        ],
    },
    {
        id: "not-accurate-precise",
        label: "Precise but not accurate",
        accurate: false,
        precise: true,
        dots: [
            [283, 102],
            [296, 110],
            [288, 121],
            [301, 96],
            [276, 114],
        ],
    },
    {
        id: "neither",
        label: "Neither accurate nor precise",
        accurate: false,
        precise: false,
        dots: [
            [128, 92],
            [298, 118],
            [121, 226],
            [274, 258],
            [166, 276],
        ],
    },
];

function initAccuracyPrecisionTarget() {
    const container = document.getElementById("accuracy-precision-target");

    if (!container || container.dataset.accuracyPrecisionReady === "true") {
        return;
    }

    container.dataset.accuracyPrecisionReady = "true";
    injectAccuracyPrecisionStyles();

    container.classList.add("accuracy-precision-component");
    container.innerHTML = `
        <div class="accuracy-precision-controls" role="group" aria-label="Accuracy and precision options">
            ${accuracyPrecisionStates.map(createAccuracyPrecisionButton).join("")}
        </div>
        <div class="accuracy-precision-stage" aria-live="polite"></div>
    `;

    const stage = container.querySelector(".accuracy-precision-stage");
    const buttons = Array.from(container.querySelectorAll(".accuracy-precision-button"));

    function setState(stateId) {
        const state = accuracyPrecisionStates.find((item) => item.id === stateId) || accuracyPrecisionStates[0];

        buttons.forEach((button) => {
            const isActive = button.dataset.state === state.id;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        stage.innerHTML = createAccuracyPrecisionDiagram(state);
    }

    container.addEventListener("click", (event) => {
        const button = event.target.closest(".accuracy-precision-button");

        if (!button) {
            return;
        }

        setState(button.dataset.state);
    });

    setState("accurate-precise");
}

function createAccuracyPrecisionButton(state) {
    return `
        <button class="accuracy-precision-button" type="button" data-state="${state.id}" aria-pressed="false">
            ${state.label}
        </button>
    `;
}

function createAccuracyPrecisionDiagram(state) {
    const centerX = 210;
    const centerY = 170;
    const rings = [18, 42, 68, 96];
    const dots = state.dots
        .map(([x, y], index) => {
            return `<circle class="accuracy-precision-dot" cx="${x}" cy="${y}" r="6.5" style="--delay:${index * 45}ms"></circle>`;
        })
        .join("");

    return `
        <div class="accuracy-precision-summary">
            <strong>${state.label}</strong>
            <span>Accurate: ${state.accurate ? "yes" : "no"}</span>
            <span>Precise: ${state.precise ? "yes" : "no"}</span>
        </div>
        <svg class="accuracy-precision-svg" viewBox="0 0 420 330" role="img" aria-label="${state.label} target diagram">
            <rect class="accuracy-precision-background" x="0" y="0" width="420" height="330"></rect>
            <g class="accuracy-precision-rings">
                ${rings.map((radius) => `<circle cx="${centerX}" cy="${centerY}" r="${radius}"></circle>`).join("")}
            </g>
            <line class="accuracy-precision-crosshair" x1="${centerX - 10}" y1="${centerY}" x2="${centerX + 10}" y2="${centerY}"></line>
            <line class="accuracy-precision-crosshair" x1="${centerX}" y1="${centerY - 10}" x2="${centerX}" y2="${centerY + 10}"></line>
            <g class="accuracy-precision-dots">
                ${dots}
            </g>
        </svg>
    `;
}

function injectAccuracyPrecisionStyles() {
    if (document.getElementById("accuracy-precision-target-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "accuracy-precision-target-styles";
    style.textContent = `
        .accuracy-precision-component {
            width: 100%;
            max-width: 760px;
            margin: 1.25rem 0;
        }

        .accuracy-precision-controls {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.55rem;
            margin-bottom: 0.8rem;
        }

        .accuracy-precision-button {
            min-height: 2.7rem;
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.92rem Roboto, Arial, sans-serif;
            padding: 0.5rem 0.75rem;
            text-align: center;
            transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
        }

        .accuracy-precision-button:hover,
        .accuracy-precision-button.is-active {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .accuracy-precision-stage {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .accuracy-precision-summary {
            display: flex;
            flex-wrap: wrap;
            gap: 0.55rem 1rem;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #dde3ea;
            background: #f8fafc;
            color: #111827;
            padding: 0.7rem;
            text-align: center;
        }

        .accuracy-precision-summary strong {
            flex-basis: 100%;
            font-size: 1rem;
        }

        .accuracy-precision-summary span {
            font-size: 0.92rem;
            font-weight: 700;
        }

        .accuracy-precision-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .accuracy-precision-background {
            fill: #ffffff;
        }

        .accuracy-precision-rings circle {
            fill: none;
            stroke: #111827;
            stroke-width: 2;
        }

        .accuracy-precision-crosshair {
            stroke: #111827;
            stroke-width: 1.7;
            stroke-linecap: round;
        }

        .accuracy-precision-dot {
            fill: #111827;
            opacity: 0;
            transform: scale(0.35);
            transform-box: fill-box;
            transform-origin: center;
            animation: accuracy-precision-dot-in 260ms ease forwards;
            animation-delay: var(--delay);
        }

        @keyframes accuracy-precision-dot-in {
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @media (max-width: 620px) {
            .accuracy-precision-controls {
                grid-template-columns: 1fr;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .accuracy-precision-dot {
                animation: none;
                opacity: 1;
                transform: none;
            }
        }
    `;

    document.head.appendChild(style);
}

if (window.document$?.subscribe) {
    window.document$.subscribe(initAccuracyPrecisionTarget);
} else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAccuracyPrecisionTarget);
} else {
    initAccuracyPrecisionTarget();
}
