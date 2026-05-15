const metallicLatticeContainer = document.getElementById("metallic-lattice-viewer");

if (metallicLatticeContainer) {
    const metals = {
        sodium: {
            button: "Na",
            symbol: "Na",
            charge: "+",
            electronsPerIon: 1,
        },
        magnesium: {
            button: "Mg",
            symbol: "Mg",
            charge: "2+",
            electronsPerIon: 2,
        },
        aluminium: {
            button: "Al",
            symbol: "Al",
            charge: "3+",
            electronsPerIon: 3,
        },
    };

    const ionPositions = [
        { x: 105, y: 92 },
        { x: 240, y: 92 },
        { x: 375, y: 92 },
        { x: 105, y: 210 },
        { x: 240, y: 210 },
        { x: 375, y: 210 },
        { x: 105, y: 328 },
        { x: 240, y: 328 },
        { x: 375, y: 328 },
    ];

    injectMetallicLatticeStyles();

    metallicLatticeContainer.classList.add("metallic-lattice-component");
    metallicLatticeContainer.innerHTML = `
        <div class="metallic-lattice-controls" aria-label="Choose metal">
            ${Object.entries(metals).map(([key, metal], index) => `
                <button class="metallic-lattice-button" type="button" data-metal="${key}" aria-pressed="${index === 0 ? "true" : "false"}">
                    ${metal.button}
                </button>
            `).join("")}
        </div>
        <div class="metallic-lattice-stage"></div>
    `;

    const stage = metallicLatticeContainer.querySelector(".metallic-lattice-stage");
    const buttons = [...metallicLatticeContainer.querySelectorAll(".metallic-lattice-button")];

    function render(selectedKey) {
        const metal = metals[selectedKey];
        const electrons = createElectronPositions(ionPositions, metal.electronsPerIon);

        stage.innerHTML = createMetallicLatticeSvg(metal, ionPositions, electrons);
        buttons.forEach((button) => {
            const isSelected = button.dataset.metal === selectedKey;
            button.classList.toggle("is-active", isSelected);
            button.setAttribute("aria-pressed", String(isSelected));
        });
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => render(button.dataset.metal));
    });

    render("sodium");
}

function createElectronPositions(ionPositions, electronsPerIon) {
    const offsets = [
        { x: -38, y: -48 },
        { x: 0, y: -58 },
        { x: 38, y: -48 },
    ];

    return ionPositions.flatMap((ionPosition) => offsets.slice(0, electronsPerIon).map((offset) => ({
        x: ionPosition.x + offset.x,
        y: ionPosition.y + offset.y,
    })));
}

function createMetallicLatticeSvg(metal, ionPositions, electrons) {
    return `
        <svg class="metallic-lattice-svg" viewBox="0 0 480 410" role="img" aria-label="${metal.symbol} metallic lattice with ${metal.electronsPerIon} delocalised electrons per ion">
            <rect class="metallic-lattice-background" x="0" y="0" width="480" height="410"></rect>
            <g class="metallic-lattice-ions">
                ${ionPositions.map((position) => createIon(position, metal)).join("")}
            </g>
            <g class="metallic-lattice-electrons">
                ${electrons.map((electron, index) => createElectron(electron, index)).join("")}
            </g>
        </svg>
    `;
}

function createIon(position, metal) {
    const chargeDy = metal.charge.length > 1 ? -10 : -9;

    return `
        <g class="metallic-lattice-ion" transform="translate(${position.x} ${position.y})">
            <circle cx="0" cy="0" r="42"></circle>
            <text class="metallic-lattice-ion-symbol" x="-9" y="9">${metal.symbol}</text>
            <text class="metallic-lattice-ion-charge" x="18" y="${chargeDy}">${metal.charge}</text>
        </g>
    `;
}

function createElectron(position, index) {
    return `
        <g class="metallic-lattice-electron" transform="translate(${position.x} ${position.y})" style="--delay:${index * 22}ms">
            <text x="0" y="5">e</text>
            <text class="metallic-lattice-electron-charge" x="10" y="-8">-</text>
        </g>
    `;
}

function injectMetallicLatticeStyles() {
    if (document.getElementById("metallic-lattice-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "metallic-lattice-styles";
    style.textContent = `
        .metallic-lattice-component {
            width: 100%;
            max-width: 760px;
            margin: 1.25rem 0;
        }

        .metallic-lattice-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }

        .metallic-lattice-button {
            min-width: 4.5rem;
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            padding: 0.45rem 0.8rem;
        }

        .metallic-lattice-button:hover,
        .metallic-lattice-button.is-active {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .metallic-lattice-stage {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .metallic-lattice-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .metallic-lattice-background {
            fill: #ffffff;
        }

        .metallic-lattice-ion circle {
            fill: #ffffff;
            stroke: #111827;
            stroke-width: 3;
        }

        .metallic-lattice-ion-symbol,
        .metallic-lattice-ion-charge,
        .metallic-lattice-electron text {
            fill: #111827;
            font-family: Roboto, Arial, sans-serif;
            font-weight: 700;
            text-anchor: middle;
        }

        .metallic-lattice-ion-symbol {
            font-size: 28px;
        }

        .metallic-lattice-ion-charge {
            font-size: 18px;
        }

        .metallic-lattice-electron {
            animation: metallic-lattice-electron-enter 260ms ease both;
            animation-delay: var(--delay);
        }

        .metallic-lattice-electron text {
            fill: #000000;
            font-size: 25px;
        }

        .metallic-lattice-electron-charge {
            font-size: 16px;
        }

        @keyframes metallic-lattice-electron-enter {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;

    document.head.appendChild(style);
}
