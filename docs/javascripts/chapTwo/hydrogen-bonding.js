const hydrogenBondingContainer = document.getElementById("hydrogen-bonding-viewer");

if (hydrogenBondingContainer) {
    initHydrogenBonding(hydrogenBondingContainer);
}

function initHydrogenBonding(container) {
    if (container.dataset.hydrogenBondingReady === "true") {
        return;
    }

    container.dataset.hydrogenBondingReady = "true";
    injectHydrogenBondingStyles();

    container.classList.add("hydrogen-bonding-component");
    container.innerHTML = `
        <div class="hydrogen-bonding-stage" role="region" aria-label="Hydrogen bonding between two water molecules">
            ${createHydrogenBondingSvg()}
        </div>
    `;
}

function createHydrogenBondingSvg() {
    return `
        <svg class="hydrogen-bonding-svg" viewBox="0 0 900 430" role="img" aria-labelledby="hydrogen-bonding-title hydrogen-bonding-description">
            <title id="hydrogen-bonding-title">Hydrogen bonding between water molecules</title>
            <desc id="hydrogen-bonding-description">
                Two bent water molecules show oxygen atoms with partial negative charges and hydrogen atoms with partial positive charges. A dashed intermolecular attraction connects a lone pair on one oxygen atom to a hydrogen atom bonded to oxygen on the neighbouring water molecule.
            </desc>
            <defs>
                <radialGradient id="hydrogen-bonding-oxygen-gradient" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stop-color="#fee2e2"></stop>
                    <stop offset="100%" stop-color="#ef4444"></stop>
                </radialGradient>
                <radialGradient id="hydrogen-bonding-hydrogen-gradient" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stop-color="#ffffff"></stop>
                    <stop offset="100%" stop-color="#e2e8f0"></stop>
                </radialGradient>
            </defs>
            <rect class="hydrogen-bonding-background" x="0" y="0" width="900" height="430"></rect>
            ${createWaterMolecule({
                key: "acceptor",
                oxygen: { x: 340, y: 220 },
                hydrogens: [
                    { x: 236, y: 158 },
                    { x: 236, y: 282 },
                ],
                lonePairs: [
                    { x1: 389, y1: 210, x2: 389, y2: 230, active: true },
                    { x1: 369, y1: 174, x2: 386, y2: 186 },
                ],
            })}
            ${createWaterMolecule({
                key: "donor",
                oxygen: { x: 648, y: 220 },
                hydrogens: [
                    { x: 534, y: 220, active: true },
                    { x: 685, y: 324 },
                ],
                lonePairs: [
                    { x1: 650, y1: 166, x2: 673, y2: 171 },
                    { x1: 700, y1: 219, x2: 700, y2: 241 },
                ],
            })}
            <g class="hydrogen-bonding-intermolecular" aria-hidden="true">
                <line x1="407" y1="220" x2="497" y2="220"></line>
            </g>
        </svg>
    `;
}

function createWaterMolecule({ key, oxygen, hydrogens, lonePairs }) {
    return `
        <g class="hydrogen-bonding-water hydrogen-bonding-water--${key}">
            ${hydrogens.map((hydrogen) => createOhBond(oxygen, hydrogen)).join("")}
            ${hydrogens.map((hydrogen, index) => createHydrogenAtom(hydrogen, `${key}-${index}`)).join("")}
            ${createOxygenAtom(oxygen)}
            ${lonePairs.map((pair) => createLonePair(pair)).join("")}
        </g>
    `;
}

function createOhBond(oxygen, hydrogen) {
    const bond = shortenLine(hydrogen.x, hydrogen.y, oxygen.x, oxygen.y, 31, 40);

    return `
        <line class="hydrogen-bonding-covalent-bond" x1="${bond.x1}" y1="${bond.y1}" x2="${bond.x2}" y2="${bond.y2}"></line>
    `;
}

function createHydrogenAtom(hydrogen, id) {
    const activeClass = hydrogen.active ? " hydrogen-bonding-hydrogen--active" : "";

    return `
        <g class="hydrogen-bonding-hydrogen${activeClass}" id="hydrogen-bonding-h-${id}">
            <circle class="hydrogen-bonding-hydrogen-halo" cx="${hydrogen.x}" cy="${hydrogen.y}" r="33"></circle>
            <circle class="hydrogen-bonding-atom hydrogen-bonding-atom--hydrogen" cx="${hydrogen.x}" cy="${hydrogen.y}" r="28"></circle>
            <text class="hydrogen-bonding-atom-label" x="${hydrogen.x}" y="${hydrogen.y + 7}">H</text>
            <text class="hydrogen-bonding-charge hydrogen-bonding-charge--positive" x="${hydrogen.x}" y="${hydrogen.y - 43}">&delta;+</text>
        </g>
    `;
}

function createOxygenAtom(oxygen) {
    return `
        <g class="hydrogen-bonding-oxygen">
            <circle class="hydrogen-bonding-atom hydrogen-bonding-atom--oxygen" cx="${oxygen.x}" cy="${oxygen.y}" r="42"></circle>
            <text class="hydrogen-bonding-atom-label" x="${oxygen.x}" y="${oxygen.y + 8}">O</text>
            <text class="hydrogen-bonding-charge hydrogen-bonding-charge--negative" x="${oxygen.x}" y="${oxygen.y - 58}">&delta;-</text>
        </g>
    `;
}

