const ionicContainer = document.getElementById("group-one-ionic-radius");

if (ionicContainer) {
    const ions = [
        {
            symbol: "Li",
            charge: "+",
            protons: 3,
            shells: [2],
            outerRadius: 46,
        },
        {
            symbol: "Na",
            charge: "+",
            protons: 11,
            shells: [2, 8],
            outerRadius: 58,
        },
        {
            symbol: "K",
            charge: "+",
            protons: 19,
            shells: [2, 8, 8],
            outerRadius: 70,
        },
        {
            symbol: "Rb",
            charge: "+",
            protons: 37,
            shells: [2, 8, 18, 8],
            outerRadius: 82,
        },
    ];

    injectIonicStyles();

    ionicContainer.classList.add("group-one-ion-radius-component");
    ionicContainer.innerHTML = `
        <div class="group-one-ion-radius-scroller">
            <div class="group-one-ion-radius-row" aria-label="Group 1 ionic radii trend">
                ${ions.map(createIonCard).join("")}
            </div>
        </div>
    `;
}

function createIonCard(ion, index) {
    const center = 112;
    const shellRadii = getIonShellRadii(ion);
    const shellMarkup = shellRadii
        .map((radius) => `<circle class="group-one-ion-radius-shell" cx="${center}" cy="${center}" r="${radius}"></circle>`)
        .join("");
    const electronMarkup = ion.shells
        .map((electronCount, shellIndex) => createIonShellElectrons(center, shellRadii[shellIndex], electronCount))
        .join("");
    const ionLabel = `${ion.symbol}${ion.charge}`;

    return `
        <article class="group-one-ion-radius-card" style="--delay:${index * 80}ms">
            <div class="group-one-ion-radius-label">
                <strong>${ion.symbol}<sup>${ion.charge}</sup></strong>
            </div>
            <svg viewBox="0 0 224 224" role="img" aria-label="${ionLabel} ion with ${ion.protons} protons and ${ion.shells.length} electron shells">
                ${shellMarkup}
                ${electronMarkup}
                <circle class="group-one-ion-radius-nucleus" cx="${center}" cy="${center}" r="21"></circle>
                <text class="group-one-ion-radius-protons" x="${center}" y="${center - 2}">${ion.protons}p</text>
                <text class="group-one-ion-radius-nucleus-label" x="${center}" y="${center + 13}">nucleus</text>
            </svg>
        </article>
    `;
}

function getIonShellRadii(ion) {
    const firstRadius = Math.max(22, ion.outerRadius - (ion.shells.length - 1) * 16);

    return ion.shells.map((_, index) => firstRadius + index * 16);
}

function createIonShellElectrons(center, radius, electronCount) {
    const offset = electronCount === 1 ? -Math.PI / 2 : -Math.PI / 2 + Math.PI / electronCount;

    return Array.from({ length: electronCount }, (_, index) => {
        const angle = offset + (index * Math.PI * 2) / electronCount;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        return `<circle class="group-one-ion-radius-electron" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4.2"></circle>`;
    }).join("");
}

function injectIonicStyles() {
    if (document.getElementById("group-one-ion-radius-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "group-one-ion-radius-styles";
    style.textContent = `
        .group-one-ion-radius-component {
            width: 100%;
            max-width: 980px;
            margin: 1.25rem 0;
        }

        .group-one-ion-radius-scroller {
            overflow-x: auto;
            padding-bottom: 0.35rem;
        }

        .group-one-ion-radius-row {
            display: grid;
            grid-template-columns: repeat(4, minmax(150px, 1fr));
            min-width: 680px;
            gap: 0.75rem;
            align-items: stretch;
        }

        .group-one-ion-radius-card {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            padding: 0.75rem;
            animation: group-one-ion-radius-enter 420ms ease both;
            animation-delay: var(--delay);
        }

        .group-one-ion-radius-label {
            text-align: center;
            color: #111827;
            margin-bottom: 0.4rem;
        }

        .group-one-ion-radius-label strong {
            font-size: 1.05rem;
        }

        .group-one-ion-radius-label sup {
            font-size: 0.7em;
            line-height: 0;
        }

        .group-one-ion-radius-card svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .group-one-ion-radius-shell {
            fill: none;
            stroke: #8b949e;
            stroke-width: 1.4;
        }

        .group-one-ion-radius-electron {
            fill: #111827;
            stroke: #ffffff;
            stroke-width: 1.3;
        }

        .group-one-ion-radius-nucleus {
            fill: #fff5f5;
            stroke: #d71920;
            stroke-width: 1.8;
        }

        .group-one-ion-radius-protons {
            fill: #d71920;
            font-family: Roboto, Arial, sans-serif;
            font-size: 15px;
            font-weight: 700;
            text-anchor: middle;
            dominant-baseline: middle;
        }

        .group-one-ion-radius-nucleus-label {
            fill: #52606d;
            font-family: Roboto, Arial, sans-serif;
            font-size: 8px;
            text-anchor: middle;
        }

        @keyframes group-one-ion-radius-enter {
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
