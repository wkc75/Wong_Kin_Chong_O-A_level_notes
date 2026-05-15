const ionicBrittlenessContainer = document.getElementById("ionic-brittleness-viewer");

if (ionicBrittlenessContainer) {
    injectIonicBrittlenessStyles();

    ionicBrittlenessContainer.classList.add("ionic-brittleness-component");
    ionicBrittlenessContainer.innerHTML = `
        <div class="ionic-brittleness-controls">
            <button class="ionic-brittleness-button" type="button" aria-pressed="false">
                Apply horizontal force
            </button>
        </div>
        <div class="ionic-brittleness-stage">
            ${createIonicBrittlenessSvg()}
        </div>
    `;

    const button = ionicBrittlenessContainer.querySelector(".ionic-brittleness-button");
    const stage = ionicBrittlenessContainer.querySelector(".ionic-brittleness-stage");
    let breakTimer;

    button.addEventListener("click", () => {
        window.clearTimeout(breakTimer);

        if (stage.classList.contains("is-forced")) {
            stage.classList.remove("is-forced", "is-broken");
            button.classList.remove("is-active");
            button.setAttribute("aria-pressed", "false");
            button.textContent = "Apply horizontal force";
            return;
        }

        stage.classList.add("is-forced");
        button.classList.add("is-active");
        button.setAttribute("aria-pressed", "true");
        button.textContent = "Reset lattice";

        breakTimer = window.setTimeout(() => {
            stage.classList.add("is-broken");
        }, 900);
    });
}

function createIonicBrittlenessSvg() {
    const rows = 2;
    const columns = 8;
    const startX = 170;
    const startY = 82;
    const gap = 62;

    return `
        <svg class="ionic-brittleness-svg" viewBox="0 0 760 230" role="img" aria-label="Ionic lattice layers sliding and shattering when force is applied">
            <defs>
                <marker id="ionic-brittleness-force-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z"></path>
                </marker>
            </defs>
            <rect class="ionic-brittleness-background" x="0" y="0" width="760" height="230"></rect>
            <g class="ionic-brittleness-force-arrow" aria-hidden="true">
                <line x1="56" y1="${startY}" x2="132" y2="${startY}"></line>
            </g>
            <g class="ionic-brittleness-lattice">
                ${Array.from({ length: rows }, (_, row) => createIonicBrittlenessRow(row, columns, startX, startY + row * gap, gap)).join("")}
            </g>
        </svg>
    `;
}

function createIonicBrittlenessRow(row, columns, startX, y, gap) {
    return `
        <g class="ionic-brittleness-row ionic-brittleness-row--${row}">
            ${Array.from({ length: columns }, (_, column) => {
                const ion = (row + column) % 2 === 0 ? "sodium" : "chloride";
                return createIonicBrittlenessIon(ion, startX + column * gap, y);
            }).join("")}
        </g>
    `;
}

function createIonicBrittlenessIon(ion, x, y) {
    const isSodium = ion === "sodium";
    const label = isSodium ? "Na+" : "Cl-";
    const charge = isSodium ? "+" : "-";

    return `
        <g class="ionic-brittleness-ion ionic-brittleness-ion--${ion}" transform="translate(${x} ${y})">
            <circle cx="0" cy="0" r="22"></circle>
            <text class="ionic-brittleness-charge" x="0" y="7">${charge}</text>
            <title>${label}</title>
        </g>
    `;
}

function injectIonicBrittlenessStyles() {
    if (document.getElementById("ionic-brittleness-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "ionic-brittleness-styles";
    style.textContent = `
        .ionic-brittleness-component {
            width: 100%;
            max-width: 900px;
            margin: 1.25rem 0;
        }

        .ionic-brittleness-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }

        .ionic-brittleness-button {
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            min-width: 11rem;
            padding: 0.45rem 0.85rem;
        }

        .ionic-brittleness-button:hover,
        .ionic-brittleness-button.is-active {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .ionic-brittleness-stage {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .ionic-brittleness-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .ionic-brittleness-background {
            fill: #ffffff;
        }

        .ionic-brittleness-row {
            transform-box: fill-box;
            transform-origin: center;
            transition: transform 760ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .ionic-brittleness-stage.is-forced .ionic-brittleness-row--0 {
            transform: translateX(62px);
        }

        .ionic-brittleness-stage.is-broken .ionic-brittleness-row--0 {
            transform: translate(62px, -24px);
        }

        .ionic-brittleness-stage.is-broken .ionic-brittleness-row--1 {
            transform: translateY(32px);
        }

        .ionic-brittleness-ion circle {
            stroke: #111827;
            stroke-width: 2;
        }

        .ionic-brittleness-ion--sodium circle {
            fill: #ef4444;
        }

        .ionic-brittleness-ion--chloride circle {
            fill: #22c55e;
        }

        .ionic-brittleness-charge {
            fill: #111827;
            font: 700 20px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .ionic-brittleness-force-arrow {
            opacity: 0;
            transition: opacity 220ms ease;
        }

        .ionic-brittleness-stage.is-forced .ionic-brittleness-force-arrow {
            opacity: 1;
        }

        .ionic-brittleness-force-arrow line {
            marker-end: url(#ionic-brittleness-force-head);
            stroke: #dc2626;
            stroke-linecap: round;
            stroke-width: 5;
        }

        #ionic-brittleness-force-head path {
            fill: #dc2626;
        }

        @media (prefers-reduced-motion: reduce) {
            .ionic-brittleness-row,
            .ionic-brittleness-force-arrow {
                transition: none;
            }
        }
    `;

    document.head.appendChild(style);
}
