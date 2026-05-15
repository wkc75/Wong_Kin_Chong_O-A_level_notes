const molecularPolarityExamples = {
    cl2: {
        label: "Cl-Cl",
        type: "Non-polar bond",
        result: "No partial charges. No bond dipole.",
        svg: createCl2Svg,
    },
    o2: {
        label: "O=O",
        type: "Non-polar bond",
        result: "No partial charges. No bond dipole.",
        svg: createO2Svg,
    },
    hcl: {
        label: "H-Cl",
        type: "Polar bond",
        result: "Bond dipole points towards Cl.",
        svg: createHClSvg,
    },
    co: {
        label: "C=O",
        type: "Polar bond",
        result: "Bond dipole points towards O.",
        svg: createCOSvg,
    },
    co2: {
        label: "CO2",
        type: "Polar bonds",
        result: "Each C=O bond is polar because O is more electronegative than C.",
        svg: createCO2Svg,
    },
};

function initMolecularPolarity() {
    const container = document.getElementById("molecular-polarity-viewer");

    if (!container || container.dataset.molecularPolarityReady === "true") {
        return;
    }

    container.dataset.molecularPolarityReady = "true";
    injectMolecularPolarityStyles();

    let selectedExample = "cl2";

    container.classList.add("molecular-polarity-component");
    container.innerHTML = `
        <div class="molecular-polarity-toolbar" role="group" aria-label="Bond and molecule examples">
            ${Object.entries(molecularPolarityExamples)
                .map(([key, example]) => `
                    <button class="molecular-polarity-button" type="button" data-example="${key}" aria-pressed="false">
                        ${example.label}
                    </button>
                `)
                .join("")}
        </div>
        <div class="molecular-polarity-stage"></div>
    `;

    const buttons = Array.from(container.querySelectorAll(".molecular-polarity-button"));
    const stage = container.querySelector(".molecular-polarity-stage");

    function render() {
        const example = molecularPolarityExamples[selectedExample];

        stage.innerHTML = `
            ${example.svg()}
            <div class="molecular-polarity-caption">
                <strong>${example.type}</strong>
                <span>${example.result}</span>
            </div>
        `;

        buttons.forEach((button) => {
            const isActive = button.dataset.example === selectedExample;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    container.addEventListener("click", (event) => {
        const button = event.target.closest(".molecular-polarity-button");

        if (!button) {
            return;
        }

        selectedExample = button.dataset.example;
        render();
    });

    render();
}

function createBaseSvg(content, label) {
    return `
        <svg class="molecular-polarity-svg" viewBox="0 0 760 320" role="img" aria-label="${label}">
            <defs>
                <marker id="molecular-polarity-arrow" viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z"></path>
                </marker>
            </defs>
            <rect class="molecular-polarity-bg" x="0" y="0" width="760" height="320"></rect>
            ${content}
        </svg>
    `;
}

function createCl2Svg() {
    return createBaseSvg(`
        ${atomText("Cl", 300, 150)}
        ${atomText("Cl", 460, 150)}
        ${singleBond(334, 145, 426, 145)}
        ${noDipoleLabel(380, 235)}
    `, "Non-polar chlorine bond");
}

function createO2Svg() {
    return createBaseSvg(`
        ${atomText("O", 302, 150)}
        ${atomText("O", 458, 150)}
        ${doubleBond(337, 140, 423, 140, 0, 12)}
        ${noDipoleLabel(380, 235)}
    `, "Non-polar oxygen double bond");
}

function createHClSvg() {
    return createBaseSvg(`
        ${partialCharge("&delta;+", 291, 103)}
        ${partialCharge("&delta;-", 471, 103)}
        ${atomText("H", 300, 150)}
        ${atomText("Cl", 470, 150)}
        ${singleBond(328, 145, 436, 145)}
        ${dipoleArrow(305, 222, 462, 222, "Bond dipole")}
    `, "Polar hydrogen chloride bond");
}

function createCOSvg() {
    return createBaseSvg(`
        ${partialCharge("&delta;+", 301, 103)}
        ${partialCharge("&delta;-", 462, 103)}
        ${atomText("C", 310, 150)}
        ${atomText("O", 460, 150)}
        ${doubleBond(344, 140, 424, 140, 0, 12)}
        ${dipoleArrow(318, 222, 452, 222, "Bond dipole")}
    `, "Polar carbon oxygen double bond");
}

function createCO2Svg() {
    return createBaseSvg(`
        ${partialCharge("&delta;-", 204, 104)}
        ${partialCharge("&delta;+", 382, 104)}
        ${partialCharge("&delta;-", 552, 104)}
        ${atomText("O", 210, 150)}
        ${atomText("C", 380, 150)}
        ${atomText("O", 550, 150)}
        ${doubleBond(246, 140, 344, 140, 0, 12)}
        ${doubleBond(416, 140, 514, 140, 0, 12)}
        ${dipoleArrow(356, 230, 238, 230, "dipole")}
        ${dipoleArrow(404, 230, 522, 230, "dipole")}
    `, "Carbon dioxide with polar carbon oxygen bonds");
}

function atomText(symbol, x, y) {
    return `<text class="molecular-polarity-atom" x="${x}" y="${y}">${symbol}</text>`;
}

function partialCharge(label, x, y) {
    return `<text class="molecular-polarity-charge" x="${x}" y="${y}">${label}</text>`;
}

function singleBond(x1, y1, x2, y2) {
    return `<line class="molecular-polarity-bond" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>`;
}

function doubleBond(x1, y1, x2, y2, offsetX, offsetY) {
    return `
        <line class="molecular-polarity-bond" x1="${x1 + offsetX}" y1="${y1 - offsetY / 2}" x2="${x2 + offsetX}" y2="${y2 - offsetY / 2}"></line>
        <line class="molecular-polarity-bond" x1="${x1 - offsetX}" y1="${y1 + offsetY / 2}" x2="${x2 - offsetX}" y2="${y2 + offsetY / 2}"></line>
    `;
}

function dipoleArrow(x1, y1, x2, y2, label) {
    const plusX = x1 + (x2 >= x1 ? 12 : -12);
    const labelX = (x1 + x2) / 2;

    return `
        <g class="molecular-polarity-dipole">
            <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>
            <line class="molecular-polarity-plus" x1="${plusX}" y1="${y1 - 9}" x2="${plusX}" y2="${y1 + 9}"></line>
            <line class="molecular-polarity-plus" x1="${plusX - 9}" y1="${y1}" x2="${plusX + 9}" y2="${y1}"></line>
            <text x="${labelX}" y="${y1 + 32}">${label}</text>
        </g>
    `;
}

function noDipoleLabel(x, y) {
    return `<text class="molecular-polarity-net-label" x="${x}" y="${y}">no dipole</text>`;
}

function injectMolecularPolarityStyles() {
    if (document.getElementById("molecular-polarity-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "molecular-polarity-styles";
    style.textContent = `
        .molecular-polarity-component {
            width: 100%;
            max-width: 900px;
            margin: 1.25rem 0;
        }

        .molecular-polarity-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }

        .molecular-polarity-button {
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.92rem Roboto, Arial, sans-serif;
            min-width: 4.8rem;
            padding: 0.45rem 0.75rem;
        }

        .molecular-polarity-button:hover,
        .molecular-polarity-button.is-active {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .molecular-polarity-stage {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .molecular-polarity-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .molecular-polarity-bg {
            fill: #ffffff;
        }

        .molecular-polarity-atom {
            fill: #111827;
            font: 500 42px Georgia, "Times New Roman", serif;
            text-anchor: middle;
            dominant-baseline: middle;
        }

        .molecular-polarity-charge {
            fill: #111827;
            font: 500 24px Georgia, "Times New Roman", serif;
            text-anchor: middle;
        }

        .molecular-polarity-bond {
            stroke: #111827;
            stroke-linecap: round;
            stroke-width: 3;
        }

        .molecular-polarity-dipole line:first-child {
            marker-end: url(#molecular-polarity-arrow);
            stroke: #111827;
            stroke-linecap: round;
            stroke-width: 2.4;
        }

        .molecular-polarity-plus {
            stroke: #111827;
            stroke-linecap: round;
            stroke-width: 2.2;
        }

        .molecular-polarity-dipole text,
        .molecular-polarity-net-label {
            fill: #111827;
            font: 700 16px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .molecular-polarity-caption {
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

        .molecular-polarity-caption strong,
        .molecular-polarity-caption span {
            font-size: 0.95rem;
        }

        #molecular-polarity-arrow path {
            fill: #111827;
        }
    `;

    document.head.appendChild(style);
}

if (window.document$?.subscribe) {
    window.document$.subscribe(initMolecularPolarity);
} else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMolecularPolarity);
} else {
    initMolecularPolarity();
}
