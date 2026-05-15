const periodTwoContainer = document.getElementById("period-two-atomic-radius");

if (periodTwoContainer) {
    const atoms = [
        {
            symbol: "Li",
            protons: 3,
            shells: [2, 1],
            outerRadius: 76,
        },
        {
            symbol: "Be",
            protons: 4,
            shells: [2, 2],
            outerRadius: 70,
        },
        {
            symbol: "B",
            protons: 5,
            shells: [2, 3],
            outerRadius: 64,
        },
        {
            symbol: "C",
            protons: 6,
            shells: [2, 4],
            outerRadius: 60,
        },
        {
            symbol: "N",
            protons: 7,
            shells: [2, 5],
            outerRadius: 56,
        },
        {
            symbol: "O",
            protons: 8,
            shells: [2, 6],
            outerRadius: 53,
        },
        {
            symbol: "F",
            protons: 9,
            shells: [2, 7],
            outerRadius: 50,
        },
        {
            symbol: "Ne",
            protons: 10,
            shells: [2, 8],
            outerRadius: 47,
        },
    ];

    injectPeriodTwoStyles();

    periodTwoContainer.classList.add("period-two-radius-component");
    periodTwoContainer.innerHTML = `
        <div class="period-two-radius-trend" aria-hidden="true">
            <span>larger</span>
            <div></div>
            <span>smaller</span>
        </div>
        <div class="period-two-radius-scroller">
            <div class="period-two-radius-row" aria-label="Period 2 atomic radii trend">
                ${atoms.map(createPeriodTwoAtomCard).join("")}
            </div>
        </div>
    `;
}

function createPeriodTwoAtomCard(atom, index) {
    const center = 98;
    const shellRadii = [29, atom.outerRadius];
    const shellMarkup = shellRadii
        .map((radius, shellIndex) => {
            const shellClass = shellIndex === shellRadii.length - 1 ? " period-two-radius-outer-shell" : "";
            return `<circle class="period-two-radius-shell${shellClass}" cx="${center}" cy="${center}" r="${radius}"></circle>`;
        })
        .join("");
    const electronMarkup = atom.shells
        .map((electronCount, shellIndex) => createPeriodTwoShellElectrons(center, shellRadii[shellIndex], electronCount))
        .join("");

    return `
        <article class="period-two-radius-card" style="--delay:${index * 55}ms">
            <div class="period-two-radius-label">
                <strong>${atom.symbol}</strong>
            </div>
            <svg viewBox="0 0 196 196" role="img" aria-label="${atom.symbol} atom with ${atom.protons} protons and 2 electron shells">
                ${shellMarkup}
                ${electronMarkup}
                <circle class="period-two-radius-nucleus" cx="${center}" cy="${center}" r="18"></circle>
                <text class="period-two-radius-protons" x="${center}" y="${center - 2}">${atom.protons}p</text>
                <text class="period-two-radius-nucleus-label" x="${center}" y="${center + 12}">nucleus</text>
            </svg>
        </article>
    `;
}

function createPeriodTwoShellElectrons(center, radius, electronCount) {
    const offset = electronCount === 1 ? -Math.PI / 2 : -Math.PI / 2 + Math.PI / electronCount;

    return Array.from({ length: electronCount }, (_, index) => {
        const angle = offset + (index * Math.PI * 2) / electronCount;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        return `<circle class="period-two-radius-electron" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3.8"></circle>`;
    }).join("");
}

function injectPeriodTwoStyles() {
    if (document.getElementById("period-two-radius-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "period-two-radius-styles";
    style.textContent = `
        .period-two-radius-component {
            width: 100%;
            max-width: 980px;
            margin: 1.25rem 0;
        }

        .period-two-radius-header {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 0.5rem;
            margin-bottom: 0.55rem;
            color: #1f2933;
            font-size: 0.95rem;
            font-weight: 700;
        }

        .period-two-radius-header span:last-child {
            color: #d71920;
        }

        .period-two-radius-trend {
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.65rem;
            color: #52606d;
            font-size: 0.78rem;
            font-weight: 700;
        }

        .period-two-radius-trend div {
            position: relative;
            height: 2px;
            background: linear-gradient(90deg, #d71920, #f08a24);
        }

        .period-two-radius-trend div::after {
            position: absolute;
            top: 50%;
            right: -1px;
            width: 0;
            height: 0;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 8px solid #f08a24;
            content: "";
            transform: translateY(-50%);
        }

        .period-two-radius-scroller {
            overflow-x: auto;
            padding-bottom: 0.35rem;
        }

        .period-two-radius-row {
            display: grid;
            grid-template-columns: repeat(8, minmax(112px, 1fr));
            min-width: 920px;
            gap: 0.6rem;
            align-items: stretch;
        }

        .period-two-radius-card {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            padding: 0.65rem;
            animation: period-two-radius-enter 380ms ease both;
            animation-delay: var(--delay);
        }

        .period-two-radius-label {
            text-align: center;
            color: #111827;
            margin-bottom: 0.3rem;
        }

        .period-two-radius-label strong {
            font-size: 1rem;
        }

        .period-two-radius-card svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .period-two-radius-shell {
            fill: none;
            stroke: #8b949e;
            stroke-width: 1.25;
        }

        .period-two-radius-outer-shell {
            stroke: #6b7280;
            stroke-width: 1.5;
        }

        .period-two-radius-electron {
            fill: #111827;
            stroke: #ffffff;
            stroke-width: 1.15;
        }

        .period-two-radius-nucleus {
            fill: #fff5f5;
            stroke: #d71920;
            stroke-width: 1.7;
        }

        .period-two-radius-protons {
            fill: #d71920;
            font-family: Roboto, Arial, sans-serif;
            font-size: 13px;
            font-weight: 700;
            text-anchor: middle;
            dominant-baseline: middle;
        }

        .period-two-radius-nucleus-label {
            fill: #52606d;
            font-family: Roboto, Arial, sans-serif;
            font-size: 7px;
            text-anchor: middle;
        }

        .period-two-radius-summary {
            margin-top: 0.75rem;
            color: #1f2933;
            font-size: 0.95rem;
            line-height: 1.5;
        }

        @keyframes period-two-radius-enter {
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
