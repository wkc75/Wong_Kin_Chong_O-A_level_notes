const metalLayerSlidingContainer = document.getElementById("metal-layer-sliding-viewer");

if (metalLayerSlidingContainer) {
    injectMetalLayerSlidingStyles();

    metalLayerSlidingContainer.classList.add("metal-layer-sliding-component");
    metalLayerSlidingContainer.innerHTML = `
        <div class="metal-layer-sliding-controls">
            <button class="metal-layer-sliding-button" type="button" aria-pressed="false">
                Apply horizontal force
            </button>
        </div>
        <div class="metal-layer-sliding-stage">
            ${createMetalLayerSlidingSvg()}
        </div>
    `;

    const button = metalLayerSlidingContainer.querySelector(".metal-layer-sliding-button");
    const stage = metalLayerSlidingContainer.querySelector(".metal-layer-sliding-stage");

    button.addEventListener("click", () => {
        const isShifted = stage.classList.toggle("is-shifted");

        button.classList.toggle("is-active", isShifted);
        button.setAttribute("aria-pressed", String(isShifted));
        button.textContent = isShifted ? "Reset lattice" : "Apply horizontal force";
    });
}

function createMetalLayerSlidingSvg() {
    const rows = [
        { key: "top", y: 115 },
        { key: "middle", y: 220 },
        { key: "bottom", y: 325 },
    ];
    const ionXPositions = [145, 285, 425, 565];

    return `
        <svg class="metal-layer-sliding-svg" viewBox="0 0 760 430" role="img" aria-label="Aluminium metallic lattice showing layers sliding when a horizontal force is applied">
            <defs>
                <marker id="metal-layer-force-arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z"></path>
                </marker>
            </defs>
            <rect class="metal-layer-sliding-background" x="0" y="0" width="760" height="430"></rect>
            <g class="metal-layer-force-arrow" aria-hidden="true">
                <line x1="92" y1="52" x2="252" y2="52"></line>
            </g>
            <g class="metal-layer-lattice">
                ${rows.map((row) => createAluminiumLayer(row, ionXPositions)).join("")}
            </g>
        </svg>
    `;
}

function createAluminiumLayer(row, ionXPositions) {
    return `
        <g class="metal-layer-row metal-layer-row--${row.key}">
            ${ionXPositions.map((x) => `
                <g class="metal-layer-unit" transform="translate(${x} ${row.y})">
                    ${createAluminiumIon()}
                    ${createAluminiumElectrons()}
                </g>
            `).join("")}
        </g>
    `;
}

function createAluminiumIon() {
    return `
        <g class="metal-layer-ion">
            <circle cx="0" cy="0" r="39"></circle>
            <text class="metal-layer-ion-symbol" x="-8" y="9">Al</text>
            <text class="metal-layer-ion-charge" x="21" y="-11">3+</text>
        </g>
    `;
}

function createAluminiumElectrons() {
    const electrons = [
        { x: -38, y: -49 },
        { x: 0, y: -59 },
        { x: 38, y: -49 },
    ];

    return electrons.map((electron, index) => `
        <g class="metal-layer-electron" transform="translate(${electron.x} ${electron.y})" style="--delay:${index * 40}ms">
            <text x="0" y="5">e</text>
            <text class="metal-layer-electron-charge" x="10" y="-8">-</text>
        </g>
    `).join("");
}

function injectMetalLayerSlidingStyles() {
    if (document.getElementById("metal-layer-sliding-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "metal-layer-sliding-styles";
    style.textContent = `
        .metal-layer-sliding-component {
            width: 100%;
            max-width: 900px;
            margin: 1.25rem 0;
        }

        .metal-layer-sliding-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }

        .metal-layer-sliding-button {
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            min-width: 10.5rem;
            padding: 0.45rem 0.85rem;
        }

        .metal-layer-sliding-button:hover,
        .metal-layer-sliding-button.is-active {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .metal-layer-sliding-stage {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .metal-layer-sliding-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .metal-layer-sliding-background {
            fill: #ffffff;
        }

        .metal-layer-row {
            transform-box: fill-box;
            transform-origin: center;
            transition: transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .metal-layer-sliding-stage.is-shifted .metal-layer-row--top {
            transform: translateX(76px);
        }

        .metal-layer-sliding-stage.is-shifted .metal-layer-row--middle {
            transform: translateX(38px);
        }

        .metal-layer-ion circle {
            fill: #ffffff;
            stroke: #111827;
            stroke-width: 3;
        }

        .metal-layer-ion-symbol,
        .metal-layer-ion-charge,
        .metal-layer-electron text {
            fill: #111827;
            font-family: Roboto, Arial, sans-serif;
            font-weight: 700;
            text-anchor: middle;
        }

        .metal-layer-ion-symbol {
            font-size: 27px;
        }

        .metal-layer-ion-charge {
            font-size: 17px;
        }

        .metal-layer-electron {
            animation: metal-layer-electron-enter 260ms ease both;
            animation-delay: var(--delay);
        }

        .metal-layer-electron text {
            fill: #000000;
            font-size: 24px;
        }

        .metal-layer-electron-charge {
            font-size: 15px;
        }

        .metal-layer-force-arrow {
            opacity: 0;
            transition: opacity 240ms ease;
        }

        .metal-layer-sliding-stage.is-shifted .metal-layer-force-arrow {
            opacity: 1;
        }

        .metal-layer-force-arrow line {
            marker-end: url(#metal-layer-force-arrowhead);
            stroke: #2563eb;
            stroke-linecap: round;
            stroke-width: 5;
        }

        #metal-layer-force-arrowhead path {
            fill: #2563eb;
        }

        @keyframes metal-layer-electron-enter {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .metal-layer-row {
                transition: none;
            }
        }
    `;

    document.head.appendChild(style);
}
