const periodThreeIonicContainer = document.getElementById("period-three-ionic-radius");

if (periodThreeIonicContainer) {
    const ions = [
        {
            symbol: "Na",
            charge: "+",
            protons: 11,
            shells: [2, 8],
            outerRadius: 58,
        },
        {
            symbol: "Mg",
            charge: "2+",
            protons: 12,
            shells: [2, 8],
            outerRadius: 52,
        },
        {
            symbol: "Al",
            charge: "3+",
            protons: 13,
            shells: [2, 8],
            outerRadius: 46,
        },
        {
            symbol: "P",
            charge: "3-",
            protons: 15,
            shells: [2, 8, 8],
            outerRadius: 90,
        },
        {
            symbol: "S",
            charge: "2-",
            protons: 16,
            shells: [2, 8, 8],
            outerRadius: 82,
        },
        {
            symbol: "Cl",
            charge: "-",
            protons: 17,
            shells: [2, 8, 8],
            outerRadius: 74,
        },
    ];

    injectPeriodThreeIonicStyles();

    periodThreeIonicContainer.classList.add("period-three-ion-radius-component");
    periodThreeIonicContainer.innerHTML = `
        <div class="period-three-ion-radius-scroller">
            <div class="period-three-ion-radius-row" aria-label="Period 3 ionic radii">
                ${ions.map(createPeriodThreeIonCard).join("")}
            </div>
        </div>
    `;
}

function createPeriodThreeIonCard(ion, index) {
    const center = 98;
    const shellRadii = getPeriodThreeIonShellRadii(ion);
    const shellMarkup = shellRadii
        .map((radius, shellIndex) => {
            const shellClass = shellIndex === shellRadii.length - 1 ? " period-three-ion-radius-outer-shell" : "";
            return `<circle class="period-three-ion-radius-shell${shellClass}" cx="${center}" cy="${center}" r="${radius}"></circle>`;
        })
        .join("");
    const electronMarkup = ion.shells
        .map((electronCount, shellIndex) => createPeriodThreeIonShellElectrons(center, shellRadii[shellIndex], electronCount))
        .join("");
    const ionLabel = `${ion.symbol}${ion.charge}`;

    return `
        <article class="period-three-ion-radius-card" style="--delay:${index * 55}ms">
            <div class="period-three-ion-radius-label">
                <strong>${ion.symbol}<sup>${ion.charge}</sup></strong>
            </div>
            <svg viewBox="0 0 196 196" role="img" aria-label="${ionLabel} ion with ${ion.protons} protons and ${ion.shells.length} electron shells">
                ${shellMarkup}
                ${electronMarkup}
                <circle class="period-three-ion-radius-nucleus" cx="${center}" cy="${center}" r="18"></circle>
                <text class="period-three-ion-radius-protons" x="${center}" y="${center - 2}">${ion.protons}p</text>
                <text class="period-three-ion-radius-nucleus-label" x="${center}" y="${center + 12}">nucleus</text>
            </svg>
        </article>
    `;
}

function getPeriodThreeIonShellRadii(ion) {
    const firstRadius = Math.max(24, ion.outerRadius - (ion.shells.length - 1) * 17);

    return ion.shells.map((_, index) => firstRadius + index * 17);
}

function createPeriodThreeIonShellElectrons(center, radius, electronCount) {
    const offset = electronCount === 1 ? -Math.PI / 2 : -Math.PI / 2 + Math.PI / electronCount;

    return Array.from({ length: electronCount }, (_, index) => {
        const angle = offset + (index * Math.PI * 2) / electronCount;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        return `<circle class="period-three-ion-radius-electron" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3.8"></circle>`;
    }).join("");
}

function injectPeriodThreeIonicStyles() {
    if (document.getElementById("period-three-ion-radius-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "period-three-ion-radius-styles";
    style.textContent = `
        .period-three-ion-radius-component {
            width: 100%;
            max-width: 980px;
            margin: 1.25rem 0;
        }

        .period-three-ion-radius-scroller {
            overflow-x: auto;
            padding-bottom: 0.35rem;
        }

        .period-three-ion-radius-row {
            display: grid;
            grid-template-columns: repeat(6, minmax(112px, 1fr));
            min-width: 920px;
            gap: 0.6rem;
            align-items: stretch;
        }

        .period-three-ion-radius-card {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            padding: 0.65rem;
            animation: period-three-ion-radius-enter 380ms ease both;
            animation-delay: var(--delay);
        }

        .period-three-ion-radius-label {
            text-align: center;
            color: #111827;
            margin-bottom: 0.3rem;
        }

        .period-three-ion-radius-label strong {
            font-size: 1rem;
        }

        .period-three-ion-radius-label sup {
            font-size: 0.7em;
            line-height: 0;
        }

        .period-three-ion-radius-card svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .period-three-ion-radius-shell {
            fill: none;
            stroke: #8b949e;
            stroke-width: 1.25;
        }

        .period-three-ion-radius-outer-shell {
            stroke: #6b7280;
            stroke-width: 1.5;
        }

        .period-three-ion-radius-electron {
            fill: #111827;
            stroke: #ffffff;
            stroke-width: 1.15;
        }

        .period-three-ion-radius-nucleus {
            fill: #fff5f5;
            stroke: #d71920;
            stroke-width: 1.7;
        }

        .period-three-ion-radius-protons {
            fill: #d71920;
            font-family: Roboto, Arial, sans-serif;
            font-size: 13px;
            font-weight: 700;
            text-anchor: middle;
            dominant-baseline: middle;
        }

        .period-three-ion-radius-nucleus-label {
            fill: #52606d;
            font-family: Roboto, Arial, sans-serif;
            font-size: 7px;
            text-anchor: middle;
        }

        @keyframes period-three-ion-radius-enter {
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
