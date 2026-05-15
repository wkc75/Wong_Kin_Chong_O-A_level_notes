const molecularNetPolarityExamples = {
    co2: {
        label: "CO2",
        result: "Non-polar molecule: the two equal C=O bond dipoles cancel.",
        svg: createNetCO2Svg,
    },
    h2o: {
        label: "H2O",
        result: "Polar molecule: the O-H bond dipoles do not cancel because the molecule is bent.",
        svg: createNetH2OSvg,
    },
    ch4: {
        label: "CH4",
        result: "Non-polar molecule: the four C-H bond dipoles cancel in the tetrahedral shape.",
        svg: createNetCH4Svg,
    },
};

function initMolecularNetPolarity() {
    const container = document.getElementById("molecular-net-polarity-viewer");

    if (!container || container.dataset.molecularNetPolarityReady === "true") {
        return;
    }

    container.dataset.molecularNetPolarityReady = "true";
    injectMolecularNetPolarityStyles();

    let selectedMolecule = "co2";

    container.classList.add("molecular-net-polarity-component");
    container.innerHTML = `
        <div class="molecular-net-polarity-toolbar" role="group" aria-label="Molecular polarity examples">
            ${Object.entries(molecularNetPolarityExamples)
                .map(([key, molecule]) => `
                    <button class="molecular-net-polarity-button" type="button" data-molecule="${key}" aria-pressed="false">
                        ${molecule.label}
                    </button>
                `)
                .join("")}
        </div>
        <div class="molecular-net-polarity-stage"></div>
    `;

    const buttons = Array.from(container.querySelectorAll(".molecular-net-polarity-button"));
    const stage = container.querySelector(".molecular-net-polarity-stage");

    function render() {
        const molecule = molecularNetPolarityExamples[selectedMolecule];

        stage.innerHTML = `
            ${molecule.svg()}
            <div class="molecular-net-polarity-caption">
                <strong>${molecule.label}</strong>
                <span>${molecule.result}</span>
            </div>
        `;

        buttons.forEach((button) => {
            const isActive = button.dataset.molecule === selectedMolecule;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    container.addEventListener("click", (event) => {
        const button = event.target.closest(".molecular-net-polarity-button");

        if (!button) {
            return;
        }

        selectedMolecule = button.dataset.molecule;
        render();
    });

    render();
}

function createNetBaseSvg(content, label) {
    return `
        <svg class="molecular-net-polarity-svg" viewBox="0 0 760 380" role="img" aria-label="${label}">
            <defs>
                <marker id="molecular-net-polarity-dipole-head" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z"></path>
                </marker>
                <marker id="molecular-net-polarity-net-head" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z"></path>
                </marker>
            </defs>
            <rect class="molecular-net-polarity-bg" x="0" y="0" width="760" height="380"></rect>
            ${content}
        </svg>
    `;
}

function createNetCO2Svg() {
    return createNetBaseSvg(`
        ${netPartialCharge("&delta;-", 210, 75)}
        ${netPartialCharge("&delta;+", 380, 75)}
        ${netPartialCharge("&delta;-", 550, 75)}
        ${netAtom("O", 210, 135)}
        ${netAtom("C", 380, 135)}
        ${netAtom("O", 550, 135)}
        ${netDoubleBond(250, 126, 340, 126, 12)}
        ${netDoubleBond(420, 126, 510, 126, 12)}
        ${netBondDipole(362, 215, 250, 215, true)}
        ${netBondDipole(398, 215, 510, 215, true)}
        <text class="molecular-net-polarity-note" x="380" y="275">net dipole = 0</text>
    `, "Carbon dioxide molecular polarity");
}

function createNetH2OSvg() {
    return createNetBaseSvg(`
        ${netPartialCharge("&delta;-", 380, 58)}
        ${netPartialCharge("&delta;+", 246, 263)}
        ${netPartialCharge("&delta;+", 514, 263)}
        ${netAtom("O", 380, 115)}
        ${netAtom("H", 270, 245)}
        ${netAtom("H", 490, 245)}
        ${netSingleBond(352, 140, 296, 210)}
        ${netSingleBond(408, 140, 464, 210)}
        ${netBondDipole(250, 188, 320, 112, false)}
        ${netBondDipole(510, 188, 440, 112, false)}
        ${netDipole(380, 272, 380, 162, "net dipole")}
        <text class="molecular-net-polarity-note" x="380" y="325">bond dipoles do not cancel</text>
    `, "Water molecular polarity");
}

function createNetCH4Svg() {
    return createNetBaseSvg(`
        ${netPartialCharge("&delta;-", 330, 174)}
        ${netPartialCharge("&delta;+", 338, 58)}
        ${netPartialCharge("&delta;+", 205, 285)}
        ${netPartialCharge("&delta;+", 555, 285)}
        ${netPartialCharge("&delta;+", 428, 324)}
        ${netAtom("C", 380, 180)}
        ${netAtom("H", 380, 86)}
        ${netAtom("H", 250, 250)}
        ${netAtom("H", 510, 250)}
        ${netAtom("H", 380, 306)}
        ${netSingleBond(380, 152, 380, 111)}
        ${netSingleBond(352, 194, 278, 235)}
        ${netSingleBond(408, 194, 482, 235)}
        ${netSingleBond(380, 208, 380, 278)}
        ${netBondDipole(420, 104, 420, 148, false)}
        ${netBondDipole(266, 204, 334, 166, false)}
        ${netBondDipole(494, 204, 426, 166, false)}
        ${netBondDipole(420, 280, 420, 214, false)}
        <text class="molecular-net-polarity-note" x="380" y="360">net dipole = 0</text>
    `, "Methane molecular polarity");
}

function netAtom(symbol, x, y) {
    return `<text class="molecular-net-polarity-atom" x="${x}" y="${y}">${symbol}</text>`;
}

function netPartialCharge(label, x, y) {
    return `<text class="molecular-net-polarity-charge" x="${x}" y="${y}">${label}</text>`;
}

function netSingleBond(x1, y1, x2, y2) {
    return `<line class="molecular-net-polarity-bond" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>`;
}

function netDoubleBond(x1, y1, x2, y2, gap) {
    return `
        <line class="molecular-net-polarity-bond" x1="${x1}" y1="${y1 - gap / 2}" x2="${x2}" y2="${y2 - gap / 2}"></line>
        <line class="molecular-net-polarity-bond" x1="${x1}" y1="${y1 + gap / 2}" x2="${x2}" y2="${y2 + gap / 2}"></line>
    `;
}

function netBondDipole(x1, y1, x2, y2, showLabel) {
    const label = showLabel ? `<text x="${(x1 + x2) / 2}" y="${y1 + 32}">bond dipole</text>` : "";

    return `
        <g class="molecular-net-polarity-bond-dipole">
            <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>
            ${netDipoleTailBar(x1, y1, x2, y2, "molecular-net-polarity-bond-tail")}
            ${label}
        </g>
    `;
}

function netDipole(x1, y1, x2, y2, label) {
    return `
        <g class="molecular-net-polarity-net-dipole">
            <line class="molecular-net-polarity-net-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>
            ${netDipoleTailBar(x1, y1, x2, y2, "molecular-net-polarity-net-tail", 0.04)}
            <text x="${x2 + 24}" y="${(y1 + y2) / 2 + 6}">${label}</text>
        </g>
    `;
}

function netDipoleTailBar(x1, y1, x2, y2, className, fraction = 0.18) {
    const size = 12;
    const center = getPointAlongLine(x1, y1, x2, y2, fraction);
    const angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
    const offsetX = Math.cos(angle) * size;
    const offsetY = Math.sin(angle) * size;

    return `<line class="${className}" x1="${(center.x - offsetX).toFixed(2)}" y1="${(center.y - offsetY).toFixed(2)}" x2="${(center.x + offsetX).toFixed(2)}" y2="${(center.y + offsetY).toFixed(2)}"></line>`;
}

function getPointAlongLine(x1, y1, x2, y2, fraction) {
    return {
        x: x1 + (x2 - x1) * fraction,
        y: y1 + (y2 - y1) * fraction,
    };
}

function injectMolecularNetPolarityStyles() {
    if (document.getElementById("molecular-net-polarity-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "molecular-net-polarity-styles";
    style.textContent = `
        .molecular-net-polarity-component {
            width: 100%;
            max-width: 900px;
            margin: 1.25rem 0;
        }

        .molecular-net-polarity-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }

        .molecular-net-polarity-button {
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.92rem Roboto, Arial, sans-serif;
            min-width: 4.8rem;
            padding: 0.45rem 0.75rem;
        }

        .molecular-net-polarity-button:hover,
        .molecular-net-polarity-button.is-active {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .molecular-net-polarity-stage {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .molecular-net-polarity-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .molecular-net-polarity-bg {
            fill: #ffffff;
        }

        .molecular-net-polarity-atom {
            fill: #111827;
            font: 500 42px Georgia, "Times New Roman", serif;
            text-anchor: middle;
            dominant-baseline: middle;
        }

        .molecular-net-polarity-charge {
            fill: #111827;
            font: 500 22px Georgia, "Times New Roman", serif;
            text-anchor: middle;
        }

        .molecular-net-polarity-bond {
            stroke: #111827;
            stroke-linecap: round;
            stroke-width: 3;
        }

        .molecular-net-polarity-bond-dipole line:first-child {
            marker-end: url(#molecular-net-polarity-dipole-head);
            stroke: #2563eb;
            stroke-linecap: round;
            stroke-width: 2.4;
        }

        .molecular-net-polarity-net-line {
            marker-end: url(#molecular-net-polarity-net-head);
            stroke: #dc2626;
            stroke-linecap: round;
            stroke-width: 3;
        }

        .molecular-net-polarity-bond-dipole text,
        .molecular-net-polarity-net-dipole text,
        .molecular-net-polarity-note {
            fill: #111827;
            paint-order: stroke;
            stroke: #ffffff;
            stroke-linejoin: round;
            stroke-width: 5;
            font: 700 15px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .molecular-net-polarity-net-dipole text {
            text-anchor: start;
        }

        .molecular-net-polarity-bond-tail {
            stroke: #2563eb;
            stroke-linecap: round;
            stroke-width: 2.4;
        }

        .molecular-net-polarity-net-tail {
            marker-end: none;
            stroke: #dc2626;
            stroke-linecap: round;
            stroke-width: 3;
        }

        .molecular-net-polarity-net-dipole text {
            fill: #dc2626;
        }

        .molecular-net-polarity-caption {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem 1rem;
            justify-content: center;
            border-top: 1px solid #dde3ea;
            background: #f8fafc;
            color: #111827;
            padding: 0.7rem;
            text-align: center;
        }

        .molecular-net-polarity-caption strong,
        .molecular-net-polarity-caption span {
            font-size: 0.95rem;
        }

        #molecular-net-polarity-dipole-head path {
            fill: #2563eb;
        }

        #molecular-net-polarity-net-head path {
            fill: #dc2626;
        }
    `;

    document.head.appendChild(style);
}

if (window.document$?.subscribe) {
    window.document$.subscribe(initMolecularNetPolarity);
} else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMolecularNetPolarity);
} else {
    initMolecularNetPolarity();
}
