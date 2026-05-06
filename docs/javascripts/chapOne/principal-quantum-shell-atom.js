const principalQuantumShellAtomContainer = document.getElementById("principal-quantum-shell-atom");

if (principalQuantumShellAtomContainer) {
    injectPrincipalQuantumShellAtomStyles();
    principalQuantumShellAtomContainer.classList.add("principal-shell-atom-component");
    principalQuantumShellAtomContainer.innerHTML = createPrincipalQuantumShellAtomSvg();
}

function createPrincipalQuantumShellAtomSvg() {
    const centerX = 380;
    const centerY = 255;
    const shells = [
        {
            label: "n = 1",
            radius: 78,
            electrons: 2,
            duration: 5.4,
            startAngle: -90,
            delay: 0,
        },
        {
            label: "n = 2",
            radius: 155,
            electrons: 6,
            duration: 9.2,
            startAngle: -102,
            delay: 0.25,
        },
    ];

    return `
        <svg class="principal-shell-atom-svg" viewBox="0 0 760 520" role="img" aria-labelledby="principal-shell-atom-title principal-shell-atom-desc">
            <title id="principal-shell-atom-title">Animated atom showing electronic shells</title>
            <desc id="principal-shell-atom-desc">A nucleus made of protons and neutrons with electrons moving around the first and second principal quantum shells.</desc>
            <rect class="principal-shell-atom-bg" x="0" y="0" width="760" height="520"></rect>
            <g class="principal-shell-atom-orbits">
                ${shells.map((shell) => createShellOrbit(centerX, centerY, shell)).join("")}
            </g>
            <g class="principal-shell-atom-nucleus" aria-label="Nucleus containing protons and neutrons">
                <circle class="principal-shell-nucleus-boundary" cx="${centerX}" cy="${centerY}" r="53">
                    <title>Nucleus</title>
                </circle>
                ${createNucleons(centerX, centerY)}
            </g>
            <g class="principal-shell-atom-electrons" aria-label="Moving electrons">
                ${shells.map((shell) => createShellElectrons(centerX, centerY, shell)).join("")}
            </g>
        </svg>
    `;
}

function createShellOrbit(centerX, centerY, shell) {
    return `
        <g>
            <circle class="principal-shell-orbit" cx="${centerX}" cy="${centerY}" r="${shell.radius}">
                <title>${shell.label} electronic shell</title>
            </circle>
        </g>
    `;
}

function createNucleons(centerX, centerY) {
    const nucleons = [
        { x: -18, y: -15, type: "proton" },
        { x: 4, y: -20, type: "neutron" },
        { x: 21, y: -4, type: "proton" },
        { x: -3, y: 1, type: "proton" },
        { x: -24, y: 9, type: "neutron" },
        { x: 13, y: 20, type: "neutron" },
    ];

    return nucleons.map((nucleon) => `
        <g class="principal-shell-nucleon principal-shell-nucleon--${nucleon.type}">
            <title>${nucleon.type === "proton" ? "Proton" : "Neutron"}</title>
            <circle cx="${centerX + nucleon.x}" cy="${centerY + nucleon.y}" r="16"></circle>
        </g>
    `).join("");
}

function createShellElectrons(centerX, centerY, shell) {
    return Array.from({ length: shell.electrons }, (_, index) => {
        const angle = shell.startAngle + (index * 360) / shell.electrons;
        const endAngle = angle + 360;

        return `
            <g class="principal-shell-electron-track" transform="rotate(${angle} ${centerX} ${centerY})">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="${angle} ${centerX} ${centerY}"
                    to="${endAngle} ${centerX} ${centerY}"
                    dur="${shell.duration}s"
                    begin="0s"
                    repeatCount="indefinite">
                </animateTransform>
                <circle class="principal-shell-electron" cx="${centerX + shell.radius}" cy="${centerY}" r="10">
                    <title>Electron</title>
                </circle>
            </g>
        `;
    }).join("");
}

function injectPrincipalQuantumShellAtomStyles() {
    if (document.getElementById("principal-quantum-shell-atom-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "principal-quantum-shell-atom-styles";
    style.textContent = `
        .principal-shell-atom-component {
            width: 100%;
            max-width: 920px;
            margin: 1.25rem 0;
        }

        .principal-shell-atom-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
        }

        .principal-shell-atom-bg {
            fill: #ffffff;
        }

        .principal-shell-orbit {
            fill: none;
            stroke: #111827;
            stroke-width: 4.2;
        }

        .principal-shell-orbit,
        .principal-shell-nucleus-boundary,
        .principal-shell-nucleon,
        .principal-shell-electron {
            cursor: help;
        }

        .principal-shell-orbit:hover {
            stroke: #2563eb;
            stroke-width: 6;
        }

        .principal-shell-nucleus-boundary {
            fill: #fff7ed;
            stroke: #dc2626;
            stroke-width: 4;
        }

        .principal-shell-nucleus-boundary:hover {
            fill: #fee2e2;
            stroke-width: 5.5;
        }

        .principal-shell-nucleon circle {
            stroke: #ffffff;
            stroke-width: 2.2;
        }

        .principal-shell-nucleon:hover circle {
            stroke: #111827;
            stroke-width: 3;
        }

        .principal-shell-nucleon--proton circle {
            fill: #ef4444;
        }

        .principal-shell-nucleon--neutron circle {
            fill: #22c55e;
        }

        .principal-shell-electron {
            fill: #006df0;
            stroke: #0047a8;
            stroke-width: 2;
        }

        .principal-shell-electron:hover {
            fill: #1d4ed8;
            stroke: #111827;
            stroke-width: 3;
        }

        @media (prefers-reduced-motion: reduce) {
            .principal-shell-electron-track animateTransform {
                display: none;
            }
        }
    `;

    document.head.appendChild(style);
}
