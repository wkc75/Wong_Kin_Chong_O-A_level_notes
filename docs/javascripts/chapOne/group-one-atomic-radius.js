const container = document.getElementById("group-one-atomic-radius");

if (container) {
    const atoms = [
        {
            symbol: "Li",
            protons: 3,
            shells: [2, 1],
            outerRadius: 58,
        },
        {
            symbol: "Na",
            protons: 11,
            shells: [2, 8, 1],
            outerRadius: 70,
        },
        {
            symbol: "K",
            protons: 19,
            shells: [2, 8, 8, 1],
            outerRadius: 82,
        },
        {
            symbol: "Rb",
            protons: 37,
            shells: [2, 8, 18, 8, 1],
            outerRadius: 94,
        },
    ];

    injectStyles();

    container.classList.add("group-one-radius-component");
    container.innerHTML = `
        <div class="group-one-radius-row" aria-label="Group 1 atomic radii trend">
            ${atoms.map(createAtomCard).join("")}
        </div>
    `;
}

function createAtomCard(atom, index) {
    const center = 112;
    const shellRadii = getShellRadii(atom);
    const shellMarkup = shellRadii
        .map((radius) => `<circle class="group-one-radius-shell" cx="${center}" cy="${center}" r="${radius}"></circle>`)
        .join("");
    const electronMarkup = atom.shells
        .map((electronCount, shellIndex) => createShellElectrons(center, shellRadii[shellIndex], electronCount))
        .join("");

    return `
        <article class="group-one-radius-card" style="--delay:${index * 80}ms">
            <div class="group-one-radius-label">
                <strong>${atom.symbol}</strong>
            </div>
            <svg viewBox="0 0 224 224" role="img" aria-label="${atom.symbol} atom with ${atom.protons} protons and ${atom.shells.length} electron shells">
                ${shellMarkup}
                ${electronMarkup}
                <circle class="group-one-radius-nucleus" cx="${center}" cy="${center}" r="21"></circle>
                <text class="group-one-radius-protons" x="${center}" y="${center - 2}">${atom.protons}p</text>
                <text class="group-one-radius-nucleus-label" x="${center}" y="${center + 13}">nucleus</text>
            </svg>
        </article>
    `;
}

function getShellRadii(atom) {
    const firstRadius = Math.max(22, atom.outerRadius - (atom.shells.length - 1) * 16);

    return atom.shells.map((_, index) => firstRadius + index * 16);
}

function createShellElectrons(center, radius, electronCount) {
    const offset = electronCount === 1 ? -Math.PI / 2 : -Math.PI / 2 + Math.PI / electronCount;

    return Array.from({ length: electronCount }, (_, index) => {
        const angle = offset + (index * Math.PI * 2) / electronCount;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        return `<circle class="group-one-radius-electron" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4.2"></circle>`;
    }).join("");
}

function injectStyles() {
    if (document.getElementById("group-one-radius-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "group-one-radius-styles";
    style.textContent = `
        .group-one-radius-component {
            width: 100%;
            max-width: 980px;
            margin: 1.25rem 0;
        }

        .group-one-radius-header {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            color: #1f2933;
            font-size: 0.95rem;
            font-weight: 700;
        }

        .group-one-radius-header span:last-child {
            color: #d71920;
        }

        .group-one-radius-row {
            display: grid;
            grid-template-columns: repeat(4, minmax(150px, 1fr));
            gap: 0.75rem;
            align-items: stretch;
        }

        .group-one-radius-card {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            padding: 0.75rem;
            animation: group-one-radius-enter 420ms ease both;
            animation-delay: var(--delay);
        }

        .group-one-radius-label {
            text-align: center;
            color: #111827;
            margin-bottom: 0.4rem;
        }

        .group-one-radius-label strong {
            font-size: 1.05rem;
        }

        .group-one-radius-card svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .group-one-radius-shell {
            fill: none;
            stroke: #8b949e;
            stroke-width: 1.4;
        }

        .group-one-radius-electron {
            fill: #111827;
            stroke: #ffffff;
            stroke-width: 1.3;
        }

        .group-one-radius-nucleus {
            fill: #fff5f5;
            stroke: #d71920;
            stroke-width: 1.8;
        }

        .group-one-radius-protons {
            fill: #d71920;
            font-family: Roboto, Arial, sans-serif;
            font-size: 15px;
            font-weight: 700;
            text-anchor: middle;
            dominant-baseline: middle;
        }

        .group-one-radius-nucleus-label {
            fill: #52606d;
            font-family: Roboto, Arial, sans-serif;
            font-size: 8px;
            text-anchor: middle;
        }

        .group-one-radius-summary {
            margin-top: 0.75rem;
            color: #1f2933;
            font-size: 0.95rem;
            line-height: 1.5;
        }

        @media (max-width: 760px) {
            .group-one-radius-row {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        @media (max-width: 440px) {
            .group-one-radius-row {
                grid-template-columns: 1fr;
            }
        }

        @keyframes group-one-radius-enter {
            from {
                opacity: 0;
                transform: translateY(8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    document.head.appendChild(style);
}
