const chargedParticleDeflectionContainer = document.getElementById("charged-particle-deflection");

if (chargedParticleDeflectionContainer) {
    const particles = [
        {
            key: "electron",
            label: "electron",
            deflection: -160,
            color: "#d71920",
            defaultVisible: true,
        },
        {
            key: "neutron",
            label: "neutron",
            deflection: 0,
            color: "#111827",
            defaultVisible: true,
        },
        {
            key: "proton",
            label: "proton",
            deflection: 72,
            color: "#2563eb",
            defaultVisible: true,
        },
        {
            key: "sodium",
            label: "Na+",
            deflection: 24,
            color: "#059669",
            defaultVisible: false,
        },
        {
            key: "oxide",
            label: "O2-",
            deflection: -56,
            color: "#ea580c",
            defaultVisible: false,
        },
    ];

    injectChargedParticleDeflectionStyles();

    chargedParticleDeflectionContainer.classList.add("charged-deflection-component");
    chargedParticleDeflectionContainer.innerHTML = `
        <div class="charged-deflection-controls" aria-label="Choose particle paths">
            ${particles.map((particle) => `
                <button class="charged-deflection-button" type="button" data-particle="${particle.key}" aria-pressed="${particle.defaultVisible ? "true" : "false"}">
                    ${particle.label}
                </button>
            `).join("")}
        </div>
        <div class="charged-deflection-stage"></div>
    `;

    const stage = chargedParticleDeflectionContainer.querySelector(".charged-deflection-stage");
    const buttons = [...chargedParticleDeflectionContainer.querySelectorAll(".charged-deflection-button")];
    const selected = new Set(particles.filter((particle) => particle.defaultVisible).map((particle) => particle.key));

    function render() {
        const visibleParticles = particles.filter((particle) => selected.has(particle.key));

        stage.innerHTML = createChargedDeflectionSvg(visibleParticles);
        buttons.forEach((button) => {
            const isSelected = selected.has(button.dataset.particle);
            button.classList.toggle("is-active", isSelected);
            button.setAttribute("aria-pressed", String(isSelected));
        });
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            if (selected.has(button.dataset.particle)) {
                selected.delete(button.dataset.particle);
            } else {
                selected.add(button.dataset.particle);
            }

            render();
        });
    });

    render();
}

function createChargedDeflectionSvg(particles) {
    return `
        <svg class="charged-deflection-svg" viewBox="0 0 760 420" role="img" aria-label="Deflection of charged particles passing through an electric field">
            <rect class="charged-deflection-background" x="0" y="0" width="760" height="420"></rect>
            <g class="charged-deflection-plates">
                <line x1="205" y1="90" x2="555" y2="90"></line>
                <line x1="380" y1="24" x2="380" y2="90"></line>
                <text x="214" y="73">+</text>
                <line x1="205" y1="330" x2="555" y2="330"></line>
                <line x1="380" y1="330" x2="380" y2="396"></line>
                <text x="214" y="362">-</text>
            </g>
            <g class="charged-deflection-axis">
                <line x1="40" y1="210" x2="700" y2="210"></line>
            </g>
            <g class="charged-deflection-paths">
                ${particles.map((particle, index) => createParticlePath(particle, index)).join("")}
            </g>
        </svg>
    `;
}

function createParticlePath(particle, index) {
    const startX = 50;
    const fieldStartX = 300;
    const exitX = 610;
    const deflection = particle.deflection;
    const labelX = 650;
    const centerY = 210;
    const labelY = centerY + deflection + getLabelOffset(index, deflection);
    const controlY = centerY;
    const exitY = centerY + deflection;

    return `
        <g class="charged-deflection-path" style="--path-color:${particle.color}; --delay:${index * 70}ms">
            <path d="M ${startX} ${centerY} L ${fieldStartX} ${centerY} Q ${(fieldStartX + exitX) / 2} ${controlY.toFixed(2)} ${exitX} ${exitY.toFixed(2)}"></path>
            <circle cx="${fieldStartX}" cy="${centerY}" r="4.8"></circle>
            <text class="charged-deflection-label" x="${labelX}" y="${labelY.toFixed(2)}">${particle.label}</text>
        </g>
    `;
}

function getLabelOffset(index, deflection) {
    if (deflection === 0) {
        return -10;
    }

    return deflection < 0 ? -6 - index * 2 : 16 + index * 2;
}

function injectChargedParticleDeflectionStyles() {
    if (document.getElementById("charged-deflection-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "charged-deflection-styles";
    style.textContent = `
        .charged-deflection-component {
            width: 100%;
            max-width: 920px;
            margin: 1.25rem 0;
        }

        .charged-deflection-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }

        .charged-deflection-button {
            min-width: 5rem;
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            padding: 0.45rem 0.8rem;
        }

        .charged-deflection-button:hover,
        .charged-deflection-button.is-active {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .charged-deflection-stage {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .charged-deflection-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .charged-deflection-background {
            fill: #ffffff;
        }

        .charged-deflection-plates line,
        .charged-deflection-axis line {
            stroke: #111827;
            stroke-linecap: round;
            stroke-width: 3.2;
        }

        .charged-deflection-axis line {
            stroke-width: 2.6;
        }

        .charged-deflection-plates text {
            fill: #111827;
            font-family: Roboto, Arial, sans-serif;
            font-size: 34px;
            font-weight: 700;
        }

        .charged-deflection-path {
            animation: charged-deflection-enter 320ms ease both;
            animation-delay: var(--delay);
        }

        .charged-deflection-path path {
            fill: none;
            stroke: var(--path-color);
            stroke-linecap: round;
            stroke-width: 4.2;
        }

        .charged-deflection-path circle {
            fill: var(--path-color);
        }

        .charged-deflection-label {
            fill: var(--path-color);
            font-family: Roboto, Arial, sans-serif;
            font-size: 22px;
            font-weight: 700;
        }

        @keyframes charged-deflection-enter {
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
