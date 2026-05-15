const container = document.getElementById("oxygen-electron-allocation");

if (container) {
    const steps = [
        {
            label: "Step 1",
            remaining: 7,
            configuration: "1s1",
            electrons: {
                "1s": ["up"],
                "2s": [],
                "2p-x": [],
                "2p-y": [],
                "2p-z": [],
            },
            explanation: "Again we start with 1s, which only has 1 orbital. We allocate 1 electron to the 1s orbital first.",
        },
        {
            label: "Step 2",
            remaining: 6,
            configuration: "1s2",
            electrons: {
                "1s": ["up", "down"],
                "2s": [],
                "2p-x": [],
                "2p-y": [],
                "2p-z": [],
            },
            explanation: "Since the 1s orbital is singly occupied, we can pair the electrons. The second electron goes into the same 1s orbital.",
        },
        {
            label: "Step 3",
            remaining: 4,
            configuration: "1s2 2s2",
            electrons: {
                "1s": ["up", "down"],
                "2s": ["up", "down"],
                "2p-x": [],
                "2p-y": [],
                "2p-z": [],
            },
            explanation: "We still have 6 electrons to allocate. The next available subshell is 2s, which has 1 orbital, so we fill the 2s orbital.",
        },
        {
            label: "Step 4",
            remaining: 1,
            configuration: "1s2 2s2 2p3",
            electrons: {
                "1s": ["up", "down"],
                "2s": ["up", "down"],
                "2p-x": ["up"],
                "2p-y": ["up"],
                "2p-z": ["up"],
            },
            explanation: "Now we have 4 electrons. The next available subshell is 2p, which has 3 degenerate orbitals. Hund's Rule says to fill them singly first.",
        },
        {
            label: "Step 5",
            remaining: 0,
            configuration: "1s2 2s2 2p4",
            electrons: {
                "1s": ["up", "down"],
                "2s": ["up", "down"],
                "2p-x": ["up", "down"],
                "2p-y": ["up"],
                "2p-z": ["up"],
            },
            explanation: "Lastly, since all 2p orbitals are singly filled, we can pair the electrons. The final electron pairs in one of the 2p orbitals.",
        },
    ];

    const orbitals = [
        { id: "1s", label: "1s", x: 70, y: 116 },
        { id: "2s", label: "2s", x: 190, y: 116 },
        { id: "2p-x", label: "2p", x: 340, y: 116 },
        { id: "2p-y", label: "", x: 424, y: 116 },
        { id: "2p-z", label: "", x: 508, y: 116 },
    ];

    injectStyles();

    container.classList.add("oxygen-allocation-component");
    container.innerHTML = `
        <div class="oxygen-allocation-controls" aria-label="Choose electron allocation step">
            ${steps.map((step, index) => `
                <button
                    class="oxygen-allocation-step${index === 0 ? " is-active" : ""}"
                    type="button"
                    data-step="${index}"
                    aria-pressed="${index === 0 ? "true" : "false"}"
                >
                    ${step.label}
                </button>
            `).join("")}
        </div>
        <div class="oxygen-allocation-stage" aria-label="Oxygen electron allocation diagram">
            <svg viewBox="0 0 720 260" role="img" aria-labelledby="oxygen-allocation-title oxygen-allocation-desc">
                <title id="oxygen-allocation-title">Oxygen electron allocation</title>
                <desc id="oxygen-allocation-desc">Step-by-step filling of 1s, 2s and 2p orbitals for oxygen.</desc>
                <text class="oxygen-allocation-heading" x="40" y="34">Oxygen: 8 electrons</text>
                <text class="oxygen-allocation-remaining" x="40" y="62"></text>
                <text class="oxygen-allocation-config" x="430" y="62"></text>
                <g class="oxygen-allocation-orbitals"></g>
            </svg>
        </div>
        <div class="oxygen-allocation-explanation" aria-live="polite"></div>
    `;

    const stepButtons = [...container.querySelectorAll(".oxygen-allocation-step")];
    const orbitalsLayer = container.querySelector(".oxygen-allocation-orbitals");
    const remainingText = container.querySelector(".oxygen-allocation-remaining");
    const configText = container.querySelector(".oxygen-allocation-config");
    const explanation = container.querySelector(".oxygen-allocation-explanation");

    orbitalsLayer.innerHTML = orbitals.map(createOrbitalBox).join("");

    stepButtons.forEach((button) => {
        button.addEventListener("click", () => {
            renderStep(Number(button.dataset.step));
        });
    });

    renderStep(0);

    function renderStep(stepIndex) {
        const step = steps[stepIndex];

        stepButtons.forEach((button, index) => {
            const isActive = index === stepIndex;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        remainingText.textContent = `Electrons left: ${step.remaining}`;
        configText.textContent = `Configuration: ${step.configuration}`;
        explanation.textContent = step.explanation;

        orbitals.forEach((orbital) => {
            const electronLayer = orbitalsLayer.querySelector(`[data-electrons-for="${orbital.id}"]`);
            electronLayer.innerHTML = step.electrons[orbital.id]
                .map((spin, index) => createElectronArrow(orbital, spin, index))
                .join("");
        });
    }
}

function createOrbitalBox(orbital) {
    const boxSize = 54;
    const labelY = orbital.y - 16;

    return `
        <g class="oxygen-allocation-orbital" data-orbital="${orbital.id}">
            ${orbital.label ? `<text class="oxygen-allocation-label" x="${orbital.x + boxSize / 2}" y="${labelY}">${orbital.label}</text>` : ""}
            <rect class="oxygen-allocation-box" x="${orbital.x}" y="${orbital.y}" width="${boxSize}" height="${boxSize}" rx="4"></rect>
            <g data-electrons-for="${orbital.id}"></g>
        </g>
    `;
}

function createElectronArrow(orbital, spin, index) {
    const x = orbital.x + (index === 0 ? 21 : 33);
    const shaftTop = spin === "up" ? orbital.y + 14 : orbital.y + 40;
    const shaftBottom = spin === "up" ? orbital.y + 40 : orbital.y + 14;
    const head = spin === "up"
        ? `${x - 5},${shaftTop + 7} ${x},${shaftTop} ${x + 5},${shaftTop + 7}`
        : `${x - 5},${shaftTop - 7} ${x},${shaftTop} ${x + 5},${shaftTop - 7}`;

    return `
        <g class="oxygen-allocation-electron">
            <line x1="${x}" y1="${shaftTop}" x2="${x}" y2="${shaftBottom}"></line>
            <polygon points="${head}"></polygon>
        </g>
    `;
}

function injectStyles() {
    if (document.getElementById("oxygen-allocation-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "oxygen-allocation-styles";
    style.textContent = `
        .oxygen-allocation-component {
            width: 100%;
            max-width: 760px;
            margin: 1.25rem 0;
        }

        .oxygen-allocation-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.625rem;
        }

        .oxygen-allocation-step {
            border: 1px solid #c7ced6;
            border-radius: 6px;
            background: #ffffff;
            color: #1f2933;
            cursor: pointer;
            font: inherit;
            line-height: 1;
            padding: 0.55rem 0.75rem;
        }

        .oxygen-allocation-step:hover,
        .oxygen-allocation-step:focus-visible {
            border-color: #d71920;
            outline: none;
        }

        .oxygen-allocation-step.is-active {
            background: #d71920;
            border-color: #d71920;
            color: #ffffff;
        }

        .oxygen-allocation-stage {
            width: 100%;
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .oxygen-allocation-stage svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .oxygen-allocation-heading,
        .oxygen-allocation-remaining,
        .oxygen-allocation-config,
        .oxygen-allocation-label {
            fill: #111827;
            font-family: Roboto, Arial, sans-serif;
        }

        .oxygen-allocation-heading {
            font-size: 18px;
            font-weight: 700;
        }

        .oxygen-allocation-remaining,
        .oxygen-allocation-config {
            font-size: 14px;
        }

        .oxygen-allocation-label {
            font-size: 15px;
            font-weight: 700;
            text-anchor: middle;
        }

        .oxygen-allocation-box {
            fill: #ffffff;
            stroke: #111827;
            stroke-width: 2;
        }

        .oxygen-allocation-electron line {
            stroke: #d71920;
            stroke-width: 2.3;
            stroke-linecap: round;
        }

        .oxygen-allocation-electron polygon {
            fill: #d71920;
        }

        .oxygen-allocation-explanation {
            margin-top: 0.625rem;
            color: #1f2933;
            font-size: 0.95rem;
            line-height: 1.5;
        }
    `;

    document.head.appendChild(style);
}
