const container = document.getElementById("orbital-energy-diagram");

if (container) {
    const subshells = [
        {
            id: "1s",
            label: "1s",
            x: 82,
            y: 355,
            orbitals: 1,
            electrons: 2,
            note: "1 s orbital; holds up to 2 electrons.",
        },
        {
            id: "2s",
            label: "2s",
            x: 82,
            y: 265,
            orbitals: 1,
            electrons: 2,
            note: "2 s orbital; filled after 1s.",
        },
        {
            id: "2p",
            label: "2p",
            x: 180,
            y: 232,
            orbitals: 3,
            electrons: 6,
            note: "Three degenerate p orbitals; holds up to 6 electrons.",
        },
        {
            id: "3s",
            label: "3s",
            x: 82,
            y: 195,
            orbitals: 1,
            electrons: 2,
            note: "3 s orbital; filled before 3p.",
        },
        {
            id: "3p",
            label: "3p",
            x: 180,
            y: 165,
            orbitals: 3,
            electrons: 6,
            note: "Three degenerate 3p orbitals; filled after 3s.",
        },
        {
            id: "4s",
            label: "4s",
            x: 82,
            y: 135,
            orbitals: 1,
            electrons: 2,
            note: "4s is lower in energy than 3d for neutral atoms.",
        },
        {
            id: "3d",
            label: "3d",
            x: 390,
            y: 120,
            orbitals: 5,
            electrons: 10,
            note: "Five degenerate 3d orbitals; filled after 4s.",
        },
        {
            id: "4p",
            label: "4p",
            x: 180,
            y: 104,
            orbitals: 3,
            electrons: 6,
            note: "Three degenerate 4p orbitals; filled after 3d.",
        },
    ];

    injectStyles();

    container.classList.add("orbital-energy-component");
    container.innerHTML = `
        <div class="orbital-energy-canvas" aria-label="Interactive orbital energy diagram">
            ${createDiagram(subshells)}
        </div>
        <div class="orbital-energy-readout" aria-live="polite">
            Select a subshell to see its orbital capacity.
        </div>
    `;

    const readout = container.querySelector(".orbital-energy-readout");
    const groups = [...container.querySelectorAll(".orbital-energy-subshell")];

    groups.forEach((group) => {
        group.addEventListener("click", () => {
            selectSubshell(group);
        });

        group.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            event.preventDefault();
            selectSubshell(group);
        });
    });

    function selectSubshell(group) {
        const selected = subshells.find((subshell) => subshell.id === group.dataset.subshell);

        groups.forEach((item) => {
            item.classList.toggle("is-active", item === group);
        });

        readout.textContent = `${selected.label}: ${selected.note}`;
    }
}

function createDiagram(subshells) {
    const groups = subshells.map(createSubshellGroup).join("");

    return `
        <svg viewBox="0 0 720 420" role="img" aria-labelledby="orbital-energy-title orbital-energy-desc">
            <title id="orbital-energy-title">Orbital energy diagram</title>
            <desc id="orbital-energy-desc">Energy-level ordering of 1s, 2s, 2p, 3s, 3p, 4s, 3d and 4p subshells.</desc>
            <line class="orbital-energy-axis" x1="48" y1="388" x2="48" y2="28"></line>
            <polygon class="orbital-energy-arrow" points="48,20 42,35 54,35"></polygon>
            <text class="orbital-energy-axis-label" x="24" y="14">Energy</text>
            ${groups}
        </svg>
    `;
}

function createSubshellGroup(subshell) {
    const lineWidth = 50;
    const gap = 10;
    const labelX = subshell.x + ((subshell.orbitals - 1) * (lineWidth + gap)) / 2 + lineWidth / 2;
    const labelY = subshell.y - 13;
    const lines = Array.from({ length: subshell.orbitals }, (_, index) => {
        const x1 = subshell.x + index * (lineWidth + gap);
        const x2 = x1 + lineWidth;

        return `<line class="orbital-energy-level" x1="${x1}" y1="${subshell.y}" x2="${x2}" y2="${subshell.y}"></line>`;
    }).join("");

    return `
        <g class="orbital-energy-subshell" data-subshell="${subshell.id}" tabindex="0" role="button" aria-label="${subshell.label}: ${subshell.note}">
            <text class="orbital-energy-label" x="${labelX}" y="${labelY}">${subshell.label}</text>
            ${lines}
            <title>${subshell.label}: ${subshell.orbitals} orbital${subshell.orbitals === 1 ? "" : "s"}, ${subshell.electrons} electrons maximum</title>
        </g>
    `;
}

function injectStyles() {
    if (document.getElementById("orbital-energy-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "orbital-energy-styles";
    style.textContent = `
        .orbital-energy-component {
            width: 100%;
            max-width: 760px;
            margin: 1.25rem 0;
        }

        .orbital-energy-canvas {
            width: 100%;
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .orbital-energy-canvas svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .orbital-energy-axis,
        .orbital-energy-level {
            stroke: #111827;
            stroke-linecap: square;
        }

        .orbital-energy-axis {
            stroke-width: 1.6;
        }

        .orbital-energy-arrow {
            fill: #111827;
        }

        .orbital-energy-level {
            stroke-width: 2;
            transition: stroke 160ms ease, stroke-width 160ms ease;
        }

        .orbital-energy-axis-label,
        .orbital-energy-label {
            fill: #111827;
            font-family: Roboto, Arial, sans-serif;
            font-size: 15px;
        }

        .orbital-energy-label {
            text-anchor: middle;
            user-select: none;
        }

        .orbital-energy-subshell {
            cursor: pointer;
            outline: none;
        }

        .orbital-energy-subshell:hover .orbital-energy-level,
        .orbital-energy-subshell:focus-visible .orbital-energy-level,
        .orbital-energy-subshell.is-active .orbital-energy-level {
            stroke: #d71920;
            stroke-width: 3;
        }

        .orbital-energy-subshell:hover .orbital-energy-label,
        .orbital-energy-subshell:focus-visible .orbital-energy-label,
        .orbital-energy-subshell.is-active .orbital-energy-label {
            fill: #d71920;
            font-weight: 700;
        }

        .orbital-energy-readout {
            margin-top: 0.625rem;
            color: #1f2933;
            font-size: 0.9rem;
        }
    `;

    document.head.appendChild(style);
}
