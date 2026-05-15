const ionicDotCrossContainer = document.getElementById("ionic-dot-cross-viewer");

if (ionicDotCrossContainer) {
    const compounds = {
        NaCl: {
            label: "NaCl",
            ions: [
                { type: "cation", symbol: "Na", charge: "+" },
                { type: "anion", symbol: "Cl", charge: "-", dots: 7, crosses: 1 },
            ],
        },
        MgCl2: {
            label: "MgCl2",
            ions: [
                { type: "cation", symbol: "Mg", charge: "2+" },
                { type: "anion", symbol: "Cl", charge: "-", dots: 7, crosses: 1, coefficient: 2 },
            ],
        },
        Al2O3: {
            label: "Al2O3",
            ions: [
                { type: "cation", symbol: "Al", charge: "3+", coefficient: 2 },
                { type: "anion", symbol: "O", charge: "2-", dots: 6, crosses: 2, coefficient: 3 },
            ],
        },
    };

    let selectedCompound = "NaCl";

    injectIonicDotCrossStyles();
    ionicDotCrossContainer.classList.add("ionic-dot-cross-component");
    ionicDotCrossContainer.innerHTML = `
        <div class="ionic-dot-cross-toolbar">
            ${Object.entries(compounds).map(([key, compound], index) => `
                <button class="ionic-dot-cross-button ${index === 0 ? "is-active" : ""}" type="button" data-compound="${key}" aria-pressed="${index === 0 ? "true" : "false"}">
                    ${compound.label}
                </button>
            `).join("")}
        </div>
        <div class="ionic-dot-cross-stage"></div>
    `;

    const buttons = [...ionicDotCrossContainer.querySelectorAll("[data-compound]")];
    const stage = ionicDotCrossContainer.querySelector(".ionic-dot-cross-stage");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedCompound = button.dataset.compound;
            render();
        });
    });

    function render() {
        stage.innerHTML = createIonicDotCrossSvg(compounds[selectedCompound]);

        buttons.forEach((button) => {
            const isActive = button.dataset.compound === selectedCompound;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    render();
}

function createIonicDotCrossSvg(compound) {
    const viewBoxWidth = 960;
    const viewBoxHeight = 250;
    const gap = 230;
    const startX = (viewBoxWidth - (compound.ions.length - 1) * gap) / 2;
    const y = 128;

    return `
        <svg class="ionic-dot-cross-svg" viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" role="img" aria-label="Dot and cross diagram for ${compound.label}">
            <rect class="ionic-dot-cross-bg" x="0" y="0" width="${viewBoxWidth}" height="${viewBoxHeight}"></rect>
            ${compound.ions.map((ion, index) => createIonSvg(ion, startX + index * gap, y)).join("")}
        </svg>
    `;
}

function createIonSvg(ion, x, y) {
    const bracketWidth = ion.type === "anion" ? 145 : 125;
    const bracketHeight = ion.type === "anion" ? 150 : 130;
    const top = y - bracketHeight / 2;
    const bottom = y + bracketHeight / 2;
    const left = x - bracketWidth / 2;
    const right = x + bracketWidth / 2;
    const symbolSize = ion.symbol.length > 1 ? 42 : 48;

    return `
        <g class="ionic-dot-cross-ion">
            ${createBracket(left, top, bottom, "left")}
            ${createBracket(right, top, bottom, "right")}
            ${ion.coefficient > 1 ? `<text class="ionic-dot-cross-coefficient" x="${left - 32}" y="${y + 15}">${ion.coefficient}</text>` : ""}
            <text class="ionic-dot-cross-symbol" x="${x}" y="${y + 16}" font-size="${symbolSize}">${ion.symbol}</text>
            ${ion.type === "anion" ? createElectronMarks(ion, x, y) : ""}
            <text class="ionic-dot-cross-charge" x="${right + 18}" y="${top + 14}">${ion.charge}</text>
        </g>
    `;
}

function createBracket(x, top, bottom, side) {
    const tick = side === "left" ? 11 : -11;

    return `
        <path class="ionic-dot-cross-bracket" d="
            M ${x + tick} ${top}
            L ${x} ${top}
            L ${x} ${bottom}
            L ${x + tick} ${bottom}
        "></path>
    `;
}

function createElectronMarks(ion, x, y) {
    const dotPositions = getDotPositions(ion.symbol).slice(0, ion.dots);
    const crossPositions = getCrossPositions(ion.symbol).slice(0, ion.crosses);

    return `
        ${dotPositions.map(([dx, dy]) => `<circle class="ionic-dot-cross-dot" cx="${x + dx}" cy="${y + dy}" r="4"></circle>`).join("")}
        ${crossPositions.map(([dx, dy]) => `
            <text class="ionic-dot-cross-cross" x="${x + dx}" y="${y + dy}">x</text>
        `).join("")}
    `;
}

function getDotPositions(symbol) {
    if (symbol === "O") {
        return [
            [-22, -47],
            [22, -47],
            [51, -14],
            [51, 24],
            [-22, 51],
            [-51, 14],
        ];
    }

    return [
        [-34, -47],
        [0, -52],
        [34, -47],
        [52, -16],
        [52, 22],
        [26, 51],
        [-26, 51],
    ];
}

function getCrossPositions(symbol) {
    if (symbol === "O") {
        return [
            [-51, -21],
            [24, 51],
        ];
    }

    return [[-52, 14]];
}

function injectIonicDotCrossStyles() {
    if (document.getElementById("ionic-dot-cross-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "ionic-dot-cross-styles";
    style.textContent = `
        .ionic-dot-cross-component {
            width: 100%;
            max-width: 960px;
            margin: 1.25rem 0;
        }

        .ionic-dot-cross-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
            margin-bottom: 0.75rem;
        }

        .ionic-dot-cross-button {
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            min-width: 5.5rem;
            padding: 0.45rem 0.75rem;
        }

        .ionic-dot-cross-button:hover,
        .ionic-dot-cross-button.is-active {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .ionic-dot-cross-stage {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .ionic-dot-cross-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .ionic-dot-cross-bg {
            fill: #ffffff;
        }

        .ionic-dot-cross-bracket {
            fill: none;
            stroke: #111827;
            stroke-linecap: square;
            stroke-width: 2.2;
        }

        .ionic-dot-cross-symbol,
        .ionic-dot-cross-coefficient,
        .ionic-dot-cross-charge,
        .ionic-dot-cross-cross {
            fill: #111827;
            font-family: Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .ionic-dot-cross-symbol {
            font-weight: 500;
        }

        .ionic-dot-cross-coefficient {
            font-size: 32px;
            font-weight: 700;
        }

        .ionic-dot-cross-charge {
            font-size: 25px;
            font-weight: 700;
        }

        .ionic-dot-cross-dot {
            fill: #111827;
        }

        .ionic-dot-cross-cross {
            font-size: 22px;
            font-weight: 800;
            dominant-baseline: middle;
        }
    `;

    document.head.appendChild(style);
}
