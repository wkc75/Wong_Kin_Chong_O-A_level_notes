const permanentDipoleContainer = document.getElementById("permanent-dipole-attraction-viewer");

if (permanentDipoleContainer) {
    initPermanentDipoleAttraction(permanentDipoleContainer);
}

function initPermanentDipoleAttraction(container) {
    if (container.dataset.permanentDipoleReady === "true") {
        return;
    }

    container.dataset.permanentDipoleReady = "true";
    injectPermanentDipoleStyles();

    container.classList.add("permanent-dipole-component");
    container.innerHTML = `
        <div class="permanent-dipole-stage">
            ${createPermanentDipoleSvg()}
        </div>
    `;
}

function createPermanentDipoleSvg() {
    return `
        <svg class="permanent-dipole-svg" viewBox="0 0 900 430" aria-hidden="true">
            <defs>
                <marker id="permanent-dipole-arrowhead" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z"></path>
                </marker>
                <linearGradient id="permanent-dipole-cloud" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stop-color="#fee2e2"></stop>
                    <stop offset="44%" stop-color="#eef2ff"></stop>
                    <stop offset="100%" stop-color="#dbeafe"></stop>
                </linearGradient>
            </defs>
            <rect class="permanent-dipole-background" x="0" y="0" width="900" height="430"></rect>
            ${createPermanentDipoleMolecule("a", 180, 208)}
            ${createPermanentDipoleMolecule("b", 545, 208)}
            ${createPermanentDipoleAttraction()}
        </svg>
    `;
}

function createPermanentDipoleMolecule(key, startX, centerY) {
    const hydrogenX = startX;
    const chlorineX = startX + 165;
    const midpointX = (hydrogenX + chlorineX) / 2;

    return `
        <g class="permanent-dipole-molecule permanent-dipole-molecule--${key}">
            <ellipse class="permanent-dipole-electron-cloud" cx="${midpointX}" cy="${centerY}" rx="132" ry="67"></ellipse>
            <line class="permanent-dipole-bond" x1="${hydrogenX + 34}" y1="${centerY}" x2="${chlorineX - 42}" y2="${centerY}"></line>
            <circle class="permanent-dipole-atom permanent-dipole-atom--hydrogen" cx="${hydrogenX}" cy="${centerY}" r="36"></circle>
            <circle class="permanent-dipole-atom permanent-dipole-atom--chlorine" cx="${chlorineX}" cy="${centerY}" r="48"></circle>
            <text class="permanent-dipole-atom-label" x="${hydrogenX}" y="${centerY + 8}">H</text>
            <text class="permanent-dipole-atom-label" x="${chlorineX}" y="${centerY + 8}">Cl</text>
            <text class="permanent-dipole-charge permanent-dipole-charge--positive" x="${hydrogenX}" y="${centerY - 66}">&delta;+</text>
            <text class="permanent-dipole-charge permanent-dipole-charge--negative" x="${chlorineX}" y="${centerY - 76}">&delta;-</text>
            ${createPermanentDipoleArrow(hydrogenX + 4, centerY + 78, chlorineX - 8, centerY + 78)}
        </g>
    `;
}

function createPermanentDipoleArrow(x1, y1, x2, y2) {
    return `
        <g class="permanent-dipole-arrow" aria-hidden="true">
            <line class="permanent-dipole-arrow-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>
            <line class="permanent-dipole-arrow-cross" x1="${x1}" y1="${y1 - 12}" x2="${x1}" y2="${y1 + 12}"></line>
            <line class="permanent-dipole-arrow-cross" x1="${x1 - 12}" y1="${y1}" x2="${x1 + 12}" y2="${y1}"></line>
        </g>
    `;
}

function createPermanentDipoleAttraction() {
    return `
        <g class="permanent-dipole-attraction" aria-hidden="true">
            ${Array.from({ length: 9 }, (_, index) => {
                const x = 378 + index * 18;
                const height = index % 2 === 0 ? 72 : 58;
                const y1 = 208 - height / 2;
                const y2 = 208 + height / 2;

                return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"></line>`;
            }).join("")}
        </g>
    `;
}

function injectPermanentDipoleStyles() {
    if (document.getElementById("permanent-dipole-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "permanent-dipole-styles";
    style.textContent = `
        .permanent-dipole-component {
            width: 100%;
            max-width: 940px;
            margin: 1.25rem 0;
        }

        .permanent-dipole-stage {
            overflow: hidden;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            background: #ffffff;
        }

        .permanent-dipole-svg {
            display: block;
            width: 100%;
            height: auto;
            min-height: 270px;
            background: #ffffff;
        }

        .permanent-dipole-background {
            fill: #ffffff;
        }

        .permanent-dipole-electron-cloud {
            fill: url(#permanent-dipole-cloud);
            opacity: 0.82;
            stroke: #bfd4ee;
            stroke-width: 2;
        }

        .permanent-dipole-bond {
            stroke: #64748b;
            stroke-linecap: round;
            stroke-width: 7;
        }

        .permanent-dipole-atom {
            stroke: #111827;
            stroke-width: 2.2;
        }

        .permanent-dipole-atom--hydrogen {
            fill: #fee2e2;
        }

        .permanent-dipole-atom--chlorine {
            fill: #bfdbfe;
        }

        .permanent-dipole-atom-label {
            fill: #111827;
            font: 900 25px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .permanent-dipole-charge {
            font: 900 30px Georgia, "Times New Roman", serif;
            text-anchor: middle;
        }

        .permanent-dipole-charge--positive {
            fill: #dc2626;
        }

        .permanent-dipole-charge--negative {
            fill: #1d4ed8;
        }

        .permanent-dipole-arrow-line,
        .permanent-dipole-arrow-cross {
            stroke: #111827;
            stroke-linecap: round;
            stroke-width: 3.2;
        }

        .permanent-dipole-arrow-line {
            marker-end: url(#permanent-dipole-arrowhead);
        }

        #permanent-dipole-arrowhead path {
            fill: #111827;
        }

        .permanent-dipole-attraction line {
            stroke: #7c3aed;
            stroke-linecap: round;
            stroke-width: 4.4;
            transform-box: fill-box;
            transform-origin: center;
            animation: permanent-dipole-attraction-pulse 1200ms ease-in-out infinite alternate;
        }

        .permanent-dipole-attraction line:nth-child(2n) {
            animation-delay: 180ms;
        }

        .permanent-dipole-molecule {
            transform-box: fill-box;
            transform-origin: center;
            animation: permanent-dipole-soft-pull 1800ms ease-in-out infinite alternate;
        }

        .permanent-dipole-molecule--a {
            animation-name: permanent-dipole-soft-pull-a;
        }

        .permanent-dipole-molecule--b {
            animation-name: permanent-dipole-soft-pull-b;
        }

        @keyframes permanent-dipole-soft-pull-a {
            to {
                transform: translateX(4px);
            }
        }

        @keyframes permanent-dipole-soft-pull-b {
            to {
                transform: translateX(-4px);
            }
        }

        @keyframes permanent-dipole-attraction-pulse {
            from {
                opacity: 0.42;
                transform: scaleY(0.78);
            }

            to {
                opacity: 1;
                transform: scaleY(1);
            }
        }

        @media (max-width: 640px) {
            .permanent-dipole-svg {
                min-height: 250px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .permanent-dipole-molecule,
            .permanent-dipole-attraction line {
                animation: none;
            }
        }
    `;

    document.head.appendChild(style);
}