function createLonePair(pair) {
    const activeClass = pair.active ? " hydrogen-bonding-lone-pair--active" : "";

    return `
        <g class="hydrogen-bonding-lone-pair${activeClass}" aria-hidden="true">
            <circle cx="${pair.x1}" cy="${pair.y1}" r="6"></circle>
            <circle cx="${pair.x2}" cy="${pair.y2}" r="6"></circle>
        </g>
    `;
}

function shortenLine(x1, y1, x2, y2, startInset, endInset) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;

    return {
        x1: toFixed(x1 + ux * startInset),
        y1: toFixed(y1 + uy * startInset),
        x2: toFixed(x2 - ux * endInset),
        y2: toFixed(y2 - uy * endInset),
    };
}

function toFixed(value) {
    return Number(value).toFixed(1);
}

function injectHydrogenBondingStyles() {
    if (document.getElementById("hydrogen-bonding-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "hydrogen-bonding-styles";
    style.textContent = `
        .hydrogen-bonding-component {
            width: 100%;
            max-width: 940px;
            margin: 1.25rem 0;
        }

        .hydrogen-bonding-stage {
            overflow: hidden;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            background: #ffffff;
        }

        .hydrogen-bonding-svg {
            display: block;
            width: 100%;
            height: auto;
            min-height: 280px;
            background: #ffffff;
        }

        .hydrogen-bonding-background {
            fill: #ffffff;
        }

        .hydrogen-bonding-water {
            transform-box: fill-box;
            transform-origin: center;
        }

        .hydrogen-bonding-water--acceptor {
            animation: hydrogen-bonding-acceptor-align 1900ms ease-in-out infinite alternate;
        }

        .hydrogen-bonding-water--donor {
            animation: hydrogen-bonding-donor-align 1900ms ease-in-out infinite alternate;
        }

        .hydrogen-bonding-covalent-bond {
            stroke: #64748b;
            stroke-linecap: round;
            stroke-width: 7;
        }

        .hydrogen-bonding-atom {
            stroke: #111827;
            stroke-width: 2.2;
        }

        .hydrogen-bonding-atom--oxygen {
            fill: url(#hydrogen-bonding-oxygen-gradient);
        }

        .hydrogen-bonding-atom--hydrogen {
            fill: url(#hydrogen-bonding-hydrogen-gradient);
        }

        .hydrogen-bonding-atom-label {
            fill: #111827;
            font: 900 24px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .hydrogen-bonding-charge {
            font: 900 28px Georgia, "Times New Roman", serif;
            text-anchor: middle;
        }

        .hydrogen-bonding-charge--positive {
            fill: #dc2626;
        }

        .hydrogen-bonding-charge--negative {
            fill: #1d4ed8;
        }

        .hydrogen-bonding-hydrogen-halo {
            fill: #fee2e2;
            opacity: 0;
            transform-box: fill-box;
            transform-origin: center;
        }

        .hydrogen-bonding-hydrogen--active .hydrogen-bonding-hydrogen-halo {
            opacity: 0.92;
            animation: hydrogen-bonding-halo-pulse 1150ms ease-in-out infinite alternate;
        }

        .hydrogen-bonding-hydrogen--active .hydrogen-bonding-charge--positive {
            font-size: 34px;
        }

        .hydrogen-bonding-lone-pair circle {
            fill: #1d4ed8;
            stroke: #eff6ff;
            stroke-width: 2;
            transform-box: fill-box;
            transform-origin: center;
        }

        .hydrogen-bonding-lone-pair--active circle {
            animation: hydrogen-bonding-lone-pair-pulse 1150ms ease-in-out infinite alternate;
        }

        .hydrogen-bonding-intermolecular line {
            stroke: #7c3aed;
            stroke-dasharray: 8 9;
            stroke-linecap: round;
            stroke-width: 4.2;
            animation: hydrogen-bonding-dash 950ms linear infinite;
        }

        @keyframes hydrogen-bonding-acceptor-align {
            to {
                transform: translateX(3px);
            }
        }

        @keyframes hydrogen-bonding-donor-align {
            to {
                transform: translateX(-3px);
            }
        }

        @keyframes hydrogen-bonding-halo-pulse {
            to {
                opacity: 0.5;
                transform: scale(1.08);
            }
        }

        @keyframes hydrogen-bonding-lone-pair-pulse {
            to {
                transform: scale(1.18);
            }
        }

        @keyframes hydrogen-bonding-dash {
            to {
                stroke-dashoffset: -17;
            }
        }

        @media (max-width: 640px) {
            .hydrogen-bonding-svg {
                min-height: 250px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .hydrogen-bonding-water--acceptor,
            .hydrogen-bonding-water--donor,
            .hydrogen-bonding-hydrogen--active .hydrogen-bonding-hydrogen-halo,
            .hydrogen-bonding-lone-pair--active circle,
            .hydrogen-bonding-intermolecular line {
                animation: none;
            }
        }
    `;

    document.head.appendChild(style);
}
